import mongoose from 'mongoose';
import { logger } from './logger.config';

const dbLogger = logger('database');

const handleDatabaseConnection = () => {
  dbLogger.log('info', 'Database connected successfully');
};

const handleDatabaseConnectionError = (error: any) => {
  dbLogger.log('error', error);
};

mongoose.connect('mongodb://localhost:27017/revolt_rp')
  .then(handleDatabaseConnection)
  .catch(handleDatabaseConnectionError);


