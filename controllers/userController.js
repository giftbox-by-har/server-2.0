const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

// Controller untuk mendapatkan semua pengguna
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
    console.log('Users retrieved successfully');
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
};

// Controller untuk mendapatkan pengguna berdasarkan ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json(user);
      console.log('User retrieved successfully');
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve user' });
  }
};

// Controller untuk membuat pengguna baru
const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Periksa apakah ada pengguna dengan email yang sama
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Buat pengguna baru dengan password yang di-hash
    const newUser = await User.create({
      name,
      email,
      password,
    });

    res.status(201).json(newUser);
    console.log('User created successfully');
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// Controller untuk mengupdate pengguna
const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json(updatedUser);
      console.log('User updated successfully');
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Controller untuk menghapus pengguna
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.sendStatus(204);
      console.log('User deleted successfully');
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
