const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    Name: {
        type: String,
        trim: true,
        uppercase: true,
        required: true
    },
    Email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        sparse: true,
        required: true
    },
    MobileNo: {
        type: String,
        trim: true,
        required: true
    },
    RegNo: {
        type: String,
        trim: true,
        uppercase: true,
        required: true
    },
    // Verification flags and metadata for public registrations.
    // These are additive fields that are optional for admin-created users.
    isMobileVerified: {
        type: Boolean,
        default: false
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    // source indicates how the record was created: 'admin' | 'public' | 'qr'
    source: {
        type: String,
        trim: true,
        default: 'admin'
    },
    // timestamp when the public form was submitted (or when admin created record)
    submittedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });


// const userModel = mongoose.model('User', userSchema);

module.exports = mongoose.model('User', userSchema, 'users');

// module.exports = userModel;
