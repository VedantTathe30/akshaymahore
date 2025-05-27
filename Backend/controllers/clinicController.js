const { validationResult } = require('express-validator');
const Clinic = require('../models/clinic.model');
const MessageModel = require('../models/message.model');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
module.exports = {

    login: async (req,res)=>{
      console.log("hi");
      console.log(req.body);
  
      const user = await Clinic.findOne({ email: req.body.email });

  
      if(!user)
      {
          return res.status(400).json({
              message: "username or password not found"
          })
      }
      
      // console.log("Entered password:", req.body.password);
      // console.log("Stored hash:", user.password);
  
  
      const match = user.password === req.body.password ? true : false;
  
      if(!match)
      {
          return res.status(400).json({
              message: "username or password not found"
          })
      }
  
      const token = jwt.sign({
          userId: user._id,
          username: user.username,
          email: user.email,
      }, process.env.JWT_SECRET_KEY);
  
      res.cookie('token',token);
      console.log(token);
      return res.status(200).json({
          user:user,
          token:token
      });
  },

  logout: async (req, res) => {
  // Clear the cookie named 'token'
  res.clearCookie('token');
  return res.status(200).json({ message: 'Logged out successfully' });
},


  getClinicStatus: async (req, res) => {
    const result = await Clinic.findOne({ clinic_status: { $exists: true } });
    res.status(200).json(result);
  },

  searchData: async (req, res) => {
    const q = req.query.q || '';
    const regex = new RegExp(q, 'i');
    const results = await Clinic.find({
      $or: [
        { Name: { $regex: regex } },
        { MobileNo: { $regex: regex } },
        { RegNo: { $regex: regex } },
      ]
    }, 'Name MobileNo RegNo');
    res.status(200).json(results);
  },

  changeStatus: async (req, res) => {
    const { status } = req.body;
    await Clinic.updateOne(
      { clinic_status: { $exists: true } },
      {
        $set: {
          clinic_status: status || 'NOTSET',
          date_updated: new Date().toISOString().split('T')[0]
        }
      }
    );
    res.json({ message: 'Clinic Status Changed Successfully..!' });
  },

  updateNotice: async (req, res) => {
    const { notice } = req.body;
    await Clinic.updateOne({ clinic_status: { $exists: true } }, { $set: { notice } });
    res.json({ message: 'Notice Updated Successfully..!' });
  },

  addPatient: async (req, res) => {
    const { Name, MobileNo, RegNo } = req.body;
    console.log(req.body);
    console.log(Name, MobileNo, RegNo);
    await User.create({
      Name: Name,
      MobileNo: MobileNo,
      RegNo: RegNo
    });
    res.status(201).json({ message: 'Patient Added Successfully..!' });
  },

  delPatient: async (req, res) => {
    const regno = req.params.regno;
    const result = await User.deleteMany({ RegNo: regno });
    if (result.deletedCount > 0) {
      res.json({ message: 'Patient Deleted Successfully..!' });
    } else {
      res.status(404).json({ err: 'No patient found with the given RegNo.' });
    }
  },

  getAllData: async (req, res) => {
    const data = await User.find({});
    res.json(data);
  },

  changeHeroHeading: async (req, res) => {
    const { heading } = req.body;
    await Clinic.updateOne({ hero_heading: { $exists: true } }, { $set: { hero_heading: heading } });
    res.json({ message: 'Hero Heading Changed Successfully..!' });
  },

  changeClinicTimings: async (req, res) => {
    const { timing } = req.body;
    await Clinic.updateOne({ clinic_timings: { $exists: true } }, { $set: { clinic_timings: timing } });
    res.json({ message: 'Clinic Timings Changed Successfully..!' });
  },

  changeAboutData: async (req, res) => {
    const { about } = req.body;
    await Clinic.updateOne({ about_data: { $exists: true } }, { $set: { about_data: about } });
    res.json({ message: 'About Data Changed Successfully..!' });
  },

  changeContactData: async (req, res) => {
    const { mobileno, email } = req.body;
    await Clinic.updateOne({ mobileno: { $exists: true } }, { $set: { mobileno } });
    await Clinic.updateOne({ email: { $exists: true } }, { $set: { email } });
    res.json({ message: 'Contact Data Changed Successfully..!' });
  },

  changeEduData: async (req, res) => {
    const { name, year, desc, degree } = req.body;
    await Clinic.updateOne({ clinic_status: { $exists: true } }, {
      $set: {
        edu_data_name: name,
        edu_data_year: year,
        edu_data_desc: desc,
        edu_data_degree: degree
      }
    });
    res.json({ message: 'Education Data Changed Successfully..!' });
  },

  
  sendMessage: async (req, res) => {
    console.log(MessageModel);
    try {
      const { Name, Email, Message } = req.body;

      console.log('Request body:', req.body);
      console.log('Name:', Name, 'Email:', Email, 'Message:', Message);

      const newMessage = await MessageModel.create({
        Name,
        Email,
        Message,
      });

      return res.status(201).json({ message: 'Message Sent Successfully..!' });
    } catch (error) {
      console.error('Error saving message:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  readMessages: async (req, res) => {
    const data = await MessageModel.find({});
    res.json(data);
  },

  delMsg: async (req, res) => {
    const { message } = req.body;
    const result = await MessageModel.deleteMany({ message });
    if (result.deletedCount > 0) {
      res.json({ message: 'Message Deleted Successfully..!' });
    } else {
      res.json({ err: 'No Message found' });
    }
  }
};
