const sgMail = require('@sendgrid/mail')
const { sendBasicError } = require("../helper/library");
const Routine = require('../models/Routine');
const Qrcode = require('../models/Qrcode');
const Joi = require('joi');
const Attendance = require('../models/Attendance');
const Subject = require('../models/Subject');
const Teacher = require('../models/Teacher');
const User = require('../models/User');
const Student = require('../models/Student');
const { default: mongoose } = require('mongoose');
const { ObjectId } = require('mongodb');

const send_mail = async (req, res) => {
    try {
        let result = []
        const item = { period_code: 'p1', start_time: "12:00 PM", end_time: "1:30 PM" }
        const day = new Date().toLocaleString('en-us', { weekday: 'short' })
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        const routine = await Routine.find({ day: 'Mon' }).lean()
        let email_HTML;
        for (var rou of routine) {

            for (var p_item of rou.periods) {
                if (p_item.period_code == item.period_code ) {
                    const qrText = Date.now().toString()
                    const qrcode = await Qrcode.findByIdAndUpdate(p_item.qr_code._id, { qr_code: qrText }, { new: true }).populate('paper')
                    console.log(qrcode);
                    if(qrcode.paper_code){
                        const att = new Attendance({
                            semester_code: qrcode.paper.semester_code,
                            stream_code : qrcode.paper.stream_code,
                            paper_code: qrcode.paper_code,
                            users: [],
                            day: qrcode.day,
                            period_code: qrcode.period_code,
                            // date : new Date()
                        })
                        let att_res = await att.save()
                        result.push(att_res)
                        const subject = await Subject.findOne({ paper_code: qrcode.paper_code }).populate('stream').lean()
                        const teacher = await Teacher.findOne({ short_name: 'RM' })
                        // console.log("Subject" , subject);
                        // console.log("Teacher" , teacher);
                        const link = "http://"+process.env.HOST +":" + process.env.FRONTEND_URL_PORT + process.env.FRONTEND_QR_SCAN_ENDPOINT + "/" + qrText + "$" + p_item.qr_code._id + "$" + att_res._id
    
                        email_HTML = `<!DOCTYPE html>
                        <html lang="en">
                        
                        <body >
                            <div style="padding: 40px;color: #444444;background: white;border-radius: 10px;">
                                <p>Hi ${teacher.name},</p>
                                <p>
                                    Your today’s <strong>${subject.name}</strong> class at ${item.start_time} hope you ready to take the class .
                                    Your class attendance QR code is generated and it is valid up to [ ${item.end_time} + 10mins ]
                                    please tell the students to scan this qr code to submit their attendance.
                                </p>
                                <h1 style="color : #F88600">Your class attendance link :</h1>
                                <a href="${link}">${link}</a>
                                <br>
                                <hr>
                                <br>
                                <h3>Course - ${subject.stream.name}</h3>
                                <h3>Subject - ${subject.name} (${qrcode.paper_code})</h3>
                                <h3>Batch - Semester ${subject.semester_code} </h3>
                                <h3>Time - ${item.start_time} - ${item.end_time} </h3>
                                <br/>
                                <hr>
                                <br/>
                                <p>If you are not able to take class please click the below link.</p>
                                <h3><a href="http://${process.env.HOST}:${process.env.FRONTEND_URL_PORT}"><font color="red">Leave today’s class !</font></a></h3>
                            </div>
                        </body>
                        
                        </html>`
                        const msg = {
                            to: ["abhijit.kumar.dev@gmail.com" , "kumarisback98@gmail.com","majumder.sukanta85@gmail.com"], // Change to your recipient
                            from: 'abhijitkumar@astergo.in', // Change to your verified sender
                            subject: `Attendance link for (${qrcode.paper_code})`,
                            text: `Attendace Link : ${link}`,
                            html: email_HTML,
                        }
                        sgMail
                            .send(msg)
                            .then(() => {
                                console.log("Email sent");
                            })
                            .catch((error) => {
                                console.log("Email error : ", error)
                            })
                    }else{
                        res.send("<h1>No Paper in this subject</h1>")
                    }
                }
            }
        }





        // res.send(`
        //     <h1 style="text-align:center;padding:10px;" >Mail Sent successfully</h1>
        // `)
        res.send(email_HTML)
    } catch (err) {
        sendBasicError(err, res)
    }
}
const make_attendance = async (client_data, socket) => {
    let schema = Joi.object({
        a_id: Joi.string().required(),
        user_id: Joi.string().required(),
        qr_text: Joi.string().required(),
        qr_id: Joi.string().required(),
    })
    try {
        let data = await schema.validateAsync(client_data);
        const qrcode = await Qrcode.findById(data.qr_id).lean()
        console.log(qrcode.qr_code, data.qr_text);
        if (qrcode.qr_code == data.qr_text) {
            var is_Exist = await Attendance.find({_id:ObjectId(data.a_id),users:data.user_id}).lean()
            console.log("is_Exist" , is_Exist);
            if(is_Exist.length == 0 ){
                console.log("Unique");
                let att = await Attendance.findByIdAndUpdate(data.a_id, { $addToSet: { users: data.user_id } }, { new: true })
                socket.emit('app:sendSuccess', "Your attendance recorded succefully!")
                const update_qr = await Qrcode.findByIdAndUpdate(data.qr_id, { qr_code: Date.now() }, { new: true })
                const user = await Student.findById(data.user_id).lean()
                const a_list = await Attendance.findById(data.a_id).populate('users').lean()
                socket.broadcast.emit('getQrText', { qr_text: update_qr.qr_code, a_list: a_list.users })
                socket.broadcast.emit('client:sendScannedSuccess', user)
            }else{
                console.log("Found");
                socket.emit('app:sendErr', { type: 'duplicate', msg: "You already Attended !!" })
            }
        } else {
            socket.emit('app:sendErr', { type: 'cheating', msg: "Invalid qr code , you make a cheating your merit point is decresed !" })
        }
    } catch (err) {
        console.log("Attendance Err", err)
        socket.emit('app:sendErr', { type: 'other', msg: "Somthing went wrong" })
    }
}
const getAttendance = async (req, res) => {
    try {
        let schema = Joi.object({
            date_from: Joi.string().required(),
            date_to: Joi.string().required(),
        })
        let data = await schema.validateAsync(req.body);
        let attendance = await Attendance.find({
            date: {
                $gte: new Date(data.date_from),
                $lte: new Date(data.date_to)
            }
        }).populate('paper').lean()
        res.send({
            status: true,
            data: attendance,
            msg: "Attendance List"
        })

    } catch (err) {
        sendBasicError(err, res)
    }
}
const getStudentWiseAtt = async (req, res) => {
    try {
        let schema = Joi.object({
            id: Joi.string().required(),
            date_from: Joi.string().required(),
            date_to: Joi.string().required(),
            semester_code: Joi.string().required(),
            stream_code: Joi.string().required(),
        })
        let data = await schema.validateAsync(req.body);
        let date_to = new Date(data.date_to);
        date_to.setDate(date_to.getDate() + 1)
        data = {
            ...data,
            date_from : new Date(data.date_from),
            date_to  :  date_to
        }
        let present = await Attendance.find({
            date: {
                $gte: data.date_from,
                $lte: data.date_to
            },
            users: data.id,
            semester_code: data.semester_code,
            stream_code: data.stream_code
        }, "paper_code date is_cancelled").populate('paper', 'name').lean()
        const present_ids = await Attendance.find({
            date: {
                $gte: data.date_from,
                $lte: data.date_to
            },
            users: data.id,
            semester_code: data.semester_code,
            stream_code: data.stream_code
        }, "_id")
        const absent = await Attendance.find({
            _id: { $nin: present_ids },
            date: {
                $gte: data.date_from,
                $lte: data.date_to
            },
            semester_code: data.semester_code,
            stream_code: data.stream_code
        }, "paper_code date is_cancelled").populate('paper').lean()
        // .aggregate([
        //     {$match :{ 
        //             date: {
        //                 $gte: data.date_from, 
        //                 $lte : data.date_to
        //             },
        //             users :mongoose.Types.ObjectId(data.id),
        //     }},
        //     // {$count:"paper_code"},
        //     // {$group:{_id : '$paper_code'}},
        // ])
        let attendance = {}
        for (var i of present) {
           
            if (attendance[i.paper_code] !== undefined) {
                attendance[i.paper_code].att.push({is_cancelled : i.is_cancelled, date: i.date, is_attend: true })
            } else {
                attendance[i.paper_code] = { ...i.paper, att: [{ is_cancelled : i.is_cancelled,date: i.date, is_attend: true }] }
            }
            attendance[i.paper_code]["present"] = 0;
            attendance[i.paper_code]["cancelled"] = 0;
            attendance[i.paper_code]["absent"] = 0;
            
        }
        for (var i of absent) {
            if (attendance[i.paper_code] !== undefined) {
                attendance[i.paper_code].att.push({is_cancelled : i.is_cancelled, date: i.date, is_attend: false })
            } else {
                attendance[i.paper_code] = { ...i.paper, att: [{ is_cancelled : i.is_cancelled,date: i.date, is_attend: false }] }
            }
            attendance[i.paper_code]["present"] = 0;
            attendance[i.paper_code]["cancelled"] = 0;
            attendance[i.paper_code]["absent"] = 0;
        }
        let temp_array = []
        for (var key  in attendance) {
            attendance[key].att = attendance[key].att.sort(
                (objA, objB) => Number(objA.date) - Number(objB.date),
            );
            temp_array = attendance[key].att
            attendance[key].att = {}
            for (var j  of temp_array){
                let [yyyy,mm,dd] = j.date.toISOString().split("T")[0].split("-")
                let n_key = `${yyyy}-${mm}`
                if (attendance[key].att[n_key] !== undefined) {
                    attendance[key].att[n_key].push({...j,date : dd})
                } else {
                    attendance[key].att[n_key] = [{...j,date : dd}]
                }
                if(j.is_cancelled){
                    attendance[key]["cancelled"] += 1
                }else if(j.is_attend){
                    attendance[key]["present"] += 1
                }else{
                    attendance[key]["absent"] +=  1
                }
            }
        }
        res.send({
            status: true,
            data: attendance,
            msg: "Attendance List"
        })

    } catch (err) {
        sendBasicError(err, res)
    }
}
const AttendanceController = {
    send_mail,
    make_attendance,
    getAttendance,
    getStudentWiseAtt
}

module.exports = AttendanceController