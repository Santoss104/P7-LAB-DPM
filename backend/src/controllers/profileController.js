const User = require("../models/users");

class ProfileController {
    async getProfile(req, res) {
        const userId = req.user.id;

        try {
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ data: user });
        } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
        }
    }
}

module.exports = new ProfileController();
