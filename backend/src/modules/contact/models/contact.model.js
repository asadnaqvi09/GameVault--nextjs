import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 2000
  },
  status: {
    type: String,
    enum: ['pending', 'read', 'replied'],
    default: 'pending'
  }
}, { timestamps: true });

contactSchema.index({ status: 1, createdAt: -1 });

const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);
export default Contact;
