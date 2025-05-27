const express = require('express');
const router = express.Router();
const controller = require('../controllers/clinicController');

router.post('/login', controller.login);
router.post('/logout', controller.logout);
router.get('/clinic-status', controller.getClinicStatus);
router.get('/search', controller.searchData);
router.post('/change-status', controller.changeStatus);
router.post('/update-notice', controller.updateNotice);
router.post('/add-patient', controller.addPatient);
router.delete('/delete-patient/:regno', controller.delPatient);
router.get('/all-data', controller.getAllData);
router.post('/change-hero-heading', controller.changeHeroHeading);
router.post('/change-clinic-timings', controller.changeClinicTimings);
router.post('/change-about-data', controller.changeAboutData);
router.post('/change-contact-data', controller.changeContactData);
router.post('/change-edu-data', controller.changeEduData);
router.post('/send-message', controller.sendMessage);
router.get('/read-messages', controller.readMessages);
router.delete('/delete-message', controller.delMsg);

module.exports = router;
