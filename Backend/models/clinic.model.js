const mongoose = require('mongoose');

const clinicSchema = mongoose.Schema({
    clinic_status: {
        type: String,
        trim: true,
        uppercase: true
    },
    date_updated: {
        type: String,
        trim: true,
        lowercase: true,
    },
    notice: {
        type: String,
        trim: true,
    },
    hero_heading: {
        type: String,
        trim: true,
    },
    clinic_timings: {
        type: String,
        trim: true,
    },
    about_data: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
    },
    mobileno: {
        type: String,
        trim: true,
    },
    edu_data_degree: {
        type: Array,
        trim: true,
    },
    edu_data_desc: {
        type: Array,
        trim: true,
    },
    edu_data_name: {
        type: Array,
        trim: true,
    },
    edu_data_year: {
        type: Array,
        trim: true,
    },
    password: {
        type: String,
        trim: true,
    }
});


const clinicModel = mongoose.model('Clinic', clinicSchema);

module.exports = clinicModel;