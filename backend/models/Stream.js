const mongoose = require("mongoose");

const StreamSchema = new mongoose.Schema({
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


const Stream = mongoose.model('Stream', StreamSchema);

module.exports = Stream;