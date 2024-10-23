
const express = require("express")
const app = express();
const jwt = require("jsonwebtoken")

const {auth,SCRT_KEY} = require('./auth')
const{userModel,todoModel} = require('./db')
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const {z} = require ("zod")

mongoose.connect("mongodb+srv://manishk78625:mkpd9548@cluster0.yjiof.mongodb.net/todo-app-manish");
app.use(express.json())


app.post('/signup', async function(req,res){
try{
    const validatedata = z.object({
        username : z.string().min(5).max(25),
        password : z.string().min(8).max(16),
        name : z.string().min(1).max(25)
    })
    const parseddata = validatedata.safeParse(req.body);
    if(parseddata.success){
       return
    }else{
        res.json({
            message : "input data is incorrrect",
            error : parseddata.error
        }) 
    }
}catch(err){
    res.json({
        message : "inputs are wrong"
    })
}
   const{username,password,name} = req.body;

    const hashedPassword = await bcrypt.hash(password,10);
    try{
    await userModel.create({
        username : username,
        password : hashedPassword,
        name : name
    })
    res.json({
        message : "you are sigend up"
    })
}catch(err){
    res.status(403).send({
        message : "error in signed up"
    })
}
})

app.post('/signin', async function(req,res){

    const{username,password} = req.body;

    const response = await userModel.findOne({
        username
        })
        try{
        const comparedpassword = await bcrypt.compare(password,response.password)
        
    if(comparedpassword){
        const token = jwt.sign({
            id: response._id.toString()
        },SCRT_KEY);

        res.json({
            token
        })
    }
}catch(err){
    res.json({
        message : "error in signed in"
    })
}
})

app.post('/todo',auth,async function(req,res){

    const userid = req.userid;
    const title = req.body.title;
    const done = req.body.done;
    try{
    await todoModel.create({
        userid,
        title,
        done
    })
    res.json({
        message : "todo created "
    })
}catch(err){
    throw new Error ("Invalid token")
}
})

app.get('/todos',auth,function(req,res){

    const userid = req.userid
    try{
    const todos = todoModel.findOne({
        userid
    })
    res.json({
        todos
    })
}catch(err){
    throw new Error("todo not found ")
}
})

app.listen(3000);
