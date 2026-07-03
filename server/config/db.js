import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI is missing. Add it to server/.env before starting the API.');
  }

  const connection = await mongoose.connect(mongoUri);
  console.log(`MongoDB connected: ${connection.connection.host}`);
};

export default connectDB;
