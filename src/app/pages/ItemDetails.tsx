import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";
import {
  Box,
  Typography,
  Grid,
  Button,
  Chip,
  Rating,
  Paper,
  Divider,
  Avatar,
  Alert,
  Tooltip,
  TextField,
  Select,
  MenuItem,
  FormControl
} from "@mui/material";
import { LocationOn, Category, Verified, CalendarToday, WhatsApp, Star, Send } from "@mui/icons-material";
import TrackingMap from "../components/TrackingMap";
import { motion } from "framer-motion";

export interface Item {
  _id: string;
  name: string;
  category: string;
  condition: string;
  pricePerDay: number;
  location: string;
  image: string;
  description: string;
  rating: number;
  reviewCount: number;
  totalQuantity: number;
  availableQuantity: number;
  ownerId: {
    _id: string;
    name: string;
    email: string;
    phoneNumber?: string;
  };
}

export interface Review {
  _id: string;
  userId: {
    _id: string;
    name: string;
  };
  itemId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const API = (import.meta.env.VITE_API_URL || "http://localhost:5000") + "/api";

export function ItemDetails() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated, token } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [canReview, setCanReview] = useState(false);
  const [newRating, setNewRating] = useState<number | null>(5);
  const [newComment, setNewComment] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [aiData, setAiData] = useState<any>(null);

  useEffect(() => {
    if (!item?._id) return;

    fetch(`${API}/ai/predict/${item._id}`)
      .then(res => res.json())
      .then(data => {
        console.log("AI:", data);
        setAiData(data);
      })
      .catch(() => setAiData(null));
  }, [item]);

  useEffect(() => {
    let active = true;
    if (id) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const itemData = await api(`/api/items/${id}`);
          if (active) setItem(itemData);

          const reviewsRes = await fetch(`${API}/reviews/${id}`);
          const reviewsData = await reviewsRes.json();
          if (active) setReviews(reviewsData);

          // Check if user has booked this item to allow reviews
          if (isAuthenticated && user?.role === "renter") {
            const bookings = await api("/api/bookings/my-bookings");
            const hasBooked = bookings.some((b: any) => 
                (typeof b?.itemId === 'string' ? b?.itemId === id : b?.itemId?._id === id) && 
                (b?.paymentStatus === "Paid" || b?.status === "confirmed" || b?.paymentStatus === "paid")
            );
            if (active) setCanReview(hasBooked);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          if (active) setLoading(false);
        }
      };

      fetchData();

      const timer = setTimeout(() => {
        if (active) setLoading(false);
      }, 3000);

      return () => {
        active = false;
        clearTimeout(timer);
      };
    }
  }, [id, isAuthenticated, user]);

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", py: 10 }}>
        <Typography variant="h5" color="text.secondary">Loading Item Details...</Typography>
      </Box>
    );
  }

  if (!item) {
    return <p>No item found</p>;
  }

  const isOutOfStock = item?.availableQuantity === 0;

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (user?.role !== "renter") {
      alert("Only renters can book items");
      return;
    }
    navigate(`/renter/book/${item?._id}`);
  };

  const handleAddToCart = async () => {
    try {
      const tokenToUse = localStorage.getItem("token");
      if (!tokenToUse) {
        alert("Please login first to use the Cart");
        return;
      }

      const res = await fetch(`${API}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenToUse}`,
        },
        body: JSON.stringify({ itemId: item._id }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Add to cart failed");
        return;
      }

      alert("Added to cart ✅");
    } catch (err) {
      console.error(err);
      alert("Server not connected ❌");
    }
  };

  const handleSubmitReview = async () => {
    if (!newComment.trim()) {
      setError("Please add a comment");
      return;
    }
    setSubmitting(true);
    setError("");

    try {
      const tokenToUse = localStorage.getItem("token");
      const res = await fetch(`${API}/reviews/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenToUse}`,
        },
        body: JSON.stringify({
          itemId: item._id,
          rating: newRating,
          comment: newComment,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Instant UI Update: Re-fetch reviews or append locally
        const reviewsRes = await fetch(`${API}/reviews/${id}`);
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData);
        
        setNewComment("");
        setNewRating(5);
        alert("Review submitted successfully!");
      } else {
        setError(data.message || "Failed to submit review");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGlobalFeedback = async () => {
    if (!feedbackMsg.trim()) return;
    setSubmittingFeedback(true);
    try {
      const tokenToUse = localStorage.getItem("token");
      const res = await fetch(`${API}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenToUse}`,
        },
        body: JSON.stringify({ message: feedbackMsg }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Thank you for your feedback! 🚀");
        setFeedbackMsg("");
      } else {
        alert(data.message || "Failed to submit feedback.");
      }
    } catch (e) {
      console.error(e);
      alert("Error submitting feedback. Server not connected ❌");
    } finally {
      setSubmittingFeedback(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Box>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={item.image || "https://via.placeholder.com/300"}
              alt={item.name}
              sx={{
                width: "100%",
                height: "auto",
                borderRadius: "20px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                objectFit: "cover",
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h3" sx={{ fontWeight: 800, color: "#2D3A8D", mb: 2 }}>
              {item.name}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Rating value={item.rating} precision={0.1} readOnly size="large" />
              <Typography variant="h6" sx={{ ml: 1, color: "text.secondary", fontWeight: 600 }}>
                {item.rating} <span style={{ fontSize: "1rem", fontWeight: 400 }}>({item.reviewCount} reviews)</span>
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Chip label={item.category} icon={<Category />} sx={{ mr: 1, mb: 1, borderRadius: "8px" }} />
              <Chip label={item.condition} icon={<Verified />} color="success" sx={{ mr: 1, mb: 1, borderRadius: "8px" }} />
              <Chip label={item.location} icon={<LocationOn />} sx={{ mr: 1, mb: 1, borderRadius: "8px" }} />
              {isOutOfStock ? (
                <Chip label="Out of Stock" color="error" sx={{ mb: 1, borderRadius: "8px" }} />
              ) : item.availableQuantity <= 2 ? (
                <Chip label={`Only ${item.availableQuantity} left`} color="warning" sx={{ mb: 1, borderRadius: "8px" }} />
              ) : (
                <Chip label={`In Stock: ${item.availableQuantity}`} color="success" sx={{ mb: 1, borderRadius: "8px", fontWeight: "bold" }} />
              )}
            </Box>

            <Typography variant="h4" color="primary" sx={{ fontWeight: 800, mb: 1 }}>
              ₹{item.pricePerDay} <span style={{ fontSize: "1rem", color: "text.secondary", fontWeight: 400 }}>/day</span>
            </Typography>

            <Box sx={{ mt: 3, p: 2, border: "1px solid", borderColor: "grey.200", borderRadius: "15px", bgcolor: "white" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                <LocationOn color="primary" /> Location
              </Typography>
              <Grid container spacing={2}>
                 <Grid item xs={12}>
                  <Box sx={{ height: "300px", borderRadius: "10px", overflow: "hidden" }}>
                    <TrackingMap 
                      lat={(item as any).locationCoords?.lat || 28.6139} 
                      lng={(item as any).locationCoords?.lng || 77.2090} 
                    />
                  </Box>
                 </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
              Description
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: "text.secondary", lineHeight: 1.8 }}>
              {item.description}
            </Typography>

            <Divider sx={{ my: 3 }} />

            {user?.role === "renter" || !isAuthenticated ? (
              <>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={<CalendarToday />}
                  onClick={handleBookNow}
                  disabled={isOutOfStock}
                  sx={{ py: 1.5, mb: 1, borderRadius: "12px", boxShadow: "0 4px 14px rgba(45, 58, 141, 0.3)" }}
                >
                  {isOutOfStock ? "Out of Stock" : "Book Now"}
                </Button>
                
                <button 
                  onClick={handleAddToCart}
                  style={{
                    marginTop: "10px",
                    marginBottom: "16px",
                    padding: "10px",
                    width: "100%",
                    backgroundColor: "#ff9800",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "1rem"
                  }}
                >
                  ADD TO CART
                </button>
              </>
            ) : (
              <Alert severity="info" sx={{ borderRadius: "12px" }}>Only renters can book items. Switch to a renter account to book.</Alert>
            )}
          </Grid>
        </Grid>

        {/* Reviews Section */}
        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 800, color: "#2D3A8D" }}>
            Reviews & Ratings
          </Typography>

          {/* Add Review Form */}
          {canReview && (
            <Paper elevation={0} sx={{ p: 4, mb: 6, borderRadius: "20px", border: "1px solid", borderColor: "grey.100", bgcolor: "#F8F9FA" }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>Write a Review</Typography>
              {error && <Alert severity="error" sx={{ mb: 2, borderRadius: "8px" }}>{error}</Alert>}
              
              <Box sx={{ mb: 3 }}>
                <FormControl sx={{ minWidth: 120, mb: 2 }}>
                  <Select
                    value={newRating || 5}
                    onChange={(e) => setNewRating(Number(e.target.value))}
                    displayEmpty
                    size="small"
                  >
                    <MenuItem value={5}>⭐⭐⭐⭐⭐ (5 Stars)</MenuItem>
                    <MenuItem value={4}>⭐⭐⭐⭐ (4 Stars)</MenuItem>
                    <MenuItem value={3}>⭐⭐⭐ (3 Stars)</MenuItem>
                    <MenuItem value={2}>⭐⭐ (2 Stars)</MenuItem>
                    <MenuItem value={1}>⭐ (1 Star)</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Write your review..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                variant="outlined"
                sx={{ mb: 3, bgcolor: "white", "& fieldset": { borderRadius: "12px" } }}
              />

              <Button
                variant="contained"
                disabled={submitting}
                onClick={handleSubmitReview}
                sx={{ px: 6, py: 1.5, borderRadius: "30px", fontWeight: 700 }}
              >
                {submitting ? "Posting..." : "Submit Review"}
              </Button>
            </Paper>
          )}

          {/* Reviews List */}
          {reviews.length > 0 ? (
            <Grid container spacing={3}>
              {reviews.map((review, index) => (
                <Grid item xs={12} key={review._id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Paper sx={{ p: 3, borderRadius: "20px", border: "1px solid", borderColor: "grey.50" }} elevation={0}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Avatar sx={{ width: 48, height: 48, mr: 2, bgcolor: "primary.main" }}>
                          {review.userId?.name?.charAt(0).toUpperCase() || "U"}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{review.userId?.name || "Anonymous"}</Typography>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Rating value={review.rating} readOnly size="small" />
                            <Typography variant="caption" sx={{ ml: 1, color: "text.secondary" }}>
                              {new Date(review.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                            </Typography>
                          </Box>
                        </Box>
                        <Chip label="Verified Rental" size="small" variant="outlined" color="success" sx={{ borderRadius: "6px", fontWeight: 600 }} />
                      </Box>
                      <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.6 }}>{review.comment}</Typography>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
              <Box sx={{ textAlign: "center", py: 6, bgcolor: "grey.50", borderRadius: "20px" }}>
                <Star sx={{ fontSize: 48, color: "grey.300", mb: 2 }} />
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Be the first to review this item ⭐
                </Typography>
                {!canReview && (
                  <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
                    Only verified renters can leave reviews.
                  </Typography>
                )}
              </Box>
            </motion.div>
          )}
        </Box>

        {/* Global Feedback Section */}
        {isAuthenticated && (
          <Box sx={{ mt: 10, mb: 4 }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: "20px", background: "linear-gradient(135deg, #f0f4ff 0%, #ffffff 100%)", border: "1px solid #e0e7ff" }}>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, display: "flex", alignItems: "center" }}>
                <Send sx={{ mr: 1, color: "primary.main" }} /> Platform Feedback
              </Typography>
              <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
                Help us improve RentIt! Share your thoughts or report issues directly to our team.
              </Typography>
              
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="How can we make RentIt better for you?"
                value={feedbackMsg}
                onChange={(e) => setFeedbackMsg(e.target.value)}
                variant="outlined"
                sx={{ mb: 2, bgcolor: "white", "& fieldset": { borderRadius: "12px" } }}
              />
              <Button
                variant="contained"
                onClick={handleGlobalFeedback}
                disabled={submittingFeedback || !feedbackMsg.trim()}
                sx={{ borderRadius: "20px", fontWeight: 700, px: 4 }}
              >
                {submittingFeedback ? "Sending..." : "Submit Feedback"}
              </Button>
            </Paper>
          </Box>
        )}
      </Box>
    </motion.div>
  );
}
