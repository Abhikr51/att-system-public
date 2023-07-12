const Joi = require("joi")
const csv = require('csv-parser')
const fs = require('fs')
const { sendBasicError } = require("../helper/library")
const User = require("../models/User")
const colors = require('colors')
const Teacher = require("../models/Teacher")
const getTeacherList = async (req, res) => {
    try {
        let user = await User.find({ role: 'teacher' }).populate('teacher_details')
        res.send({
            status: true,
            data: user,
            msg: "Teacher list"
        })

    } catch (err) {
        sendBasicError(err, res)
    }
}
const updateTeacher = async (req, res) => {
    let schema = Joi.object({
        id: Joi.string().required()
    }).unknown(true)
    try {
        let data = await schema.validateAsync(req.body);
        let temp = await Teacher.findById(data.id)
        let result = await Teacher.findByIdAndUpdate(data.id,
            {
                $set: {
                    "gender": data.gender ?? temp.gender,
                    "title": data.title ?? temp.title,
                    "first_name": data.first_name ?? temp.first_name,
                    "middle_name": data.middle_name ?? temp.middle_name,
                    "last_name": data.last_name ?? temp.last_name,
                    "dob": data.dob ?? temp.dob,
                    "designation": data.designation ?? temp.designation,
                    // "phone": temp.phone,
                }
            }, { new: true })
        res.send({
            status: true,
            data: result,
            msg: "Updated successfully"
        })

    } catch (err) {
        console.log(err);
        sendBasicError(err, res)
    }
}
const deleteTeacher = async (req, res) => {
    let schema = Joi.object({
        id: Joi.string().required()
    })
    try {
        let data = await schema.validateAsync(req.body);
        let result = await User.findByIdAndDelete(data.id)
        res.send({
            status: true,
            msg: "Deleted successfully"
        })

    } catch (err) {
        console.log(err);
        sendBasicError(err, res)
    }
}
const createTeacher = async (req, res) => {
    let teacherSchema = Joi.object({
        title: Joi.string().required(),
        first_name: Joi.string().required(),
        middle_name: Joi.string().allow(null, ''),
        last_name: Joi.string().required(),
        short_name: Joi.string().required(),
        dob: Joi.string().required(),
        gender: Joi.string().required(),
        designation: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().length(10).required(),
        short_name : Joi.string().required()
        // image : Joi.any().required()
    })
    try {
        let data = await teacherSchema.validateAsync(req.body);
        let isExistEmail = await User.findOne({ email: data.email })
        let isExistPhone = await Teacher.findOne({ phone: data.phone })

        if (isExistEmail && isExistPhone) {
            res.send({
                status: false,
                data: {},
                msg: "Email and phone already registered , please try another one !"
            })
        } else if (isExistEmail) {
            res.send({
                status: false,
                data: {},
                msg: "Email id already registered , please try another email !"
            })
        } else if (isExistPhone) {
            res.send({
                status: false,
                data: {},
                msg: "Phone no. already registered , please try another phone !"
            })
        } else {

            let teacher = new Teacher({
                title: data.title,
                first_name: data.first_name,
                middle_name: data.middle_name,
                last_name: data.last_name,
                short_name: data.short_name,
                dob: data.dob,
                gender: data.gender,
                designation: data.designation,
                phone: data.phone,
                image: null,
                short_name : data.short_name
            });
            let teacher_result = await teacher.save()
            let user = new User({
                // name: data.middle_name ? [data.first_name, data.middle_name, data.last_name].join(" ") : [data.first_name, data.last_name].join(" "),
                teacher_details : teacher_result._id,
                email: data.email.toLowerCase(),
                password: "teacher@" + data.phone.slice(data.phone.length - 4, data.phone.length)
            });
            let user_result = await user.save()

            res.send({
                status: true,
                data: {...user_result._doc,teacher_details:teacher_result},
                msg: "Teacher added successfully ."
            })
        }

    } catch (err) {
        sendBasicError(err, res)
    }
}


const createBulkTeachers = async (req, res) => {
    let teacherSchema = Joi.object({
        title: Joi.string().required(),
        first_name: Joi.string().required(),
        middle_name: Joi.string().allow(null, '').allow(null, ''),
        last_name: Joi.string().required(),
        short_name: Joi.string().required(),
        dob: Joi.string().required(),
        gender: Joi.string().required(),
        designation: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().length(10).required(),
        short_name : Joi.string().required()
    }).unknown(true)
    try {

        if (req.file) {
            let data_array = []
            let error_array = []
            fs.createReadStream(req.file.path)
                .pipe(csv())
                .on('data', (data) => data_array.push(data))
                .on('end', async () => {
                    let data;
                    let isExistEmail;
                    let isExistPhone;
                    for (var item of data_array) {
                        try {

                            data = await teacherSchema.validateAsync(item);
                            let isExistEmail = await User.findOne({ email: data.email })
                            let isExistPhone = await Teacher.findOne({ phone: data.phone })


                            if (isExistEmail && isExistPhone) {
                                error_array.push({ sl_no: item.sl_no, msg: "Email id and phone no. already registered , please try another one !" })
                                    continue;
                            }else if (isExistEmail) {
                                error_array.push({ sl_no: item.sl_no, msg: "Email id already registered , please try another email !" })
                                    continue
                            } else if (isExistPhone) {
                                error_array.push({ sl_no: item.sl_no, msg: "Phone no. already registered , please try another phone !" })
                                    continue;
                            } else {
                                let teacher = new Teacher({
                                    title: data.title,
                                    first_name: data.first_name,
                                    middle_name: data.middle_name,
                                    last_name: data.last_name,
                                    short_name: data.short_name,
                                    dob: data.dob,
                                    gender: data.gender,
                                    designation: data.designation,
                                    phone: data.phone,
                                    image: null,
                                    short_name : data.short_name
                                });
                                let teacher_result = await teacher.save()
                                let user = new User({
                                    // name: data.middle_name ? [data.first_name, data.middle_name, data.last_name].join(" ") : [data.first_name, data.last_name].join(" "),
                                    teacher_details : teacher_result._id,
                                    email: data.email.toLowerCase(),
                                    password: "teacher@" + data.phone.slice(data.phone.length - 4, data.phone.length)
                                });
                                let user_result = await user.save()
                                console.log("Sl no " + item.sl_no + "success".green)
                            }
                        } catch (c_error) {
                            error_array.push({ sl_no: item.sl_no, msg: "Error happens : " + c_error.message })
                            continue
                        }

                    }
                    console.log("error_array".red, error_array)
                    res.send({
                        status: error_array.length == 0 ? true :false,
                        msg: error_array.length == 0 ? 'All data are succesfully added' : "Some data may not added please check log .",
                        error: error_array
                    })
                });

        } else {
            res.send({
                status: false,
                msg: 'sheet field required'
            })
        }

    } catch (err) {
        sendBasicError(err, res)
    }
}







const TeacherController = {
    getTeacherList,
    createTeacher,
    createBulkTeachers,
    updateTeacher,
    deleteTeacher
}
module.exports = TeacherController


