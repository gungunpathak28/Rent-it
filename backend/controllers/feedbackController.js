import Feedback from "../models/Feedback.js";

export const addFeedback = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: "Message is required" });

    const feedback = await Feedback.create({
      userId: req.user.id || req.user._id,
      message,
    });

    res.status(201).json({ success: true, feedback });
  } catch (error) {
    res.status(500).json({ message: "Server error saving feedback", error: error.message });
  }
};
