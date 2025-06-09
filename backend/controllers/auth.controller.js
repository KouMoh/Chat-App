import bcrypt, { hash } from 'bcryptjs';
import User from "../models/user.model.js";
export const login = (req, res) => {
    res.send('Login Page');
};

export const signup = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;
        if (!fullName || !username || !password || !confirmPassword || !gender) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }
        // Continue with signup logic
        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ error: 'Username already exists' });
        }
        // HASH THE PASSWORD HERE

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
            fullName,
            username,
            password: hashedPassword,
            gender,
            profilePic: gender === 'male' ? boyProfilePic : girlProfilePic,
        });

        if (newUser) {
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic,
            });
        } else {
            res.status(400).json({ error: 'User creation failed' });
        }
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const logout = (req, res) => {
    res.send('Logout Page');
};
