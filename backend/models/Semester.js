const mongoose = require("mongoose");

const SemesterSchema = new mongoose.Schema({
    name:{
        type : String,
        required : true,
    },
    code:{
        type : String,
        required : true,
        unique : true,
    },

})


const Semester = mongoose.model('Semester', SemesterSchema);

module.exports = Semester;