const mongoose=require("mongoose");

async function connectToMongoDB(link){
    await mongoose.connect(link);
}

module.exports={connectToMongoDB,};