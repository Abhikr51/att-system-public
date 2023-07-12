const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema({
    title: String,
    first_name: String,
    middle_name: String,
    last_name: String,
    dob: String,
    gender: String,
    designation: String,
    phone: String,
    image: String,
    short_name : String
})
TeacherSchema.virtual('name')
   .get(function () {
   return  `${this.title} ${this.first_name} ${this.last_name}`; 
});
mongoose.set('toJSON', { getters: true });
mongoose.set('toObject', { getters: true });
const Teacher = mongoose.model('Teacher', TeacherSchema);

module.exports = Teacher;