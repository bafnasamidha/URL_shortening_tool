const {getUser}=require("../service/auth");

function restrictToLoggedinUserOnly(req,res,next){

    const sessionId=req.cookies?.uid;
    // const sessionId=req.headers["authorization"];


    if(!sessionId){
        next();
    }

    // const token=sessionId.split("Bearer ")[1];

    const user=getUser(sessionId);
    if(!user){
        next();
    }

    req.user=user;
    next();
}

function restrictTo(roles){

    return function(req,res,next){
        if(!req.user){
            return res.redirect("/login");
        }
        if(!roles.includes(req.user.role)){
            return res.end("Unauthorized access");
        }
        return next();
    }
}

module.exports={restrictToLoggedinUserOnly,restrictTo};