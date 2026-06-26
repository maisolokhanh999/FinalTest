export const createUser = async (req, res) => {
    try {
        const {
            name,
            email,
            phoneNumber,
            address,
            identity,
            dob,
            role,
        } = req.body;

        if (!name || !email || !role) {
            return res.status(400).json({
                success: false,
                message: "Thiếu thông tin bắt buộc",
            });
        }

        const existingEmail = await User.findOne({
            email: email.toLowerCase(),
            isDeleted: false,
        });

        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: "Email đã tồn tại",
            });
        }

        if (identity) {
            const existingIdentity = await User.findOne({
                identity,
                isDeleted: false,
            });

            if (existingIdentity) {
                return res.status(400).json({
                    success: false,
                    message: "CCCD đã tồn tại",
                });
            }
        }

        if (phoneNumber) {
            const existingPhone = await User.findOne({
                phoneNumber,
                isDeleted: false,
            });

            if (existingPhone) {
                return res.status(400).json({
                    success: false,
                    message: "Số điện thoại đã tồn tại",
                });
            }
        }

        const newUser = await User.create({
            name,
            email: email.toLowerCase(),
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
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};