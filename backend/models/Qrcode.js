const mongoose = require("mongoose");
const QrcodeSchema = new mongoose.Schema({
    period_code : {
        type : String,
    },
    qr_code  :{
        type : String,
    },
    paper_code : {
        type :String
    },
    teacher_short_name : {
        type :String,
    },
    day :{
        type : String,
        required : true
    },
},{timestamps : true,})

QrcodeSchema.set('toJSON',{virtuals  :true})
QrcodeSchema.set('toObject',{virtuals  :true})
QrcodeSchema.virtual('teacher',{
    'ref' : "Teacher",
    localField : "teacher_short_name",
    foreignField : "short_name",
    justOne : true
})
QrcodeSchema.virtual('period',{
    'ref' : "Period",
    localField : "period_code",
    foreignField : "period_code",
    justOne : true
})
QrcodeSchema.virtual('paper',{
    'ref' : "Subject",
    localField : "paper_code",
    foreignField : "paper_code",
    justOne : true
})
const Qrcode = mongoose.model('Qrcode', QrcodeSchema);

module.exports = Qrcode;