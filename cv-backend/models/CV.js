const mongoose = require('mongoose');

const CVSchema = new mongoose.Schema({
  personal: {
    fullName: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    bio: { type: String, default: '' },
    image: { type: String, default: '' },
    title: { type: String, default: '' },
    summary: { type: String, default: '' }
  },
  education: [
    {
      school: { type: String, default: '' },
      degree: { type: String, default: '' },
      fieldOfStudy: { type: String, default: '' },
      startDate: { type: String, default: '' },
      endDate: { type: String, default: '' },
      description: { type: String, default: '' }
    }
  ],
  experience: [
    {
      company: { type: String, default: '' },
      position: { type: String, default: '' },
      startDate: { type: String, default: '' },
      endDate: { type: String, default: '' },
      description: { type: String, default: '' }
    }
  ],
  skills: [
    {
      name: { type: String, default: '' },
      level: { type: String, default: '' }
    }
  ],
  languages: [
    {
      name: { type: String, default: '' },
      level: { type: String, default: '' }
    }
  ],
  certifications: [String],
  projects: [
    {
      title: { type: String, default: '' },
      description: { type: String, default: '' },
      details: [String]
    }
  ],
  hobbies: [String] // New field for hobbies
});

module.exports = mongoose.model('CV', CVSchema);
