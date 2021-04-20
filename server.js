const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(cookieParser());
app.use(fileUpload())

const DB_URL = process.env.DB_URI;
mongoose.connect(DB_URL,{
     useNewUrlParser:true,
     useUnifiedTopology:true,
     useCreateIndex:true,
     useFindAndModify:false
},()=>{
    console.log("Connected to MongoDB");
})

app.use('/user',require('./routes/authRouter'));
app.use('/image',require('./routes/upload'));
app.use('/image',require('./routes/imageRouter'));

app.get('/',(req,res)=>{
    res.send('Hello World');
})

app.listen(5000,()=>{
    console.log("Server listening to port 5000");
})