// const model = require('../model/schema')
const { User } = require('../models'); // Sequelize auto-loads from /models/index.js
const bcrypt = require('bcryptjs')
const validator = require('../helper/validation')
const logger = require('../helper/logger')
const apiAuth = require('../helper/apiAuthentication')

/*
User Registeration function
Accepts: firstName, lastName, emailId, password 
Validation: firstname, lastname not Null 
            emailID - contain '@' and '.com' 
            password - min 8, lowecase, uppercase, special character, numbers
API: /users/v1/register
*/
exports.userReg = async (req, res) => {
    try {
        //Checking email Id exist in DB
        /** changed */
        // const user = await model.User.findOne({
        //     emailId: req.body.emailId
        // })
        console.log('User model:', User);

        const user = await User.findOne({
            where: { 
                emailId: req.body.emailId
            }   
        });
        //If email ID present in database thows error and retuen message
        if (user) {
            const err = new Error("Email Id already present, please login!")
            err.status = 400
            throw err
        } else {
            //Accepts the inputs and create user model form req.body
            /** changed */
            // var newUser = new model.User(req.body)
            const newUser = User.build(req.body); // Sequelize way to create a new instance
            //Performing validations
            if (validator.emailValidation(newUser.emailId) &&
                validator.passwordValidation(newUser.password) &&
                validator.notNull(newUser.firstName)) {
                //Bcrypt password encryption
                const salt = await bcrypt.genSalt(10);
                newUser.password = await bcrypt.hash(newUser.password, salt)

                //storing user details in DB
                /** changed */
                // var id = await model.User.create(newUser)
                const createdUser = await newUser.save(); // Sequelize way to save the instance
                res.status(200).json({
                    status: "Success",
                    message: "User Registeration Success",
                    userId: createdUser.id
                })
            }
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
User login function
Accepts: email Id & Pass
Implement Google Sign-in in the future.
*/
exports.userLogin = async (req, res) => {
    try {
        //Checking email Id exist in DB 
        /** changed */
        // const user = await model.User.findOne({
        //     emailId: req.body.emailId
        // })
        const user = await User.findOne({
            where: {
                emailId: req.body.emailId
            },
            attributes: ['id', 'emailId', 'password', 'firstName', 'lastName'] // Include password in the result
        });
        
        if (!user) {
            var err = new Error("Invalid email Id or Password !")
            err.status = 401
            throw err
        }

        //validating password using bcrypt
        const validCred = await bcrypt.compare(req.body.password, user.password)
        if (!validCred) {
            var err = new Error("Invalid email Id or Password* !")
            err.status = 401
            throw err
        } else {
            const accessToken = apiAuth.generateAccessToken(req.body.emailId)
            res.status(200).json({
                status: "Success",
                message: "User Login Success",
                userId: user.id,
                emailId: user.emailId,
                firstName: user.firstName,
                lastName: user.lastName,
                accessToken
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
View User function 
This function is to view the user details 
Accepts: user email Id 
Returns: user details (ensure password is removed)
*/
exports.viewUser = async (req, res) => {
    try {
        //check if the login user is same as the requested user 
        apiAuth.validateUser(req.user, req.body.emailId) 
        /** changed */
        // const user = await model.User.findOne({
        //     emailId: req.body.emailId
        // }, {
        //     password: 0
        // })

        const user = await User.findOne({
            where: {
                emailId: req.body.emailId
            },
            attributes: { exclude: ['password'] } // Exclude password from the result
        });

        if(!user) {
            var err = new Error("User does not exist!")
            err.status = 400
            throw err
        }
        res.status(200).json({
            status: "Success",
            user: user
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
View All User EmailIs function 
This function is to get all the user email Id 
Accepts: none
Returns: all user Email ID
*/
exports.emailList = async (req, res) => {
    try {
        //check if the login user is same as the requested user 
        /** changed */
        // const userEmails = await model.User.find({
        // }, {
        //     emailId: 1,
        //     _id: 0
        // })
        const userEmails = await User.findAll({
            attributes: ['emailId'] // Only select emailId
        });

        if(!userEmails) {
            var err = new Error("User does not exist!")
            err.status = 400
            throw err
        }
        /** changed */
        // var emailList = [] 
        // for(var email of userEmails){
        //     emailList.push(email.emailId)
        // }
        // simplify by using map
        const emailList = userEmails.map(user => user.emailId);

        res.status(200).json({
            status: "Success",
            user: emailList
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
Delete User function 
This function is used to delete an existing user in the database 
Accepts: user email id 
*/
exports.deleteUser = async (req, res) => {
    try {
        //check if the login user is same as the requested user 
        apiAuth.validateUser(req.user, req.body.emailId)
        const userCheck = await validator.userValidation(req.body.emailId)
        if (!userCheck) {
            var err = new Error("User does not exist!")
            err.status = 400 
            throw err
        }
        /** changed */
        // const delete_response = await model.User.deleteOne({
        //     emailId: req.body.emailId
        // })
        const deleteUser = await User.destroy({
            where: {
                emailId: req.body.emailId
            }
        });
        res.status(200).json({
            status: "Success",
            message: "User Account deleted!",
            response: deleteUser
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
Edit User function 
This function is used to edit the user present in the database 
Accepts: User data (user email id can not be changed)
This function can not be used to change the password of the user 
*/
exports.editUser = async (req, res) => {
    try {
        //check if the login user is same as the requested user 
        apiAuth.validateUser(req.user, req.body.emailId)
        const userCheck = await validator.userValidation(req.body.emailId)
        if (!userCheck) {
            var err = new Error("User does not exist!")
            err.status = 400
            throw err
        }
        //Accepts the inputs and create user model form req.body
        var editUser = req.body
        //Performing validations
        if (validator.notNull(editUser.firstName) &&
            validator.notNull(editUser.lastName)) {
            //storing user details in DB
            /** changed */
            // var update_response = await model.User.updateOne({
            //     emailId: editUser.emailId
            // }, {
            //     $set: {
            //         firstName: editUser.firstName,
            //         lastName: editUser.lastName,
            //     }
            // })
            const updateUser = await User.update(
                {
                    firstName: editUser.firstName,
                    lastName: editUser.lastName
                },
                {
                    where: { emailId: editUser.emailId }
                }
            );
            res.status(200).json({
                status: "Success",
                message: "User update Success",
                updatedCount: updateUser[0]
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
Update Password function 
This function is used to update the user password 
Accepts : emailId 
          new password 
          old password 
validation : old password is correct 
             new password meet the requirements 
*/
exports.updatePassword = async (req, res) => {
    try {
        //check if the login user is same as the requested user 
        apiAuth.validateUser(req.user, req.body.emailId)
        /** changed */
        // const user = await model.User.findOne({
        //     emailId: req.body.emailId
        // })
        const user = await User.findOne({
            where: {
                emailId: req.body.emailId
            },
            attributes: ['id', 'emailId', 'password'] // Include password in the result
        });
        if (!user) {
            var err = new Error("User does not exist!")
            err.status = 400
            throw err
        }

        //Performing basic validations 
        validator.notNull(req.body.oldPassword)
        validator.passwordValidation(req.body.newPassword)

        //validating password using bcrypt
        const validCred = await bcrypt.compare(req.body.oldPassword, user.password)
        if (!validCred) {
            var err = new Error("Old Password does not match")
            err.status = 400
            throw err
        }
        //Bcrypt password encryption
        const salt = await bcrypt.genSalt(10);
        var hash_password = await bcrypt.hash(req.body.newPassword, salt)
        /** changed */
        // var update_response = await model.User.updateOne({
        //     emailId: req.body.emailId
        // }, {
        //     $set: {
        //         password: hash_password
        //     }
        // })
        // the below method returns an array where the first element is the number of affected rows
        // so we need to access the first element to get the count of updated rows
        const updateUser = await User.update(
            { password: hash_password },
            { where: { emailId: req.body.emailId } }
        );

        res.status(200).json({
            status: "Success",
            message: "Password update Success",
            updatedCount: updateUser[0]
        })
    } catch (err) {
        // logger.withCaller().error(`URL : ${req.originalUrl} | status : ${err.status} | message: ${err.message} ${err.stack}`)
                // Pass the entire error object to the logger
        logger.error(err); 
        res.status(err.status || 500).json({
            message: err.message
        })
    }
}