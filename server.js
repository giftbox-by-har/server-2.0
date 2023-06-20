const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const customPackageRoutes = require("./routes/customPackageRoutes");
const boxTypeRoutes = require("./routes/boxTypeRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use('/public', express.static(path.join(__dirname, 'public')));

// Mengatur koneksi ke database MongoDB
mongoose.connect(process.env.MONGODB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (error) => {
	console.error("Database connection error:", error);
});
db.once("open", () => {
	console.log("Connected to database");
});

// Menggunakan userRoutes sebagai handler untuk rute pengguna
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use('/box-types', boxTypeRoutes);
app.use('/custom-packages', customPackageRoutes);
app.use("/auth", authRoutes);
app.use("/orders", orderRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
