const Joi = require("joi");
const { sendBasicError } = require("../helper/library");
const Course = require("../models/Course");
const csv = require('csv-parser')
const fs = require('fs')


const getCourse = async (req, res) => {
    try {
        let course = await Course.find()
        res.send({
            status: true,
            data: course,
            msg: "Course List"
        })

    } catch (err) {
        sendBasicError(err, res)
    }
}

const addCourse = async (req, res) => {
    let courseSchema = Joi.object({
        course_name: Joi.string().required(),
        prefix: Joi.string().required(),
    })
    try {
        let data = await courseSchema.validateAsync(req.body);
        let course = new Course({
            name: data.course_name,
            prefix: data.prefix
        })
        let result = await course.save()
        res.send({
            status: true,
            data: result,
            msg: "Course added successfully ."
        })

    } catch (err) {
        sendBasicError(err, res)
    }
}
const bulkAddCourse = async (req, res) => {
    let courseSchema = Joi.object({
        course_name: Joi.string().required(),
        prefix: Joi.string().required(),
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
                    for (var item of data_array) {
                        try {
                            data = await courseSchema.validateAsync(item);
                            let course = new Course({
                                name: data.course_name,
                                prefix: data.prefix
                            })
                            let result = await course.save()
                            console.log("Sl no " + item.sl_no + "success".green)
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
const deleteCourse = async (req, res) => {
    let schema = Joi.object({
        id: Joi.string().required()
    })
    try {
        let data = await schema.validateAsync(req.body);
        let result = await Course.findByIdAndDelete(data.id)
        res.send({
            status: true,
            msg: "Deleted successfully"
        })

    } catch (err) {
        console.log(err);
        sendBasicError(err, res)
    }
}
const updateCourse = async (req, res) => {
    let schema = Joi.object({
        id: Joi.string().required()
    }).unknown(true)
    try {
        let data = await schema.validateAsync(req.body);
        let temp = await Course.findById(data.id)
        let result = await Course.findByIdAndUpdate(data.id,
            {
                $set: {
                    "name": data.course_name ?? temp.name,
                    "prefix": data.prefix ?? temp.prefix
                }
            })
        temp = await Course.findById(data.id)
        res.send({
            status: true,
            data: temp,
            msg: "Updated successfully"
        })

    } catch (err) {
        console.log(err);
        sendBasicError(err, res)
    }
}

const CourseController = {
    getCourse,
    addCourse,
    deleteCourse,
    updateCourse,
    bulkAddCourse
}
module.exports = CourseController