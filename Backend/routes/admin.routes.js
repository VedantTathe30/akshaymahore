const express = require('express');
const router = express.Router();
const controller = require('../controllers/clinicController');


//auth
router.post('/login', controller.login);
router.post('/logout', controller.logout);
//search
router.get('/search', controller.searchData);
//status
router.get('/clinic-status', controller.getClinicStatus);
router.post('/change-status', controller.changeStatus);
//notice
router.get('/get-notice', controller.getNotice);
router.get('/get-notice-original', controller.getNoticeOriginal);
router.post('/update-notice', controller.updateNotice);
router.post('/reset-notice', controller.resetNotice);
//users
router.post('/add-patient', controller.addPatient);
router.delete('/delete-patient/:regno', controller.delPatient);
router.get('/all-data', controller.getAllData);
//hero
router.post('/change-hero-heading', controller.changeHeroHeading);
router.post('/reset-hero-heading', controller.resetHeroHeading);
router.post('/change-clinic-timings', controller.changeClinicTimings);
//about
router.post('/change-about-data', controller.changeAboutData);
router.post('/reset-about-data', controller.resetAboutData);
//contact
router.post('/change-contact-data', controller.changeContactData);
router.post('/reset-contact-data', controller.resetContactData);
//edu
router.post('/change-edu-data', controller.changeEduData);
router.post('/reset-edu-data', controller.resetEduData);

//messages
router.post('/send-message', controller.sendMessage);
router.get('/read-messages', controller.readMessages);
router.delete('/delete-message', controller.delMsg);

module.exports = router;
