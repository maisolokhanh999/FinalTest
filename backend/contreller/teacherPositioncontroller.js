import TeacherPosition from "../models/teacherPosition.js";

export const getTeacherPositions = async (req, res) => {
    try {
        const positions = await TeacherPosition.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: positions,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const createTeacherPosition = async (req, res) => {
    try {
        let { name, code, des } = req.body;

        if (!name || !code) {
            return res.status(400).json({
                success: false,
                message: "Tên và mã vị trí là bắt buộc",
            });
        }

        name = name.trim();
        code = code.trim().toUpperCase();

        const existing = await TeacherPosition.findOne({
            code,
            isDeleted: false,
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Mã vị trí công tác đã tồn tại",
            });
        }

        const newPosition = await TeacherPosition.create({
            name,
            code,
            des,
        });

        return res.status(201).json({
            success: true,
            message: "Tạo vị trí công tác thành công",
            data: newPosition,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Mã vị trí công tác đã tồn tại",
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};