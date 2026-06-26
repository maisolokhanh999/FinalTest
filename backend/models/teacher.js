import mongoose from "mongoose";

const degreeSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, "Loại bằng cấp là bắt buộc"],
      trim: true,
    },

    school: {
      type: String,
      required: [true, "Tên trường là bắt buộc"],
      trim: true,
    },

    major: {
      type: String,
      required: [true, "Chuyên ngành là bắt buộc"],
      trim: true,
    },

    year: {
      type: Number,
      required: [true, "Năm tốt nghiệp là bắt buộc"],
      min: 1900,
      max: new Date().getFullYear(),
    },

    isGraduated: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  }
);

const teacherSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Người dùng là bắt buộc"],
      unique: true,
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
      required: [true, "Mã giáo viên là bắt buộc"],
      unique: true,
      trim: true,
      match: [/^\d{10}$/, "Mã giáo viên phải gồm đúng 10 chữ số"],
    },

    startDate: {
      type: Date,
      required: [true, "Ngày bắt đầu công tác là bắt buộc"],
    },

    endDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return !value || value >= this.startDate;
        },
        message: "Ngày kết thúc phải sau ngày bắt đầu",
      },
    },

    teacherPositions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TeacherPosition",
      },
    ],

    degrees: {
      type: [degreeSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Teacher", teacherSchema);