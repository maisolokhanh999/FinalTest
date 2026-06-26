import Teacher from "../models/teacher.js";
import User from "../models/user.js";

const generateUniqueCode = async () => {
    let code;
    let isUnique = false;

    while (!isUnique) {
        code = Math.floor(1000000000 + Math.random() * 9000000000).toString();
        const existing = await Teacher.findOne({ code });
        if (!existing) isUnique = true;
    }

    return code;
};

export const getTeachers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const total = await Teacher.countDocuments({ isDeleted: false });

        const teachers = await Teacher.find({ isDeleted: false })
            .skip(skip)
            .limit(limit)
            .populate({
                path: "userId",
                select: "name email phoneNumber address",
            })
            .populate({
                path: "teacherPositions",
                select: "name code",
            });

        const data = teachers.map((teacher) => ({
            code: teacher.code,
            name: teacher.userId?.name,
            email: teacher.userId?.email,
            phoneNumber: teacher.userId?.phoneNumber,
            isActive: teacher.isActive,
            address: teacher.userId?.address,
            teacherPositions: teacher.teacherPositions,
            degrees: teacher.degrees.map((d) => ({
                type: d.type,
                school: d.school,
            })),
        }));

        return res.status(200).json({
            success: true,
            data,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const createTeacher = async (req, res) => {
    try {
        const {
            name,
            email,
            phoneNumber,
            address,
            identity,
            dob,
            startDate,
            endDate,
            teacherPositions,
            degrees,
        } = req.body;

        // Kiểm tra email trùng
        const existingUser = await User.findOne({ email, isDeleted: false });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email đã tồn tại",
            });
        }

        // Tạo User với role TEACHER
        const newUser = await User.create({
            name,
            email,
            phoneNumber,
            address,
            identity,
            dob,
            role: "TEACHER",
        });

        // Sinh code unique
        const code = await generateUniqueCode();

        // Tạo Teacher liên kết với User
        const newTeacher = await Teacher.create({
            userId: newUser._id,
            code,
            startDate,
            endDate,
            teacherPositions,
            degrees,
        });

        return res.status(201).json({
            success: true,
            message: "Tạo giáo viên thành công",
            data: {
                ...newTeacher.toObject(),
                userInfo: newUser,
            },
        });
    } catch (error) {
        // Nếu tạo Teacher thất bại thì xóa User vừa tạo để tránh dữ liệu thừa
        return res.status(500).json({ success: false, message: error.message });
    }
};