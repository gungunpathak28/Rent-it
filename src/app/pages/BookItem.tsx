import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Divider,
  Chip,
} from "@mui/material";
import { CalendarToday, Payment } from "@mui/icons-material";
import { Item } from "./Home";

export function BookItem() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [startDate, setStartDate] = useState("");
  const [days, setDays] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [isInsured, setIsInsured] = useState(false);
  const INSURANCE_FEE_PER_DAY = 150;
  const [totalAmount, setTotalAmount] = useState(0);
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (id) {
      const fetchItem = async () => {
        try {
          const itemData = await api(`/api/items/${id}`);
          setItem(itemData);
        } catch (error) {
          console.error("Error fetching item:", error);
        }
      };
      fetchItem();
    }
  }, [id]);

  const calculateEndDate = () => {
    if (!startDate || !days) return "";
    const start = new Date(startDate);
    const end = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);
    return end.toLocaleString();
  };

  const getDiscount = () => {
    if (days >= 7) return 50;
    if (days >= 3) return 20;
    return 0;
  };

  const getFinalPrice = () => {
    const originalPrice = item?.pricePerDay || 0;
    const discount = getDiscount();
    return originalPrice - (originalPrice * discount) / 100;
  };

  useEffect(() => {
    if (startDate && item && days > 0 && quantity > 0) {
      const start = new Date(startDate);
      const end = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);
      setEndDate(end.toISOString());
      
      const finalPrice = getFinalPrice();
      const baseTotal = days * finalPrice * quantity;
      const insuranceTotal = isInsured ? (days * INSURANCE_FEE_PER_DAY) : 0;
      setTotalAmount(baseTotal + insuranceTotal);
    }
  }, [startDate, days, quantity, item, isInsured]);

  const handleBooking = async () => {
    if (!user || !item || !startDate || !days) return;

    try {
      const payload = {
        itemId: id,
        startDate: startDate,
        endDate: new Date(new Date(startDate).getTime() + days * 24 * 60 * 60 * 1000),
        totalAmount: totalAmount,
        quantity: quantity,
        isInsured: isInsured
      };

      const token = localStorage.getItem("token");

      console.log("BOOKING PAYLOAD:", payload);
      console.log("TOKEN:", token);

      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      alert("Booking successfully staged! Redirecting to payment gateway...");
      navigate(`/renter/payment/${data._id}`);
      
    } catch (err: any) {
      console.error("Error creating booking", err);
      alert("Booking failed: " + err.message);
    }
  };

  if (!item) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h5">Item not found</Typography>
      </Box>
    );
  }

  const getLocalNow = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };
  const today = getLocalNow();

  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <CalendarToday sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Book Item
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Select your rental dates
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              {item.name}
              {days >= 7 && <Chip label="🔥 Best Deal (7 days)" color="success" size="small" sx={{ ml: 2, fontWeight: 700 }} />}
              {days >= 3 && days < 7 && <Chip label="🎉 Save More (3 days)" color="warning" size="small" sx={{ ml: 2, fontWeight: 700 }} />}
            </Typography>
            <Typography variant="h5" color="primary" sx={{ fontWeight: 700 }}>
              ₹{item.pricePerDay}/day
            </Typography>
            {item.availableQuantity === 0 ? (
              <Chip label="Out of Stock" color="error" sx={{ mt: 1 }} />
            ) : item.availableQuantity <= 2 ? (
              <Chip label={`Only ${item.availableQuantity} left`} color="warning" sx={{ mt: 1 }} />
            ) : null}
          </Box>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="datetime-local"
                label="Start Date & Time"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: today }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Duration (Days)"
                value={days}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setDays(val);
                  console.log("Duration:", val);
                }}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: 1 }}
                required
              />
              <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                <Button size="small" variant="outlined" onClick={() => setDays(3)}>3 Days</Button>
                <Button size="small" variant="outlined" onClick={() => setDays(7)}>7 Days</Button>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Return Date & Time"
                value={calculateEndDate()}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label={`Quantity (In Stock: ${item.availableQuantity})`}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: 1, max: item.availableQuantity }}
                required
                error={quantity > item.availableQuantity}
                helperText={quantity > item.availableQuantity ? "Quantity exceeds available stock" : ""}
              />
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3, p: 2, border: "1px solid", borderColor: "primary.light", borderRadius: "12px", bgcolor: "primary.50", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "primary.main", display: "flex", alignItems: "center", gap: 1 }}>
                🛡️ Add Accidental Damage Insurance
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Protect your rented equipment from physical damage.
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>₹{INSURANCE_FEE_PER_DAY}/day</Typography>
              <Button 
                variant={isInsured ? "contained" : "outlined"} 
                color="primary" 
                size="small" 
                onClick={() => setIsInsured(!isInsured)}
                sx={{ borderRadius: "8px", textTransform: "none", fontWeight: "bold" }}
              >
                {isInsured ? "Added" : "Add"}
              </Button>
            </Box>
          </Box>

            <Alert severity="info" sx={{ mt: 3, borderRadius: "15px" }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                Rental Summary
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Typography variant="body2">Duration: <b>{days} day{days > 1 ? "s" : ""}</b></Typography>
                <Typography variant="body2">Quantity: <b>{quantity}</b> items</Typography>
                <Typography variant="body2">
                    Price per day:{" "}
                    {days >= 3 ? (
                        <>
                            <span style={{ textDecoration: "line-through", color: "gray", marginRight: "8px" }}>
                                ₹{item.pricePerDay}
                            </span>
                            <span style={{ fontWeight: "bold", color: "green" }}>
                                ₹{getFinalPrice()}/day
                            </span>
                        </>
                    ) : (
                        <span>₹{item.pricePerDay}</span>
                    )}
                </Typography>
                {getDiscount() > 0 && (
                  <Typography variant="body2" sx={{ color: "orange", fontWeight: "bold" }}>
                    🎉 {days >= 7 ? "7 Days Offer (50%)" : "3 Days Offer (20%)"} Applied
                  </Typography>
                )}
                {isInsured && (
                  <Typography variant="body2" color="success.main">
                    Insurance: <b>₹{INSURANCE_FEE_PER_DAY * days}</b> (₹{INSURANCE_FEE_PER_DAY} × {days} days)
                  </Typography>
                )}
                <Typography variant="body2">
                  Return Time:{" "}
                  <b>{calculateEndDate() || "Select start date"}</b>
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: "primary.main", mt: 0.5 }}>
                        Total Amount: ₹{totalAmount}
                    </Typography>
                </Box>
              </Box>
            </Alert>

          <Button
            variant="contained"
            fullWidth
            size="large"
            sx={{ mt: 3 }}
            onClick={handleBooking}
            disabled={!startDate || days < 1 || quantity > item.availableQuantity || quantity < 1 || item.availableQuantity === 0}
            startIcon={<Payment />}
          >
            {item.availableQuantity === 0 ? "Out of Stock" : "Proceed to Payment"}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
