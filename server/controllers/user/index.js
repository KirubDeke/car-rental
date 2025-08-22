const bcrypt = require("bcrypt");
const db = require("../../models");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");


const signup = async (req, res) => {
  const { fullName, email, phoneNumber, password, role = "user" } = req.body;

  try {
    console.log("Request body:", req.body);

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
        role: user.role,
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

    const user = await db.users.findByPk(decoded.id, {
      attributes: ["id", "fullName", "email", "role", "photo"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ authenticated: true, user });
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

const profile = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      status: "fail",
      message: "Not authenticated",
    });
  }

  try {
    const user = await db.users.findByPk(userId, {
      attributes: ["id", "fullName", "email", "phoneNumber", "role"],
    });

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    console.error("Profile error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
//user Info
const getAllUsers = async (req, res) => {
  try {
    const users = await db.users.findAndCountAll();

    if (users.count === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No users found",
      });
    }

    return res.status(200).json({
      status: "success",
      totalCount: users.count,
      data: users.rows,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
//delete user
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await db.users.findByPk(id);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }
    await user.destroy();
    return res.status(200).json({
      status: "success",
      message: "User removed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
//get profile
const getProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await db.users.findByPk(id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update profile
const updateProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await db.users.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { fullName, email, phoneNumber } = req.body;
    let data = { fullName, email, phoneNumber };
    if (req.file) {
      const image = req.file.path;
      // (Optional) Delete old Cloudinary image if exists
      if (user.photo && user.photo.includes("cloudinary.com")) {
        const publicId = user.photo.split("/").slice(-1)[0].split(".")[0];
        await cloudinary.uploader.destroy(`users/${publicId}`);
      }
      data.photo = image;
    }
    await user.update(data);
    return res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  signup,
  login,
  signout,
  getMe,
  profile,
  getAllUsers,
  deleteUser,
  getProfile,
  updateProfile,
};
