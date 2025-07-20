const { User, Personal_message } = require('../models');
const { Op, Model } = require('sequelize');

const getChattedUsers = async (req, res) => {
  const loggedInUserId = req.body.userId;
    console.log(req.data);
    
  try {
    // Step 1: Find all unique user IDs the current user has chatted with
    const messages = await Personal_message.findAll({
      where: {
        [Op.or]: [
          { sender_id: loggedInUserId },
          { receiver_id: loggedInUserId }
        ]
      },
      attributes: ['sender_id', 'receiver_id']
    });

    // Step 2: Extract all unique user IDs except current user
    const userIds = new Set();
    messages.forEach(msg => {
      if (msg.sender_id !== loggedInUserId) userIds.add(msg.sender_id);
      if (msg.receiver_id !== loggedInUserId) userIds.add(msg.receiver_id);
    });

    // Step 3: Fetch user details for those IDs
    const users = await User.findAll({
      where: {
        id: Array.from(userIds)
      },
      attributes: ['id', 'username', 'profile_image_url']
    });

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching chatted users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {getChattedUsers}