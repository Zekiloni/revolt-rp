import mongoose from 'mongoose';
import { logger } from './logger.config';

const dbLogger = logger('database');

const DEFAULT_DB_URL = 'mongodb://localhost:27017/rage-server';

const handleDatabaseConnection = () => {
  dbLogger.log('info', 'Database connected successfully');
};

const handleDatabaseConnectionError = (error: any) => {
  dbLogger.log('error', error);
};

mongoose.connect(process.env['DATABASE_URL'] || DEFAULT_DB_URL)
  .then(handleDatabaseConnection)
  .catch(handleDatabaseConnectionError);


