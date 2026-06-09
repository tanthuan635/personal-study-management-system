const bcrypt = require("bcryptjs");

const User = require("../models/User");
const generateToken = require("../utils/generateToken");

function formatAuthResponse(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
  };
}

function isBlank(value) {
  return typeof value !== "string" || value.trim() === "";
}

function ensureJwtSecret(res) {
  if (!process.env.JWT_SECRET) {
    res.status(500).json({
      success: false,
      message: "JWT secret is not configured",
    });

    return false;
  }

  return true;
}

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (isBlank(name) || isBlank(email) || isBlank(password)) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    if (!ensureJwtSecret(res)) {
      return undefined;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: formatAuthResponse(user),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to register user",
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (isBlank(email) || isBlank(password)) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    if (!ensureJwtSecret(res)) {
      return undefined;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    return res.json({
      success: true,
      token: generateToken(user._id),
      user: formatAuthResponse(user),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to login",
    });
  }
}

async function getMe(req, res) {
  return res.json({
    success: true,
    user: formatAuthResponse(req.user),
  });
}

module.exports = {
  register,
  login,
  getMe,
};
