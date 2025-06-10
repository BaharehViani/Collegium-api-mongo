const { User, Course, Form, Meal } = require('../models');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

function generateTrackingCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

async function registerUser(req, res) {
  try {
    const { full_name, username, major, password, role } = req.body;

    if (!full_name || !username || !password || !major) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "This username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      full_name,
      username,
      major,
      password: hashedPassword,
      role
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error" });
  }
}

async function loginUser(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Server error" });
  }
}

async function getAllStudents(req, res) {
  try {
    const { major, orderBy } = req.query;

    const filter = { role: 'Student' };
    if (major) {
      filter.major = major;
    }

    let sort = {};
    if (orderBy === "updatedAt") {
      sort.updatedAt = -1; 
    } else if (orderBy) {
      sort[orderBy] = 1;
    }
    
    const users = await User.find(filter).sort(sort);

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
}

async function getStudent(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

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
    const { full_name, username, major, password, photo, birth_date, phone_number } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    if (full_name) user.full_name = full_name;
    if (username) user.username = username;
    if (major) user.major = major;
    if (birth_date !== undefined) user.birth_date = birth_date;
    if (phone_number !== undefined) user.phone_number = phone_number;
    if (photo) user.photo = photo;

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
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.remove();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
}

async function getCourse(req, res) {
  try {
    const { course_name } = req.params;
    const course = await Course.findOne({ course_name });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({
      course_name: course.course_name,
      instructor_name: course.instructor_name,
      first_class: course.first_class,
      second_class: course.second_class,
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ message: "Server error" });
  }
}

async function getAllMajors(req, res) {
  try {
    // گرفتن لیست یکتا رشته‌ها
    const majors = await User.distinct('major');

    res.status(200).json({ majors });
  } catch (error) {
    console.error("Error fetching majors:", error);
    res.status(500).json({ message: "Server error" });
  }
}

async function submitForm(req, res) {
  try {
    const { title, type, content, user_id } = req.body;

    let code;
    let exists = true;
    do {
      code = generateTrackingCode();
      exists = await Form.findOne({ tracking_code: code });
    } while (exists);

    const status = "pending";

    const newForm = new Form({
      title,
      tracking_code: code,
      type,
      status,
      content,
      user_id
    });

    await newForm.save();

    res.status(201).json({ message: "Form submitted successfully", form: newForm });
  } catch (error) {
    console.error("❌ Error submitting form:", error);
    res.status(500).json({ message: "Server error", detail: error.message });
  }
}

async function getFormsForUser(req, res) {
  try {
    const user_id = req.params.user_id;
    if (!user_id) {
      return res.status(400).json({ message: 'user_id is required' });
    }

    const forms = await Form.find({ user_id }).sort({ createdAt: -1 });

    return res.json({ forms });
  } catch (err) {
    console.error('Error fetching forms:', err);
    return res.status(500).json({ message: 'server error' });
  }
}

async function updateForm(req, res) {
  try {
    const formId = req.params.id;
    const { title, type, content, user_id } = req.body;

    const form = await Form.findOne({
      _id: formId,
      user_id: user_id
    });

    if (!form) {
      return res.status(404).json({ message: 'Form not found or not owned by you.' });
    }

    form.title   = title;
    form.type    = type;
    form.content = content;
    await form.save();

    return res.json({ message: 'Form updated successfully.', form });

  } catch (err) {
    console.error('Error updating form:', err);
    return res.status(500).json({ message: 'server error' });
  }
}

async function deleteForm(req, res) {
  try {
    const formId = req.params.id;
    const { user_id } = req.body;
    if (!user_id) {
      return res.status(400).json({ message: 'user_id is required' });
    }
    const deleted = await Form.deleteOne({ _id: formId, user_id });
    if (deleted.deletedCount === 0) {
      return res.status(404).json({ message: 'form not found' });
    }
    return res.json({ message: 'form deleted successfully' });
  } catch (err) {
    console.error('Error deleting form:', err);
    return res.status(500).json({ message: 'server error' });
  }
}

async function getFormById(req, res) {
  const { id } = req.params;
  try {
    const form = await Form.findById(id);
    if (!form) {
      return res.status(404).json({ message: 'form not found' });
    }
    return res.json(form);
  } catch (err) {
    console.error('Error fetching form:', err);
    return res.status(500).json({ message: 'server error fetching form' });
  }
}

async function getPendingForms(req, res) {
  try {
    const forms = await Form.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .populate('user_id', 'full_name');

    const result = forms.map(form => ({
      _id: form._id,
      title: form.title,
      type: form.type,
      tracking_code: form.tracking_code,
      content: form.content,
      createdAt: form.createdAt,
      username: form.user_id.full_name || 'Unknown'
    }));

    res.json({ forms: result });
  } catch (err) {
    console.error('Error fetching forms:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

async function updateFormStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const form = await Form.findById(id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    form.status = status;
    await form.save();

    res.json({ message: 'Status updated successfully.' });
  } catch (err) {
    console.error('Error updating status:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function reserveMeal(req, res) {
  try {
    const { meal_name, meal_type, cafeteria_name, reservation_date, user_id } = req.body;
    const newReserve = new Meal({
      meal_name,
      meal_type,
      cafeteria_name,
      reservation_date: new Date(reservation_date),
      user_id
    });
    await newReserve.save();
    res.status(201).json(newReserve);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function cancelMeal(req, res) {
  try {
    const { id } = req.params; 
    const { user_id } = req.body;

    const result = await Meal.deleteOne({ _id: id, user_id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Reservation not found or not owned by user' });
    }

    res.json({ message: 'Reservation cancelled' });
  } catch (err) {
    console.error("CancelMeal Error:", err.message);
    res.status(500).json({ message: 'Server error' });
  }
}

async function getReservationsForDay(req, res) {
  const { user_id, reservation_date } = req.query;
  try {
    const reservations = await Meal.find({ user_id, reservation_date });
    res.json(reservations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function getReservationsReport(req, res) {
  try {
    const { date, meal_time, restaurant_id } = req.query;

    if (!date || !meal_time) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const matchStage = {
      reservation_date: {
        $gte: new Date(date),
        $lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000),
      },
      meal_type: { $regex: new RegExp(`^${meal_time}$`, "i") },
    };


    if (restaurant_id && restaurant_id !== "All") {
      matchStage.cafeteria_name = restaurant_id;
    }

    const report = await Meal.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$meal_name",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } }
    ]);

    const formatted = report.map(item => ({
      meal_name: item._id,
      count: item.count,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error in getReservationsReport:", err);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  registerUser,
  getAllStudents,
  getStudent,
  updateUser,
  deleteUser,
  loginUser,
  getCourse,
  getAllMajors,
  submitForm,
  getFormsForUser,
  updateForm,
  deleteForm,
  getFormById,
  getPendingForms,
  updateFormStatus,
  reserveMeal,
  cancelMeal,
  getReservationsForDay,
  getReservationsReport,
};
