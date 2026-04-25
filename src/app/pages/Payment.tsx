import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Divider,
} from "@mui/material";
import { Payment as PaymentIcon, CheckCircle, Download } from "@mui/icons-material";
import { generateReceipt } from "../utils/receiptGenerator";
import { useAuth } from "../context/AuthContext";
import confetti from "canvas-confetti";

export interface Booking {
  _id: string;
  item: {
    _id: string;
    name: string;
    image: string;
    category: string;
    pricePerDay: number;
  };
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
}

export function Payment() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/payment/config")
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error("Failed to fetch payment config", err));
  }, []);

  useEffect(() => {
    if (bookingId) {
      const fetchBooking = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          const data = await res.json();
          console.log("Fetched booking data:", data);

          if (res.ok) {
            setBooking(data);
          } else {
            setError(data.message || "Booking not found");
          }
        } catch (err) {
          console.error("Error fetching booking:", err);
          setError("Failed to connect to the server");
        } finally {
          setLoading(false);
        }
      };
      
      fetchBooking();
    }
  }, [bookingId]);

  const handlePayment = async () => {
    if (!booking) return;

    setProcessing(true);
    console.log("Attempting payment for booking:", booking._id);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/payment/confirm/${booking._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });

      const data = await res.json();
      console.log("Payment update response:", data);

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/renter/dashboard");
        }, 3000);
      } else {
        alert(`Payment failed: ${data.message}`);
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert("Something went wrong during payment processing.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h5">Loading booking details...</Typography>
      </Box>
    );
  }

  if (error || !booking) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>{error || "Booking not found"}</Typography>
        <Button onClick={() => navigate("/")} variant="outlined">Back to Home</Button>
      </Box>
    );
  }

  if (success) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", textAlign: "center", py: 8 }}>
        <CheckCircle sx={{ fontSize: 80, color: "success.main", mb: 3 }} />
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          Payment Successful!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Your booking has been confirmed. Redirecting to dashboard...
        </Typography>
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Booking Details
          </Typography>
          <Typography variant="body2">Item: {booking.item?.name}</Typography>
          <Typography variant="body2">
            Dates: {new Date(booking.startDate).toLocaleString()} - {new Date(booking.endDate).toLocaleString()}
          </Typography>
          <Typography variant="body2">Amount Paid: ₹{booking.totalAmount}</Typography>
        </Alert>

        <Button
            variant="contained"
            color="secondary"
            startIcon={<Download />}
            onClick={() => generateReceipt(booking, user?.name || "Customer")}
            sx={{ borderRadius: "12px", px: 4 }}
        >
            Download Receipt
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <PaymentIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Complete Payment
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Secure payment for your rental booking
            </Typography>
          </Box>

          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Booking Summary
            </Typography>
            <Typography variant="body2">Item: {booking.item?.name}</Typography>
            <Typography variant="body2">
              Dates: {new Date(booking.startDate).toLocaleString()} - {new Date(booking.endDate).toLocaleString()}
            </Typography>
            <Typography variant="h6" sx={{ mt: 1, fontWeight: 700 }}>
              Total Amount: ₹{booking.totalAmount}
            </Typography>
          </Alert>

          <Divider sx={{ my: 3 }} />

          <FormLabel component="legend" sx={{ mb: 2 }}>
            Select Payment Method
          </FormLabel>
          <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} sx={{ mb: 3 }}>
            <FormControlLabel value="upi" control={<Radio />} label="UPI (Google Pay, PhonePe, Paytm)" />
            <FormControlLabel value="card" control={<Radio />} label="Credit/Debit Card" />
            <FormControlLabel value="netbanking" control={<Radio />} label="Net Banking" />
            <FormControlLabel value="wallet" control={<Radio />} label="Wallet" />
          </RadioGroup>

          {paymentMethod === "upi" && config && (
            <Box sx={{ p: 3, border: "1px solid", borderColor: "grey.300", borderRadius: "12px", textAlign: "center", bgcolor: "grey.50", mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2, color: "#1a1a1a" }}>Scan to pay with any UPI app</Typography>
              <Box sx={{ display: 'inline-block', p: 2, bgcolor: 'white', borderRadius: '16px', boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}>
                <img 
                  src={config.qrImage || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${config.upiId}%26pn=RentIt%26am=${booking.totalAmount}%26cu=INR`} 
                  alt="UPI QR Code" 
                  style={{ width: "200px", height: "200px", display: "block" }}
                />
              </Box>
              <Typography variant="body1" sx={{ mt: 2, color: "text.secondary", fontWeight: 500 }}>
                UPI ID: {config.upiId}
              </Typography>
            </Box>
          )}

          {paymentMethod === "card" && (
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12}>
                <TextField fullWidth label="Card Number" placeholder="1234 5678 9012 3456" />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Expiry Date" placeholder="MM/YY" />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="CVV" placeholder="123" type="password" />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Cardholder Name" placeholder="Name on card" />
              </Grid>
            </Grid>
          )}

          <Alert severity="warning" sx={{ mb: 3 }}>
            This is a functional presentation element. Scanning the QR code above via GPay/PhonePe will accurately initiate a real commercial payment tracking the explicit INR amount mapped to PRITI Pathak constraints.
          </Alert>

          <Button
            variant="contained"
            color="success"
            fullWidth
            size="large"
            onClick={handlePayment}
            disabled={processing}
            sx={{ fontWeight: "bold", fontSize: "1.1rem", py: 1.5 }}
          >
            {processing ? "Processing..." : `I Have Paid ₹${booking.totalAmount}`}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
