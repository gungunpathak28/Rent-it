import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  Alert as MuiAlert,
} from "@mui/material";
import { Edit, Delete, TrendingUp, Inventory, BookOnline } from "@mui/icons-material";
import { Item } from "./Home";
import { Booking } from "./Payment";

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

export function OwnerDashboard() {
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Fetch items
        const itemsRes = await fetch("http://localhost:5000/api/items/my-items", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const itemsData = await itemsRes.json();
        
        // Fetch bookings
        const bookingsRes = await fetch("http://localhost:5000/api/bookings/owner-bookings", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const bookingsData = await bookingsRes.json();
        
        console.log("OWNER BOOKINGS:", bookingsData);

        if (itemsRes.ok && bookingsRes.ok) {
          setItems(itemsData);
          setBookings(bookingsData);
        } else {
          setError("Failed to load dashboard data");
        }
      } catch (err) {
        setError("Something went wrong while connecting to the server");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }

    // Safety timeout: guarantee dashboard becomes interactive
    const timer = setTimeout(() => {
        setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [user]);

  const handleStatusUpdate = async (bookingId: string, status: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        alert(`Booking marked as ${status}`);
        // Refresh both items and bookings to see stock/status changes
        const currentToken = localStorage.getItem("token");
        const itemsRes = await fetch("http://localhost:5000/api/items/my-items", {
            headers: { Authorization: `Bearer ${currentToken}` }
        });
        const bookingsRes = await fetch("http://localhost:5000/api/bookings/owner-bookings", {
            headers: { Authorization: `Bearer ${currentToken}` }
        });
        if (itemsRes.ok && bookingsRes.ok) {
            setItems(await itemsRes.json());
            setBookings(await bookingsRes.json());
        }
      } else {
        const data = await res.json();
        alert(`Failed to update: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error updating booking status");
    }
  };


  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/items/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          setItems(items.filter((item) => item._id !== id));
        } else {
          const data = await res.json();
          alert(`Failed to delete: ${data.message}`);
        }
      } catch (err) {
        alert("Error deleting item");
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

  const earnings = bookings
    .filter((b) => b.paymentStatus === "paid")
    .reduce((sum, b) => sum + b.totalAmount, 0);

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
          Owner Dashboard
        </Typography>
      </motion.div>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} md={4}>
          <motion.div variants={itemVariants} whileHover={{ y: -8, transition: { duration: 0.2 } }}>
            <Paper sx={{ 
              p: 3, 
              background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)", 
              color: "white",
              borderRadius: "20px",
              boxShadow: "0 20px 40px rgba(79, 70, 229, 0.25)",
              position: "relative",
              overflow: "hidden"
            }}>
              <Box sx={{ position: "absolute", top: "-20%", right: "-10%", opacity: 0.1 }}>
                <Inventory sx={{ fontSize: 150 }} />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1, position: "relative", zIndex: 1 }}>
                <Inventory sx={{ fontSize: 40, mr: 2, color: "#E0E7FF" }} />
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, textShadow: "0 2px 10px rgba(0,0,0,0.2)" }}>
                    {items.length}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, color: "#E0E7FF" }}>Listed Items</Typography>
                </Box>
              </Box>
            </Paper>
          </motion.div>
        </Grid>
        
        <Grid item xs={12} md={4}>
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
        
        <Grid item xs={12} md={4}>
          <motion.div variants={itemVariants} whileHover={{ y: -8, transition: { duration: 0.2 } }}>
            <Paper sx={{ 
              p: 3, 
              background: "linear-gradient(135deg, #10b981 0%, #34d399 100%)", 
              color: "white",
              borderRadius: "20px",
              boxShadow: "0 20px 40px rgba(16, 185, 129, 0.25)",
              position: "relative",
              overflow: "hidden"
            }}>
              <Box sx={{ position: "absolute", top: "-20%", right: "-10%", opacity: 0.1 }}>
                <TrendingUp sx={{ fontSize: 150 }} />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1, position: "relative", zIndex: 1 }}>
                <TrendingUp sx={{ fontSize: 40, mr: 2, color: "#D1FAE5" }} />
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, textShadow: "0 2px 10px rgba(0,0,0,0.2)" }}>
                    ₹{earnings}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, color: "#D1FAE5" }}>Total Earnings</Typography>
                </Box>
              </Box>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>

      {/* Listed Items */}
      <motion.div variants={itemVariants}>
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: "#1e293b" }}>
              My Listed Items
            </Typography>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                component={Link} 
                to="/owner/add-item" 
                variant="contained"
                sx={{ 
                  borderRadius: "12px", 
                  px: 3, 
                  py: 1,
                  background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                  boxShadow: "0 8px 20px rgba(59, 130, 246, 0.3)",
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": {
                    boxShadow: "0 12px 25px rgba(59, 130, 246, 0.5)",
                  }
                }}
              >
                Add New Item
              </Button>
            </motion.div>
          </Box>

          <Grid container spacing={3}>
            {items.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={item._id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  style={{ height: "100%" }}
                >
                  <Card sx={{ 
                    height: "100%", 
                    display: "flex", 
                    flexDirection: "column", 
                    borderRadius: "20px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                    transition: "box-shadow 0.3s",
                    "&:hover": { boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }
                  }}>
                    <CardMedia component="img" height="180" image={item.image} alt={item.name} sx={{ objectFit: "cover" }} />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 700, color: "#0f172a" }}>
                        {item.name}
                      </Typography>
                      <Chip label={item.category} size="small" sx={{ mb: 2, bgcolor: "#f1f5f9", color: "#475569", fontWeight: 600 }} />
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 800 }}>
                        ₹{item.pricePerDay}/day
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ p: 2, pt: 0, justifyContent: "space-between" }}>
                      <IconButton component={Link} to={`/owner/edit-item/${item._id}`} color="primary" sx={{ bgcolor: "#eff6ff", "&:hover": { bgcolor: "#dbeafe" } }}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(item._id)} color="error" sx={{ bgcolor: "#fef2f2", "&:hover": { bgcolor: "#fee2e2" } }}>
                        <Delete />
                      </IconButton>
                    </CardActions>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {items.length === 0 && (
            <Paper sx={{ p: 6, textAlign: "center", borderRadius: "24px", bgcolor: "white", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
              <Inventory sx={{ fontSize: 60, color: "grey.300", mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                You haven't listed any items yet
              </Typography>
              <Button component={Link} to="/owner/add-item" variant="contained" sx={{ 
                  borderRadius: "12px", 
                  px: 4, 
                  py: 1.5,
                  background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                  boxShadow: "0 8px 20px rgba(59, 130, 246, 0.3)",
                  textTransform: "none",
                  fontWeight: 600
              }}>
                Add Your First Item
              </Button>
            </Paper>
          )}
        </Box>
      </motion.div>

      {/* Bookings Received */}
      <motion.div variants={itemVariants}>
        <Box>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: "#1e293b" }}>
            Recent Bookings
          </Typography>
          {bookings.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: "center", borderRadius: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
              <BookOnline sx={{ fontSize: 60, color: "grey.300", mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No bookings received yet
              </Typography>
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
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking._id} hover sx={{ transition: "background-color 0.2s" }}>
                      <TableCell sx={{ fontWeight: 600 }}>{(booking as any).item?.name || "N/A"}</TableCell>
                      <TableCell>{new Date(booking.startDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(booking.endDate).toLocaleDateString()}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#059669" }}>₹{(booking as any).totalPrice}</TableCell>
                    <TableCell>
                      <Chip
                        label={booking.status}
                        color={
                          booking.status === "completed" ? "success" : 
                          booking.status === "confirmed" ? "info" : 
                          booking.status === "cancelled" ? "error" : "warning"
                        }
                        size="small"
                        sx={{ textTransform: "capitalize", fontWeight: 600 }}
                      />
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                          {booking.status === "pending" && (
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                               <Button 
                                  size="small" 
                                  variant="contained" 
                                  sx={{ bgcolor: "#0ea5e9", color: "white", borderRadius: "8px", "&:hover": { bgcolor: "#0284c7" } }}
                                  onClick={() => handleStatusUpdate(booking._id, "confirmed")}
                               >
                                 Confirm
                               </Button>
                            </motion.div>
                          )}
                          {booking.status === "confirmed" && (
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button 
                                    size="small" 
                                    variant="contained" 
                                    sx={{ bgcolor: "#10b981", color: "white", borderRadius: "8px", "&:hover": { bgcolor: "#059669" } }}
                                    onClick={() => handleStatusUpdate(booking._id, "completed")}
                                >
                                    Complete
                                </Button>
                              </motion.div>
                          )}
                          {(booking.status === "pending" || booking.status === "confirmed") && (
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button 
                                    size="small" 
                                    variant="outlined" 
                                    color="error"
                                    sx={{ borderRadius: "8px" }}
                                    onClick={() => handleStatusUpdate(booking._id, "cancelled")}
                                >
                                    Cancel
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
    </Box>
  );
}
