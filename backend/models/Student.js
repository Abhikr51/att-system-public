const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
    first_name: String,
    middle_name: String,
    last_name: String,
    dob: String,
    gender: String,
    phone: String,
    image: String,
    guardian_name  : String,
    category : String,
    address : String,
    father_name : String,
    total_sem_attendance : {
        type : Number,
        default : 0,
    },
    stream_code :{
        type : String,
        required :true,
    },
    semester_code :{
        type : String,
        required :true,
    },
})
StudentSchema.set('toJSON',{virtuals  :true ,getters : true})
StudentSchema.set('toObject',{virtuals  :true,getters : true})
StudentSchema.virtual('stream',{
    'ref' : "Stream",
    localField : "stream_code",
    foreignField : "code",

})
StudentSchema.virtual('name')
   .get(function () {
   return  `${this.first_name} ${this.last_name}`; 
});


const Student = mongoose.model('Student', StudentSchema);

module.exports = Student;