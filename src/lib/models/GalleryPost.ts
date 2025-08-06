import mongoose from 'mongoose';

const galleryPostSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  user_email: {
    type: String,
    required: true,
  },
  image_url: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    default: '',
  },
  hashtags: [{
    type: String,
  }],
  likes: {
    type: Number,
    default: 0,
  },
  liked_by: [{
    type: String, // user_ids who liked the post
  }],
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
galleryPostSchema.index({ created_at: -1 });
galleryPostSchema.index({ user_id: 1 });
galleryPostSchema.index({ hashtags: 1 });

const GalleryPost = mongoose.models.GalleryPost || mongoose.model('GalleryPost', galleryPostSchema);

export default GalleryPost;
