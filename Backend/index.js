const express = require('express');
const db = require('./config/db');
const connectToDB = require('./config/db');
const adminRoutes = require('./routes/admin.routes');
const cors = require('cors');
const app = express();

connectToDB();

app.use(cors());

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/',adminRoutes);

// app.listen(3000,(req,res)=>{
//     console.log("Server is Running");
// })


module.exports = app;