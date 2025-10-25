require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

//Importing routes
const productRoutes = require("./routes/productRoutes");

//Connect to database
connectDB();

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

//Routes
app.use("/api", productRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
