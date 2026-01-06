const patientGalleryModel = require('../models/patientGallery.model');
const userModel = require('../models/user.model');
const fs = require('fs');
const path = require('path');

// Upload patient gallery photos
const uploadPatientGallery = async (req, res) => {
    try {
        console.log('=== BACKEND UPLOAD DEBUG ===');
        console.log('Request received at:', new Date().toISOString());
        console.log('Request headers:', req.headers);
        console.log('Request body keys:', Object.keys(req.body));
        console.log('Request body:', req.body);
        console.log('Request files keys:', req.files ? Object.keys(req.files) : 'No files');
        console.log('Request files:', req.files);
        
        const { patientName } = req.body;

        console.log('Extracted patientName:', patientName);

        // Validate required fields
        if (!patientName) {
            console.log('VALIDATION FAILED: No patient name');
            return res.status(400).json({ 
                success: false, 
                message: 'Patient Name is required' 
            });
        }

        // Check if both photos are uploaded
        if (!req.files || !req.files.beforePhoto || !req.files.afterPhoto) {
            console.log('VALIDATION FAILED: Missing photos');
            console.log('req.files exists:', !!req.files);
            console.log('beforePhoto exists:', !!(req.files && req.files.beforePhoto));
            console.log('afterPhoto exists:', !!(req.files && req.files.afterPhoto));
            return res.status(400).json({ 
                success: false, 
                message: 'Both before and after photos are required' 
            });
        }

        console.log('VALIDATION PASSED');

        // Create patient gallery entry
        const galleryEntry = new patientGalleryModel({
            patientName,
            beforePhoto: {
                filename: req.files.beforePhoto[0].filename,
                originalName: req.files.beforePhoto[0].originalname,
                path: req.files.beforePhoto[0].path
            },
            afterPhoto: {
                filename: req.files.afterPhoto[0].filename,
                originalName: req.files.afterPhoto[0].originalname,
                path: req.files.afterPhoto[0].path
            },
            treatmentDate: new Date()
        });

        console.log('Gallery entry to save:', galleryEntry);

        await galleryEntry.save();

        console.log('Gallery saved successfully');

        res.status(201).json({
            success: true,
            message: 'Patient gallery uploaded successfully',
            data: galleryEntry
        });

    } catch (error) {
        console.error('=== BACKEND ERROR ===');
        console.error('Error uploading patient gallery:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get all patient gallery (admin)
const getAllPatientGallery = async (req, res) => {
    try {
        const gallery = await patientGalleryModel.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: gallery
        });

    } catch (error) {
        console.error('Error fetching patient gallery:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get public patient gallery (for frontend display)
const getPublicPatientGallery = async (req, res) => {
    try {
        console.log('=== GET PUBLIC GALLERY DEBUG ===');
        const gallery = await patientGalleryModel.find({ isActive: true })
            .select('patientName beforePhoto afterPhoto treatmentDate')
            .sort({ createdAt: -1 });

        console.log('Public gallery items found:', gallery.length);
        console.log('Gallery items:', gallery);

        res.status(200).json({
            success: true,
            data: gallery
        });

    } catch (error) {
        console.error('Error fetching public patient gallery:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get single patient gallery item by ID
const getPatientGalleryById = async (req, res) => {
    try {
        const gallery = await patientGalleryModel.findById(req.params.id);

        if (!gallery) {
            return res.status(404).json({
                success: false,
                message: 'Gallery item not found'
            });
        }

        res.status(200).json({
            success: true,
            data: gallery
        });

    } catch (error) {
        console.error('Error fetching gallery item:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get public single gallery item
const getPublicPatientGalleryItem = async (req, res) => {
    try {
        const gallery = await patientGalleryModel.findOne({ 
            _id: req.params.id, 
            isActive: true 
        }).select('patientName treatmentDescription beforePhoto afterPhoto treatmentDate');

        if (!gallery) {
            return res.status(404).json({
                success: false,
                message: 'Gallery item not found'
            });
        }

        res.status(200).json({
            success: true,
            data: gallery
        });

    } catch (error) {
        console.error('Error fetching public gallery item:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Update patient gallery
const updatePatientGallery = async (req, res) => {
    try {
        const { patientName } = req.body;
        
        const gallery = await patientGalleryModel.findByIdAndUpdate(
            req.params.id,
            { 
                patientName,
                updatedAt: new Date()
            },
            { new: true, runValidators: true }
        );

        if (!gallery) {
            return res.status(404).json({
                success: false,
                message: 'Gallery item not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Gallery updated successfully',
            data: gallery
        });

    } catch (error) {
        console.error('Error updating gallery:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Delete patient gallery
const deletePatientGallery = async (req, res) => {
    try {
        const gallery = await patientGalleryModel.findById(req.params.id);

        if (!gallery) {
            return res.status(404).json({
                success: false,
                message: 'Gallery item not found'
            });
        }

        // Delete files from filesystem
        try {
            if (fs.existsSync(gallery.beforePhoto.path)) {
                fs.unlinkSync(gallery.beforePhoto.path);
            }
            if (fs.existsSync(gallery.afterPhoto.path)) {
                fs.unlinkSync(gallery.afterPhoto.path);
            }
        } catch (fileError) {
            console.error('Error deleting files:', fileError);
        }

        await patientGalleryModel.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Gallery deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting gallery:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Toggle active status
const toggleActiveStatus = async (req, res) => {
    try {
        const gallery = await patientGalleryModel.findById(req.params.id);

        if (!gallery) {
            return res.status(404).json({
                success: false,
                message: 'Gallery item not found'
            });
        }

        gallery.isActive = !gallery.isActive;
        await gallery.save();

        res.status(200).json({
            success: true,
            message: `Gallery ${gallery.isActive ? 'activated' : 'deactivated'} successfully`,
            data: gallery
        });

    } catch (error) {
        console.error('Error toggling gallery status:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

module.exports = {
    uploadPatientGallery,
    getAllPatientGallery,
    getPublicPatientGallery,
    getPatientGalleryById,
    getPublicPatientGalleryItem,
    updatePatientGallery,
    deletePatientGallery,
    toggleActiveStatus
};
