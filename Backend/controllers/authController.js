
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendRegistrationEmail } from "../services/email.service.js";

export const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const userExists = await User.findOne({
      email: normalizedEmail,
    });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "user", // Public signup can never create an admin
    });

    try {
      await sendRegistrationEmail(user.email, user.name);
    } catch (emailError) {
      console.error("Registration email error:", emailError);
    }

    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Signup Error:", error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

export const loginuser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Existing accounts without a role are treated as regular users
    const role = user.role || "user";

    const token = jwt.sign(
      {
        id: user._id,
        role,
      },
      process.env.JWT_TOKEN,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      message: "Login Successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      role,
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};
