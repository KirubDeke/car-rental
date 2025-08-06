const bcrypt = require("bcrypt");
const db = require("../../models");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  const { fullName, email, phoneNumber, password, role = "user" } = req.body;

  try {
    console.log('Request body:', req.body);

    const existingUser = await db.users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        status: "fail",
        message: "Email already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.users.create({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
    });
    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      status: "success",
      data: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phoneNumber,
        role: user.role
      },
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
//login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await db.users.findOne({ where: { email } });
    if (!user) {
      return res
        .status(401)
        .json({ status: "fail", message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ status: "fail", message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      status: "success",
      data: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};
//signout
const signout = async (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  return res.status(200).json({
    status: "success",
    message: "Successfully signed out",
  });
};
//get me
const getMe = async (req, res) => {
  const token = req.cookies?.jwt;
  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    res.status(200).json({ authenticated: true, user: decoded });
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = {
  signup,
  login,
  signout,
  getMe,

};
