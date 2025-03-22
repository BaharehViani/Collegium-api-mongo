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

async function loginUser(req, res) {
  try {
    const { username, password } = req.body;

    // چک کردن ورودی‌ها
    if (!username || !password) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    // پیدا کردن یوزر با یوزرنیم
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // مقایسه پسورد وارد شده با پسورد هش شده
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // در صورت موفقیت
    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error("Error logging in user:", error);
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
    const { id } = req.params; 
    const user = await User.findByPk(id); 

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
    const { id } = req.params; 
    const { full_name, username, password, photo, birth_date, phone_number } = req.body; 

    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (password) {
      user.password = await bcrypt.hash(password, 10); 
    }
    if (full_name) {
      user.full_name = full_name;
    }
    if (username) {
      user.username = username;
    }
    if (birth_date !== undefined) {
      user.birth_date = birth_date;
    }
    if (phone_number !== undefined) {
      user.phone_number = phone_number;
    }
    if (photo) {
      user.photo = photo;
    }
    
    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params; 
    const user = await User.findByPk(id); 
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
  deleteUser,
  loginUser,
};
