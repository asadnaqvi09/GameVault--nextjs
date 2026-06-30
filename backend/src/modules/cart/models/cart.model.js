import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  gameId: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
    default: 1
  },
  platform: { type: String, default: null, trim: true },
  edition: { type: String, default: null, trim: true }
}, { _id: true });

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  items: [cartItemSchema]
}, { timestamps: true });

const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);
export default Cart;
