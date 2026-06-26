import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Tên người dùng là bắt buộc"],
        },
        email: {
            type: String,
            required: [true, "Email là bắt buộc"],
            unique: true,
        },
        phoneNumber: {
            type: String,
        },
        address: {
            type: String,
        },
        identity: {
            type: String,
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
            required: [true, "Vai trò là bắt buộc"],
        },
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);