import express from "express";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import md5 from "md5";
import mongoose from "mongoose";
import dotenv from "dotenv";

const app = express();
const { Schema } = mongoose;
let PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ 
  extended: true 
}));

dotenv.config();


mongoose.connect('mongodb://127.0.0.1:27017/jwt');

// Define a user schema and model
const userSchema = new Schema({
  email: String,
  password: String
});

const User = mongoose.model('User', userSchema);

const revokedTokens = [];

function verifyToken(req, res, next) {
  const token = req.header('Authorization');

  if (!token || revokedTokens.includes(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, process.env.secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
}

app.post("/register", function(req, res){
  const email = req.body.email;

  async function exist(){
    const existingUser = await User.findOne({email: email});
    if(existingUser){
      return res.status(400).json("Email already exists");
    }
    else 
    {
      const newUser = new User({
        email: req.body.email,
        password: md5(req.body.password)
      })
      newUser.save();
      res.json("Successfully stored");
    }
  }
  exist();

})

app.post("/login", function(req, res){
  const email = req.body.email;
  const password = md5(req.body.password);

  async function fun(){
    const foundEmail = await User.findOne({email: email});
    if(foundEmail){
      if(foundEmail.password == password){
        const token =jwt.sign({ email }, process.env.secretKey, { expiresIn: '1h' });
        res.json({token});
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

app.post('/logout', (req, res) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Add the token to the revoked tokens list
  revokedTokens.push(token);
  res.json({ message: 'Logout successful' });
});

// Protected route
app.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});


app.listen(PORT, () => {
  console.log(`Server is up and running on ${PORT} ...`);
});