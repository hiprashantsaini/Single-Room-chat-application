const jwt=require('jsonwebtoken');
const auth=(req,res,next)=>{
    try {
        const token=req.cookies.token;
        if(!token){
           return res.status(401).send({success:false,message:"User is not authenticated"});
        }
        const payload=jwt.verify(token,'my_secret_key_this');
        req.userId=payload.userId;
        next();
    } catch (error) {
        console.log("isAuthenticated :",error.message);
        return res.status(401).send({success:false,message:"User is not authenticated"});
    }
}

module.exports=auth;