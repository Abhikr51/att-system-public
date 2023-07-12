const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema({
    name :{
        type : String,
        required :true,
    },
    paper_code :{
        type : String,
        required :true,
    },
    stream_code :{
        type : String,
        required :true,
    },
    semester_code :{
        type : String,
        required :true
    },
})

SubjectSchema.set('toJSON',{virtuals  :true})
SubjectSchema.set('toObject',{virtuals  :true})
SubjectSchema.virtual('stream',{
    'ref' : "Stream",
    localField : "stream_code",
    foreignField : "code",
    justOne : true,
})
const Subject = mongoose.model('Subject', SubjectSchema);

module.exports = Subject;