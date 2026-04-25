import { useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router";
import { api } from "../api";
import { 
  Box, 
  Typography, 
  Grid, 
  Container, 
  TextField, 
  MenuItem, 
  Paper, 
  InputAdornment, 
  Divider,
  Button
} from "@mui/material";
import { Search, LocationOn, FilterList, Star } from "@mui/icons-material";
import { ModernItemCard } from "../components/ModernItemCard";
import { CATEGORIES_DATA, CITIES } from "../utils/constants";
import { Item } from "./Home";

export function AllItems() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const location = searchParams.get("location") || "";

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        console.log("FILTER:", { search, category, location });
        let url = "http://localhost:5000/api/items?";

        if (search) url += `search=${search}&`;
        if (category) url += `category=${category}&`;
        if (location) url += `location=${location}&`;

        const res = await fetch(url);
        const data = await res.json();

        setItems(data);
      } catch (error) {
        console.error("Fetch failed:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();

    // Safety timeout: ensure loading screen clears even if API hangs
    const timer = setTimeout(() => {
        setLoading(false);
        console.log("Forced loading termination via safety timeout (AllItems)");
    }, 3000);

    return () => clearTimeout(timer);
  }, [search, category, location]);

  const handleFilterChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Sidebar Filters */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, borderRadius: "20px", position: "sticky", top: 100 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <FilterList sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Filters</Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700 }}>Search</Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Name or description..."
                value={search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment>,
                  sx: { borderRadius: "10px" }
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700 }}>Category</Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              >
                <MenuItem value="">All Categories</MenuItem>
                {CATEGORIES_DATA.map((cat) => (
                  <MenuItem key={cat.name} value={cat.name}>{cat.name}</MenuItem>
                ))}
              </TextField>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700 }}>Location</Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              >
                <MenuItem value="">All Locations</MenuItem>
                {CITIES.map((city) => (
                  <MenuItem key={city} value={city}>{city}</MenuItem>
                ))}
              </TextField>
            </Box>

            <Button 
              fullWidth 
              variant="outlined" 
              onClick={() => setSearchParams({})}
              sx={{ borderRadius: "10px", fontWeight: 700, textTransform: "none" }}
            >
              Clear All
            </Button>
          </Paper>
        </Grid>

        {/* Content Area */}
        <Grid item xs={12} md={9}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#2D3A8D", mb: 1 }}>
              {category || "All Items"}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {loading ? "Discovering items..." : `${items.length} gear found`}
            </Typography>
          </Box>

          {items.length > 0 ? (
            <Grid container spacing={3}>
              {items.map((item) => (
                <Grid item xs={12} sm={6} lg={4} key={item._id}>
                  <ModernItemCard item={item} />
                </Grid>
              ))}
            </Grid>
          ) : (
            !loading && (
              <Box sx={{ textAlign: "center", py: 10, bgcolor: "grey.50", borderRadius: "30px" }}>
                <Star sx={{ fontSize: 60, color: "grey.300", mb: 2 }} />
                <Typography variant="h6" sx={{ color: "text.secondary" }}>
                  No exact matches found. Showing available gear instead.
                </Typography>
                <Button sx={{ mt: 2, fontWeight: 700 }} onClick={() => setSearchParams({})}>
                  Clear All Filters
                </Button>
              </Box>
            )
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
