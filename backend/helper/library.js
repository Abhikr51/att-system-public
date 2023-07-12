const Period = require("../models/Period");
const User = require("../models/User");
const multer = require('multer')
const cron = require('node-cron')
const shell = require('shell')
const generateUniqueUsername = (proposedName) => {
    return User
        .findOne({ username: proposedName })
        .then(function (account) {
            if (account) {
                console.log('username exists: ' + proposedName);
                proposedName = proposedName.slice(0, 4)
                proposedName += Math.floor(Math.random() * 1000 + 1);
                return generateUniqueUsername(proposedName); // <== return statement here
            }
            console.log('proposed name is unique' + proposedName);
            return proposedName;
        })
        .catch(function (err) {
            console.error(err);
            throw err;
        });
}
const sendBasicError = (err, res) => {
    console.log(err);
    if (err.isJoi) {
        res.status(422).send({
            status: false,
            msg: err.message,
            // error: err.details
        })
    } else {
        res.send({
            status: false,
            msg: "Internal Server error",
            error: err
        })
    }
}
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split(".")[1])
    }
});
const file_uploader = (field_name,file_types = ["jpg", "png", "jpeg", "svg"]) => {

    let temp = multer({ //multer settings
        storage: storage,
        fileFilter: function (req, file, callback) {
            var ext = file.originalname.split(".")[1];
            if (file_types.indexOf(ext) == -1) {
                return callback(`Only ${file_types.join(" ,")} file are allowed` , false)
            }
            callback(null, true)
        },
        limits: {
            fileSize: 1024 * 1024
        },
    }).single(field_name)
    return temp
}
const admin_details = {
    first_name : "Admin",
    middle_name : "",
    last_name : "User",
    image : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlfj-tenfStG46J9XCL_xwAbol_ruIJOgy1tFMeWEPwQ&usqp=CAU&ec=48600112",
    gender : "Male",
    phone : "0000000000",
    dob : "00-00-0000"
}
const periodCrons = async()=>{
    const periods = await Period.find().lean()
    // let meredian,hour,min,temp;
    periods.map((item,index)=>{
        let [temp , meredian] = item.start_time.split(" ");
        meredian = meredian.toUpperCase()
        let [hour , min] = temp.split(":");
        if(meredian == "PM" && hour !== "12"){
            hour = parseInt(hour) + 12
        }else if(meredian == "AM" && hour == '12'){
            hour = "00"
        }
        // console.log(hour , min ,meredian);
        // cronJanmData(hour,min,()=>{console.log(hour ,min,item)});
    })
    // cronJanmData("21","14",()=>{console.log(new Date().toLocaleString());})
}
const cronJanmData = (hour,min,callback) =>{
    cron.schedule(`00 ${min} ${hour} * * Mon,Tue,Wed,Thu,Fri,Sat`, callback);
}

// cronJanmData(14,38)
module.exports = {
    generateUniqueUsername,
    sendBasicError,
    file_uploader,
    admin_details,
    periodCrons,
    cronJanmData
}

