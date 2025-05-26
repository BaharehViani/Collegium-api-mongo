const { User, Course, Form } = require('../models');
const bcrypt = require('bcrypt');

function generateTrackingCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

async function registerUser(req, res) {
  try {
    const { full_name, username, major, password, role } = req.body;

    if (!full_name || !username || !password || !major) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "This username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      full_name,
      username,
      major,
      password: hashedPassword,
      role
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

    if (!username || !password) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const user = await User.findOne({ where: { username } });
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
  const { major, orderBy } = req.query;

  const whereClause = {
    role: 'student'
  };
  if (major) {
    whereClause.major = major;
  }
  
  const orderClause = [];
  if (orderBy) {
    orderClause.push([orderBy, "ASC"]);
  }

  try {
    const users = await User.findAll({ 
      where: whereClause, 
      order: orderClause, 
    });
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
}

async function getStudent(req, res) {
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
    const { full_name, username, major, password, photo, birth_date, phone_number } = req.body; 

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
    if (major) {
      user.major = major;
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

    await user.destroy(); 

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
}

async function getCourse(req, res) {
  try {
    const { course_name } = req.params;
    const course = await Course.findOne({where: { course_name: course_name } });

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
    const majors = await User.findAll({
      attributes: ['major'],
      group: ['major']
    });

    const majorList = majors.map(user => user.major);
    res.status(200).json({ majors: majorList });
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
      exists = await Form.findOne({ where: { tracking_code: code } });
    } while (exists);

    const status = "pending";

    const newForm = await Form.create({ title: title, tracking_code: code, type: type, status: status, content: content, user_id: user_id });
    res.status(201).json({ message: "Form submitted successfully", form: newForm });
  } catch (error) {
    console.error("❌ Error submitting form:", error);
    if (error.name === 'SequelizeValidationError') {
      // برقرا کنید خطاهای مدل رو ببینید
      console.error(error.errors.map(e => e.message));
      return res.status(400).json({ message: error.errors.map(e => e.message) });
    }
    res.status(500).json({ message: "Server error", detail: error.message });
  }
}

async function getFormsForUser(req, res) {
  try {
    const user_id = req.params.user_id;
    if (!user_id) {
      return res.status(400).json({ message: 'user_id is required' });
    }

    const forms = await Form.findAll({
      where: { user_id },
      order: [['createdAt', 'DESC']]
    });

    return res.json({ forms });
  } catch (err) {
    console.error('Error fetching forms:', err);
    return res.status(500).json({ message: 'server error' });
  }
}

async function updateForm(req, res) {
  try {
    const formId  = req.params.id;
    const { title, type, content, user_id } = req.body;
    if (!title || !type || !content || !user_id) {
      return res.status(400).json({ message: 'فیلدهای title, type, content و user_id الزامی‌اند.' });
    }
    const form = await Form.findOne({ where: { id: formId, user_id } });
    if (!form) {
      return res.status(404).json({ message: 'فرم پیدا نشد یا متعلق به شما نیست.' });
    }
    form.title   = title;
    form.type    = type;
    form.content = content;
    await form.save();

    return res.json({ message: 'فرم با موفقیت ویرایش شد.', form });
  } catch (err) {
    console.error('Error updating form:', err);
    return res.status(500).json({ message: 'خطای سروری' });
  }
}

async function deleteForm(req, res) {
  try {
    const formId = req.params.id;
    const { user_id } = req.body;
    if (!user_id) {
      return res.status(400).json({ message: 'user_id is required' });
    }
    const deleted = await Form.destroy({ where: { id: formId, user_id } });
    if (!deleted) {
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
    const form = await Form.findByPk(id);
    if (!form) {
      return res.status(404).json({ message: 'form not found' });
    }
    return res.json(form); // ارسال اطلاعات فرم به کلاینت
  } catch (err) {
    console.error('Error fetching form:', err);
    return res.status(500).json({ message: 'server error fetching form' });
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
  getFormById
};