const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    Name: {
        type: String,
        trim: true,
        uppercase: true
    },
    MobileNo: {
        type: String,
        trim: true
    },
    Email: {
        type: String,
        trim: true,
        lowercase: true,
        sparse: true
    },
    Message: {
        type: String,
        trim: true,
        uppercase: true
    },

    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});


const messageModel = mongoose.model('Message', messageSchema);



module.exports = messageModel;