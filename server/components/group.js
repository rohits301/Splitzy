// const model = require('../model/schema')
const { User, Group, Settlement } = require('../models')
const validator = require('../helper/validation')
const logger = require('../helper/logger')
const splitCalculator = require('../helper/split')
const { Op } = require('sequelize'); // for groupMembers JSONB array operations
// const { User, Settlement } = require('../model/schema')

/*
Create Group Function This function basically create new groups
Accepts: Group Name
         Group Description:
         Group Members
         Currency Type:
Validation: Group Name not empty
            Group Members present in DB
            Currency type INR, USD, EUR (for now)
*/
exports.createGroup = async (req, res) => {
    try {
        /** changed */
        // var newGroup = new model.Group(req.body)
        const newGroup = Group.build(req.body);
        //Performing validation on the input
        if (validator.notNull(newGroup.groupName) &&
            validator.currencyValidation(newGroup.groupCurrency)) {

            /*
            Split Json is used to store the user split value (how much a person owes)
            When the Group is created all members are assigned the split value as 0    
            */
            var splitJson = {}

            for (var user of newGroup.groupMembers) {
                //Validating the group Members exist in the DB 
                var memberCheck = await validator.userValidation(user)
                if (!memberCheck) {
                    var err = new Error('Invalid member id')
                    err.status = 400
                    throw err
                }

                //Adding user to the split Json and init with 0 
                splitJson[user] = 0
            }

            /*
            Split Json will now contain an json with user email as the key and the split amount (currently 0) as the value
            We now store this splitJson object to the newGroup model so it can be stored to DB directly
            */
            newGroup.split = splitJson

            //Validating the group Owner exist in the DB 
            var ownerCheck = await validator.userValidation(newGroup.groupOwner)
            if (!ownerCheck) {
                var err = new Error('Invalid owner id')
                err.status = 400
                throw err
            }

            const createdGroup = await newGroup.save()
            res.status(200).json({
                status: "Success",
                message: "Group Creation Success",
                id: createdGroup.id
            })
        }
    } catch (err) {
        // logger.withCaller().error(`URL : ${req.originalUrl} | status : ${err.status} | message: ${err.message} ${err.stack}`)
        // Pass the entire error object to the logger
        logger.error(err); 
        res.status(err.status || 500).json({
            message: err.message
        })
    }
}


/*
View Group function 
This function is used to display the group details 
Accepts: Group Id 
Returns: Group Info 
*/
exports.viewGroup = async (req, res) => {
    try {
        /** changed */
        // const group = await model.Group.findOne({
        //     _id: req.body.id
        // })
        const group = await Group.findOne({
            where : { id: req.body.id }
        });
        if (!group || req.body.id == null) {
            var err = new Error('Invalid Group Id')
            err.status = 400
            throw err
        }
        res.status(200).json({
            status: "Success",
            group: group,
        })
    } catch(err) {
        // logger.withCaller().error(`URL : ${req.originalUrl} | status : ${err.status} | message: ${err.message}`)
        // Pass the entire error object to the logger
        logger.error(err); 
        res.status(err.status || 500).json({
            message: err.message
        })
    }
}

/*
Find all user group function
This function is basically to display the list of group that a user belongs
Accepts: user email ID
Validation: email Id present in DB
*/
exports.findUserGroup = async (req, res) => {
    try {
        /** changed */
        // const user = await model.User.findOne({
        //     emailId: req.body.emailId
        // })
        const user = await User.findOne({
            where: { emailId: req.body.emailId }
        });
        if (!user) {
            var err = new Error("User Id not found !")
            err.status = 400
            throw err
        }
        /** changed */
        // const groups = await model.Group.find({
        //     groupMembers: req.body.emailId
        // }).sort({
        //     $natural: -1 //to get the newest first 
        // })
        const groups = await Group.findAll({
            where: {
                groupMembers: {
                    [Op.contains]: [req.body.emailId] // Assuming groupMembers is an array
                }
            },
            order: [['createdAt', 'DESC']] // to get the newest first
        });
        res.status(200).json({
            status: "Success",
            groups: groups
        })
    } catch (err) {
        // logger.withCaller().error(`URL : ${req.originalUrl} | status : ${err.status} | message: ${err.message}`)
        // Pass the entire error object to the logger
        logger.error(err); 
        res.status(err.status || 500).json({
            message: err.message
        })
    }
}

/*
Edit Group Function
This function is to edit the already existing group to make changes.
Accepts: Group Id
        Modified group info
*/
exports.editGroup = async (req, res) => {
    try {
        /** changed */
        // var group = await model.Group.findOne({
        //     _id: req.body.id
        // })
        const group = await Group.findOne({
            where: { id: req.body.id }
        });
        if (!group || req.body.id == null) {
            var err = new Error("Invalid Group Id")
            err.status = 400
            throw err
        }

        /** changed */
        // var editGroup = new model.Group(req.body)
        const editGroup = Group.build(req.body);

        //Passing the existing split to the edit group 
        editGroup.split = group.split

        if (validator.notNull(editGroup.groupName) &&
            validator.currencyValidation(editGroup.groupCurrency)) {

            for (var user of editGroup.groupMembers) {
                //Validation to check if the members exist in the DB 
                var memberCheck = await validator.userValidation(user)
                if (!memberCheck) {
                    var err = new Error('Invalid member id')
                    err.status = 400
                    throw err
                }

                //Check if a new group member is added to the group and missing in the split 
                //split is used since json is stored as an array in the DB - ideally there should only be one element in the split array hence we are using the index number
                /** changed */ 
                // if (!editGroup.split.hasOwnProperty(user)) {
                //     //adding the missing members to the split and init with value 0
                //     editGroup.split[user] = 0
                // }
                if (!editGroup.split[user]) {
                    //if the split value is not present then init with 0
                    editGroup.split[user] = 0
                }
            }

            //validation to check if the groupOwner exist in the DB 
            var ownerCheck = await validator.userValidation(editGroup.groupOwner)
            if (!ownerCheck) {
                var err = new Error('Invalid owner id')
                err.status = 400
                throw err
            }

            /** changed */
            // change the commented code below in postgres compatible way
            // var update_response = await model.Group.updateOne({
            //     _id: req.body.id
            // }, {
            //     $set: {
            //         groupName: editGroup.groupName,
            //         groupDescription: editGroup.groupDescription,
            //         groupCurrency: editGroup.groupCurrency,
            //         groupMembers: editGroup.groupMembers,
            //         groupCategory: editGroup.groupCategory,
            //         split: editGroup.split
            //     }
            // })
            const updatedGroup = await Group.update({
                groupName: editGroup.groupName,
                groupDescription: editGroup.groupDescription,
                groupCurrency: editGroup.groupCurrency,
                groupMembers: editGroup.groupMembers,
                groupCategory: editGroup.groupCategory,
                split: editGroup.split
            }, {
                where: { id: req.body.id }
            });
            res.status(200).json({
                status: "Success",
                message: "Group updated successfully!",
                response: updatedGroup
            })
        }
    } catch (err) {
        // logger.withCaller().error(`URL : ${req.originalUrl} | status : ${err.status} | message: ${err.message}`)
        // Pass the entire error object to the logger
        logger.error(err); 
        res.status(err.status || 500).json({
            message: err.message
        })
    }
}

/*
Delete Group Function
This function is used to delete the existing group
Accepts: Group Id
Validation: exisitng group Id
*/
exports.deleteGroup = async (req, res) => {
    try {
        /** changed */
        // const group = await model.Group.findOne({
        //     _id: req.body.id
        // })
        const group = await Group.findOne({
            where: { id: req.body.id }
        });
        if (!group) {
            var err = new Error("Invalid Group Id")
            err.status = 400
            throw err
        }
        /** changed */
        // var delete_group = await model.Group.deleteOne({
        //     _id: req.body.id
        // })
        const deleteGroup = await Group.destroy({
            where: { id: req.body.id }
        });
        res.status(200).json({
            message: "Group deleted successfully!",
            status: "Success",
            response: deleteGroup
        })
    } catch (err) {
        // logger.withCaller().error(`URL : ${req.originalUrl} | status : ${err.status} | message: ${err.message}`)
        // Pass the entire error object to the logger
        logger.error(err); 
        res.status(err.status || 500).json({
            message: err.message
        })
    }
}


/*
Make Settlement Function 
This function is used to make the settlements in the group 

*/
exports.makeSettlement = async(req, res) =>{
    try{
        /** changed */
        // var reqBody = new model.Settlement(req.body)
        const reqBody = Settlement.build(req.body);
        validator.notNull(reqBody.groupId)
        validator.notNull(reqBody.settleTo)
        validator.notNull(reqBody.settleFrom)
        validator.notNull(reqBody.settleAmount)
        validator.notNull(reqBody.settleDate)
        /** changed */
        // const group = await model.Group.findOne({
        //     _id: req.body.groupId
        // })
        const group = await Group.findOne({
            where: { id: req.body.groupId }
        });
        if (!group) {
            var err = new Error("Invalid Group Id")
            err.status = 400
            throw err
        }
       
       group.split[req.body.settleFrom] += req.body.settleAmount
       group.split[req.body.settleTo] -= req.body.settleAmount

       /** changed */
    //    var id = await model.Settlement.create(reqBody)
       const id = await Settlement.build(reqBody).save();
    //    var update_response = await Group.updateOne({_id: group._id}, {$set:{split: group.split}})
        const updatedResponse = await Group.update({
            split: group.split
        }, {
            where: { id: group.id }
        });

       res.status(200).json({
        message: "Settlement successfully!",
        status: "Success",
        update: updatedResponse,
        response: id
    })
    }catch (err) {
        // logger.withCaller().error(`URL : ${req.originalUrl} | status : ${err.status} | message: ${err.message}`)
        // Pass the entire error object to the logger
        logger.error(err); 
        res.status(err.status || 500).json({
            message: err.message
        })
    }
}


/*
Add Split function 
This function is called when a new expense is added 
This function updates the member split amount present in the goroup 
Accepts groupId
        per person exp
        exp owner 
        exp members 
it will add split to the owner and deduct from the remaining members 
This function is not a direct API hit - it is called by add expense function 
*/
exports.addSplit = async (groupId, expenseAmount, expenseOwner, expenseMembers) => {
    /** changed */
    // var group = await model.Group.findOne({
    //     _id: groupId
    // })
    const group = await Group.findOne({
        where: { id: groupId }
    });
    
    group.groupTotal += expenseAmount
    group.split[expenseOwner] += expenseAmount
    expensePerPerson = expenseAmount / expenseMembers.length
    expensePerPerson = Math.round((expensePerPerson  + Number.EPSILON) * 100) / 100;
    //Updating the split values per user 
    for (var user of expenseMembers) {
        group.split[user] -= expensePerPerson
    }
    
    //Nullifying split - check if the group balance is zero else added the diff to owner 
    let bal=0
    for(val of Object.entries(group.split))
    {
        bal += val[1]
    }
    group.split[expenseOwner] -= bal
    group.split[expenseOwner] = Math.round((group.split[expenseOwner]  + Number.EPSILON) * 100) / 100;
    //Updating back the split values to the group 
    /** changed */
    // return await model.Group.updateOne({
    //     _id: groupId
    // }, group)
    return await Group.update({
        split: group.split,
        groupTotal: group.groupTotal
    }, {
        where: { id: groupId }
    });
}

/*
Clear Split function 
This function is used to clear the split caused due to a prev expense 
This is used guring edit expense or delete expense operation 
Works in the reverse of addSplit function 
*/
exports.clearSplit = async (groupId, expenseAmount, expenseOwner, expenseMembers) => {
    /** changed */
    // var group = await model.Group.findOne({
    //     _id: groupId
    // })
    const group = await Group.findOne({
        where: { id: groupId }
    });
    group.groupTotal -= expenseAmount
    group.split[expenseOwner] -= expenseAmount
    expensePerPerson = expenseAmount / expenseMembers.length
    expensePerPerson = Math.round((expensePerPerson  + Number.EPSILON) * 100) / 100;
    //Updating the split values per user 
    for (var user of expenseMembers) {
        group.split[user] += expensePerPerson
    }

    //Nullifying split - check if the group balance is zero else added the diff to owner 
    let bal=0
    for(val of Object.entries(group.split))
    {
        bal += val[1]
    }
    group.split[expenseOwner] -= bal
    group.split[expenseOwner] = Math.round((group.split[expenseOwner]  + Number.EPSILON) * 100) / 100;
    //Updating back the split values to the group 
    /** changed */
    // return await model.Group.updateOne({
    //     _id: groupId
    // }, group)
    return await Group.update({
        split: group.split,
        groupTotal: group.groupTotal
    }, {
        where: { id: groupId }
    });
}


/*
Group Settlement Calculator 
This function is used to calculate the balnce sheet in a group, who owes whom 
Accepts : group Id 
return : group settlement detals
*/
exports.groupBalanceSheet = async(req, res) =>{
    try {
        /** changed */
        // const group = await model.Group.findOne({
        //     _id: req.body.id
        // })
        const group = await Group.findOne({
            where: { id: req.body.id }
        });
        if (!group) {
            var err = new Error("Invalid Group Id")
            err.status = 400
            throw err
        }
        res.status(200).json({
            status: "Success",
            data: splitCalculator(group.split)
        })
    } catch (err) {
        // logger.withCaller().error(`URL : ${req.originalUrl} | status : ${err.status} | message: ${err.message}`)
        // Pass the entire error object to the logger
        logger.error(err); 
        res.status(err.status || 500).json({
            message: err.message
        })
    }
}