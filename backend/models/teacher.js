import mongoose from "mongoose";

const degreeSchema = new mongoose.Schema(
    {
        type: {
            type: String, // Cử nhân, Thạc sĩ, ...
        },
        school: {
            type: String,
        },
        major: {
            type: String,
        },
        year: {
            type: Number,
        },
        isGraduated: {
            type: Boolean,
            default: false,
        },
    },
    { _id: false }
);

const teacherSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "userId là bắt buộc"],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        code: {
            type: String,
            unique: true,
            match: [/^\d{10}$/, "Mã giáo viên phải gồm đúng 10 chữ số"],
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
        teacherPositions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "TeacherPosition",
            },
        ],
        degrees: [degreeSchema],
    },
    { timestamps: true }
);

export default mongoose.model("Teacher", teacherSchema);