const Joi = require("joi");
const { sendBasicError } = require("../helper/library");
const Subject = require("../models/Subject");
const csv = require('csv-parser')
const fs = require('fs')

const getSubject = async (req, res) => {
    try {
        let subject = await Subject.find().populate('stream')
        res.send({
            status: true,
            data: subject,
            msg: "Subject List"
        })

    } catch (err) {
        sendBasicError(err, res)
    }
}

const addSubject = async (req, res) => {
    let subjectSchema = Joi.object({
        subject_name: Joi.string().required(),
        paper_code: Joi.string().required(),
        stream: Joi.string().required(),
        semester: Joi.string().required(),
    })
    try {
        let data = await subjectSchema.validateAsync(req.body);
        let subject = new Subject({
            name: data.subject_name,
            paper_code: data.paper_code,
            stream_code: data.stream,
            semester_code: data.semester,
        })
        let result = await subject.save()
        res.send({
            status: true,
            data: result,
            msg: "Subject added successfully ."
        })

    } catch (err) {
        sendBasicError(err, res)
    }
}
const bulkAddSubject = async (req, res) => {
    let subjectSchema = Joi.object({
        subject_name: Joi.string().required(),
        paper_code: Joi.string().required(),
        stream: Joi.string().required(),
        semester: Joi.string().required(),
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
                            data = await subjectSchema.validateAsync(item);
                            let subject = new Subject({
                                name: data.subject_name,
                                paper_code: data.paper_code,
                                stream_code: data.stream,
                                semester_code: data.semester,
                            })
                            let result = await subject.save()
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
const deleteSubject = async (req, res) => {
    let schema = Joi.object({
        id: Joi.string().required()
    })
    try {
        let data = await schema.validateAsync(req.body);
        let result = await Subject.findByIdAndDelete(data.id)
        res.send({
            status: true,
            msg: "Deleted successfully"
        })

    } catch (err) {
        console.log(err);
        sendBasicError(err, res)
    }
}
const updateSubject = async (req, res) => {
    let schema = Joi.object({
        id: Joi.string().required()
    }).unknown(true)
    try {
        let data = await schema.validateAsync(req.body);
        let temp = await Subject.findById(data.id)
        let result = await Subject.findByIdAndUpdate(data.id,
            {
                $set: {
                    name: data.subject_name ?? temp.name,
                    paper_code: data.paper_code ?? temp.paper_code,
                    stream_code: data.stream ?? temp.stream_code,
                    semester_code: data.semester ?? temp.semester_code,
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

const SubjectController = {
    getSubject,
    addSubject,
    deleteSubject,
    updateSubject,
    bulkAddSubject
}
module.exports = SubjectController