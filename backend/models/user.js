import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên người dùng là bắt buộc"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email là bắt buộc"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      default: "",
      trim: true,
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    identity: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    dob: {
      type: Date,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      enum: ["STUDENT", "TEACHER", "ADMIN"],
      default: "STUDENT",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);