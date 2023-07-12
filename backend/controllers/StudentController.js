const Joi = require("joi")
const jwt = require('jsonwebtoken')
const csv = require('csv-parser')
const fs = require('fs')
const { sendBasicError } = require("../helper/library")
const User = require("../models/User")
const colors = require('colors')
const Student = require("../models/Student")
const getStudentList = async (req, res) => {
    try {
        let user = await User.find({ role: 'student' }).populate('student_details')
        res.send({
            status: true,
            data: user,
            msg: "Student list"
        })

    } catch (err) {
        sendBasicError(err, res)
    }
}
const getStudentById = async (req, res) => {
    try {
        let schema = Joi.object({
            id: Joi.string().required()
        })
        let data = await schema.validateAsync(req.body);
        let student = await Student.findById(data.id)
        res.send({
            status: true,
            data: student,
            msg: "Student list"
        })

    } catch (err) {
        sendBasicError(err, res)
    }
}
const updateStudent = async (req, res) => {
    let schema = Joi.object({
        id: Joi.string().required()
    }).unknown(true)
    try {
        let data = await schema.validateAsync(req.body);
        let temp = await Student.findById(data.id)
        let result = await Student.findByIdAndUpdate(data.id,
            {
                $set: {
                    "first_name" : data.first_name ?? temp.first_name,
                    "middle_name" : data.middle_name ?? temp.middle_name,
                    "last_name" : data.last_name ?? temp.last_name,
                    "dob" : data.dob ?? temp.dob,
                    "gender" : data.gender ?? temp.gender,
                    "father_name" : data.father_name ?? temp.father_name,
                    "guardian_name" : data.guardian_name ?? temp.guardian_name,
                    "alternate_phone" : data.alternate_phone ?? temp.alternate_phone,
                    "course" : data.course ?? temp.course,
                    "semester" : data.semester ?? temp.semester,
                    "category" : data.category ?? temp.category,
                    "address" : data.address ?? temp.address,
                }
            },{new : true})
        // temp = await Student.findById(data.id)
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
const deleteStudent = async (req, res) => {
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
const createStudent = async (req, res) => {
    let studentSchema = Joi.object({
        first_name : Joi.string().required(),
        middle_name : Joi.string().allow(null, ''),
        last_name : Joi.string().required(),
        dob : Joi.string().required(),
        gender : Joi.string().required(),
        father_name  : Joi.string().required(),
        guardian_name  : Joi.string().required(),
        alternate_phone  : Joi.string().length(10).allow(null, ''),
        course  : Joi.string().required(),
        semester  : Joi.string().required(),
        category  : Joi.string().required(),
        address  : Joi.string().required(),
        phone : Joi.string().length(10).required(),
        email: Joi.string().email().required(),
        // image : Joi.any().required(),
        password:Joi.string().allow(null, ''),
    })
    try {
        let data = await studentSchema.validateAsync(req.body);
        let isExistEmail = await User.findOne({ email: data.email })
        let isExistPhone = await Student.findOne({ phone: data.phone })

        if (isExistEmail && isExistPhone) {
            res.send({
                status: false,
                data: {},
                msg: "Email and phone already registered , please try another one !"
            })
        }else if (isExistEmail) {
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
            let student = new Student({
                first_name : data.first_name,
                middle_name : data.middle_name,
                last_name : data.last_name,
                dob : data.dob,
                gender : data.gender,
                father_name  : data.father_name ,
                guardian_name  : data.guardian_name ,
                alternate_phone  : data.alternate_phone ,
                stream_code  : data.course ,
                semester_code  : data.semester ,
                category  : data.category ,
                address  : data.address ,
                phone : data.phone,
                image: null,
            });
            let student_result = await student.save()
            let user = new User({
                // name: data.middle_name ? [data.first_name, data.middle_name, data.last_name].join(" ") : [data.first_name, data.last_name].join(" "),
                role : "student",
                student_details : student_result._id,
                email: data.email.toLowerCase(),
                password: data.password ?? "student@" + data.phone.slice(data.phone.length - 4, data.phone.length)
            });
            let user_result = await user.save()
            res.send({
                status: true,
                data: {...user_result._doc,details:student_result},
                msg: "Student added successfully .",
                token: jwt.sign({   email: user.email, _id: user._id }, 'RESTFULAPIs', {

                    // expiresIn: 100000 // expires in 5 days
                    expiresIn: '10d' // expires in 5 days

                })
            })
        }

    } catch (err) {
        sendBasicError(err, res)
    }
}


const createBulkStudents = async (req, res) => {
    let studentSchema = Joi.object({
        first_name : Joi.string().required(),
        middle_name : Joi.string().allow(null, ''),
        last_name : Joi.string().required(),
        dob : Joi.string().required(),
        gender : Joi.string().required(),
        father_name  : Joi.string().required(),
        guardian_name  : Joi.string().required(),
        alternate_phone  : Joi.string().length(10).allow(null, ''),
        course  : Joi.string().required(),
        semester  : Joi.string().required(),
        category  : Joi.string().required(),
        address  : Joi.string().required(),
        phone : Joi.string().length(10).required(),
        email: Joi.string().email().required(),
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

                            data = await studentSchema.validateAsync(item);
                            // data = item
                            let isExistEmail = await User.findOne({ email: data.email })
                            let isExistPhone = await Student.findOne({ phone: data.phone })

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

                                let student = new Student({
                                    first_name : data.first_name,
                                    middle_name : data.middle_name,
                                    last_name : data.last_name,
                                    dob : data.dob,
                                    gender : data.gender,
                                    father_name  : data.father_name ,
                                    guardian_name  : data.guardian_name ,
                                    alternate_phone  : data.alternate_phone ,
                                    stream_code  : data.course ,
                                    semester_code  : data.semester ,
                                    category  : data.category ,
                                    address  : data.address ,
                                    phone : data.phone,
                                    image: null,
                                });
                                let student_result = await student.save()
                                let user = new User({
                                    // name: data.middle_name ? [data.first_name, data.middle_name, data.last_name].join(" ") : [data.first_name, data.last_name].join(" "),
                                    role : "student",
                                    student_details : student_result._id,
                                    email: data.email.toLowerCase(),
                                    password: "student@" + data.phone.slice(data.phone.length - 4, data.phone.length)
                                });
                                let user_result = await user.save()
                                // res.send({
                                //     status: true,
                                //     data: result,
                                //     msg: "Student added successfully ."
                                // })
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







const StudentController = {
    getStudentList,
    getStudentById,
    createStudent,
    createBulkStudents,
    updateStudent,
    deleteStudent
}
module.exports = StudentController


