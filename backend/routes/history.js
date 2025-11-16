const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ChatHistory = require('../models/chatHistory');

router.get('/', auth, async (req, res) => {
  try {
    const chatHistory = await ChatHistory.findOne({ userId: req.user._id });
    res.json(chatHistory || { messages: [] });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history', error: error.message });
  }
});

router.delete('/', auth, async (req, res) => {
  try {
    await ChatHistory.findOneAndDelete({ userId: req.user._id });
    res.json({ message: 'Chat history deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting history', error: error.message });
  }
});

module.exports = router;