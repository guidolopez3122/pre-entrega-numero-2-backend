import { Router } from 'express';
import fs from 'fs';

const cartsRouter = Router();

const getCarts = async () => {
  try {
    const carts = await fs.promises.readFile('src/db/carts.json', 'utf-8');
    return JSON.parse(carts);
  } catch (error) {
    return [];
  }
};

cartsRouter.get('/', async (req, res) => {
  const carts = await getCarts();
  res.json({ carts });
});

cartsRouter.post('/', async (req, res) => {
  const newCart = { id: Date.now(), products: [] };

  const carts = await getCarts();
  carts.push(newCart);

  try {
    await fs.promises.writeFile('src/db/carts.json', JSON.stringify(carts, null, 2));
    res.status(201).json({ status: 'Ok', message: 'Carrito creado', cart: newCart });
  } catch (error) {
    res.status(500).json({ status: 'Error', message: 'No se pudo crear el carrito' });
  }
});

export default cartsRouter;
