import { useState, useEffect } from "react";
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, CircularProgress, Grid 
} from "@mui/material";
import { TrendingUp, Inventory, Storefront } from "@mui/icons-material";
import { api } from "../api";
import { Booking } from "./Payment";

export function OwnerOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Stats
  const [earnings, setEarnings] = useState(0);
  const [activeRentals, setActiveRentals] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/bookings/owner-bookings", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();

        if (res.ok) {
            setOrders(data);
            
            // Calculate stats
            const totalEarnings = data
                .filter((b: any) => b.paymentStatus === "paid" || b.status === "completed")
                .reduce((sum: number, b: any) => sum + (b.totalPrice || b.totalAmount || 0), 0);
            
            const activeCount = data.filter((b: any) => b.status === "confirmed" || b.status === "pending").length;
            
            setEarnings(totalEarnings);
            setActiveRentals(activeCount);
        } else {
            setError(data.message || "Failed to fetch orders");
        }
      } catch (err) {
        setError("Network error connecting to platform");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", mt: 6, mb: 10 }}>
      {/* Stats Cards Header */}
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, color: "#2D3A8D" }}>
          Sales & Orders Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", color: "white", borderRadius: "16px" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Storefront sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>{orders.length}</Typography>
                <Typography variant="body1">Total Orders</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", color: "white", borderRadius: "16px" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Inventory sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>{activeRentals}</Typography>
                <Typography variant="body1">Active Rentals</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", borderRadius: "16px" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <TrendingUp sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>₹{earnings}</Typography>
                <Typography variant="body1">Total Earnings</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Table Section */}
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Recent Orders Received</Typography>
      
      {error && <Typography color="error" sx={{ mb: 3 }}>{error}</Typography>}

      {orders.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: "center", borderRadius: "16px" }}>
              <Typography variant="h6" color="text.secondary">No orders received yet.</Typography>
          </Paper>
      ) : (
          <TableContainer component={Paper} sx={{ borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
            <Table>
              <TableHead sx={{ bgcolor: "#f8f9fa" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Item</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Renter</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Start Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>End Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order: any) => (
                  <TableRow key={order._id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{(order as any).item?.name || "N/A"}</TableCell>
                    <TableCell>{(order as any).user?.name || "Deleted User"}</TableCell>
                    <TableCell>{new Date(order.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(order.endDate).toLocaleDateString()}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "primary.main" }}>₹{order.totalPrice || order.totalAmount}</TableCell>
                    <TableCell>
                      <Chip 
                        label={order.status} 
                        color={order.status === "completed" ? "success" : order.status === "cancelled" ? "error" : "info"} 
                        size="small" 
                        sx={{ textTransform: "capitalize", fontWeight: 600 }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
      )}
    </Box>
  );
}
