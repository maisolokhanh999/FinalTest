import TeacherPosition from "../models/teacherPosition.js";

// 1.4 GET /teacher-positions
export const getTeacherPositions = async (req, res) => {
    try {
        const positions = await TeacherPosition.find({ isDeleted: false });

        return res.status(200).json({
            success: true,
            data: positions,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// 1.5 POST /teacher-positions
export const createTeacherPosition = async (req, res) => {
    try {
        const { name, code, des } = req.body;

        // Kiểm tra code đã tồn tại chưa
        const existing = await TeacherPosition.findOne({ code, isDeleted: false });
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
        return res.status(500).json({ success: false, message: error.message });
    }
};