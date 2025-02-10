// controllers/cvController.js
const CV = require('../models/CV');
const cloudinary = require('../config/cloudinary');

// Helper: Retrieve the existing CV document or create one if none exists.
const getCVDocument = async () => {
  let cv = await CV.findOne();
  if (!cv) {
    cv = new CV();
    await cv.save();
  }
  return cv;
};

// @desc    Get complete CV data
// @route   GET /api/cv
// @access  Public
const getCV = async (req, res) => {
  try {
    const cv = await getCVDocument();
    res.json(cv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Update personal information (including image upload)
// @route   PUT /api/cv/personal
// @access  Public (or protected as needed)
const updatePersonal = async (req, res) => {
  try {
    const cv = await getCVDocument();

    // If an image file is included, upload it to Cloudinary.
    if (req.file) {
      // Helper function to upload from memory buffer
      const streamUpload = (fileBuffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream((error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          });
          stream.end(fileBuffer);
        });
      };

      const result = await streamUpload(req.file.buffer);
      // Set the image URL in the request body so that it is saved along with other fields.
      req.body.image = result.secure_url;
    }

    // Merge the incoming fields (including image URL if uploaded) with the current personal data.
    cv.personal = { ...cv.personal.toObject(), ...req.body };
    await cv.save();
    res.json(cv.personal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// The remaining controllers remain unchanged...

// @desc    Add a new skill
// @route   POST /api/cv/skill
// @access  Public
const addSkill = async (req, res) => {
  try {
    const { name, level } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Skill name is required' });
    }
    const cv = await getCVDocument();
    const newSkill = { name, level };
    cv.skills.push(newSkill);
    await cv.save();
    res.json(cv.skills[cv.skills.length - 1]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Delete a skill by ID
// @route   DELETE /api/cv/skill/:id
// @access  Public
const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const cv = await getCVDocument();
    cv.skills = cv.skills.filter(skill => skill._id.toString() !== id);
    await cv.save();
    res.json({ message: 'Skill deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Add a new work experience entry
// @route   POST /api/cv/experience
// @access  Public
const addExperience = async (req, res) => {
  try {
    const { company, position, startDate, endDate, description } = req.body;
    if (!company || !position) {
      return res.status(400).json({ error: 'Company and position are required' });
    }
    const cv = await getCVDocument();
    const newExperience = { company, position, startDate, endDate, description };
    cv.experience.push(newExperience);
    await cv.save();
    res.json(cv.experience[cv.experience.length - 1]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Delete a work experience entry by ID
// @route   DELETE /api/cv/experience/:id
// @access  Public
const deleteExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const cv = await getCVDocument();
    cv.experience = cv.experience.filter(exp => exp._id.toString() !== id);
    await cv.save();
    res.json({ message: 'Experience entry deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Add a new education entry
// @route   POST /api/cv/education
// @access  Public
const addEducation = async (req, res) => {
  try {
    const { school, degree, fieldOfStudy, startDate, endDate, description } = req.body;
    if (!school || !degree) {
      return res.status(400).json({ error: 'School and degree are required' });
    }
    const cv = await getCVDocument();
    const newEducation = { school, degree, fieldOfStudy, startDate, endDate, description };
    cv.education.push(newEducation);
    await cv.save();
    res.json(cv.education[cv.education.length - 1]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Delete an education entry by ID
// @route   DELETE /api/cv/education/:id
// @access  Public
const deleteEducation = async (req, res) => {
  try {
    const { id } = req.params;
    const cv = await getCVDocument();
    cv.education = cv.education.filter(edu => edu._id.toString() !== id);
    await cv.save();
    res.json({ message: 'Education entry deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Update hobbies
// @route   PUT /api/cv/hobbies
// @access  Public (or protected as needed)
const updateHobbies = async (req, res) => {
  try {
    const { hobbies } = req.body; // expecting { hobbies: [ ... ] }
    const cv = await getCVDocument();
    cv.hobbies = hobbies; // replace the hobbies array with the new data
    await cv.save();
    res.json(cv.hobbies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Add a new project entry
// @route   POST /api/cv/project
// @access  Public
const addProject = async (req, res) => {
  try {
    const { title, description, details } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Project title is required' });
    }
    const cv = await getCVDocument();
    const newProject = { title, description, details };
    cv.projects.push(newProject);
    await cv.save();
    res.json(cv.projects[cv.projects.length - 1]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Delete a project entry by ID
// @route   DELETE /api/cv/project/:id
// @access  Public
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const cv = await getCVDocument();
    cv.projects = cv.projects.filter(project => project._id.toString() !== id);
    await cv.save();
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Delete the entire CV document (all data)
// @route   DELETE /api/cv
// @access  Public
const deleteAllCV = async (req, res) => {
  try {
    const cv = await CV.findOneAndDelete();
    if (!cv) {
      return res.status(404).json({ error: 'CV not found' });
    }
    res.json({ message: 'All CV data deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getCV,
  updatePersonal,
  addSkill,
  deleteSkill,
  addExperience,
  deleteExperience,
  addEducation,
  deleteEducation,
  updateHobbies,
  addProject,
  deleteProject,
  deleteAllCV,
};
