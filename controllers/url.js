const shortid=require("shortid");

const url=require("../models/url");

async function handleGenerateShortUrl(req,res){
    console.log("url shortening start");
    const body=req.body;

    if(body.url==null){
        return res.status(400).json({err: "url is required"});
    } 
    
    const shortId=shortid();

    await url.create({
        shortId:shortId,
        redirectUrl: body.url,
        visitHistory:[],
        createdBy:req.user._id,
    });

    return res.redirect("/",{
        shortId: shortId
    })

}

async function handleAnalytics(req,res){

    const shortId=req.params.shortId;

    const entry=await url.findOne({shortId});

    return res.json({
        total_clicks:entry.visitHistory.length,
        analytics:entry.visitHistory,
    });

}

module.exports={handleGenerateShortUrl, handleAnalytics };