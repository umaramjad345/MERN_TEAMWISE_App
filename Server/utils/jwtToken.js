import jwt from "jsonwebtoken";

export const sendToken = (message, res, newUser, statusCode) => {
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
  const { password, ...user } = newUser._doc;
  const options = {
    expiresIn: new Date(Date.now() + 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  return res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ status: true, user, message, token });
};
