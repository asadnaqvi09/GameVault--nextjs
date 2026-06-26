import mongoose from 'mongoose';

const featureSubSchema = new mongoose.Schema({
  id: { type: String, trim: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  image: { type: String, default: null }
}, { _id: false });

const gameSchema = new mongoose.Schema({
  id: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true,
    index: true 
  },
  title: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  oldPrice: { type: Number, min: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0, min: 0 },
  tags: [{ type: String, trim: true }],
  smallDescription: { type: String, required: true, trim: true },
  coverImage: { type: String, trim: true },
  genre: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Genre', 
    required: true,
    index: true 
  },
  gameMode: [{ type: String, trim: true }],
  ageRestrictionBadge: { type: String, trim: true },
  options: {
    platforms: [{ type: String, trim: true }],
    editions: [{ type: String, trim: true }]
  },
  specifications: {
    releaseDate: { type: Date, required: true },
    publisher: { type: String, required: true, trim: true },
    developer: { type: String, required: true, trim: true },
    languages: [{ type: String, trim: true }],
    audio: [{ type: String, trim: true }]
  },
  detailedDescription: {
    topGalleryImages: [{ type: String }],
    mainVideoUrl: { type: String, trim: true },
    features: [featureSubSchema]
  },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false }
}, {
  timestamps: true
});

gameSchema.index({ price: 1 });
gameSchema.index({ 'specifications.releaseDate': -1 });
gameSchema.index({ title: 'text', smallDescription: 'text' });

const Game = mongoose.models.Game || mongoose.model('Game', gameSchema);
export default Game;