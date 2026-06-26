import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Game from '../src/modules/games/models/game.model.js';
import Review from '../src/modules/reviews/models/review.model.js';
import User from '../src/modules/auth/models/user.model.js';
import { recalculateGameRating } from '../src/modules/reviews/services/review.service.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GAME_JSON_PATH = path.resolve(
  __dirname,
  '../../frontend/src/data/game_details.json'
);

const SEED_PASSWORD = 'SeedUser123!';
const SEED_RECOVERY_KEY = 'seed-recovery-key';

const connectDB = async () => {
  const { DB_USERNAME, DB_PASSWORD } = process.env;
  if (!DB_USERNAME || !DB_PASSWORD) {
    throw new Error('DB_USERNAME and DB_PASSWORD must be set in .env');
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected for review seeding');
};

const toSeedEmail = (userName) => {
  const slug = userName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.+|\.+$/g, '');
  return `seed.${slug}@gamevault.local`;
};

const normalizeRating = (userRating) => {
  const rounded = Math.round(Number(userRating));
  return Math.min(5, Math.max(1, rounded));
};

const collectReviewAuthors = (rawGames) => {
  const usernames = new Set();
  for (const game of rawGames) {
    for (const review of game.reviews ?? []) {
      if (review.username?.trim()) {
        usernames.add(review.username.trim());
      }
    }
  }
  return [...usernames];
};

const seedReviewUsers = async (usernames) => {
  const userMap = new Map();

  for (const userName of usernames) {
    const email = toSeedEmail(userName);
    let user = await User.findOne({ email }).select('_id userName');

    if (!user) {
      user = await User.create({
        userName,
        email,
        password: SEED_PASSWORD,
        recoveryKey: SEED_RECOVERY_KEY,
        role: 'User'
      });
      console.log(`  Created seed user: ${userName} (${email})`);
    } else {
      console.log(`  Reusing seed user: ${userName} (${email})`);
    }

    userMap.set(userName, user._id);
  }

  return userMap;
};

const seedReviews = async () => {
  if (!fs.existsSync(GAME_JSON_PATH)) {
    throw new Error(`game_details.json not found at ${GAME_JSON_PATH}`);
  }

  const gameCount = await Game.countDocuments();
  if (gameCount === 0) {
    throw new Error('No games in database. Run "npm run seed" first.');
  }

  const rawGames = JSON.parse(fs.readFileSync(GAME_JSON_PATH, 'utf-8'));
  const usernames = collectReviewAuthors(rawGames);

  console.log(`Loaded ${rawGames.length} games from JSON`);
  console.log(`Found ${usernames.length} unique review author(s)\n`);

  const deleted = await Review.deleteMany({});
  console.log(`Deleted ${deleted.deletedCount} existing review(s)\n`);

  console.log('Ensuring seed users exist...');
  const userMap = await seedReviewUsers(usernames);
  console.log('');

  const documents = [];
  const gamesToRecalc = new Map();

  for (const rawGame of rawGames) {
    const reviews = rawGame.reviews ?? [];
    if (!reviews.length) continue;

    const game = await Game.findOne({ id: rawGame.id }).select('_id id title').lean();
    if (!game) {
      console.warn(`Skipping reviews — game not in DB: ${rawGame.id}`);
      continue;
    }

    for (const rawReview of reviews) {
      const userId = userMap.get(rawReview.username?.trim());
      if (!userId) {
        console.warn(`Skipping review — unknown author: ${rawReview.username}`);
        continue;
      }

      documents.push({
        user: userId,
        game: game._id,
        rating: normalizeRating(rawReview.userRating),
        comment: rawReview.comment.trim(),
        isApproved: true,
        isDeleted: false,
        createdAt: new Date(rawReview.date),
        updatedAt: new Date(rawReview.date)
      });
    }

    gamesToRecalc.set(game._id.toString(), game.title);
  }

  if (!documents.length) {
    console.log('No review documents to insert.');
    return;
  }

  const inserted = await Review.insertMany(documents);
  console.log(`Inserted ${inserted.length} review(s)\n`);

  console.log('Recalculating game rating aggregates...');
  for (const [gameId, title] of gamesToRecalc) {
    const { rating, reviewCount } = await recalculateGameRating(
      new mongoose.Types.ObjectId(gameId)
    );
    console.log(`  ${title}: rating=${rating}, reviewCount=${reviewCount}`);
  }
};

const run = async () => {
  try {
    await connectDB();
    await seedReviews();
    await mongoose.disconnect();
    console.log('\nReview seed complete');
    process.exit(0);
  } catch (error) {
    console.error('Review seed failed:', error.message);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
};

run();
