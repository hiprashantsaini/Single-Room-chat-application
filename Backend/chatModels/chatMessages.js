const mongoose=require("mongoose");

const chatSchema=new mongoose.Schema({
    msg:{type:String,required:true},
    author:{type:mongoose.Schema.Types.ObjectId,ref:'User'}
},{timestamps:true});

const chat=mongoose.model('Chat',chatSchema);

module.exports=chat;