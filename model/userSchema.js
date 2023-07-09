const mongoose = require('mongoose') 
const JWT = require('jsonwebtoken')
const bcrypt = require("bcrypt")
const { Schema } = mongoose 

const userSchema = new Schema({
    name : { 
    type: String ,
    required: [true , 'Name must be required'] ,
    minLength: [5 , 'Name must be atleast of 5 char'],
    maxLength:[ 30 ,'Name must be less than 30 char'],
    trim: true 
} ,
    email : { 
    type: String ,
    required:[ true , 'Email must be required'],
    unique:[true , 'Already Exist '] ,
    lowercase: true 

} ,  
     password : { 
    type: String ,
    select:false
}  ,

     forgotPSWToken : { 
    type: String ,
}, 
     forgotPSWExpiryDate : {
        type : Date
        
     }
} , {timestamps : true}) ;


userSchema.pre('save' , async function(next){
    if(!this.isModified('password')){
        return next() ;
    }
    this.password = await bcrypt.hash(this.password,10);
    return next() ;
})

userSchema.methods = {
  jwtToken(){
    return JWT.sign (
        {id: this._id , email: this.email} ,
        process.env.SECRET ,
        { expiresIn :'24h'}
    
  )
    }
}

const userModel = mongoose.model('user' , userSchema) ;
module.exports = userModel ;
