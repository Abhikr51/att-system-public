const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    // name: {
    //     type: String,
    //     trim: true,
    //     required: true
    // },
    email: {
        type: String,
        unique: true,
        required: true
    },
    teacher_details: {
        type : mongoose.Schema.Types.ObjectId,
        ref  : "Teacher",
    },
    student_details: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Student'
    },
    // user_details: {
        // title: String,
        // first_name: String,
        // middle_name: String,
        // last_name: String,
        // dob: String,
        // gender: String,
        // designation: String,
        // phone: String,
        // image: String,
    // },
    password: {
        type: String
    },
    role: {
        type: String,
        default: "teacher"
    },
    created: {
        type: Date,
        default: Date.now
    },
    
})

// UserSchema.virtual('namemmm').get( ()=> "HHH");
UserSchema.methods.toJSON = function () {
    var obj = this.toObject()
    delete obj.password
    delete obj.__v
    // delete obj.role
    return obj
}


const User = mongoose.model('User', UserSchema);

module.exports = User;