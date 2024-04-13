import bcrypt from "bcrypt";
import mongoose, { Schema } from "mongoose";
import validator from "validator";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is Required"],
    },
    title: { type: String, required: [true, "Title is Required"] },
    role: { type: String, required: [true, "User Role is Required"] },
    email: {
      type: String,
      required: [true, "Email is Required"],
      unique: [true, "User Already Registered!"],
      validate: [validator.isEmail, "Please Provid a Valid Email!"],
    },
    password: {
      type: String,
      required: [true, "Password is Required"],
      minLenth: [4, "Password Must Contain atleast 4 Characters"],
      // maxLength: [32, "Password can't Exceed 32 Characters"],
    },
    isAdmin: {
      type: Boolean,
      required: [true, "Please Choose, is User Admin"],
      default: false,
    },
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    isActive: {
      type: Boolean,
      required: [true, "User Current Status is Required"],
      default: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
