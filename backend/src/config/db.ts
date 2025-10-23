import mongoose from 'mongoose';
import { config } from './environment';
import logger from './logger';

const connectDB = async () => {
  try {
    await mongoose.connect(config.database.mongoUri, config.database.options);
    logger.info('✅ MongoDB Connected successfully');
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️  MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      logger.info('🔄 MongoDB reconnected');
    });
    
  } catch (err: any) {
    logger.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

export default connectDB;
