import jwt from 'jsonwebtoken';

const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '15d' // Token expiration time
    });
    res.cookie('token', token, {
        httpOnly: true,
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
        sameSite: 'strict', // Helps prevent CSRF attacks
        secure: process.env.NODE_ENV !== 'development' // Use secure cookies in production
    });
};

export default generateTokenAndSetCookie;
