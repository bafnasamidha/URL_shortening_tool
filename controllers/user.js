const user = require("../models/user");
const { v4: uuidv4 } = require("uuid");
const { setUser } = require("../service/auth");
// const { useId } = require("react");

async function handleUserSignup(req,res){

    const {name,email,password}=req.body;

    await user.create({
        name,
        email,
        password,
    });

    return res.redirect("/");
}

async function handleUserLogin(req,res){
    const {email,password}=req.body;
    // console.log(user);
    const entry=await user.findOne({
        email,password
    });
    // console.log(user);
    if(!entry){
        res.redirect("/",{
            err:"Invalid username or password"
        })
    }

    //for session
    // const sessionId=uuidv4();

    // setUser(sessionId,entry);
    const token=setUser(entry);
    res.cookie("uid",token);
    // res.json({token});

    return res.redirect("/");

}

module.exports={handleUserSignup,handleUserLogin};