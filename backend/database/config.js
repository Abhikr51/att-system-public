const mongoose = require('mongoose')
const colors = require('colors')
const url = ""
// const database_name = 'linkzifyv2'
mongoose.set('strictQuery', false);
//via mongoose package
const __db_connect = async ()=>{
    let connectionString = process.env.MONGO_URI+ "/" + process.env.DB_NAME
    let altlas_url = ""
    if(altlas_url){
        connectionString = altlas_url
    }
    await mongoose.connect(connectionString)
    .then(() => console.log('============ Connected! MongoDB with Mongoose ============'.magenta ,));

}
// __db_connect()
module.exports = __db_connect