const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String }, // Optional field for image
}, {
  timestamps: true // This will automatically add createdAt and updatedAt fields
});

const POST = mongoose.model('POST', PostSchema);

module.exports = { POST };
