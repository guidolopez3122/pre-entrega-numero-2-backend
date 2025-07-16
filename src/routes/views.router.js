import { Router } from 'express';
import Product from '../models/product.model.js';

const viewsRouter = Router();

viewsRouter.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.render('home', { products });
  } catch (error) {
    res.status(500).send('Error cargando productos');
  }
});

viewsRouter.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await Product.find();
    res.render('realtimeproducts', { products });
  } catch (error) {
    res.status(500).send('Error cargando productos');
  }
});

export default viewsRouter;


