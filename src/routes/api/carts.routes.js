import { Router } from 'express';
import {
  createCart,
  getCartProducts,
  addProductToCart
} from '../../controllers/cartController.js';

const router = Router();

router.post('/', createCart);
router.get('/:cid', getCartProducts);
router.post('/:cid/product/:pid', addProductToCart);

export default router;


