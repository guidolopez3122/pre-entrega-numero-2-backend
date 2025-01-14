import { Router } from 'express';
import fs from 'fs';

const productsRouter = Router();

const getProducts = async () => {
  try {
    const products = await fs.promises.readFile('src/db/products.json', 'utf-8');
    return JSON.parse(products);
  } catch (error) {
    return [];
  }
};

productsRouter.get('/', async (req, res) => {
  const products = await getProducts();
  res.json({ products });
});

productsRouter.post('/', async (req, res) => {
  const newProduct = req.body;

  if (!newProduct.title || !newProduct.description || !newProduct.price) {
    return res.status(400).json({ status: 'Error', message: 'Producto incompleto' });
  }

  const products = await getProducts();
  newProduct.id = products.length + 1;

  products.push(newProduct);

  try {
    await fs.promises.writeFile('src/db/products.json', JSON.stringify(products, null, 2));
    res.status(201).json({ status: 'Ok', message: 'Producto añadido', product: newProduct });
  } catch (error) {
    res.status(500).json({ status: 'Error', message: 'No se pudo agregar el producto' });
  }
});

export default productsRouter;
