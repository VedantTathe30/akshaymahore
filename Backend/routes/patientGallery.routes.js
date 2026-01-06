const express = require('express');
const router = express.Router();
const controller = require('../controllers/patientGalleryController');
const { protect } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/patient-gallery/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit per file
    },
    fileFilter: function (req, file, cb) {
        // Accept images only
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

// Public routes
router.get('/public', controller.getPublicPatientGallery);
router.get('/public/:id', controller.getPublicPatientGalleryItem);

// Protected admin routes
// router.use(protect); // All routes below this require authentication

router.post('/upload', upload.fields([
    { name: 'beforePhoto', maxCount: 1 },
    { name: 'afterPhoto', maxCount: 1 }
]), (req, res) => {
    console.log('=== ROUTE DEBUG ===');
    console.log('Upload route hit');
    console.log('Request method:', req.method);
    console.log('Request URL:', req.originalUrl);
    controller.uploadPatientGallery(req, res);
});

router.get('/', controller.getAllPatientGallery);
router.get('/:id', controller.getPatientGalleryById);
router.put('/:id', controller.updatePatientGallery);
router.delete('/:id', controller.deletePatientGallery);
router.patch('/:id/toggle-active', controller.toggleActiveStatus);

module.exports = router;
