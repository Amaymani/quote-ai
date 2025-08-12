import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env'
  );
}

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var mongoose: MongooseCache;
}

let cached: MongooseCache = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) {
    console.log('=> Using existing cached Mongoose connection.');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable Mongoose's buffering to get immediate errors
    };

    console.log('=> Creating a new Mongoose connection...');
    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
      console.log('=> Mongoose connection successful.');
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    // If the connection fails, reset the promise cache so a new attempt can be made
    cached.promise = null;
    console.error('Failed to connect to MongoDB with Mongoose', e);
    throw e;
  }
}

export default dbConnect;