const mongoose = require('mongoose');
const authModel = require('../model/authModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../Services/sendEmail');

const register = async (req, res) => {
    try {
        const { firstName, lastName, password, email, phone, address, district, role, serviceCategory, price } = req.body;

        console.log(req.body);

        if (!firstName || !lastName || !password || !email || !phone || !address || !district || !role) {
            return res.status(400).json({ message: "All mandatory fields are required" });
        }

        if (role === 'provider') {
            if (!serviceCategory) {
                return res.status(400).json({ message: "Service category is required for providers" });
            }
            if (!price) {
                return res.status(400).json({ message: "Price is required for providers" });
            }
        }

        //find [{},{},{}]
        const userExists = await authModel.findOne({ email })
        if (userExists) {
            return res.status(409).json({ message: "User already exists" });
        }

        const newUser = await authModel.create({
            firstName,
            lastName,
            email,
            phone,
            password: bcrypt.hashSync(password, 10),
            address,
            district,
            role,
            serviceCategory: role === 'provider' ? serviceCategory : undefined,
            price: role === 'provider' ? price : undefined
        });

        return res.status(201).json({
            message: "User registered successfully",
            data: newUser
        })

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

}

const login = async (req, res) => {
    try {
        console.log("Login request body:", req.body);
        let { email, password } = req.body;
        email = email?.trim();

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Hardcoded Admin Login (Case-insensitive for the username 'admin')
        if (email?.toLowerCase() === "admin" && password === "admin@123") {
            const adminUser = await authModel.findOne({ email: "admin@bookybee.com" });
            if (adminUser) {
                const adminToken = jwt.sign({ id: adminUser._id, email: adminUser.email, role: "admin" }, "helloworld", { expiresIn: "1h" });
                return res.status(200).json({
                    message: "Admin Login successful",
                    data: {
                        firstName: adminUser.firstName,
                        lastName: adminUser.lastName,
                        email: adminUser.email,
                        role: "admin"
                    },
                    token: adminToken
                });
            }
        }

        const user = await authModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user._id, email: user.email, phone: user.phone, role: user.role }, "helloworld", { expiresIn: "1h" });

        // Don't modify the user object directly if you want to avoid saving token to DB (optional)
        const userData = user.toObject();
        delete userData.password;

        return res.status(200).json({
            message: "Login successful",
            data: userData,
            token: token
        });

    } catch (err) {
        console.error("Login Error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const forgotPassword = async (req, res) => {
    let { email } = req.body;
    email = email?.trim();
    console.log("Forgot password request for email:", email);

    try {
        const user = await authModel.findOne({ email }).select("+otp +isOtpVerified");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        console.log("OTP generated:", otp);

        user.otp = otp;
        user.isOtpVerified = false;
        await user.save();

        await sendEmail({
            email,
            subject: "Password Reset OTP",
            message: `Your OTP for password reset is: ${otp}`,
        });

        return res.status(200).json({
            message: "OTP sent to email",
        });
    }
    catch (err) {
        console.error("Failed to process forgot password:", err.message);
        return res.status(500).json({ message: "Failed to send OTP" });
    }
};


// verify otp 
const verifyOtp = async (req, res) => {
    let { email, otp } = req.body
    email = email?.trim();
    if (!email || !otp) {
        return res.status(400).json({
            message: "Please provide email,otp"
        })
    }
    // check if that otp is correct or not of that email
    const user = await authModel.findOne({ email }).select("+otp +isOtpVerified")

    if (!user) {
        return res.status(404).json({
            message: "Email is not registered"
        })
    }

    if (user.otp !== otp) {
        return res.status(400).json({
            message: "Invalid otp"
        })
    } else {
        // dispose the otp so cannot be used next time the same otp
        user.otp = undefined
        user.isOtpVerified = true
        await user.save()
        res.status(200).json({
            message: "Otp is correct"
        })
    }
}

const resetPassword = async (req, res) => {
    let { email, newPassword, confirmPassword } = req.body
    email = email?.trim();
    if (!email || !newPassword || !confirmPassword) {
        return res.status(400).json({
            message: "Please provide email,newPassword,confirmPassword"
        })
    }
    if (newPassword !== confirmPassword) {
        return res.status(400).json({
            message: "newPassword and confirmPassword doesn't match"
        })
    }

    const user = await authModel.findOne({ email }).select("+isOtpVerified")
    if (!user) {
        return res.status(404).json({
            message: "User email not registered"
        })
    }

    if (user.isOtpVerified != true) {
        return res.status(403).json({
            message: "You cannot perform this action"
        })
    }

    user.password = bcrypt.hashSync(newPassword, 12)
    user.isOtpVerified = false;
    await user.save()

    res.status(200).json({
        message: "Password changed successfully"
    })
}

const getAllUsers = async (req, res) => {
    try {
        const users = await authModel.find().select("-password");
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await authModel.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role === 'admin') {
            return res.status(403).json({ message: "Admin users cannot be deleted" });
        }

        await authModel.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const toggleAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Toggling availability for user:", id);

        // We can get the user directly from req.user if it's the same ID
        // or fetch it from DB to be sure we have the latest state
        const user = await authModel.findById(id);

        if (!user) {
            console.log("User not found in toggleAvailability");
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role !== 'provider') {
            return res.status(403).json({ message: "Only providers can toggle availability" });
        }

        user.isAvailable = !user.isAvailable;
        await user.save();

        console.log("New availability state:", user.isAvailable);

        res.status(200).json({
            success: true,
            message: `Provider is now ${user.isAvailable ? 'available' : 'unavailable'}`,
            isAvailable: user.isAvailable
        });
    } catch (err) {
        console.error("Error in toggleAvailability:", err);
        res.status(500).json({ message: err.message });
    }
}

const updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, phone, address, district, serviceCategory, price, removeProfilePicture } = req.body;

        if (req.user._id.toString() !== id) {
            return res.status(403).json({ message: "You can only update your own profile" });
        }

        const user = await authModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.phone = phone || user.phone;
        user.address = address || user.address;
        user.district = district || user.district;

        if (req.file) {
            user.profilePicture = req.file.filename;
        } else if (removeProfilePicture === 'true') {
            user.profilePicture = "";
        }

        if (user.role === 'provider') {
            user.serviceCategory = serviceCategory || user.serviceCategory;
            user.price = price || user.price;
        }

        await user.save();

        const userData = user.toObject();
        delete userData.password;

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: userData
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const changePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;

        if (req.user._id.toString() !== id) {
            return res.status(403).json({ message: "You can only change your own password" });
        }

        const user = await authModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = bcrypt.compareSync(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid current password" });
        }

        user.password = bcrypt.hashSync(newPassword, 10);
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getUserDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await authModel.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = { register, login, forgotPassword, verifyOtp, resetPassword, getAllUsers, deleteUser, toggleAvailability, updateProfile, changePassword, getUserDetails };