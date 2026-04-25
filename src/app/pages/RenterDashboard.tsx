import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
  CircularProgress,
  LinearProgress,
  Alert as MuiAlert,
} from "@mui/material";
import { 
  ShoppingBag, 
  History, 
  Payment as PaymentIcon, 
  Star, 
  Download,
  BookOnline,
  RateReview 
} from "@mui/icons-material";
import { generateReceipt } from "../utils/receiptGenerator";
import { Booking } from "./Payment";
import TrackingMap from "../components/TrackingMap";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

export function RenterDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const fetchBookingsAndOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      
      const [bookingsRes, ordersRes] = await Promise.all([
        fetch("http://localhost:5000/api/bookings/my-bookings", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch("http://localhost:5000/api/orders/my-orders", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const bookingsData = await bookingsRes.json();
      const ordersData = await ordersRes.json();
      
      if (bookingsRes.ok && ordersRes.ok) {
        setBookings(bookingsData);
        setOrders(ordersData);
      } else {
        setError(bookingsData.message || ordersData.message || "Failed to load dashboard data");
      }
    } catch (err) {
      setError("Error connecting to the server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookingsAndOrders();
    }

    // Safety timeout: guarantee dashboard becomes interactive
    const timer = setTimeout(() => {
        setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [user]);

  const downloadReceipt = (booking: any) => {
    const receiptContent = `
    RENTIT RECEIPT
    ------------------------
    Item: ${(booking as any).itemId?.name}
    Start: ${new Date(booking.startDate).toDateString()}
    End:   ${new Date(booking.endDate).toDateString()}
    Amount: ₹${(booking as any).totalAmount || (booking as any).totalPrice}
    Status: ${booking.status}
    Tracking: ${booking.trackingStatus || "Delivery Info Pending"}
    ------------------------
    `;const blob = new Blob([receiptContent], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "receipt.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenReview = (booking: Booking) => {
    setSelectedBooking(booking);
    setReviewDialogOpen(true);
  };

  const handleSubmitReview = async () => {
    if (selectedBooking) {
      try {
        const token = localStorage.getItem("token");

        // The item ID is now under the 'itemId' field due to our recent schema change
        const selectedItemId = (selectedBooking as any).itemId?._id || (selectedBooking as any).itemId;
        console.log("Review itemId:", selectedItemId);

        if (!selectedItemId) {
          throw new Error("Item ID not found");
        }

        const res = await fetch("http://localhost:5000/api/reviews/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            itemId: selectedItemId,
            rating,
            comment,
          }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to submit review");

        alert("Review submitted successfully");
        setReviewDialogOpen(false);
        setRating(5);
        setComment("");
      } catch (err: any) {
        console.error(err);
        alert("Error submitting review: " + err.message);
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <MuiAlert severity="error">{error}</MuiAlert>;
  }

  const totalSpent = orders.reduce((sum, o) => sum + (o.amount || 0), 0);

  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={{ p: { xs: 2, md: 4 }, minHeight: "100vh", bgcolor: "#f8fafc" }}
    >
      <motion.div variants={itemVariants}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 800, background: "linear-gradient(90deg, #1e293b, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Renter Dashboard
        </Typography>
      </motion.div>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} md={6}>
          <motion.div variants={itemVariants} whileHover={{ y: -8, transition: { duration: 0.2 } }}>
            <Paper sx={{ 
              p: 3, 
              background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)", 
              color: "white",
              borderRadius: "20px",
              boxShadow: "0 20px 40px rgba(14, 165, 233, 0.25)",
              position: "relative",
              overflow: "hidden"
            }}>
              <Box sx={{ position: "absolute", top: "-20%", right: "-10%", opacity: 0.1 }}>
                <BookOnline sx={{ fontSize: 150 }} />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1, position: "relative", zIndex: 1 }}>
                <BookOnline sx={{ fontSize: 40, mr: 2, color: "#E0F2FE" }} />
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, textShadow: "0 2px 10px rgba(0,0,0,0.2)" }}>
                    {bookings.length}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, color: "#E0F2FE" }}>Total Bookings</Typography>
                </Box>
              </Box>
            </Paper>
          </motion.div>
        </Grid>
        <Grid item xs={12} md={6}>
          <motion.div variants={itemVariants} whileHover={{ y: -8, transition: { duration: 0.2 } }}>
            <Paper sx={{ 
              p: 3, 
              background: "linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)", 
              color: "white",
              borderRadius: "20px",
              boxShadow: "0 20px 40px rgba(244, 63, 94, 0.25)",
              position: "relative",
              overflow: "hidden"
            }}>
              <Box sx={{ position: "absolute", top: "-20%", right: "-10%", opacity: 0.1 }}>
                <PaymentIcon sx={{ fontSize: 150 }} />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1, position: "relative", zIndex: 1 }}>
                <PaymentIcon sx={{ fontSize: 40, mr: 2, color: "#FFE4E6" }} />
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, textShadow: "0 2px 10px rgba(0,0,0,0.2)" }}>
                    ₹{totalSpent}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, color: "#FFE4E6" }}>Total Spent</Typography>
                </Box>
              </Box>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>

      {/* Bookings Table */}
      <motion.div variants={itemVariants}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: "#1e293b" }}>
            My Bookings
          </Typography>
          {bookings.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: "center", borderRadius: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
              <BookOnline sx={{ fontSize: 60, color: "grey.300", mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                No bookings yet
              </Typography>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ display: "inline-block" }}>
                <Button component={Link} to="/" variant="contained" sx={{
                  borderRadius: "12px", 
                  px: 4, 
                  py: 1.5,
                  background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                  boxShadow: "0 8px 20px rgba(59, 130, 246, 0.3)",
                  textTransform: "none",
                  fontWeight: 600
                }}>
                  Browse Items
                </Button>
              </motion.div>
            </Paper>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", overflow: "hidden" }}>
              <Table>
                <TableHead sx={{ bgcolor: "#f8fafc" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Item</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Start Date</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>End Date</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Tracking Info</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking._id} hover sx={{ transition: "background-color 0.2s" }}>
                      <TableCell sx={{ fontWeight: 600 }}>{(booking as any).itemId?.name || "Item Deleted"}</TableCell>
                      <TableCell>{new Date(booking.startDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(booking.endDate).toLocaleDateString()}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#059669" }}>₹{(booking as any).totalAmount || (booking as any).totalPrice}</TableCell>
                      <TableCell>
                        <Chip
                          label={booking.status}
                          color={booking.status === "completed" ? "success" : "default"}
                          size="small"
                          sx={{ mr: 1, mb: 1, fontWeight: 600, textTransform: "capitalize" }}
                        />
                        {(booking as any).isInsured && (
                          <Chip
                            label="🛡️ Insured"
                            color="primary"
                            variant="outlined"
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ minWidth: 200 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            📦 Status: {(booking as any).trackingStatus || "Preparing"}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 1 }}>
                            📍 Location: {(booking as any).location || "Warehouse"}
                          </Typography>
                          {(() => {
                            const steps = ["Preparing", "Shipped", "In Use", "Returned"];
                            const currentStep = steps.indexOf((booking as any).trackingStatus || "Preparing");
                            const progress = ((currentStep + 1) / steps.length) * 100;
                            return (
                              <Box>
                                <Box sx={{ width: '100%', mr: 1, mb: 0.5 }}>
                                  <LinearProgress variant="determinate" value={progress} sx={{ height: 6, borderRadius: 3, bgcolor: "grey.200", "& .MuiLinearProgress-bar": { borderRadius: 3, background: "linear-gradient(90deg, #1cb5e0 0%, #000851 100%)" } }} />
                                </Box>
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                  {steps.map((step, idx) => (
                                    <Typography key={step} variant="caption" sx={{ fontSize: "0.6rem", fontWeight: currentStep >= idx ? 700 : 400, color: currentStep >= idx ? "primary.main" : "text.secondary" }}>
                                      {step}
                                    </Typography>
                                  ))}
                                </Box>
                                
                                <Box sx={{ mt: 2, minWidth: "250px", borderRadius: "12px", overflow: "hidden" }}>
                                  <TrackingMap 
                                    lat={(booking as any).locationCoords?.lat || 28.6139} 
                                    lng={(booking as any).locationCoords?.lng || 77.2090} 
                                  />
                                </Box>
                              </Box>
                            );
                          })()}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<Download />}
                              onClick={() => downloadReceipt(booking)}
                              sx={{ borderRadius: "8px", color: "#3b82f6", borderColor: "#3b82f6" }}
                            >
                              Receipt
                            </Button>
                          </motion.div>
                          {booking.status === "completed" && (
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                size="small"
                                variant="contained"
                                onClick={() => handleOpenReview(booking)}
                                sx={{ borderRadius: "8px", bgcolor: "#10b981", color: "white", "&:hover": { bgcolor: "#059669" } }}
                              >
                                Review
                              </Button>
                            </motion.div>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </motion.div>

      {/* Review Dialog */}
      <Dialog 
        open={reviewDialogOpen} 
        onClose={() => setReviewDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: "20px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, borderBottom: "1px solid #f1f5f9" }}>Write a Review</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
              Rating
            </Typography>
            <Rating value={rating} onChange={(_, newValue) => setRating(newValue || 5)} size="large" sx={{ color: "#fbbf24" }} />
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Tell us about your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              sx={{ 
                mt: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setReviewDialogOpen(false)} sx={{ color: "text.secondary", fontWeight: 600 }}>Cancel</Button>
          <Button 
            onClick={handleSubmitReview} 
            variant="contained"
            sx={{ 
              borderRadius: "10px", 
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              boxShadow: "0 4px 14px rgba(59, 130, 246, 0.4)",
              fontWeight: 600
            }}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
