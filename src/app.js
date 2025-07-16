import express from 'express';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { engine as expressHandlebars } from 'express-handlebars';

import viewsRouter from './routes/views.router.js';
import productsRoutes from './routes/api/products.routes.js';
import cartRoutes from './routes/api/carts.routes.js';

import { connectMongo } from './db/mongo.js';
import Product from './models/product.model.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', expressHandlebars({
  defaultLayout: 'main',
  layoutsDir: path.resolve('./src/views/layouts')
}));
app.set('view engine', 'handlebars');
app.set('views', path.resolve('./src/views'));  // <-- Aquí está la ruta correcta

app.use('/', viewsRouter);
app.use('/api/products', productsRoutes);
app.use('/api/carts', cartRoutes);

let products = [];

const loadProducts = async () => {
  products = await Product.find().lean();
};

connectMongo().then(() => {
  loadProducts();
});

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  socket.emit('updateProducts', products);

  socket.on('addProduct', async (productData) => {
    try {
      const product = new Product(productData);
      await product.save();
      products = await Product.find().lean();
      io.emit('updateProducts', products);
    } catch (error) {
      console.error('Error al agregar producto:', error);
    }
  });

  socket.on('deleteProduct', async (productId) => {
    try {
      await Product.findByIdAndDelete(productId);
      products = await Product.find().lean();
      io.emit('updateProducts', products);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

httpServer.listen(8080, () => {
  console.log('Servidor corriendo en el puerto 8080');
});




