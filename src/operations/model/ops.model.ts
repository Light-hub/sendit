import * as mongoose from "mongoose";

export const OpsSchema = new mongoose.Schema({
    amount : {type : Number, required : true},
    sender : {type : String, required : true},
    senderId : {type : String, required : true},
    receiver : {type : String, required : true},
    receiverId : {type : String, required : true},
    date : {type : Date, required : true},
})

export interface Operation{
    id : string,
    amount : number,
    sender : string,
    senderId : string,
    receiver : string,
    receiverId : string,
    date : Date
}