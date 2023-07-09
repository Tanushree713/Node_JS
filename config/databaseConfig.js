const mongoose = require('mongoose') ;
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/my_database" ;

const databaseConnect = () =>{
    mongoose.connect(MONGO_URL) 
    .then((conn) => console.log(`connected To Db ${conn.connection.host}`))
    .catch((err) => console.log(err.message)) ;
}

module.exports = databaseConnect ;