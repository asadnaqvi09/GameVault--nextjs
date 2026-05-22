import mongoose from 'mongoose';

const TokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true,
        index: true
    },
    token: {
        type: String,
        required: true
    },
    type: {
      type: String,
      enum: ['refresh'],
      default: 'refresh',
      required: true
    },
    expiresAt: {
      type: Date,
      required: true
    },
    isRevoked: {
      type: Boolean,
      default: false
    }
});

TokenSchema.index({token: 1});
TokenSchema.index({expiresAt: 1}, {expireAfterSeconds: 0});
export default mongoose.model('Token', TokenSchema);