import Cart from '../models/cart.js';

export const createCart = async (req, res) => {
  try {
    const cart = new Cart({ products: [] });
    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear carrito' });
  }
};

export const getCartProducts = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate('products.product');
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json(cart.products);
  } catch (error) {
    res.status(400).json({ error: 'Error al obtener carrito' });
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    const productInCart = cart.products.find(p => p.product.toString() === pid);
    if (productInCart) {
      productInCart.quantity++;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(400).json({ error: 'Error al agregar producto al carrito' });
  }
};
