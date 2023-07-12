const Joi = require("joi");
const { sendBasicError } = require("../helper/library");
const Stream = require("../models/Stream");
const csv = require('csv-parser')
const fs = require('fs')


const getStream = async (req, res) => {
    try {
        let stream = await Stream.find()
        res.send({
            status: true,
            data: stream,
            msg: "Stream List"
        })

    } catch (err) {
        sendBasicError(err, res)
    }
}

const addStream = async (req, res) => {
    let streamSchema = Joi.object({
        s_name: Joi.string().required(),
        s_code: Joi.string().required(),
    })
    try {
        let data = await streamSchema.validateAsync(req.body);
        let stream = new Stream({
            name: data.s_name,
            code: data.s_code
        })
        let result = await stream.save()
        res.send({
            status: true,
            data: result,
            msg: "Course added successfully ."
        })

    } catch (err) {
        sendBasicError(err, res)
    }
}
const bulkAddStream = async (req, res) => {
    let streamSchema = Joi.object({
        stream_name: Joi.string().required(),
        code: Joi.string().required(),
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
                            data = await streamSchema.validateAsync(item);
                            let stream = new Stream({
                                name: data.stream_name,
                                code: data.code
                            })
                            let result = await stream.save()
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
const deleteStream = async (req, res) => {
    let schema = Joi.object({
        id: Joi.string().required()
    })
    try {
        let data = await schema.validateAsync(req.body);
        let result = await Stream.findByIdAndDelete(data.id)
        res.send({
            status: true,
            msg: "Deleted successfully"
        })

    } catch (err) {
        console.log(err);
        sendBasicError(err, res)
    }
}
const updateStream = async (req, res) => {
    let schema = Joi.object({
        id: Joi.string().required()
    }).unknown(true)
    try {
        let data = await schema.validateAsync(req.body);
        let temp = await Stream.findById(data.id)
        let result = await Stream.findByIdAndUpdate(data.id,
            {
                $set: {
                    "name": data.name ?? temp.name,
                    "code": data.code ?? temp.code
                }
            })
        temp = await Stream.findById(data.id)
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

const StreamController = {
    getStream,
    addStream,
    deleteStream,
    updateStream,
    bulkAddStream
}
module.exports = StreamController