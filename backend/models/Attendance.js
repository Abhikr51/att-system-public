const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
    period_code: {
        type: String,
        required: true,
    },
    semester_code :{
        type : String,
        required : true
    },
    stream_code :{
        type : String,
        required : true
    },
    paper_code: {
        type: String,
        required: true,
    },
    day: {
        type: String,
    },
    date: {
        type: Date,
        default: new Date(),
        required : true
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        unique:true,
    }],
    is_cancelled: {
        type: mongoose.Schema.Types.Boolean,
        default: false
    },


})


const Attendance = mongoose.model('Attendance', AttendanceSchema);
AttendanceSchema.set('toJSON',{virtuals  :true})
AttendanceSchema.set('toObject',{virtuals  :true})
AttendanceSchema.virtual('paper',{
    'ref' : "Subject",
    localField : "paper_code",
    foreignField : "paper_code",
    justOne : true,
})
module.exports = Attendance;