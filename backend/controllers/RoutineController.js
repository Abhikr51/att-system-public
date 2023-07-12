const { sendBasicError } = require("../helper/library");
const Period = require("../models/Period");
const Qrcode = require("../models/Qrcode");
const Routine = require("../models/Routine")
const Joi = require("joi");
const csv = require('csv-parser')
const fs = require('fs')

const getRoutine = async (req, res) => {
    let schema = Joi.object({
        semester_code: Joi.string().required(),
        stream_code: Joi.string().required(),

    })
    try {
        let data = await schema.validateAsync(req.body);
        let routine = await Routine.find({ stream_code: data.stream_code, semester_code: data.semester_code }).populate('stream').populate("periods.qr_code").lean();
        let compare = (a, b) => {
            let a_num = parseInt(a.period_code.match(/\d+/).join(""));
            let b_num = parseInt(b.period_code.match(/\d+/).join(""));
            if (a_num < b_num) {
                return -1;
            }
            if (a_num > b_num) {
                return 1;
            }
            return 0;
        }
        let result =[];
        for(r of routine){
            result.push({...r,periods : r.periods.sort(compare)})
        }

        res.send({
            status: true,
            data: result,
            msg: "Routine"
        })

    } catch (err) {
        sendBasicError(err, res)
    }
}
const deleteRoutine = async (req, res) => {
    let schema = Joi.object({
        semester_code: Joi.string().required(),
        stream_code: Joi.string().required(),
    })
    try {
        let data = await schema.validateAsync(req.body);
        let routine = await Routine.deleteMany({ stream_code: data.stream_code, semester_code: data.semester_code });
        
        res.send({
            status: true,
            data: routine,
            msg: "deleted Successfully"
        })

    } catch (err) {
        sendBasicError(err, res)
    }
}
const uploadRoutine = async (req, res) => {
    let subjectSchema = Joi.object({
        sl_no: Joi.string().required(),
        day: Joi.string().required(),
        stream_code: Joi.string().required(),
        sem: Joi.string().required(),
        p1: Joi.string().allow(null, ''),
        p2: Joi.string().allow(null, ''),
        p3: Joi.string().allow(null, ''),
        p4: Joi.string().allow(null, ''),
        p5: Joi.string().allow(null, ''),
        p6: Joi.string().allow(null, ''),
        p7: Joi.string().allow(null, ''),
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
                            let periods = await Period.find();
                            let r_periods = []
                            for (var p of periods) {
                                let qr_code = new Qrcode({
                                    period_code: p.period_code,
                                    qr_code: "",
                                    paper_code: data[p.period_code].split(" ")[0],
                                    teacher_short_name: data[p.period_code].split(" ")[1],
                                    day : data.day
                                })
                                let qr_res = await qr_code.save()
                                r_periods.push({
                                    qr_code: qr_res.id,
                                    period_code: p.period_code
                                })
                            }
                            // console.log("periods", r_periods);
                            let routine = new Routine({
                                sl_no: data.sl_no,
                                day: data.day,
                                semester_code: data.sem,
                                stream_code: data.stream_code,
                                periods: r_periods
                            })
                            let routine_res = await routine.save()
                            console.log("Routine :", routine_res)
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

const RoutineController = {
    getRoutine,
    uploadRoutine,
    deleteRoutine
}
module.exports = RoutineController