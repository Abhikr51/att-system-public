const mongoose = require("mongoose");
const getQrcodes = (id)=>{
    console.log(id);
    return id + "******"
}
const RoutineSchema = new mongoose.Schema({
    sl_no:{
        type : String,
        required : true,
    },
    day:{
        type : String,
        required : true,
    },
    stream_code:{
        type : String,
        required : true,
    },
    semester_code :{
        type : String,
        required :true,
    },
    periods : [
        {
            period_code : String,
            qr_code :{
                type : mongoose.Schema.Types.ObjectId,
                ref : "Qrcode",
                // get : getQrcodes
            }
        }
    ]

})
RoutineSchema.set('toJSON',{virtuals  :true,getters : true})
RoutineSchema.set('toObject',{virtuals  :true,getters : true})
RoutineSchema.virtual('stream',{
    'ref' : "Stream",
    localField : "stream_code",
    foreignField : "code",
    justOne : true,
})
// RoutineSchema.virtual('qr_code',{
//     'ref' : "Qrcode",
//     localField : "periods.qr_code",
//     foreignField : "_id",
//     justOne : true,
// })

const Routine = mongoose.model('Routine', RoutineSchema);

module.exports = Routine;