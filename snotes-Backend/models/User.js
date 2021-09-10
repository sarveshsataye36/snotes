// import mongoose from 'mongoose';
const mongoose= require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    userName:{
        type: String,
        require:true
    },
    userEmail:{
        type:String,
        require:true,
        unique:true
    },
    userPassword:{
        type:String,
        require:true
    },
    date:{
        type:Date,
        default:Date.now
    },
  });
const User = mongoose.model('User', UserSchema);
//User.createIndexes();
module.exports = User