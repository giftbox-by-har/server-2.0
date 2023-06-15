const User = require("../models/userModel");
const Preference = require("../models/preferenceModel");
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

// Fungsi untuk melakukan collaborative filtering
const collaborativeFiltering = async (products) => {
  try {
    // Mendapatkan data pengguna dengan preferensi yang mirip
    const similarUsers = await User.find({ preference: { $in: products } });

    // Mendapatkan daftar produk yang disukai oleh pengguna dengan preferensi yang mirip
    const likedProducts = await Preference.find({ user: { $in: similarUsers } }).distinct("product");

    // Menghapus produk yang sudah ada di dalam daftar produk input
    const collaborativeFilteringRecommendations = likedProducts.filter(product => !products.includes(product));

    return collaborativeFilteringRecommendations;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Fungsi untuk melakukan content-based filtering
const contentBasedFiltering = async (products) => {
  try {
    // Mendapatkan preferensi produk pengguna
    const userPreferences = await Preference.find({ product: { $in: products } }).distinct("user");

    // Mengambil daftar produk yang telah diorder oleh pengguna
    const orderedProducts = await Order.find({ user: { $in: userPreferences } }).distinct("product");

    // Mengambil daftar produk yang ada di cart pengguna
    const cartProducts = await Cart.find({ user: { $in: userPreferences } }).distinct("product");

    // Menggabungkan produk yang disukai, diorder, dan di cart pengguna
    const userProducts = [...products, ...orderedProducts, ...cartProducts];

    // Mendapatkan daftar produk yang relevan berdasarkan produk yang disukai, diorder, dan di cart pengguna
    const relevantProducts = await Product.find({ _id: { $in: userProducts } });

    // Menghasilkan rekomendasi berdasarkan kesamaan atribut produk
    const contentBasedFilteringRecommendations = [...relevantProducts];

    return contentBasedFilteringRecommendations;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getRecommendations = async (products) => {
  // Collaborative Filtering
  const collaborativeFilteringRecommendations = await collaborativeFiltering(products);

  // Content-Based Filtering
  const contentBasedFilteringRecommendations = await contentBasedFiltering(products);

  // Gabungkan hasil peringkat dari kedua metode
  const recommendations = [...collaborativeFilteringRecommendations, ...contentBasedFilteringRecommendations];

  // Urutkan rekomendasi berdasarkan peringkat atau skor
  recommendations.sort((a, b) => b.score - a.score);

  // Ambil 5 produk teratas
  const topRecommendations = recommendations.slice(0, 5);

  return topRecommendations;
};

module.exports = { getRecommendations };
