const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user_schema");
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('815538582382-4fkhe4kd3mk63k7oofs96pj75noaq2vt.apps.googleusercontent.com'); 

exports.register = async (req, res) => {
  const { user_name, email, password } = req.body;

  if (!user_name || !email || !password ) {
    return res
      .status(400)
      .json({ success: false, msg: "All fields are required." });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }] });

    if (existingUser) {
      return res.json({
        success: false,
        msg: "This Email or Phone is already in use.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      user_name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      msg: "User registered successfully.",
    });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error.",
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, msg: "Email and password are required." });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ success: false, msg: "User not found!" });
    }

    const isSame = await bcrypt.compare(password, existingUser.password);
    if (!isSame) {
      return res.status(403).json({ success: false, msg: "Unauthorized" });
    }

    const token = jwt.sign(
      { id: existingUser._id, email: existingUser.email },
      "your_jwt_secret",
      { expiresIn: "2d" }
    );

    return res
      .status(200)
      .json({ success: true, msg: "User logged in.", token });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, msg: "Login failed. Try again." });
  }
};

exports.googleAuth = async (req, res) => {
  const { user_name, email, google_id_token, is_google_auth } = req.body;

  if (!is_google_auth || !google_id_token || !email) {
    return res.status(400).json({ success: false, msg: 'Invalid Google auth request. Missing required fields.' });
  }

  try {
    // Verify Google ID token
    const ticket = await client.verifyIdToken({
      idToken: google_id_token,
      audience: '815538582382-4fkhe4kd3mk63k7oofs96pj75noaq2vt.apps.googleusercontent.com', // Your OAuth Client ID
    });

    const payload = ticket.getPayload();

    if (payload.email !== email) {
      return res.status(400).json({ success: false, msg: 'Email mismatch between token and provided email.' });
    }

    let user = await User.findOne({ email });

    // If user does not exist, create a new user
    if (!user) {
      user = new User({
        user_name: user_name || payload.name,
        email,
        google_id: payload.sub,
      });
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      "your_jwt_secret",
      { expiresIn: "2d" }
    );

    return res.status(200).json({
      success: true,
      msg: user.wasNew ? 'User registered successfully.' : 'User logged in.',
      user: {
        id: user._id,
        user_name: user.user_name,
        email: user.email,
      },
      token,
    });

  } catch (error) {
    console.error('Google auth error:', error);
    return res.status(500).json({
      success: false,
      msg: 'Internal server error during Google authentication.',
      error: error.message,
    });
  }
};