import * as mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
    name : {type : String, required : true},
    firstName : {type : String, required : true},
    password : {type : String, required : true},
    balance : {type : Number, required : true},
    active : {type : Boolean, required : true},
    phone : {type : String, required : true},
    email : {type : String, requiredre : true},
    connected : {type : Boolean, required : true},
    admin : {type : Boolean, required : true},
    validationToken : {type : String, required : true},
    token : {type : String, required : true},
})

export class User {
    id : string;
    name : string;
    firstName : string;
    active : boolean;
    password : string;
    balance : number;
    phone : string;
    email : string;
    connected : boolean;
    admin : boolean;
    validationToken : string;
    token : string
   
}
