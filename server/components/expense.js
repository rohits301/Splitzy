const validator = require('../helper/validation');
const logger = require('../helper/logger');
const groupDAO = require('./group');
const db = require('../models');
const Op = require('sequelize').Op;

const { Expense, Group, User } = db;
const sequelize = db.sequelize;
/*
Add Expense function
This function is used to add expense to the group 
Accepts: Group ID not null group ID exist in the DB
         Expense Name - Not Null
         Expense Desc - max 100 limit
         Expense Amount not null
         Expense Owner - not null --member in the Group Expense Members not null members in the Group
         Auto-Generate Expense ID - Auto generated and stored in the database
*/
exports.addExpense = async (req, res) => {
    const t = await sequelize.transaction();
    
    try {
        var expense = req.body;
        /** changed */
        // var group = await model.Group.findOne({
        //     _id: expense.groupId
        // })
        const group = await Group.findOne({
            where: { id: expense.groupId }
        });
        if (!group) {
            var err = new Error("Invalid Group Id");
            err.status = 400;
            throw err;
        }
        try {
            validator.validateExpenseInput(expense);
        } catch (err) {
            err.status = 400;
            throw err;
        }
        // Set expenseDate to current date if not provided
        if (!expense.expenseDate) {
            expense.expenseDate = new Date();
        }

        var ownerValidation = await validator.groupUserValidation(expense.expenseOwner, expense.groupId);
        if (!ownerValidation) {
            var err = new Error("Please provide a valid group owner");
            err.status = 400;
            throw err;
        }
        for (var user of expense.expenseMembers) {
            var memberValidation = await validator.groupUserValidation(user, expense.groupId);
            if (!memberValidation) {
                var err = new Error("Please ensure the members exist in the group");
                err.status = 400;
                throw err;
            }
        }
        // expense.expensePerMember = Math.round((expense.expensePerMember + Number.EPSILON) * 100) / 100;
        // Calculate expensePerMember if not provided
        if (!expense.expensePerMember) {
            expense.expensePerMember = Math.round((expense.expenseAmount / expense.expenseMembers.length + Number.EPSILON) * 100) / 100;
        }
        // Currently, we only allow expenses in the same currency as the group currency 
        // So, even if user records an expense in different currency, we won't take it. It will be the same as group currency only in db.
        expense.expenseCurrency = group.groupCurrency;
        if (!expense.expenseType) {
            expense.expenseType = 'CASH';
        }
        if (!expense.expenseCategory) {
            expense.expenseCategory = 'Others';
        }

        /** changed */
        // var newExp = new model.Expense(expense)
        // var newExpense = await model.Expense.create(newExp)
        const newExpense = await Expense.create({
            groupId: expense.groupId,
            expenseName: expense.expenseName,
            expenseDescription: expense.expenseDescription,
            expenseAmount: expense.expenseAmount,
            expenseOwner: expense.expenseOwner,
            expenseMembers: expense.expenseMembers,
            expenseDate: expense.expenseDate,
            expensePerMember: expense.expensePerMember,
            expenseCurrency: expense.expenseCurrency,
            expenseType: expense.expenseType,
            expenseCategory: expense.expenseCategory
        }, 
        {
            transaction: t // pass transaction if Expense.create supports it
        });

        //New expense is created now we need to update the split values present in the group 
        // TODO: check what the method returns and then accordingly update the Response object. 
        // currently it returns an id only in splitUpdateResponse. 
        // Update group split within transaction
        var update_response = await groupDAO.addSplit(
            expense.groupId,
            expense.expenseAmount,
            expense.expenseOwner,
            expense.expenseMembers,
            t // pass transaction if groupDAO supports it
        );

        await t.commit(); // Commit the transaction if all operations succeed
        const updatedGroup = await Group.findOne({ where: {id : expense.groupId} });
        const roundedSplit = {};
        for (const [user, value] of Object.entries(updatedGroup.split)) {
            roundedSplit[user] = Math.round((value + Number.EPSILON) * 100) / 100;
        }
        res.status(200).json({
            status: "Success",
            message: "New expense added",
            id: newExpense.id,
            splitUpdateResponse: roundedSplit // This shows the latest balances
        });
    } catch (err) {
        await t.rollback(); // Rollback the transaction in case of error
        // Pass the entire error object to the logger
        logger.error(err);
        res.status(err.status || 500).json({
            message: err.message
        });
    }
}


/*
Edit Expense function
This function is used to edit the previously added expense to the group
Accepts: Group ID not null group ID exist in the DB 
         Expense ID not null expense ID exist in the DB for the perticular group
         Expense Name Not Null
         Expense Desc max 100 limit Expense Amount not null
         Expense Owner - not null --member in the DB
         Expense Members not null members in the DB
*/
exports.editExpense = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        var expense = req.body
        /** changed */
        // var oldExpense = await model.Expense.findOne({
        //     _id: expense.id
        // })
        const oldExpense = await Expense.findOne({
            where: { id: expense.id }
        });
        if (!oldExpense || expense.id == null ||
            oldExpense.groupId != expense.groupId
        ) {
            var err = new Error("Invalid Expense Id")
            err.status = 400
            throw err
        }

        try {
            validator.validateExpenseInput(expense);
        } catch (err) {
            err.status = 400;
            throw err;
        }
        
        var ownerValidation = await validator.groupUserValidation(expense.expenseOwner, expense.groupId)
        if (!ownerValidation) {
            var err = new Error("Please provide a valid group owner")
            err.status = 400
            throw err
        }
        
        for (var user of expense.expenseMembers) {
            var memberValidation = await validator.groupUserValidation(user, expense.groupId)
            if (!memberValidation) {
                var err = new Error("Please ensure the members exist in the group")
                err.status = 400
                throw err
            }
        }

        /** changed */
        // var expenseUpdate = await model.Expense.updateOne({
        //     _id: req.body.id

        // }, {
        //     $set: {
        //         groupId: expense.groupId,
        //         expenseName: expense.expenseName,
        //         expenseDescription: expense.expenseDescription,
        //         expenseAmount: expense.expenseAmount,
        //         expenseOwner: expense.expenseOwner,
        //         expenseMembers: expense.expenseMembers,
        //         expensePerMember: expense.expenseAmount / expense.expenseMembers.length,
        //         expenseType: expense.expenseType,
        //         expenseDate: expense.expenseDate,
        //     }
        // })
        
        // Calculate expensePerMember if not provided
        if (!expense.expensePerMember) {
            expense.expensePerMember = Math.round((expense.expenseAmount / expense.expenseMembers.length + Number.EPSILON) * 100) / 100;
        }
        // Set expenseDate to current date if not provided
        if (!expense.expenseDate) {
            expense.expenseDate = new Date();
        }
        if (!expense.expenseType) {
            expense.expenseType = 'CASH';
        }
        if (!expense.expenseCategory) {
            expense.expenseCategory = 'Others';
        }

        // Use group currency if available
        const group = await Group.findOne({ where: { id: expense.groupId } });
        if (group) {
            expense.expenseCurrency = group.groupCurrency;
        }

        // default return value of update is count
        // we add { returning : true} to return the objects
        const [count, updatedExpenses] = await Expense.update(
            {
                groupId: expense.groupId,
                expenseName: expense.expenseName,
                expenseDescription: expense.expenseDescription,
                expenseAmount: expense.expenseAmount,
                expenseOwner: expense.expenseOwner,
                expenseMembers: expense.expenseMembers,
                expensePerMember: expense.expensePerMember,
                expenseType: expense.expenseType,
                expenseDate: expense.expenseDate,
                expenseCurrency: expense.expenseCurrency,
                expenseCategory: expense.expenseCategory
            },
            {
                where: { id: expense.id },
                returning: true // This will return the updated record
            }
        );
        const updatedExpense = updatedExpenses[0];

        //Updating the group split values
        await groupDAO.clearSplit(
            oldExpense.groupId, 
            oldExpense.expenseAmount, 
            oldExpense.expenseOwner, 
            oldExpense.expenseMembers, 
            t
        );
        await groupDAO.addSplit(
            expense.groupId, 
            expense.expenseAmount, 
            expense.expenseOwner, 
            expense.expenseMembers, 
            t
        );

        await t.commit(); // Commit the transaction if all operations succeed

        res.status(200).json({
            status: "Success",
            message: "Expense Edited",
            response: updatedExpense
        });
    } catch (err) {
        await t.rollback(); // Rollback the transaction in case of error
        // Pass the entire error object to the logger
        logger.error(err);
        res.status(err.status || 500).json({
            message: err.message
        })
    }
}


/*
Delete Expense function
This function is used to deted the expense added to the group
Accepts: Group ID not null group ID exist in the DB 
         Expense ID not null expense ID exist in the DB for the perticular group
*/
exports.deleteExpense = async (req, res) => {
    try {
        /** changed */
        // var expense = await model.Expense.findOne({
        //     _id: req.body.id
        // })
        const expense = await Expense.findOne({
            where: { id: req.body.id }
        });
        if (!expense) {
            var err = new Error("Invalid Expense Id")
            err.status = 400
            throw err
        }
        /** changed */
        // var deleteExp = await model.Expense.deleteOne({
        //     _id: req.body.id
        // })
        const deleteExp = await Expense.destroy({
            where: { id: req.body.id }
        });

        //Clearing split value for the deleted expense from group table
        await groupDAO.clearSplit(expense.groupId, expense.expenseAmount, expense.expenseOwner, expense.expenseMembers)

        res.status(200).json({
            status: "Success",
            message: "Expense is deleted",
            response: deleteExp
        })
    } catch (err) {
        // Pass the entire error object to the logger
        logger.error(err);

        res.status(err.status || 500).json({
            message: err.message
        })
    }
}


/*
View Individual Expense
This function is used to view individual expenses based on the expense ID 
Accepts: Expense Id
Returns: Json with the expense details
*/
exports.viewExpense = async (req, res) => {
    try {
        /** changed */
        // var expense = await model.Expense.findOne({
        //     _id: req.body.id
        // })
        const expense = await Expense.findOne({
            where: { id: req.body.id }
        });
        if (!expense) {
            var err = new Error("No expense present for the Id")
            err.status = 400
            throw err
        }
        res.status(200).json({
            status: "Success",
            expense: expense
        })
    } catch (err) {
        // Pass the entire error object to the logger
        logger.error(err);
        res.status(err.status || 500).json({
            message: err.message
        })
    }
}


/*
View Group Expense function
This function is used to view all the group expense
Accepts: Group Id
Returns: Json with all the expense record and the total expense amount for the group
*/
exports.viewGroupExpense = async (req, res) => {
    try {
        /** changed */
        // var groupExpense = await model.Expense.find({
        //     groupId: req.body.id
        // }).sort({
        //     expenseDate: -1 //to get the newest first 
        // })
        // Check if group exists
        const group = await Group.findOne({ where: { id: req.body.id } });
        if (!group) {
            return res.status(400).json({
                status: "error",
                message: "Invalid Group Id"
            });
        }
        const groupExpense = await Expense.findAll({
            where: { groupId: req.body.id },
            order: [['expenseDate', 'DESC']] // Sort by expenseDate in descending order
        });
        // below is not an error, let it be empty response
        // if (groupExpense.length == 0) {
        //     var err = new Error("No expense present for the group")
        //     err.status = 400
        //     throw err
        // }
        // var totalAmount = 0
        // for (var expense of groupExpense) {
        //     totalAmount += expense['expenseAmount']
        // }
        // Using `const` to have ES5 feature of `reduce()`.
        const totalAmount = groupExpense.reduce((acc, expense) => acc + expense.expenseAmount, 0);

        res.status(200).json({
            status: "Success",
            expense: groupExpense,
            total: totalAmount
        })
    } catch (err) {
        // Pass the entire error object to the logger
        logger.error(err);
        res.status(err.status || 500).json({
            message: err.message
        })
    }
}


/*
User Expense function
This function is used to find all the expense a user is involved in
Accepts user email Id
returns: Expenses
*/
exports.viewUserExpense = async (req, res) => {
    try {
        validator.notNull(req.body.user)
        if (!req.body.user) {
            return res.status(400).json({
                status: "error",
                message: "User email is required"
            });
        }
        /** changed */
        // var userExpense = await model.Expense.find({
        //     expenseMembers: req.body.user
        // }).sort({
        //     expenseDate: -1 //to get the newest first 
        // })
        const user = await User.findOne({ where: { emailId: req.body.user } });
        if (!user) {
            return res.status(400).json({
                status: "error",
                message: "Invalid User"
            });
        }
        const userExpense = await Expense.findAll({
            where: {
                expenseMembers: {
                    [Op.contains]: [req.body.user]
                }
            },
            order: [['expenseDate', 'DESC']] // Sort by expenseDate in descending order
        });
        // handle this at frontend
        // if (userExpense.length == 0) {
        //     var err = new Error("No expense present for the user")
        //     err.status = 400
        //     throw err
        // }
        var totalAmount = 0
        for (var expense of userExpense) {
            totalAmount += expense['expensePerMember']
        }
        res.status(200).json({
            status: "Success",
            expense: userExpense,
            total: totalAmount
        })

    } catch (err) {
        // Pass the entire error object to the logger
        logger.error(err);
        res.status(err.status || 500).json({
            message: err.message
        })
    }
}


/*
Recent User Expenses function
This function is used to return the latest 5 expenses a user is involved in 
Accepts : user email id - check in db if user is present 
Returns : top 5 most resent expense user is a expenseMember in all the groups  
*/
exports.recentUserExpenses = async (req, res) => {
    try {
        /** changed */
        // var recentExpense = await model.Expense.find({
        //     expenseMembers: req.body.user
        // }).sort({
        //     expenseDate: -1 // Sort by expenseDate in descending order
        // }).limit(5); // Limit to the top 5 expenses
        if (!req.body.user) {
            return res.status(400).json({
                status: "error",
                message: "User email is required"
            });
        }
        const user = await User.findOne({ where: { emailId: req.body.user } });
        if (!user) {
            return res.status(400).json({
                status: "error",
                message: "Invalid User"
            });
        }
        const recentExpense = await Expense.findAll({
            where: {
                expenseMembers: {
                    [Op.contains]: [req.body.user]
                }
            },
            order: [['expenseDate', 'DESC']],
            limit: 5
        });
        // if (recentExpense.length == 0) {
        //     // Instead of throwing an error, return an empty list
        //     return res.status(200).json({
        //         status: "Success",
        //         expense: [],
        //         message: "No expense present for the user"
        //     });
        // }
        return res.status(200).json({
            status: "Success",
            expense: recentExpense,
            message: recentExpense.length === 0 ? "No expense present for the user" : undefined
        });
    } catch (err) {
        // Pass the entire error object to the logger
        logger.error(err);
        res.status(err.status || 500).json({
            message: err.message
        })
    }
}


/*
Category wise group expense calculator function 
This function is used to retuen the expense spend on each category in a group 
Accepts : groupID 
Returns : Each category total exp (group as whole)
*/
exports.groupCategoryExpense = async (req, res) => {
    try {
        /** changed */
        // var categoryExpense = await model.Expense.aggregate([{
        //         $match: {
        //             groupId: req.body.id
        //         }
        //     },
        //     {
        //         $group: {
        //             _id: "$expenseCategory",
        //             amount: {
        //                 $sum: "$expenseAmount"
        //             }
        //         }
        //     },{ $sort : {"_id" : 1 } }
        // ])
        // if group ID is not provided
        if (!req.body.id) {
            return res.status(400).json({
                status: "error",
                message: "Group ID is required"
            });
        }
        const categoryExpense = await Expense.findAll({
            // Corresponds to the columns you want to select and create
            attributes: [
                // The column you are grouping by
                'expenseCategory',
                // The aggregation function: SUM the 'expenseAmount' column
                // and name the resulting column 'amount'
                [sequelize.fn('SUM', sequelize.col('expense_amount')), 'amount']
            ],
            // The '$match' part of the aggregation, equivalent to a WHERE clause
            where: {
                groupId: req.body.id
            },
            // The '$group' part, specifying the column to group rows by
            group: ['expenseCategory'],
            // The '$sort' part, equivalent to an ORDER BY clause
            order: [['expenseCategory', 'ASC']],
            // Optional: Returns plain JSON objects, not Sequelize model instances
            raw: true
        });

        res.status(200).json({
            status: "success",
            data: categoryExpense
        })
    } catch (err) {
        // Pass the entire error object to the logger
        logger.error(err);
        res.status(err.status || 500).json({
            message: err.message
        })
    }
}


/*
Group Monthly Expense Function 
This function is used to get the monthly amount spend in a group 
Accepts : group Id 
Returns : Expense per month (current year)
*/
exports.groupMonthlyExpense = async (req, res) => {
    try {
        /** changed */
        // var monthlyExpense = await model.Expense.aggregate([{
        //     $match: {
        //         groupId: req.body.id
        //     }
        // },
        // {
        //     $group: {
        //         _id: {
        //             month: {
        //                 $month: "$expenseDate"
        //             },
        //             year: {
        //                 $year: "$expenseDate"
        //             }
        //         },
        //         amount: {
        //             $sum: "$expenseAmount"
        //         }
        //     }
        // },
        // { $sort: { "_id.month": 1 } }
        // ])
        if (!req.body.id) {
            return res.status(400).json({
                status: "error",
                message: "Group ID is required"
            });
        }
        // Check if group exists
        const group = await Group.findOne({ where: { id: req.body.id } });
        if (!group) {
            return res.status(400).json({
                status: "error",
                message: "Invalid Group Id"
            });
        }
        const monthlyExpense = await Expense.findAll({
            attributes: [
                [sequelize.literal('EXTRACT(MONTH FROM "expense_date")'), 'month'],
                [sequelize.literal('EXTRACT(YEAR FROM "expense_date")'), 'year'],
                [sequelize.fn('SUM', sequelize.col('expense_amount')), 'amount']
            ],
            where: {
                groupId: req.body.id
            },
            group: [
                sequelize.literal('EXTRACT(MONTH FROM "expense_date")'),
                sequelize.literal('EXTRACT(YEAR FROM "expense_date")')
            ],
            order: [['year', 'ASC'], ['month', 'ASC']],
            raw: true
        });
        res.status(200).json({
            status: "success",
            data: monthlyExpense
        })
    } catch (err) {
        // Pass the entire error object to the logger
        logger.error(err);
        res.status(err.status || 500).json({
            message: err.message
        })
    }
}


// is the below line even required?
// new Date(new Date().setMonth(new Date().getMonth() - 5))
/*
Group Daily Expense Function 
This function is used to get the dailyly amount spend in a group 
Accepts : group Id 
Returns : Expense per day (current year)
*/
exports.groupDailyExpense = async (req, res) => {
    try {
        /** changed */
        // var dailyExpense = await model.Expense.aggregate([{
        //     $match: {
        //         groupId: req.body.id,
        //         expenseDate: {
        //             $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        //             $lte: new Date()
        //         }
        //     }
        // },
        // {
        //     $group: {
        //         _id: {
        //             date: {
        //                 $dayOfMonth: "$expenseDate"
        //             },
        //             month: {
        //                 $month: "$expenseDate"
        //             },
        //             year: {
        //                 $year: "$expenseDate"
        //             }
        //         },
        //         amount: {
        //             $sum: "$expenseAmount"
        //         }
        //     }
        // },
        // { $sort: { "_id.month": 1, "_id.date": 1 } }
        // ])
        if (!req.body.id) {
            return res.status(400).json({
                status: "error",
                message: "Group ID is required"
            });
        }
        // Check if group exists        
        const group = await Group.findOne({
            where: { id: req.body.id }
        });
        if (!group) {
            return res.status(400).json({
                status: "error",
                message: "Invalid Group Id"
            });
        }
        const dailyExpense = await Expense.findAll({
            attributes: [
                [sequelize.literal('EXTRACT(DAY FROM "expense_date")'), 'date'],
                [sequelize.literal('EXTRACT(MONTH FROM "expense_date")'), 'month'],
                [sequelize.literal('EXTRACT(YEAR FROM "expense_date")'), 'year'],
                [sequelize.fn('SUM', sequelize.col('expense_amount')), 'amount']
            ],
            where: {
                groupId: req.body.id,
                expenseDate: {
                    [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 1)),
                    [Op.lte]: new Date()
                }
            },
            group: [
                sequelize.literal('EXTRACT(DAY FROM "expense_date")'),
                sequelize.literal('EXTRACT(MONTH FROM "expense_date")'),
                sequelize.literal('EXTRACT(YEAR FROM "expense_date")')
            ],
            order: [
                ['year', 'ASC'],
                ['month', 'ASC'],
                ['date', 'ASC']
            ],
            raw: true
        });
        res.status(200).json({
            status: "success",
            data: dailyExpense
        })
    } catch (err) {
        // Pass the entire error object to the logger
        logger.error(err);
        res.status(err.status || 500).json({
            message: err.message
        })
    }
}


/*
Category wise user expense calculator function 
This function is used to retuen the expense spend on each category for a user
Accepts : emailID
Returns : Each category total exp (individaul Expense)
*/
exports.userCategoryExpense = async (req, res) => {
    try {
        /** changed */
        // var categoryExpense = await model.Expense.aggregate([{
        //     $match: {
        //         expenseMembers: req.body.user
        //     }
        // },
        // {
        //     $group: {
        //         _id: "$expenseCategory",
        //         amount: {
        //             $sum: "$expensePerMember"
        //         }
        //     }
        // }, { $sort: { "_id": 1 } }
        // ])
        if (!req.body.user) {
            return res.status(400).json({
                status: "error",
                message: "User email is required"
            });
        }
        const user = await User.findOne({
            where: { emailId: req.body.user }
        });
        if (!user) {
            return res.status(400).json({
                status: "error",
                message: "Invalid User"
            });
        }
        const categoryExpense = await Expense.findAll({
            attributes: [
                'expenseCategory',
                [sequelize.fn('SUM', sequelize.col('expense_per_member')), 'amount']
            ],
            where: {
                expenseMembers: {
                    [Op.contains]: [req.body.user]
                }
            },
            group: ['expenseCategory'],
            order: [['expenseCategory', 'ASC']],
            raw: true
        });

        res.status(200).json({
            status: "success",
            data: categoryExpense
        })
    } catch (err) {
        // Pass the entire error object to the logger
        logger.error(err);
        res.status(err.status || 500).json({
            message: err.message
        })
    }
}


/*
User Monthly Expense Function 
This function is used to get the monthly amount spend by a user
Accepts : Email Id 
Returns : Expense per month
*/
exports.userMonthlyExpense = async (req, res) => {
    try {
        /** changed */
        // var monthlyExpense = await model.Expense.aggregate([{
        //     $match: {
        //         expenseMembers: req.body.user
        //     }
        // },
        // {
        //     $group: {
        //         _id: {
        //             month: {
        //                 $month: "$expenseDate"
        //             },
        //             year: {
        //                 $year: "$expenseDate"
        //             }
        //         },
        //         amount: {
        //             $sum: "$expensePerMember"
        //         }
        //     }
        // },
        // { $sort: { "_id.month": 1 } }
        // ])

        if (!req.body.user) {
            return res.status(400).json({
                status: "error",
                message: "User email is required"
            });
        }
        const user = await User.findOne({ where: { emailId: req.body.user } });
        if (!user) {
            return res.status(400).json({
                status: "error",
                message: "Invalid User"
            });
        }
        const monthlyExpense = await Expense.findAll({
            attributes: [
                [sequelize.literal('EXTRACT(MONTH FROM "expense_date")'), 'month'],
                [sequelize.literal('EXTRACT(YEAR FROM "expense_date")'), 'year'],
                [sequelize.fn('SUM', sequelize.col('expense_per_member')), 'amount']
            ],
            where: {
                expenseMembers: {
                    [Op.contains]: [req.body.user]
                }
            },
            group: [
                sequelize.literal('EXTRACT(MONTH FROM "expense_date")'),
                sequelize.literal('EXTRACT(YEAR FROM "expense_date")')
            ],
            order: [['year', 'ASC'], ['month', 'ASC']],
            raw: true
        });
        res.status(200).json({
            status: "success",
            data: monthlyExpense
        })
    } catch (err) {
        // Pass the entire error object to the logger
        logger.error(err);
        res.status(err.status || 500).json({
            message: err.message
        })
    }
}


/*
User Daily Expense Function 
This function is used to get the daily amount spend by a user
Accepts : Email Id 
Returns : Expense per month
*/
exports.userDailyExpense = async (req, res) => {
    try {
        /** changed */
        // var dailyExpense = await model.Expense.aggregate([{
        //     $match: {
        //         expenseMembers: req.body.user,
        //         expenseDate: {
        //             $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        //             $lte: new Date()
        //         }
        //     }
        // },
        // {
        //     $group: {
        //         _id: {
        //             date: {
        //                 $dayOfMonth: "$expenseDate"
        //             },
        //             month: {
        //                 $month: "$expenseDate"
        //             },
        //             year: {
        //                 $year: "$expenseDate"
        //             }
        //         },
        //         amount: {
        //             $sum: "$expenseAmount"
        //         }
        //     }
        // },
        // { $sort: { "_id.month": 1, "_id.date": 1 } }
        // ])
        if (!req.body.user) {
            return res.status(400).json({
                status: "error",
                message: "User email is required"
            });
        }
        const user = await User.findOne({ where: { emailId: req.body.user } });
        if (!user) {
            return res.status(400).json({
                status: "error",
                message: "Invalid User"
            });
        }
        const dailyExpense = await Expense.findAll({
            attributes: [
                [sequelize.literal('EXTRACT(DAY FROM "expense_date")'), 'date'],
                [sequelize.literal('EXTRACT(MONTH FROM "expense_date")'), 'month'],
                [sequelize.literal('EXTRACT(YEAR FROM "expense_date")'), 'year'],
                [sequelize.fn('SUM', sequelize.col('expense_per_member')), 'amount']
            ],
            where: {
                expenseMembers: {
                    [Op.contains]: [req.body.user]
                },
                expenseDate: {
                    [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 1)),
                    [Op.lte]: new Date()
                }
            },
            group: [
                sequelize.literal('EXTRACT(DAY FROM "expense_date")'),
                sequelize.literal('EXTRACT(MONTH FROM "expense_date")'),
                sequelize.literal('EXTRACT(YEAR FROM "expense_date")')
            ],
            order: [
                ['year', 'ASC'],
                ['month', 'ASC'],
                ['date', 'ASC']
            ],
            raw: true
        });
        res.status(200).json({
            status: "success",
            data: dailyExpense
        })
    } catch (err) {
        // Pass the entire error object to the logger
        logger.error(err);
        res.status(err.status || 500).json({
            message: err.message
        })
    }
}
