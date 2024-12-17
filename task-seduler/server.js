const express = require('express');
const app = express();
require('dotenv').config();
const ConncetDB = require('./config/db.js');
// const User = require("./models/User.js");
// const Post = require("./models/Post.js");
const PORT = process.env.PORT || 3000;
const cron = require('node-cron');
const bodyParser = require('body-parser');

require('./serivce/crone-sed.js'); 

ConncetDB();

app.use(bodyParser.json()); // To parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));
/// import routes
const authRoutes = require("./routes/authRoutes.js");
const postRoutes = require("./routes/postRoutes.js");
/// routes 

app.use(express.json());
app.use('/api/v1/auth',authRoutes)
app.use('/api/v1/posts',postRoutes);


app.get('/', (req,res)=>{
    res.send("Wlecome to the...")
})

app.listen(PORT , ()=>{
    console.log(`Express is Connected... ${PORT}`)
})