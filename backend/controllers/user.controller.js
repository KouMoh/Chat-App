import User from '../models/user.model.js';
export const getUsersforSidebar = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    const loggedInUserId = req.user._id.toString();
    const usersWithMe = users.map(user => {
      const userObj = user.toObject();
      if (user._id.toString() === loggedInUserId) {
        userObj.fullName = `${userObj.fullName} (Me)`;
      }
      return userObj;
    });
    res.status(200).json(usersWithMe);
  } catch (error) {
    console.error('Error fetching users for sidebar:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
