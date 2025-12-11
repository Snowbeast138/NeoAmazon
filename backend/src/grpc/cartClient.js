const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

// Docker montará la carpeta 'proto' en la raíz del contenedor backend
const PROTO_PATH = path.join(__dirname, "../../proto/cart.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const cartProto = grpc.loadPackageDefinition(packageDefinition).cart;

// 'cart-service' es el nombre del host en docker-compose
const client = new cartProto.CartService(
  "cart-service:50052",
  grpc.credentials.createInsecure()
);

module.exports = client;
