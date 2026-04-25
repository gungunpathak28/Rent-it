import Review from "../models/Review.js";

export const addReview = async (req, res) => {
  try {
    const { itemId, rating, comment } = req.body;

    if (!itemId || !rating || !comment) {
      return res.status(400).json({ message: "All fields required" });
    }

    const review = await Review.create({
      userId: req.user.id || req.user._id,
      itemId,
      rating,
      comment,
    });

    res.json({ success: true, review });
  } catch (error) {
    console.error("REVIEW ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getItemReviews = async (req, res) => {
  try {
    const { itemId } = req.params;

    const reviews = await Review.find({ itemId })
      .populate("userId", "name");

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
