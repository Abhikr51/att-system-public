const Joi = require("joi");
const { sendBasicError } = require("../helper/library");
const Period = require("../models/Period");


const getPeriod = async (req, res) => {
    try {
        let period = await Period.find().sort({period_code:'asc'})
        res.send({
            status: true,
            data: period,
            msg: "Period List"
        })

    } catch (err) {
        sendBasicError(err, res)
    }
}

const addPeriod = async (req, res) => {
    let periodSchema = Joi.object({
        period_code: Joi.string().required(),
        start_time: Joi.string().required(),
        end_time: Joi.string().required(),
    })
    try {
        let data = await periodSchema.validateAsync(req.body);
        let period = new Period({
            period_code: data.period_code,
            start_time : data.start_time,
            end_time : data.end_time
        })
        let result = await period.save()
        res.send({
            status: true,
            data: result,
            msg: "Period added successfully ."
        })

    } catch (err) {
        sendBasicError(err, res)
    }
}

const deletePeriod = async (req, res) => {
    let schema = Joi.object({
        id: Joi.string().required()
    })
    try {
        let data = await schema.validateAsync(req.body);
        let result = await Period.findByIdAndDelete(data.id)
        res.send({
            status: true,
            msg: "Deleted successfully"
        })

    } catch (err) {
        console.log(err);
        sendBasicError(err, res)
    }
}
const updatePeriod = async (req, res) => {
    let schema = Joi.object({
        id: Joi.string().required()
    }).unknown(true)
    try {
        let data = await schema.validateAsync(req.body);
        let temp = await Period.findById(data.id)
        let result = await Period.findByIdAndUpdate(data.id,
            {
                $set: {
                    "period_code": data.period_code ?? temp.period_code,
                    "start_time": data.start_time ?? temp.start_time,
                    "end_time": data.end_time ?? temp.end_time
                }
            },{new  :true})
        // temp = await Period.findById(data.id)
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

const PeriodController = {
    getPeriod,
    addPeriod,
    deletePeriod,
    updatePeriod,
    // bulkAddPeriod
}
module.exports = PeriodController