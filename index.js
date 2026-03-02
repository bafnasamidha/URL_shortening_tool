const express=require("express");
const path=require("path");
const cookieParser=require("cookie-parser");
const urlRoute= require("./routes/url");
const staticRoute=require("./routes/staticRouter");
const userRoute=require("./routes/user");
const {connectToMongoDB}= require("./connection");
const {restrictToLoggedinUserOnly,restrictTo}=require("./middleware/auth");
const url=require("./models/url");

const app=express();

const PORT=8001;

connectToMongoDB("mongodb://127.0.0.1:27017/shortUrl")
.then(()=>{
    console.log("mongoDB connected")
})
.catch((err)=>{
    console.log(err)
});

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(restrictToLoggedinUserOnly);

app.use("/",staticRoute);
app.use("/user",userRoute);
app.use("/url",restrictTo(["NORMAL"]),urlRoute);


app.get("/:shortId",async (req,res)=>{
 
 const shortId=req.params.shortId;
 const entry=await url.findOneAndUpdate({
    shortId
 },
    {$push: {
        visitHistory:{
            timestamp: Date.now(),
        },
    }
});
    return res.redirect(entry.redirectUrl);
});

app.listen(PORT,()=>{
    console.log(`server started at PORT: ${PORT}`);
})