import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Game from '../src/modules/games/models/game.model.js';
import Genre from '../src/modules/genre/models/genre.model.js';
import { allowedGenre } from '../src/modules/genre/validators/genre.validator.js';
import { normalizeGameMode } from '../src/modules/games/services/game.service.js';
import { GENRE_ALIASES } from './seed/gameImageAssets.js';
import { enrichGameImages } from './seed/enrichGameImages.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GAME_JSON_PATH = path.resolve(
  __dirname,
  '../../frontend/src/data/game_details.json'
);

const connectDB = async () => {
  const { DB_USERNAME, DB_PASSWORD } = process.env;
  if (!DB_USERNAME || !DB_PASSWORD) {
    throw new Error('DB_USERNAME and DB_PASSWORD must be set in .env');
  }

  const uri = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.vfxqpnz.mongodb.net/`;
  await mongoose.connect(uri);
  console.log('MongoDB connected for seeding');
};

const seedGenres = async () => {
  for (const name of allowedGenre) {
    await Genre.findOneAndUpdate(
      { name },
      { name },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
  console.log(`Genres ready (${allowedGenre.length})`);
};

const resolveGenreId = async (genreName) => {
  const mappedName = GENRE_ALIASES[genreName] || genreName;
  const genre = await Genre.findOne({
    name: { $regex: new RegExp(`^${mappedName}$`, 'i') }
  }).select('_id name');

  if (!genre) {
    throw new Error(`Genre not found in DB: ${mappedName} (from ${genreName})`);
  }

  return genre._id;
};

const toGameDocument = async (rawGame, index) => {
  const { reviews: _reviews, genre: genreName, ...rest } = rawGame;

  const enriched = await enrichGameImages(rawGame, index);
  const genreId = await resolveGenreId(genreName);

  const jsonRecord = {
    ...rawGame,
    coverImage: enriched.coverImage || enriched.detailedDescription?.topGalleryImages?.[0] || null,
    detailedDescription: enriched.detailedDescription
  };

  const dbDocument = {
    ...rest,
    genre: genreId,
    gameMode: normalizeGameMode(enriched.gameMode),
    coverImage: jsonRecord.coverImage,
    detailedDescription: enriched.detailedDescription,
    specifications: {
      ...enriched.specifications,
      releaseDate: new Date(enriched.specifications.releaseDate)
    },
    isActive: true,
    isDeleted: false
  };

  return { dbDocument, jsonRecord };
};

const writeEnrichedJson = (records) => {
  fs.writeFileSync(GAME_JSON_PATH, `${JSON.stringify(records, null, 4)}\n`, 'utf-8');
  console.log(`Updated frontend JSON with real images: ${GAME_JSON_PATH}`);
};

const seedGames = async () => {
  if (!fs.existsSync(GAME_JSON_PATH)) {
    throw new Error(`game_details.json not found at ${GAME_JSON_PATH}`);
  }

  const rawGames = JSON.parse(fs.readFileSync(GAME_JSON_PATH, 'utf-8'));
  console.log(`Loaded ${rawGames.length} games from JSON`);
  console.log('Fetching real cover & gallery images...\n');

  const deleted = await Game.deleteMany({});
  console.log(`\nDeleted ${deleted.deletedCount} existing game(s)`);

  const documents = [];
  const jsonRecords = [];

  for (let i = 0; i < rawGames.length; i += 1) {
    console.log(`[${i + 1}/${rawGames.length}] ${rawGames[i].title}`);
    const { dbDocument, jsonRecord } = await toGameDocument(rawGames[i], i);
    documents.push(dbDocument);
    jsonRecords.push(jsonRecord);
  }

  const inserted = await Game.insertMany(documents);
  writeEnrichedJson(jsonRecords);
  console.log(`\nSeeded ${inserted.length} game(s) successfully`);
};

const run = async () => {
  try {
    await connectDB();
    await seedGenres();
    await seedGames();
    await mongoose.disconnect();
    console.log('Seed complete');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
};

run();
