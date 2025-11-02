import mongoose from mongoose

{
    user : {type : Object.schema.type.objectId , ref:"user" , required : true},
    roomNo : {type : number , required : true},
    fee : {type : number , required : true},
    active : {type : Boolean , required : true , default : false},}
    checkin : {type : Date, required : true , default : new Date().now()},
    checkout : {type : Date , required : true , default: new Date().now() + 1000 * 24 * 60 * 60},
    
    
},{timestamps: true}