import { useState, useEffect } from "react";
import { 
  Box, Typography, Paper, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, CircularProgress, Alert
} from "@mui/material";
import { Delete, Security } from "@mui/icons-material";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

export function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);
  const [users, setUsers] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Redundant guard, layout should block this but just in case
    if (user?.role !== "admin") {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [usersRes, itemsRes, bookingsRes] = await Promise.all([
          fetch("http://localhost:5000/api/admin/users", { headers }),
          fetch("http://localhost:5000/api/admin/items", { headers }),
          fetch("http://localhost:5000/api/admin/bookings", { headers })
        ]);

        if (usersRes.ok) setUsers(await usersRes.json());
        if (itemsRes.ok) setItems(await itemsRes.json());
        if (bookingsRes.ok) setBookings(await bookingsRes.json());
      } catch (err: any) {
        setError("Network error loading admin matrix");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm("Suspend this user?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setUsers(users.map(u => u._id === id ? { ...u, isActive: false } : u));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm("Soft delete this item by emptying available stock?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/admin/items/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setItems(items.map(i => i._id === id ? { ...i, availableQuantity: 0 } : i));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", mt: 6, mb: 10 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, display: 'flex', alignItems: 'center' }}>
          <Security sx={{ mr: 2, fontSize: 36, color: "error.main" }} /> Security & Admin Sandbox
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Paper sx={{ mb: 4 }}>
        <Tabs value={tabIndex} onChange={(_, val) => setTabIndex(val)} variant="fullWidth">
          <Tab label="Network Users" />
          <Tab label="Global Inventory" />
          <Tab label="Global Ledger" />
        </Tabs>
      </Paper>

      {/* Users Tab */}
      {tabIndex === 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow><TableCell>Name</TableCell><TableCell>Email</TableCell><TableCell>Role</TableCell><TableCell>Status</TableCell><TableCell align="right">Actions</TableCell></TableRow>
            </TableHead>
            <TableBody>
              {users.map(u => (
                <TableRow key={u._id}>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell><Chip label={u.role} size="small" /></TableCell>
                  <TableCell>
                    <Chip label={u.isActive ? "Active" : "Suspended"} color={u.isActive ? "success" : "error"} size="small" />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton color="error" disabled={!u.isActive || u.role === "admin"} onClick={() => handleDeleteUser(u._id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Items Tab */}
      {tabIndex === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow><TableCell>Item Schema</TableCell><TableCell>Owner Node</TableCell><TableCell>Stock State</TableCell><TableCell align="right">Moderation</TableCell></TableRow>
            </TableHead>
            <TableBody>
              {items.map(i => (
                <TableRow key={i._id}>
                  <TableCell>{i.name}</TableCell>
                  <TableCell>{i.owner?.name}</TableCell>
                  <TableCell>
                    <Chip label={i.availableQuantity > 0 ? `${i.availableQuantity} in stock` : "Hidden / 0"} color={i.availableQuantity > 0 ? "info" : "default"} size="small" />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton color="error" disabled={i.availableQuantity <= 0} onClick={() => handleDeleteItem(i._id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Bookings Tab */}
      {tabIndex === 2 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow><TableCell>Tx ID</TableCell><TableCell>Item</TableCell><TableCell>User Matrix</TableCell><TableCell>Status Flag</TableCell></TableRow>
            </TableHead>
            <TableBody>
              {bookings.map(b => (
                <TableRow key={b._id}>
                  <TableCell>...{b._id.slice(-6)}</TableCell>
                  <TableCell>{b.item?.name}</TableCell>
                  <TableCell>{b.user?.name}</TableCell>
                  <TableCell><Chip label={b.status} size="small" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
