const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    Name: {
        type: String,
        trim: true,
        uppercase: true
    },
    Email: {
        type: String,
        trim: true
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