const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

// --- 1. MODELO MONGOOSE ---
const CartSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  items: [
    {
      productId: String,
      productName: String,
      price: Number,
      quantity: Number,
    },
  ],
});
const Cart = mongoose.model("Cart", CartSchema);

// --- 2. HELPERS ---
const calculateCart = (cartDoc) => {
  if (!cartDoc) return { userId: "", items: [], total: 0 };

  let total = 0;
  const items = cartDoc.items.map((item) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;
    return { ...item.toObject(), subtotal };
  });
  return { userId: cartDoc.userId, items, total };
};

// --- 3. IMPLEMENTACIÓN gRPC ---
const GetCart = async (call, callback) => {
  try {
    const { userId } = call.request;
    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items: [] });
    callback(null, calculateCart(cart));
  } catch (e) {
    callback(e);
  }
};

const AddItem = async (call, callback) => {
  try {
    const { userId, productId, productName, price, quantity } = call.request;
    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items: [] });

    const index = cart.items.findIndex((p) => p.productId === productId);
    if (index > -1) {
      cart.items[index].quantity += quantity; // Sumar si ya existe
    } else {
      cart.items.push({ productId, productName, price, quantity });
    }

    await cart.save();
    callback(null, calculateCart(cart));
  } catch (e) {
    callback(e);
  }
};

const RemoveItem = async (call, callback) => {
  try {
    const { userId, productId } = call.request;
    let cart = await Cart.findOne({ userId });
    if (cart) {
      cart.items = cart.items.filter((p) => p.productId !== productId);
      await cart.save();
    }
    callback(null, calculateCart(cart));
  } catch (e) {
    callback(e);
  }
};

const ClearCart = async (call, callback) => {
  try {
    const { userId } = call.request;
    await Cart.deleteOne({ userId });
    callback(null, {});
  } catch (e) {
    callback(e);
  }
};

// --- 4. INICIAR SERVIDOR ---
const PROTO_PATH = path.join(__dirname, "proto/cart.proto"); // Ojo a la ruta, se montará con Docker
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const cartProto = grpc.loadPackageDefinition(packageDefinition).cart;

const server = new grpc.Server();
server.addService(cartProto.CartService.service, {
  GetCart,
  AddItem,
  RemoveItem,
  ClearCart,
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("🔥 Cart Service DB Connected");
    server.bindAsync(
      "0.0.0.0:50052",
      grpc.ServerCredentials.createInsecure(),
      () => {
        console.log("🚀 Cart gRPC Server running on port 50052");
        server.start();
      }
    );
  })
  .catch((err) => console.error(err));
