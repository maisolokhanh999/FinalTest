import mongoose from "mongoose";

const teacherPositionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Tên vị trí là bắt buộc"],
        },
        code: {
            type: String,
            required: [true, "Mã vị trí là bắt buộc"],
            unique: true,
        },
        des: {
            type: String,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export default mongoose.model("TeacherPosition", teacherPositionSchema);