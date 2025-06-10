import bcrypt, { hash } from 'bcryptjs';
import User from "../models/user.model.js";
import generateTokenAndSetCookie from '../utils/generateToken.js';
export const login = (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
        // Find the user by username
        User.findOne({ username })
            .then(async (user) => {
                if (!user) {
                    return res.status(401).json({ error: 'Invalid username or password' });
                }
                // Compare the provided password with the stored hashed password
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return res.status(401).json({ error: 'Invalid username or password' });
                }
                // Generate a JWT token and set it in a cookie
                generateTokenAndSetCookie(user._id, res);
                // Respond with user details (excluding password)
                res.status(200).json({
                    _id: user._id,
                    fullName: user.fullName,
                    username: user.username,
                    profilePic: user.profilePic,
                });
            })
            .catch((error) => {
                console.error('Error during login:', error);
                res.status(500).json({ error: 'Internal server error' });
            });
        
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
        
    }
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

        //generate a JWT token here if needed
        generateTokenAndSetCookie(newUser._id, res);
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
    try {
        // Clear the cookie by setting its maxAge to 0
        res.cookie('token', '', {
            httpOnly: true,
            maxAge: 0, // Set maxAge to 0 to delete the cookie
            sameSite: 'strict',
            secure: process.env.NODE_ENV !== 'development' // Use secure cookies in production
        });
        res.status(200).json({ message: 'Logged out successfully' });
        
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ error: 'Internal server error' });
        
    }
};
