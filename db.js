
const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const user = new Schema({
    username : {type : String , unique : true},
    password : {type : String , unique : true},
    name : String
})

const todo = new Schema({
    userid : ObjectId,
    title : String,
    done : Boolean
})

const userModel = mongoose.model("user",user);
const todoModel = mongoose.model("todos",todo);

module.exports = {
    userModel,
    todoModel
}
