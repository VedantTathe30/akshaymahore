const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    Name: {
        type: String,
        trim: true,
        uppercase: true
    },
    MobileNo: {
        type: String,
        trim: true
    },
    RegNo: {
        type: String,
        trim: true,
        uppercase: true
    },
});


const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
