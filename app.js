import express from "express";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import md5 from "md5";
import mongoose from "mongoose";

const app = express();
const port = 3000;
const { Schema } = mongoose;

app.use(bodyParser.urlencoded({ 
  extended: true 
}));


mongoose.connect('mongodb://127.0.0.1:27017/jwt');

// Define a user schema and model
const userSchema = new Schema({
  email: String,
  password: String
});

const User = mongoose.model('User', userSchema);

app.post("/register", function(req, res){
  const newUser = new User({
    email: req.body.email,
    password: md5(req.body.password)
  })
  newUser.save();
  res.json("Successfully stored");
})

app.post("/login", function(req, res){
  const email = req.body.email;
  const password = md5(req.body.password);

  async function fun(){
    const foundEmail = await User.findOne({email: email});
    if(foundEmail){
      if(foundEmail.password == password){
        res.json("Successfully login");
      }
      else {
        res.json("Incorrect password");
      } 
    }
    else{
      res.json("Incorrect email");
    }
  }
  fun();

})

app.listen(port,()=>{
  console.log(`Server running at port ${port}`);
})