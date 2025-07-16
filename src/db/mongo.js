import mongoose from 'mongoose';

export const connectMongo = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/ecommerce');
    console.log('Conectado a MongoDB');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
  }
};



