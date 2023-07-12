const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");

const PeriodSchema = new mongoose.Schema({
    period_code:{
        type : String,
        required : true,
    },
    start_time:{
        type : String,
        required : true,
    },
    end_time:{
        type : String,
        required : true,
    },

})


const Period = mongoose.model('Period', PeriodSchema);

module.exports = Period;