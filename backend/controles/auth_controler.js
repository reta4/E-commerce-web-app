import { redis } from "../lib/redis.js";
import User from "../model/User.js";
import jwt, { decode } from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

import { sendMail } from "../lib/mail.js";
import bcrypt from "bcryptjs";

//..............................................................

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refresh_token:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  ); // 7days
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true, // prevent XSS attacks, cross site scripting attack
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // prevents CSRF attack, cross-site request forgery attack
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // prevent XSS attacks, cross site scripting attack
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // prevents CSRF attack, cross-site request forgery attack
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const signup = async (req, res, next) => {
  console.log(req.body);
  try {
    const { email, password, name } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).send({
        status: "fail",
        message: "user with this email address already exists",
      });
    } else {
      const user = await User.create({ name, email, password });

      // authenticate
      const { accessToken, refreshToken } = generateTokens(user._id);
      await storeRefreshToken(user._id, refreshToken);

      setCookies(res, accessToken, refreshToken);
      res.status(201).send({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    }
  } catch (err) {
    console.log("error from signup", err.message);

    res.status(500).send("there is an issues please try later...");
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      const { accessToken, refreshToken } = generateTokens(user._id);
      await storeRefreshToken(user._id, refreshToken);
      setCookies(res, accessToken, refreshToken);
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(404).send({ message: "wrong password or email address" });
    }
  } catch (err) {
    console.log("error from login", err.message);
    res.status(500).send({ message: "server error", error: err });
  }
};
export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      await redis.del(`refresh_token:${decoded.userId}`);
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "logged out successfully" });
  } catch (err) {
    console.log("error from logout", err.message);

    res.status(500).send({ message: "server error", error: err });
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

    if (storedToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.json({ message: "Token refreshed successfully" });
  } catch (error) {
    console.log("Error in refreshToken controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProfile = async (req, res, next) => {
  try {
    res.status(200).send(req.user);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "server error", error: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const SAFE_RESPONSE = {
    message: "If that email exists, a reset link has been sent.",
  };

  try {
    const user = await User.findOne({ email });
    if (!user) return res.json(SAFE_RESPONSE);

    // create random token
    const token = crypto.randomBytes(32).toString("hex");
    await redis.set(`pwdreset:${token}`, user._id.toString(), "EX", 15 * 60); // 15 min

    const resetUrl = `${process.env.APP_ORIGIN}/reset-password/${token}`;
    console.log(resetUrl);
    await sendMail(
      email,
      "Reset your password",
      `
        <h2>Password Reset</h2>
        <p>Click the link below to reset your password (expires in 15 minutes):</p>
        <a href="${resetUrl}">${resetUrl}</a>
      `
    );
    console.log("pass");

    res.json(SAFE_RESPONSE);
  } catch (err) {
    console.error("forgotPassword error:", err);
    res.json(SAFE_RESPONSE);
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: "Invalid request" });
  }

  try {
    const userId = await redis.get(`pwdreset:${token}`);
    if (!userId)
      return res.status(400).json({ message: "Invalid or expired token" });

    const hash = await bcrypt.hash(newPassword, 12);
    await User.findByIdAndUpdate(userId, { password: hash });

    // delete token so it's single-use
    await redis.del(`pwdreset:${token}`);
    console.log(token);

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("resetPassword error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
