const JsonWebToken = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const User = require("../models/User");
const library = require('../helper/library')
exports.admin_role = function (req, res, next) {
  if (req.user) {
    if (req.user.role == 'admin') {
      next();
    }else{
      return res.status(401).json({ status: false, msg: 'You do not have sufficient permission !' });
    }
  }else{
    return res.status(401).json({ status: false, msg: 'Unauthorized user!!' });
  }
};
exports.teacher_role = function (req, res, next) {
  if (req.user) {
    if (req.user.role == 'teacher' || req.user.role == 'admin') {
      next();
    }else{
      return res.status(401).json({ status: false, msg: 'You do not have sufficient permission !' });
    }
  }else{
    return res.status(401).json({ status: false, msg: 'Unauthorized user!!' });
  }
};
exports.auth_required = function (req, res, next) {
  if (req.user) {
    next();
  }else{
    return res.status(401).json({ status: false, msg: 'Unauthorized user!!' });
  }
};
exports.auth_verify = (req, res, next) => {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    if (req.headers.authorization.split(' ')[1]) {
      JsonWebToken.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', async function (err, decode) {
        if (err) {
          req.user = undefined;
          next();
        }
        else {
          try{
            let data = await User.findById(ObjectId(decode._id)).populate('student_details').populate('teacher_details')
            // console.log("Hello called" , data);
            var temp;
            if(data.role == 'admin'){
              temp = {...data._doc,admin_details : library.admin_details}
            }else{
              temp = data._doc
            }

            var keys = Object.keys(temp)
            var d_key
            for(i of keys){if(i.indexOf("details") !== -1){d_key = i}}
            var result = {...temp,details:temp[d_key]}
            delete result[d_key];
            req.user = result
          }catch(err){
            req.user = undefined
            console.log("auth_verify", err);
          }
          await next();
        }
      });
    } else {
      req.user = undefined;
      next();
    }
  } else {
    req.user = undefined;
    next();
  }
}