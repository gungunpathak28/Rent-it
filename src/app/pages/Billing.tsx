import { useState, useEffect } from "react";
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, CircularProgress
} from "@mui/material";
import { Download, ReceiptLong } from "@mui/icons-material";
import { api } from "../api";
import { Booking } from "./Payment";

export function Billing() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/orders/my-orders", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setOrders(data);
        } else {
          setError(data.message || "Failed to load billing history");
        }
      } catch (err: any) {
        setError("Network error loading billing data");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const downloadJsonReceipt = (order: any) => {
    const receiptData = {
      receiptId: `REC-${order._id.substring(0,8).toUpperCase()}`,
      user: order.userId || "Customer",
      item: order.itemId?.name || "Rental Item",
      amountPaid: order.amount,
      status: order.status,
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(receiptData, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${receiptData.receiptId}_Receipt.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", mt: 6, mb: 10 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, display: 'flex', alignItems: 'center' }}>
          <ReceiptLong sx={{ mr: 2, fontSize: 36 }} /> Billing & Receipts
      </Typography>
      
      {error && <Typography color="error" sx={{ mb: 3 }}>{error}</Typography>}

      {orders.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: "center", borderRadius: "16px" }}>
              <Typography variant="h6" color="text.secondary">No billing history found.</Typography>
          </Paper>
      ) : (
          <TableContainer component={Paper} sx={{ borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
            <Table>
              <TableHead sx={{ bgcolor: "#f8f9fa" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Transaction ID</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Item</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Receipt</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((o: any) => (
                  <TableRow key={o._id} hover>
                    <TableCell sx={{ fontFamily: "monospace" }}>#{o._id.substring(0,8).toUpperCase()}</TableCell>
                    <TableCell>{o.itemId?.name || "Item Deleted"}</TableCell>
                    <TableCell>{new Date(o.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>₹ {o.amount ? o.amount : "N/A"}</TableCell>
                    <TableCell>
                      <Chip 
                        label={o.status === "completed" || o.status === "paid" ? "Paid" : o.status} 
                        color={o.status === "completed" || o.status === "paid" ? "success" : "default"} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Download />}
                          onClick={() => downloadJsonReceipt(o)}
                          sx={{ borderRadius: "20px" }}
                      >
                          JSON
                      </Button>
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
