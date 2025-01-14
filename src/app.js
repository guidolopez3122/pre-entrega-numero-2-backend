import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { engine as expressHandlebars } from 'express-handlebars';
import viewsRouter from './routes/views.router.js';
import productsRoutes from './routes/api/products.routes.js';
import cartRoutes from './routes/api/carts.routes.js';
import fs from 'fs';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', expressHandlebars());
app.set('view engine', 'handlebars');

app.use('/', viewsRouter);

app.use('/api/products', productsRoutes);
app.use('/api/carts', cartRoutes);

let products = [];

const getProducts = async () => {
  try {
    const productsData = await fs.promises.readFile('src/db/products.json', 'utf-8');
    return JSON.parse(productsData);
  } catch (error) {
    return [];
  }
};

const saveProducts = async (products) => {
  try {
    const productsString = JSON.stringify(products, null, 2);
    await fs.promises.writeFile('src/db/products.json', productsString, 'utf-8');
  } catch (error) {
    console.error('Error al guardar productos', error);
  }
};

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  socket.emit('updateProducts', products);

  socket.on('addProduct', async (product) => {
    products.push(product);
    await saveProducts(products);
    io.emit('updateProducts', products);
  });

  socket.on('deleteProduct', async (productId) => {
    products = products.filter(product => product.id !== parseInt(productId));
    await saveProducts(products);
    io.emit('updateProducts', products);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

httpServer.listen(8080, () => {
  console.log('Servidor corriendo en el puerto 8080');
});


