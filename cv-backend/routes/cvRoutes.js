// routes/cvRoutes.js
const express = require('express');
const router = express.Router();
const cvController = require('../controllers/cvController');
const multer = require('multer');

// Use memory storage so that the file is available as a buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET complete CV data
router.get('/', cvController.getCV);

// Update personal information (with optional image upload)
// The key for the file should be "image" to match what the frontend sends.
router.put('/personal', upload.single('image'), cvController.updatePersonal);

// Add a new skill & delete a skill
router.post('/skill', cvController.addSkill);
router.delete('/skill/:id', cvController.deleteSkill);

// Add a new work experience entry & delete an experience entry
router.post('/experience', cvController.addExperience);
router.delete('/experience/:id', cvController.deleteExperience);

// Add a new education entry & delete an education entry
router.post('/education', cvController.addEducation);
router.delete('/education/:id', cvController.deleteEducation);

// Update hobbies
router.put('/hobbies', cvController.updateHobbies);

// Add a new project entry & delete a project entry
router.post('/project', cvController.addProject);
router.delete('/project/:id', cvController.deleteProject);

// Delete the entire CV document (all data)
router.delete('/', cvController.deleteAllCV);

module.exports = router;
