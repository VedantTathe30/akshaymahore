const { validationResult } = require('express-validator');
const Clinic = require('../models/clinic.model');
const Backup = require('../models/backup.model');
const MessageModel = require('../models/message.model');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
module.exports = {

  
  welcome: async (req, res) => {
    console.log("hi");
    res.send("welcome");
  },

  //auth
  login: async (req, res) => {
    console.log("hi");
    console.log(req.body);

    const user = await Clinic.findOne({ email: req.body.email });


    if (!user) {
      return res.status(400).json({
        message: "username or password not found"
      })
    }

    // console.log("Entered password:", req.body.password);
    // console.log("Stored hash:", user.password);


    const match = user.password === req.body.password ? true : false;

    if (!match) {
      return res.status(400).json({
        message: "username or password not found"
      })
    }

    const token = jwt.sign({
      userId: user._id,
      username: user.username,
      email: user.email,
    }, process.env.JWT_SECRET_KEY);

    res.cookie('token', token);
    console.log(token);
    return res.status(200).json({
      user: user,
      token: token
    });
  },

  logout: async (req, res) => {
    // Clear the cookie named 'token'
    res.clearCookie('token');
    return res.status(200).json({ message: 'Logged out successfully' });
  },

  
  //search
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

  //clinic
  getClinicStatus: async (req, res) => {
    const result = await Clinic.findOne({ clinic_status: { $exists: true } });
    res.status(200).json(result);
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

  //notice
  getNotice: async (req, res) => {
    const data = await Clinic.findOne(
      { clinic_status: { $exists: true } }, {});
    res.status(200).json(data);
  },

  getNoticeOriginal: async (req, res) => {
    try {
      const data = await Backup.findOne(); // Fetch any backup document
      if (!data || !data.notice) {
        return res.status(404).json({ message: 'Backup notice not found' });
      }

      res.status(200).json({ notice: data.notice });
    } catch (err) {
      console.error('Error fetching backup notice:', err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  updateNotice: async (req, res) => {
    const { notice } = req.body;
    await Clinic.updateOne({ clinic_status: { $exists: true } }, { $set: { notice } });
    res.json({ message: 'Notice Updated Successfully..!' });
  },

  resetNotice: async (req, res) => {
    try {
      const backup = await Backup.findOne({ clinic_status: { $exists: true } }, {}); // get backup notice
      if (!backup.notice) return res.status(404).json({ message: 'Backup not found' });

      const clinic = await Clinic.findOne({ clinic_status: { $exists: true } }, {});
      if (!clinic.notice) return res.status(404).json({ message: 'Clinic not found' });

      clinic.notice = backup.notice;
      await clinic.save();

      res.json({ message: 'Notice reset successfully', notice: clinic.notice });
    } catch (error) {
      console.error('Reset failed:', error);
      res.status(500).json({ message: 'Reset failed' });
    }
  },

  //users
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

  //hero

  changeHeroHeading: async (req, res) => {
    const { heroHeading } = req.body;
    // console.log(heroHeading);
    await Clinic.updateOne({ hero_heading: { $exists: true } }, { $set: { hero_heading: heroHeading } });
    res.json({ message: 'Hero Heading Changed Successfully..!' });
  },

  resetHeroHeading: async (req, res) => {
  try {
    const backup = await Backup.findOne({ hero_heading: { $exists: true } });
    if (!backup || !backup.hero_heading)
      return res.status(404).json({ message: 'Backup not found' });

    const clinic = await Clinic.findOne({ hero_heading: { $exists: true } });
    if (!clinic)
      return res.status(404).json({ message: 'Clinic not found' });

    clinic.hero_heading = backup.hero_heading;
    await clinic.save();

    res.json({ message: 'Hero heading reset successfully', hero_heading: clinic.hero_heading });
  } catch (error) {
    console.error('Reset failed:', error);
    res.status(500).json({ message: 'Reset failed' });
  }
},


  

  //clinic timings

  changeClinicTimings: async (req, res) => {
    const { timing } = req.body;
    await Clinic.updateOne({ clinic_timings: { $exists: true } }, { $set: { clinic_timings: timing } });
    res.json({ message: 'Clinic Timings Changed Successfully..!' });
  },

  //about data
  changeAboutData: async (req, res) => {
    const { aboutData } = req.body;
    await Clinic.updateOne({ about_data: { $exists: true } }, { $set: { about_data: aboutData } });
    res.json({ message: 'About Data Changed Successfully..!' });
  },

  resetAboutData: async (req, res) => {
  try {
    const backup = await Backup.findOne({ about_data: { $exists: true } });
    if (!backup || !backup.about_data)
      return res.status(404).json({ message: 'Backup not found' });

    const clinic = await Clinic.findOne({ about_data: { $exists: true } });
    if (!clinic)
      return res.status(404).json({ message: 'Clinic not found' });

    clinic.about_data = backup.about_data;
    await clinic.save();

    res.json({ message: 'About_data data reset successfully', about_data: clinic.about_data });
  } catch (error) {
    console.error('Reset failed:', error);
    res.status(500).json({ message: 'Reset failed' });
  }
},


  //contact data

  changeContactData: async (req, res) => {
    const { contactEmail, contactMobile } = req.body;
    console.log(contactEmail,contactMobile);
    await Clinic.updateOne({ email: { $exists: true } }, { $set: { email : contactEmail } });
    await Clinic.updateOne({ mobileno: { $exists: true } }, { $set: { mobileno: contactMobile } });
    res.json({ message: 'Contact Data Changed Successfully..!' });
  },

  //edu data
  // controller function
  changeEduData: async (req, res) => {
  try {
    const { index, name, degree, desc, year } = req.body;

    const clinic = await Clinic.findOne({ clinic_status: { $exists: true } });
    if (!clinic) return res.status(404).json({ message: 'Clinic not found' });

    // Safely clone the arrays
    const names = [...clinic.edu_data_name];
    const degrees = [...clinic.edu_data_degree];
    const descs = [...clinic.edu_data_desc];
    const years = [...clinic.edu_data_year];

    // Update only the target index
    names[index] = name;
    degrees[index] = degree;
    descs[index] = desc;
    years[index] = year;

    // Save the updated arrays
    await Clinic.updateOne(
      { clinic_status: { $exists: true } },
      {
        $set: {
          edu_data_name: names,
          edu_data_degree: degrees,
          edu_data_desc: descs,
          edu_data_year: years,
        },
      }
    );

    res.json({ message: 'Education entry updated successfully.' });
  } catch (error) {
    console.error('Error updating education:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
},


resetEduData: async (req, res) => {
  try {
    const { index } = req.body;

    // Get current data
    const clinic = await Clinic.findOne({ clinic_status: { $exists: true } });
    const backup = await Backup.findOne({ clinic_status: { $exists: true } });

    if (!clinic || !backup) {
      return res.status(404).json({ message: 'Clinic or Backup not found' });
    }

    // Clone the arrays
    const names = [...clinic.edu_data_name];
    const degrees = [...clinic.edu_data_degree];
    const descs = [...clinic.edu_data_desc];
    const years = [...clinic.edu_data_year];

    const backupNames = backup.edu_data_name;
    const backupDegrees = backup.edu_data_degree;
    const backupDescs = backup.edu_data_desc;
    const backupYears = backup.edu_data_year;

    if (
      index < 0 ||
      index >= names.length ||
      index >= backupNames.length
    ) {
      return res.status(400).json({ message: 'Invalid index' });
    }

    // Reset the specific index
    names[index] = backupNames[index];
    degrees[index] = backupDegrees[index];
    descs[index] = backupDescs[index];
    years[index] = backupYears[index];

    // Update the Clinic model
    await Clinic.updateOne(
      { clinic_status: { $exists: true } },
      {
        $set: {
          edu_data_name: names,
          edu_data_degree: degrees,
          edu_data_desc: descs,
          edu_data_year: years,
        },
      }
    );

    res.json({ message: `Education entry at index ${index} reset successfully.` });
  } catch (error) {
    console.error('Error resetting education entry:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
},

  resetContactData: async (req, res) => {
  try {
    const backup = await Backup.findOne({ mobileno: { $exists: true } });
    if (!backup)
      return res.status(404).json({ message: 'Backup not found' });

    const clinic = await Clinic.findOne({ mobileno: { $exists: true } });
    if (!clinic)
      return res.status(404).json({ message: 'Clinic not found' });

    clinic.mobileno = backup.mobileno;
    clinic.email = backup.email;
    clinic.contact_location = backup.contact_location;

    await clinic.save();

    res.json({ message: 'Contact data reset successfully', contact: {
      number: clinic.mobileno,
      email: clinic.email,
      location: clinic.contact_location,
    }});
  } catch (error) {
    console.error('Reset failed:', error);
    res.status(500).json({ message: 'Reset failed' });
  }
},


  //messages
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
