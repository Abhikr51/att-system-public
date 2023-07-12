const Joi = require("joi");
const { sendBasicError } = require("../helper/library");
const Semester = require("../models/Semester");
const csv = require('csv-parser')
const fs = require('fs')


const getSemester = async (req, res) => {
    try {
        let semester = await Semester.find()
        res.send({
            status: true,
            data: semester,
            msg: "Semester List"
        })

    } catch (err) {
        sendBasicError(err, res)
    }
}

const addSemester = async (req, res) => {
    let semesterSchema = Joi.object({
        semester_name: Joi.string().required(),
        code: Joi.string().required(),
    })
    try {
        let data = await semesterSchema.validateAsync(req.body);
        let semester = new Semester({
            name: data.semester_name,
            code: data.code
        })
        let result = await semester.save()
        res.send({
            status: true,
            data: result,
            msg: "Semester added successfully ."
        })

    } catch (err) {
        sendBasicError(err, res)
    }
}
// const bulkAddSemester = async (req, res) => {
//     let semesterSchema = Joi.object({
//         semester_name: Joi.string().required(),
//         code: Joi.string().required(),
//     }).unknown(true)
//     try {
//         if (req.file) {
//             let data_array = []
//             let error_array = []
//             fs.createReadStream(req.file.path)
//                 .pipe(csv())
//                 .on('data', (data) => data_array.push(data))
//                 .on('end', async () => {
//                     let data;
//                     for (var item of data_array) {
//                         try {
//                             data = await semesterSchema.validateAsync(item);
//                             let semester = new Semester({
//                                 name: data.semester_name,
//                                 code: data.code
//                             })
//                             let result = await semester.save()
//                             console.log("Sl no " + item.sl_no + "success".green)
//                         } catch (c_error) {
//                             error_array.push({ sl_no: item.sl_no, msg: "Error happens : " + c_error.message })
//                             continue
//                         }

//                     }
//                     console.log("error_array".red, error_array)
//                     res.send({
//                         status: error_array.length == 0 ? true :false,
//                         msg: error_array.length == 0 ? 'All data are succesfully added' : "Some data may not added please check log .",
//                         error: error_array
//                     })
//                 });

//         } else {
//             res.send({
//                 status: false,
//                 msg: 'sheet field required'
//             })
//         }

//     } catch (err) {
//         sendBasicError(err, res)
//     }
// }
const deleteSemester = async (req, res) => {
    let schema = Joi.object({
        id: Joi.string().required()
    })
    try {
        let data = await schema.validateAsync(req.body);
        let result = await Semester.findByIdAndDelete(data.id)
        res.send({
            status: true,
            msg: "Deleted successfully"
        })

    } catch (err) {
        console.log(err);
        sendBasicError(err, res)
    }
}
const updateSemester = async (req, res) => {
    let schema = Joi.object({
        id: Joi.string().required()
    }).unknown(true)
    try {
        let data = await schema.validateAsync(req.body);
        let temp = await Semester.findById(data.id)
        let result = await Semester.findByIdAndUpdate(data.id,
            {
                $set: {
                    "name": data.semester_name ?? temp.name,
                    "code": data.code ?? temp.code
                }
            })
        temp = await Semester.findById(data.id)
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

const SemesterController = {
    getSemester,
    addSemester,
    deleteSemester,
    updateSemester,
    // bulkAddSemester
}
module.exports = SemesterController