const userModel = require('../model/userSchema')
const emailValidator = require("email-validator")
const bcrypt = require("bcrypt");

const signup = async(req , res , next ) =>{
      
    const { name , email , password , confirmpassword } = req.body ;
    console.log(name , email , password , confirmpassword ) ;
   
    if( !name || !email || !password || !confirmpassword){
        return res.status(400).json({
            success: false ,
            message:'Every field is required'
        })
    }
    const validEmail = emailValidator.validate(email) ;

    if(!validEmail){
        return res.status(400).json({
            success: false ,
            message:'Please Enter Valid Email id' 
        })
    }

    if(password !== confirmpassword){
        return res.status(400).json({
            success: false ,
            message:"Password and ConfirmPassword doesn't match" 
    })
}

    try {  const userInfo = userModel(req.body) ;
    const result = await userInfo.save() ;


    return res.status(200).json({
        success : true ,
        data : result 
    })

}  catch(err){
        
    if(err.code === 11000){
         return res.status(400).json({
            success: false ,
            message: `Account Already exists with same Email_Id`
        })
    }
    return res.status(400).json({
        success : false ,
        message: err.message
    })
}
}








const signin = async(req ,res) =>{
     const{ email , password} = req.body ;
       
     if( !email || !password ){
        return res.status(400).json({
            success : false ,
            message: 'Every field is mandatory'
        })
     }
     try{
         const user = await userModel
        .findOne({
            email
         }).select('+password') ;
    
         if( !user || !(await bcrypt.compare(password , user.password))){
            return res.status(400).json({
                success : false ,
                message: 'Invalid Credentials'
            })
         }
    
    const token = user.jwtToken() ;
    user.password = undefined ;
    
    const cookieOption = {
         maxAge: 24*60*60*1000 ,
         httpOnly: true ,
    } ;
    
    res.cookie("token", token , cookieOption) ;
    res.status(200).json({
        success: true ,
        data:user
    })
}
catch(err){
         
        res.status(400).json({
            success:false ,
            message:err.message
        })

        
     }

    }



    const getuser = async(req ,res, next) =>{
        const userId = req.user.id ;
    
    try{
        
        const user = await userModel.findById(userId);
        return res.status(200).json({
            success: true ,
            data: user
        })
    }catch(err){
        return res.status(400).json({
            success:false ,
            message:err.message 
         })
    }

    }



   const logout = (req ,res) => {

    try{

        const cookieOption = {
            expire: new Date() ,
            httpOnly:true
        } ;
        res.cookie("token" , null , cookieOption) ;
        res.status(200).json({
            success:true ,
            message:"Logged Out" 
        })

    }catch(err){
        res.status(400).json({
            success:false ,
            message:err.message
        })

    }
   }


module.exports = {
    signup ,
    signin ,
    getuser ,
    logout
    
}