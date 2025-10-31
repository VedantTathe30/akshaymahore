const mongoose = require('mongoose');

// Schema for clinic images
const clinicImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Schema for patient before/after images
const patientImageSchema = new mongoose.Schema({
  mobileNo: {
    type: String,
    required: true,
    // Will be used to link with patient records
    index: true
  },
  patientName: {
    type: String,
    required: true
  },
  condition: {
    type: String,
    required: true
  },
  beforeImages: [{
    url: {
      type: String,
      required: true
    },
    caption: String,
    date: {
      type: Date,
      required: true
    }
  }],
  afterImages: [{
    url: {
      type: String,
      required: true
    },
    caption: String,
    date: {
      type: Date,
      required: true
    }
  }],
  testimonial: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  showOnWebsite: {
    type: Boolean,
    default: false
  }
});

// Create models
const ClinicImage = mongoose.model('ClinicImage', clinicImageSchema);
const PatientImage = mongoose.model('PatientImage', patientImageSchema);

module.exports = {
  ClinicImage,
  PatientImage
};