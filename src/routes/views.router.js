import { Router } from 'express';
import fs from 'fs';

const viewsRouter = Router();

const getProducts = async () => {
  try {
    const productsData = await fs.promises.readFile('src/db/products.json', 'utf-8');
    return JSON.parse(productsData);
  } catch (error) {
    return [];
  }
};

viewsRouter.get('/', async (req, res) => {
  const products = await getProducts();
  res.render('home', { products });
});

viewsRouter.get('/realtimeproducts', async (req, res) => {
  const products = await getProducts();
  res.render('realTimeProducts', { products });
});

export default viewsRouter;