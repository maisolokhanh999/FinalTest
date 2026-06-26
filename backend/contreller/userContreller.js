import User from "../models/user.js";

export const getUsers = async (req, res) => {
    try {
        const users = await User.find({ isDeleted: false });
        return res.status(200).json({ success: true, data: users });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const createUser = async (req, res) => {
    try {
        const { name, email, phoneNumber, address, identity, dob, role } = req.body;

        const existingUser = await User.findOne({ email, isDeleted: false });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email đã tồn tại",
            });
        }

        const newUser = await User.create({
            name,
            email,
            phoneNumber,
            address,
            identity,
            dob,
            role,
        });

        return res.status(201).json({
            success: true,
            message: "Tạo người dùng thành công",
            data: newUser,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};