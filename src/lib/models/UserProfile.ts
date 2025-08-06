import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  first_name: {
    type: String,
    default: ''
  },
  last_name: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  bust: {
    type: String,
    default: ''
  },
  waist: {
    type: String,
    default: ''
  },
  hips: {
    type: String,
    default: ''
  },
  shoulder_width: {
    type: String,
    default: ''
  },
  height: {
    type: String,
    default: ''
  },
  dress_length_preference: {
    type: String,
    default: ''
  },
  preferred_colors: {
    type: [String],
    default: []
  },
  preferred_fabrics: {
    type: [String],
    default: []
  },
  style_preferences: {
    type: [String],
    default: []
  },
  size_preference: {
    type: String,
    default: ''
  },
  budget_range: {
    type: String,
    default: ''
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const UserProfile = mongoose.models.UserProfile || mongoose.model('UserProfile', userProfileSchema);

export default UserProfile;
