import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { 
  Box, Typography, Paper, Grid, Button, IconButton, CircularProgress, Alert, Divider
} from "@mui/material";
import { Delete, ShoppingCart, Payment } from "@mui/icons-material";
import { api } from "../api";

export function Cart() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const data = await api("/api/cart");
      setCart(data);
    } catch (err: any) {
      setError("Failed to load your cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (itemId: string) => {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/cart/remove", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ itemId })
        });
        if (res.ok) {
            const data = await res.json();
            setCart(data);
        }
    } catch (err) {
        console.error("Cart removal failed", err);
    }
  };

  const calculateTotal = () => {
      if (!cart || !cart.items) return 0;
      return cart.items.reduce((sum: number, itemObj: any) => {
          return sum + (itemObj.itemId?.pricePerDay || 0) * (itemObj.quantity || 1);
      }, 0);
  };

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) return;
    setCheckoutLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      // We loop through the cart block simulating exact checkout paths mapped earlier
      for (const itemObj of cart.items) {
          const start = new Date();
          const end = new Date(start.getTime() + (itemObj.quantity || 1) * 24 * 60 * 60 * 1000);
          
          const payload = {
              itemId: itemObj.itemId._id,
              startDate: start.toISOString(),
              endDate: end.toISOString(),
              totalAmount: itemObj.itemId.pricePerDay * (itemObj.quantity || 1)
          };
          
          const res = await fetch("http://localhost:5000/api/bookings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
          });
          
          if (!res.ok) throw new Error("A booking request failed");
          
          // clear from cart dynamically
          await fetch("http://localhost:5000/api/cart/remove", {
            method: "DELETE",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ itemId: itemObj.itemId._id })
          });
      }
      
      alert("All items checked out successfully! Redirecting to Dashboard.");
      navigate("/renter/dashboard");
      
    } catch (err: any) {
        setError(err.message || "Checkout failed. Some items may be unavailable.");
    } finally {
        setCheckoutLoading(false);
    }
  };

  if (loading) {
    return <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 6 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, display: 'flex', alignItems: 'center' }}>
          <ShoppingCart sx={{ mr: 2, fontSize: 36 }} /> My Cart
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {(!cart || !cart.items || cart.items.length === 0) ? (
          <Paper sx={{ p: 6, textAlign: "center", borderRadius: "16px" }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>Your cart is empty.</Typography>
              <Button component={Link} to="/" variant="contained">Browse Items</Button>
          </Paper>
      ) : (
          <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                  {cart.items.map((itemObj: any) => (
                      <Paper key={itemObj._id} sx={{ p: 3, mb: 3, borderRadius: "12px", display: "flex", gap: 3, alignItems: "center" }}>
                          <Box 
                            component="img" 
                            src={itemObj.itemId?.image || "https://via.placeholder.com/150"} 
                            sx={{ width: 100, height: 100, objectFit: "cover", borderRadius: "8px" }} 
                          />
                          <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: 700 }}>{itemObj.itemId?.name || "Item Unavailable"}</Typography>
                              <Typography variant="body2" color="text.secondary">₹{itemObj.itemId?.pricePerDay}/day</Typography>
                              <Typography variant="body2" color="primary" sx={{ mt: 1, fontWeight: 600 }}>
                                  Duration: {itemObj.quantity} Day(s) = ₹{(itemObj.itemId?.pricePerDay || 0) * (itemObj.quantity || 1)}
                              </Typography>
                          </Box>
                          <IconButton color="error" onClick={() => handleRemove(itemObj.itemId?._id)}>
                              <Delete />
                          </IconButton>
                      </Paper>
                  ))}
              </Grid>
              <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 4, borderRadius: "16px", bgcolor: "#f8f9fa", position: 'sticky', top: 100 }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Order Summary</Typography>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                          <Typography>Total Items</Typography>
                          <Typography sx={{ fontWeight: 600 }}>{cart.items.length}</Typography>
                      </Box>
                      <Divider sx={{ my: 2 }} />
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
                          <Typography variant="h6">Total Amount</Typography>
                          <Typography variant="h6" color="primary" sx={{ fontWeight: 800 }}>₹{calculateTotal()}</Typography>
                      </Box>
                      <Button 
                          fullWidth 
                          variant="contained" 
                          size="large" 
                          startIcon={<Payment />}
                          onClick={handleCheckout}
                          disabled={checkoutLoading}
                          sx={{ py: 1.5, borderRadius: "30px", fontWeight: 700 }}
                      >
                          {checkoutLoading ? "Processing..." : "Checkout All"}
                      </Button>
                  </Paper>
              </Grid>
          </Grid>
      )}
    </Box>
  );
}
