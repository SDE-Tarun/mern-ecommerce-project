
import Cart from "../models/Cart.js";
import Product from "../models/product.js";

export async function AddCart(req, res) {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        message: "userId and productId are required",
      });
    }

    const productExists = await Product.findById(productId);

    if (!productExists) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [],
      });
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === productId.toString()
    );

    if (item) {
      item.quantity += 1;
    } else {
      cart.items.push({
        productId,
        quantity: 1,
      });
    }

    await cart.save();

    return res.json({
      message: "Item added to cart",
      cart,
    });
  } catch (error) {
    console.error("AddCart error:", error);

    return res.status(500).json({
      message: "Failed to add item to cart",
    });
  }
}

export async function DeleteCart(req, res) {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        message: "userId and productId are required",
      });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId.toString()
    );

    await cart.save();

    return res.json({
      message: "Item removed from cart",
      cart,
    });
  } catch (error) {
    console.error("DeleteCart error:", error);

    return res.status(500).json({
      message: "Failed to remove item",
    });
  }
}

export async function UpdateCart(req, res) {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || !Number.isInteger(quantity)) {
      return res.status(400).json({
        message: "Valid userId, productId and quantity are required",
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be at least 1",
      });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === productId.toString()
    );

    if (!item) {
      return res.status(404).json({
        message: "Item not found in cart",
      });
    }

    item.quantity = quantity;

    await cart.save();

    return res.json({
      message: "Item updated successfully",
      cart,
    });
  } catch (error) {
    console.error("UpdateCart error:", error);

    return res.status(500).json({
      message: "Failed to update cart",
    });
  }
}

export async function getCart(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        message: "userId is required",
      });
    }

    const cart = await Cart.findOne({ userId }).populate(
      "items.productId"
    );

    if (!cart) {
      return res.json({
        userId,
        items: [],
      });
    }

    return res.json(cart);
  } catch (error) {
    console.error("getCart error:", error);

    return res.status(500).json({
      message: "Failed to fetch cart",
    });
  }
}

// Empty the user's cart after successful order placement.
export async function ClearCart(req, res) {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "userId is required",
      });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.json({
        message: "Cart is already empty",
        items: [],
      });
    }

    cart.items = [];
    await cart.save();

    return res.json({
      message: "Cart cleared successfully",
      items: [],
    });
  } catch (error) {
    console.error("ClearCart error:", error);

    return res.status(500).json({
      message: "Failed to clear cart",
    });
  }
}
