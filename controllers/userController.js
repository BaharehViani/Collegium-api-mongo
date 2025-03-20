const { User } = require('../models/user');
const bcrypt = require('bcrypt');

async function registerUser(req, res) {
  try {
    const { full_name, username, password } = req.body;

    // چک کردن ورودی‌ها
    if (!full_name || !username || !password) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "This username already exists" });
    }

    // هش کردن پسورد
    const hashedPassword = await bcrypt.hash(password, 10);

    // ایجاد یوزر جدید
    const newUser = await User.create({
      full_name,
      username,
      password: hashedPassword
    });

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error" });
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await User.findAll();  // گرفتن همه یوزرها
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
}

async function getUser(req, res) {
  try {
    const { username } = req.params;  // گرفتن username از پارامترها
    const user = await User.findOne({ where: { username } });  // پیدا کردن یوزر با username

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
}

async function updateUser(req, res) {
  try {
    const { username } = req.params;  // گرفتن username از پارامترها
    const { full_name, password } = req.body;  // گرفتن داده‌های جدید از body

    // چک کردن که یوزر وجود دارد یا خیر
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // اگر پسورد داده شده بود، آن را هش کرده و بروزرسانی می‌کنیم
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    user.full_name = full_name || user.full_name;  // اگر full_name داده شد، آن را به‌روزرسانی می‌کنیم

    await user.save();  // ذخیره تغییرات در دیتابیس

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
}

async function deleteUser(req, res) {
  try {
    const { username } = req.params;  // گرفتن username از پارامترها

    const user = await User.findOne({ where: { username } });  // پیدا کردن یوزر با username

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();  // حذف یوزر از دیتابیس

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  registerUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser
};
