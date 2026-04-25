import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  MenuItem,
  Grid,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import TrackingMap from "../components/TrackingMap";

import { CITIES } from "../utils/constants";

const categories = [
  "Trekking Gear",
  "Cameras",
  "Gaming Consoles",
  "Riding Gear",
  "Action Cameras",
  "Musical Instruments",
  "Electronics",
  "Home Appliances",
  "Tools",
  "Other"
];

const conditions = ["New", "Like New", "Good", "Fair"];

export function AddItem() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    category: "Other",
    condition: "Good",
    pricePerDay: "",
    location: "Delhi",
    image: "",
    description: "",
    quantity: "1"
  });
  
  const [locationCoords, setLocationCoords] = useState<{ lat: number | null; lng: number | null }>({
    lat: null,
    lng: null
  });

  const [priceAnalysis, setPriceAnalysis] = useState<any>(null);

  const checkPrice = async (priceVal: string, catVal: string) => {
    if (!priceVal || !catVal) return;
    try {
      const res = await fetch("http://localhost:5000/api/ai/analyze-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: priceVal, category: catVal })
      });
      const data = await res.json();
      setPriceAnalysis(data);
    } catch (err) {
      console.error(err);
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      },
      (err) => {
        alert("Location access denied or unavailable.");
      }
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    try {
      const token = localStorage.getItem("token");
      console.log("Token retrieved in AddItem:", token);
      
      if (!token) {
        alert("Please login again");
        return;
      }

      const res = await fetch("http://localhost:5000/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          condition: formData.condition,
          pricePerDay: Number(formData.pricePerDay),
          location: formData.location,
          image: formData.image,
          description: formData.description,
          quantity: Number(formData.quantity),
          locationCoords: locationCoords.lat !== null ? locationCoords : undefined
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(`Failed to add item: ${errorData.message}`);
        return;
      }

      alert("Item added successfully!");
      navigate("/owner/dashboard");
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Failed to connect to the server.");
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Add sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Add New Item
            </Typography>
            <Typography variant="body1" color="text.secondary">
              List your item for rent and start earning
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Item Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  required
                >
                  {conditions.map((cond) => (
                    <MenuItem key={cond} value={cond}>
                      {cond}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Price Per Day (₹)"
                  name="pricePerDay"
                  value={formData.pricePerDay}
                  required
                  onChange={async (e) => {
                    const value = e.target.value;
                    setFormData({ ...formData, pricePerDay: value });

                    if (!value || !formData.category) return;

                    try {
                      const res = await fetch("http://localhost:5000/api/ai/analyze-price", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                          price: Number(value),
                          category: formData.category
                        })
                      });

                      const data = await res.json();
                      console.log("AI RESULT:", data);

                      setPriceAnalysis(data);
                    } catch (err) {
                      console.error("AI error:", err);
                    }
                  }}
                />
                
                {priceAnalysis && (
                  <div style={{ marginTop: "10px" }}>
                    
                    {priceAnalysis.status === "HIGH" && (
                      <p style={{ color: "red", margin: "5px 0", fontWeight: "bold" }}>
                        ❌ Price too high (AI suggests ₹{priceAnalysis.suggestedPrice})
                      </p>
                    )}

                    {priceAnalysis.status === "LOW" && (
                      <p style={{ color: "blue", margin: "5px 0", fontWeight: "bold" }}>
                        ⚠ Price too low (AI suggests ₹{priceAnalysis.suggestedPrice})
                      </p>
                    )}

                    {priceAnalysis.status === "FAIR" && (
                      <p style={{ color: "green", margin: "5px 0", fontWeight: "bold" }}>
                        ✅ Perfect price (AI Approved)
                      </p>
                    )}

                  </div>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Total Quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  InputProps={{ inputProps: { min: 1 } }}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                >
                  {CITIES.map((city) => (
                    <MenuItem key={city} value={city}>
                      {city}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  Live Location Tracking
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    size="small" 
                    onClick={getLocation}
                    sx={{ textTransform: "none", borderRadius: "20px" }}
                  >
                    📍 Use Current Location
                  </Button>
                </Typography>
                
                {locationCoords.lat && (
                  <Box sx={{ mt: 1, mb: 2, display: "flex", gap: 2 }}>
                    <Typography variant="caption" sx={{ color: "success.main", fontWeight: "bold" }}>
                      📍 Exact Location Available
                    </Typography>
                    <Typography variant="caption" sx={{ color: "success.main", fontWeight: "bold" }}>
                      ✔ Real-time location used
                    </Typography>
                  </Box>
                )}

                <Box sx={{ 
                  height: "300px", 
                  width: "100%", 
                  borderRadius: "10px", 
                  overflow: "hidden", 
                  border: "1px solid", 
                  borderColor: "grey.300",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "grey.50"
                }}>
                  <TrackingMap 
                    lat={locationCoords.lat || 28.6139} 
                    lng={locationCoords.lng || 77.2090} 
                  />
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Item Image
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={8}>
                    <TextField
                      fullWidth
                      label="Image URL"
                      name="image"
                      value={formData.image.startsWith("data:image") ? "Uploaded File" : formData.image}
                      onChange={handleChange}
                      disabled={formData.image.startsWith("data:image")}
                      helperText="Paste a URL or upload an image file"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      sx={{ height: "56px" }}
                    >
                      Upload File
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </Button>
                  </Grid>
                </Grid>
                {formData.image && (
                  <Box sx={{ mt: 2, textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Image Preview
                    </Typography>
                    <Box
                      component="img"
                      src={formData.image}
                      alt="Preview"
                      sx={{
                        maxWidth: "100%",
                        maxHeight: 200,
                        borderRadius: 1,
                        boxShadow: 1,
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                )}
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <Button type="submit" variant="contained" fullWidth size="large">
                  Add Item
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
