const jwt = require('jsonwebtoken')
const { ObjectId } = require("bson")
const { generateUniqueUsername, sendBasicError , admin_details} = require('../helper/library')
const User = require('../models/User')
const Joi = require('joi');
const login = async (req, res) => {
    const login_schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(4).required()
    })
    try {
        let data = await login_schema.validateAsync(req.body)
        User.findOne({
            email: data.email
        }, function (err, user) {
            if (err) {
                res.json({
                    status: false,
                    msg: "Error",
                    error: err
                })
            }
            if (!user || !(user.password == data.password)) {
                return res.status(401).json({
                    status: false,
                    msg: 'Authentication failed. Invalid email or password.'
                });
            }
            // console.log("login called", user);
            if(user.role == 'admin'){
                user = {...user._doc,admin_details}
            }else{
                user = user._doc
            }
            var keys = Object.keys(user)
            var d_key
            for(i of keys){if(i.indexOf("details") !== -1){d_key = i}}
            var result = {...user,details:user[d_key]}
            delete result[d_key];
            return res.json({
                status: true,
                data: result,
                token: jwt.sign({   email: user.email, _id: user._id }, 'RESTFULAPIs', {

                    // expiresIn: 100000 // expires in 5 days
                    expiresIn: '10d' // expires in 5 days

                })
            });
        }).populate("student_details").populate("teacher_details");
    } catch (err) {
        sendBasicError(err,res)
    }
}
const register = async (req, res) => {

    try {
        if (!req.body.name) {
            res.json({
                status: false,
                msg: "name required"
            })
        } else if (!req.body.email) {
            res.json({
                status: false,
                msg: "email required"
            })
        } else if (!req.body.password) {
            res.json({
                status: false,
                msg: "password required"
            })
        } else {
            var newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
            });
            newUser.save(function (err, user) {
                if (err) {
                    return res.status(400).send({
                        status: false,
                        msg: err
                    });
                } else {
                    return res.json({
                        status: true,
                        msg: "User Created successfully.",
                        data: user,
                        token: jwt.sign({ email: user.email, name: user.name, _id: user._id }, 'RESTFULAPIs', {

                            // expiresIn: 100000 
                            expiresIn: '10d'

                        })
                    });
                }
            });
        }
    } catch (err) {
        sendBasicError(err,res)
    }


}
const logout = (req, res) => {
    try {
        res.json("logout")
    } catch (err) {
        sendBasicError(err,res)
    }
}
const getUser = (req, res) => {
    try {
        if (req.user) {
            return res.json({
                status: true,
                msg: "success",
                data: req.user
            });
        } else {
            return res.status(401).json({ status: false, msg: 'Invalid token' });
        }
    } catch (err) {
        sendBasicError(err,res)
    }
}



const AuthController = {
    login,
    register,
    logout,
    getUser,
}
module.exports = AuthController