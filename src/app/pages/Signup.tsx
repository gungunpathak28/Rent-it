import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
} from "@mui/material";
import { PersonAdd } from "@mui/icons-material";

export function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState<"owner" | "renter">("renter");
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    console.log("🔥 Signup button clicked"); // ✅ ADD

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    console.log("📤 Sending data:", { name, email, password, role, phoneNumber }); // ✅ ADD

    const result = await signup(name, email, password, role, phoneNumber);

    console.log("📥 Response:", result); // ✅ ADD

    if (result.success) {
      navigate("/");
    } else {
      setError(result.error || "Signup failed");
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
      <Card sx={{ maxWidth: 500, width: "100%" }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <PersonAdd sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Create Account
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Join RentIt and start renting today
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              helperText="Minimum 6 characters"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              placeholder="e.g. 919999999999"
              sx={{ mb: 3 }}
            />

            <FormLabel component="legend" sx={{ mb: 1 }}>
              I want to:
            </FormLabel>
            <RadioGroup value={role} onChange={(e) => setRole(e.target.value as "owner" | "renter")} sx={{ mb: 3 }}>
              <FormControlLabel value="renter" control={<Radio />} label="Rent items (Renter)" />
              <FormControlLabel value="owner" control={<Radio />} label="List my items for rent (Owner)" />
            </RadioGroup>

            <Button type="submit" variant="contained" fullWidth size="large">
              Sign Up
            </Button>
          </form>

          <Typography variant="body2" sx={{ mt: 3, textAlign: "center" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#667eea", textDecoration: "none", fontWeight: 600 }}>
              Login
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}