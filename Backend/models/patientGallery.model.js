const mongoose = require('mongoose');

const patientGallerySchema = mongoose.Schema({
    patientName: {
        type: String,
        required: true,
        trim: true
    },
    beforePhoto: {
        filename: {
            type: String,
            required: true
        },
        originalName: {
            type: String,
            required: true
        },
        path: {
            type: String,
            required: true
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    },
    afterPhoto: {
        filename: {
            type: String,
            required: true
        },
        originalName: {
            type: String,
            required: true
        },
        path: {
            type: String,
            required: true
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    },
    treatmentDate: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const patientGalleryModel = mongoose.model('PatientGallery', patientGallerySchema);

module.exports = patientGalleryModel;
