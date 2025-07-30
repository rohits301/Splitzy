// const model = require('../model/schema')
// const logger = require('./logger')

// exports.notNull = (value) => {
//     if (value)
//         return true
//     else {
//         var err = new Error("Please input the required field")
//         err.status = 400
//         throw err
//     }
// }

// exports.emailValidation = (email) => {
//     if (email && email.includes("@") && email.includes(".com"))
//         return true
//     else {
//         var err = new Error("Email validation fail!!")
//         err.status = 400
//         throw err
//     }
// }

// exports.passwordValidation = (pass) => {
//     // if(pass)
//     // if (pass.search(/[a-z]/) >= 0 && pass.search(/[A-Z]/) >= 0 &&
//     //     pass.search(/[0-9]/) >= 0 &&
//     //     pass.search(/[!@#$%^&*()]/) >= 0 &&
//     //     pass.length >= 8) {
//     //     return true
//     // } 
//         if(pass && pass.length >=8){
//             return true
//         }
//         var err = new Error("Password validation fail!!")
//         err.status = 400
//         throw err
//     }


// exports.currencyValidation = (currency) => {
//     if (currency &&
//         currency == "INR" ||
//         currency == "USD" ||
//         currency == "EUR") {
//         return true
//     } else {
//         var err = new Error("Currency validation fail!!")
//         err.status = 400
//         throw err

//     }
// }

// exports.userValidation = async (email) => {
//     var user = await model.User.findOne({
//         emailId: email
//     })
//     if (!user)
//         return false
//     else
//         return true
// }

// exports.groupUserValidation = async (email, groupId) => {
//     var groupMembers = await model.Group.findOne({
//         _id: groupId
//     }, {
//         groupMembers: 1,
//         _id: 0
//     })
//     groupMembers = groupMembers['groupMembers']
//     if (groupMembers.includes(email))
//         return true
//     else{
//         logger.warn([`Group User Valdation fail : Group ID : [${groupId}] | user : [${email}]`])
//         return false
//     }
// }

const logger = require('./logger');
const { User, Group } = require('../models'); // Sequelize models

exports.notNull = (value) => {
    if (value)
        return true;
    else {
        const err = new Error("Please input the required field");
        err.status = 400;
        throw err;
    }
};

exports.emailValidation = (email) => {
    if (email && email.includes("@") && email.includes(".com"))
        return true;
    else {
        const err = new Error("Email validation fail!!");
        err.status = 400;
        throw err;
    }
};

exports.passwordValidation = (pass) => {
    if (pass && pass.length >= 8) {
        return true;
    }
    const err = new Error("Password validation fail!!");
    err.status = 400;
    throw err;
};

exports.currencyValidation = (currency) => {
    if (
        currency &&
        (currency === "INR" || currency === "USD" || currency === "EUR")
    ) {
        return true;
    } else {
        const err = new Error("Currency validation fail!!");
        err.status = 400;
        throw err;
    }
};

exports.userValidation = async (email) => {
    const user = await User.findOne({
        where: { emailId: email }
    });
    return !!user;
};

exports.groupUserValidation = async (email, groupId) => {
    const group = await Group.findOne({
        where: { id: groupId },
        attributes: ['groupMembers']
    });

    if (!group) {
        logger.warn([`Group not found: ID = ${groupId}`]);
        return false;
    }

    const groupMembers = group.groupMembers || [];

    if (groupMembers.includes(email)) {
        return true;
    } else {
        logger.warn([`Group User Validation fail: Group ID = [${groupId}] | User = [${email}]`]);
        return false;
    }
};

exports.validateAllMembers = async (groupId, membersArray) => {
    for (const email of membersArray) {
        const isValid = await exports.groupUserValidation(email, groupId);
        if (!isValid) {
            const err = new Error(`Invalid group member: ${email}`);
            err.status = 400;
            throw err;
        }
    }
};

exports.validateExpenseInput = (expense) => {
    if (!expense.expenseName) {
        throw new Error("Expense name is required");
    }
    if (!expense.expenseAmount && expense.expenseAmount !== 0) {
        throw new Error("Expense amount is required");
    }
    if (expense.expenseAmount <= 0) {
        throw new Error("Expense amount must be greater than zero");
    }
    if (!expense.expenseOwner) {
        throw new Error("Expense owner is required");
    }
    if (!Array.isArray(expense.expenseMembers) || expense.expenseMembers.length === 0) {
        throw new Error("Expense members must be a non-empty array");
    }
    const uniqueMembers = new Set(expense.expenseMembers);
    if (uniqueMembers.size !== expense.expenseMembers.length) {
        throw new Error("Expense members must not contain duplicates");
    }
    // Add more checks as needed
    return true;
}
