import { response } from "express";
import User from "../models/userModel.js";
import { sendToken } from "../utils/jwtToken.js";
import Notice from "../models/notificationModel.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, title } = req.body;
    if (!name || !email || !password || !role || !title) {
      return res
        .status(400)
        .json({ status: false, message: "Please Provide All Details" });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        status: false,
        message: "User Already Exists",
      });
    }
    const newUser = await User.create({
      name,
      email,
      password,
      role,
      title,
    });
    await newUser.save();
    if (newUser) {
      if (newUser.isAdmin) {
        sendToken("User Registered Succesfully", res, newUser, 200);
      } else {
        const { password, ...user } = newUser._doc;
        return res.status(201).json({
          status: true,
          user,
          message: "User Registered Successfully",
        });
      }
    } else {
      return res
        .status(400)
        .json({ status: false, message: "Invalid User Data" });
    }
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(401)
        .json({ status: false, message: "Please Provide All Details" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid Email or Password" });
    }

    if (!user?.isActive) {
      return res.status(401).json({
        status: false,
        message: "User Accound has been Deactivated, Please Contact Your Admin",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (user && isMatch) {
      sendToken("User Logged In Succesfully", res, user, 200);
    } else {
      return res
        .status(401)
        .json({ status: false, message: "Invalid Email or Password" });
    }
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res
      .status(200)
      .clearCookie("token")
      .json({ status: true, message: "User Logged Out Successfully" });
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const getTeamList = async (req, res) => {
  try {
    const users = await User.find().select("name title role email isActive");

    res.status(200).json(users);
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const getNotificationsList = async (req, res) => {
  try {
    const { userId } = req.user;

    const notice = await Notice.find({
      team: userId,
      isRead: { $nin: [userId] },
    }).populate("task", "title");

    res.status(201).json(notice);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { userId, isAdmin } = req.user;
    const { _id } = req.body;

    const id =
      isAdmin && userId === _id
        ? userId
        : isAdmin && userId !== _id
        ? _id
        : userId;

    const user = await User.findById(id);

    if (user) {
      user.name = req.body.name || user.name;
      user.title = req.body.title || user.title;
      user.role = req.body.role || user.role;

      // We can Also use findByIdAndUpdate() method
      const updatedUser = await user.save({ validateBeforeSave: false });

      // Another Method of Omitting Password
      updatedUser.password = undefined;

      res.status(201).json({
        status: true,
        message: "Profile Updated Successfully",
        user: updatedUser,
      });
    } else {
      res.status(404).json({ status: false, message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const { userId } = req.user;

    const { isReadType, id } = req.query;

    if (isReadType === "all") {
      await Notice.updateMany(
        { team: userId, isRead: { $nin: [userId] } },
        { $push: { isRead: userId } },
        { new: true }
      );
    } else {
      await Notice.findOneAndUpdate(
        { _id: id, isRead: { $nin: [userId] } },
        { $push: { isRead: userId } },
        { new: true }
      );
    }

    res
      .status(201)
      .json({ status: true, message: "Read Notification Marked Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const changeUserPassword = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await User.findById(userId);

    if (user) {
      user.password = req.body.password;

      await user.save();

      user.password = undefined;

      res.status(201).json({
        status: true,
        message: "Password Changed Successfully",
      });
    } else {
      res.status(404).json({ status: false, message: "User Not Found" });
    }
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const activateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (user) {
      user.isActive = req.body.isActive; //!user.isActive

      await user.save();

      res.status(201).json({
        status: true,
        message: `User Activated has been ${
          user?.isActive ? "Activated" : "Disabled"
        }`,
      });
    } else {
      res.status(404).json({ status: false, message: "User Not Found" });
    }
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const deleteUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    await User.findByIdAndDelete(id);

    res
      .status(200)
      .json({ status: true, message: "User Deleted Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};
