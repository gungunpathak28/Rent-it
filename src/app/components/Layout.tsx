import { useState, useEffect } from "react";
import logo from "../../assets/lo.png";
import { Outlet, Link, useNavigate, useLocation, useSearchParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Fab,
  Drawer,
  TextField,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import {
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  Add as AddIcon,
  ExitToApp,
  Login,
  LocationOn,
  Search,
  Category,
  ShoppingCart,
  WhatsApp,
  Person,
  KeyboardArrowDown,
  CalendarToday,
  ReceiptLong,
} from "@mui/icons-material";
import { DateSelectionDialog } from "./DateSelectionDialog";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { CITIES } from "../utils/constants";
import Chatbot from "./Chatbot";

export function Layout() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [locationAnchorEl, setLocationAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCity, setSelectedCity] = useState("Mumbai");
  const [dateDialogOpen, setDateDialogOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const handleLogout = () => {
    logout();
    setAnchorEl(null);
    navigate("/");
  };

  const handleProfileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLocationMenu = (event: React.MouseEvent<HTMLElement>) => {
    setLocationAnchorEl(event.currentTarget);
  };

  const isItemPage = location.pathname.startsWith("/item/");

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "#F8F9FA" }}>
      {/* Top Navbar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "white",
          color: "text.primary",
          borderBottom: "1px solid",
          borderColor: "grey.100",
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ px: { xs: 0, sm: 2 }, py: 1, gap: 2 }}>
            <Box
              component={Link}
              to="/"
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: "inherit",
                mr: 2
              }}
            >
              <img src={logo} alt="logo" style={{ width: "40px", height: "40px", borderRadius: "10px" }} />
              <Typography variant="h6" sx={{ fontWeight: 800, ml: 1, color: "#2D3A8D", display: { xs: "none", sm: "block" } }}>
                RentIt
              </Typography>
            </Box>

            {/* Location Selector */}
            <Button
              onClick={handleLocationMenu}
              startIcon={<LocationOn color="primary" />}
              endIcon={<KeyboardArrowDown sx={{ fontSize: 16 }} />}
              sx={{
                color: "text.primary",
                fontWeight: 600,
                textTransform: "none",
                bgcolor: "grey.50",
                px: 2,
                borderRadius: "12px",
                display: { xs: "none", md: "flex" }
              }}
            >
              {selectedCity}
            </Button>
            <Menu
              anchorEl={locationAnchorEl}
              open={Boolean(locationAnchorEl)}
              onClose={() => setLocationAnchorEl(null)}
            >
              {CITIES.map((city) => (
                <MenuItem key={city} onClick={() => { setSelectedCity(city); setLocationAnchorEl(null); }}>
                  {city}
                </MenuItem>
              ))}
            </Menu>

            {/* Desktop Search Bar */}
            <Box sx={{ flexGrow: 1, maxWidth: 500, display: { xs: "none", md: "block" } }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search items to rent..."
                variant="outlined"
                value={searchParams.get("search") || ""}
                onChange={(e) => {
                  const newParams = new URLSearchParams(searchParams);
                  if (e.target.value) newParams.set("search", e.target.value);
                  else newParams.delete("search");
                  setSearchParams(newParams);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") navigate(`/items?${searchParams.toString()}`);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: "grey.400" }} />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: "12px", bgcolor: "grey.50", "& fieldset": { borderColor: "transparent" } }
                }}
              />
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            {/* Desktop Actions */}
            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1 }}>
              {isAuthenticated ? (
                <>
                  <Button
                    variant="text"
                    component={Link}
                    to={user?.role === "owner" ? "/owner/dashboard" : "/renter/dashboard"}
                    sx={{ fontWeight: 600, textTransform: "none" }}
                  >
                    Dashboard
                  </Button>
                  <IconButton onClick={handleProfileMenu}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main", fontSize: "14px" }}>
                      {user?.name?.charAt(0) || "U"}
                    </Avatar>
                  </IconButton>
                </>
              ) : (
                <>
                  <Button component={Link} to="/login" sx={{ fontWeight: 600, textTransform: "none" }}>Log In</Button>
                  <Button variant="contained" component={Link} to="/signup" sx={{ borderRadius: "12px", px: 3, textTransform: "none", fontWeight: 700 }}>Sign Up</Button>
                </>
              )}
            </Box>

            {/* Mobile Location Selector (Small Icons) */}
            <IconButton onClick={handleLocationMenu} sx={{ display: { xs: "flex", md: "none" } }}>
              <LocationOn color="primary" />
            </IconButton>
            <IconButton sx={{ display: { xs: "flex", md: "none" } }}>
              <Search />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: { mt: 1.5, minWidth: 200, borderRadius: "12px", boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }
        }}
      >
        <MenuItem onClick={() => { setAnchorEl(null); navigate("/profile"); }}>
            <Person sx={{ mr: 2, color: "text.secondary" }} fontSize="small" /> View Profile
        </MenuItem>
        
        {user?.role === "admin" && (
            <MenuItem onClick={() => { setAnchorEl(null); navigate("/admin/dashboard"); }}>
                <DashboardIcon sx={{ mr: 2, color: "error.main" }} fontSize="small" /> Admin Panel
            </MenuItem>
        )}

        {user?.role !== "admin" && (
            <MenuItem onClick={() => { setAnchorEl(null); navigate(user?.role === "owner" ? "/owner/dashboard" : "/renter/dashboard"); }}>
                <DashboardIcon sx={{ mr: 2, color: "text.secondary" }} fontSize="small" /> Dashboard
            </MenuItem>
        )}

        {user?.role === "owner" && (
            <MenuItem onClick={() => { setAnchorEl(null); navigate("/owner/dashboard"); }}>
                <Category sx={{ mr: 2, color: "text.secondary" }} fontSize="small" /> My Items
            </MenuItem>
        )}

        {user?.role === "owner" && (
            <MenuItem onClick={() => { setAnchorEl(null); navigate("/owner/orders"); }}>
                <ReceiptLong sx={{ mr: 2, color: "text.secondary" }} fontSize="small" /> Orders Received
            </MenuItem>
        )}

        {user?.role === "renter" && (
            <MenuItem onClick={() => { setAnchorEl(null); navigate("/billing"); }}>
                <ReceiptLong sx={{ mr: 2, color: "text.secondary" }} fontSize="small" /> Billing History
            </MenuItem>
        )}

        {user?.role === "renter" && (
            <MenuItem onClick={() => { setAnchorEl(null); navigate("/cart"); }}>
                <ShoppingCart sx={{ mr: 2, color: "text.secondary" }} fontSize="small" /> My Cart
            </MenuItem>
        )}
        
        <MenuItem onClick={handleLogout} sx={{ color: "error.main", mt: 1, borderTop: "1px solid #f0f0f0" }}>
            <ExitToApp sx={{ mr: 2 }} fontSize="small" /> Logout
        </MenuItem>
      </Menu>

      {/* Floating Buttons */}
      <Chatbot />

      <Tooltip title="Chat on WhatsApp" placement="right" arrow>
        <Fab
          color="success"
          aria-label="whatsapp"
          sx={{
            position: "fixed",
            bottom: { xs: 80, md: 32 },
            left: 32,
            bgcolor: "#25D366",
            "&:hover": { bgcolor: "#128C7E", transform: "scale(1.1)" },
            zIndex: 1000,
            transition: "all 0.3s"
          }}
          href={`https://wa.me/919999999999?text=${encodeURIComponent(
            isItemPage
              ? "Hi, I am interested in renting an item I saw on RentIt."
              : "Hi, I have a general query about RentIt services."
          )}`}
          target="_blank"
        >
          <WhatsApp />
        </Fab>
      </Tooltip>

      {/* Main Content */}
      <Box sx={{ flex: 1, pb: { xs: 20, md: 12 } }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Outlet />
        </Container>
      </Box>

      {/* Sticky Bottom Date Selection Bar */}
      <Paper
        elevation={10}
        sx={{
          position: "fixed",
          bottom: { xs: 56, md: 0 },
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          p: 2,
          zIndex: 1000,
          borderTop: "1px solid",
          borderColor: "grey.100",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(8px)"
        }}
      >
        <Button
          fullWidth={false}
          variant="contained"
          startIcon={<CalendarToday />}
          onClick={() => setDateDialogOpen(true)}
          sx={{
            borderRadius: "20px",
            px: { xs: 4, sm: 8 },
            py: 1.5,
            fontWeight: 700,
            textTransform: "none",
            bgcolor: "#000",
            border: "2px solid #2D3A8D",
            "&:hover": { bgcolor: "#222" }
          }}
        >
          {dateRange?.from ? (
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {format(dateRange.from, "MMM dd")} – {dateRange.to ? format(dateRange.to, "MMM dd") : "..."}
              </Typography>
              {dateRange.to && (
                <Typography variant="caption" sx={{ color: "primary.main", display: "block", fontWeight: 700 }}>
                  Return by: {format(dateRange.to, "p")}
                </Typography>
              )}
            </Box>
          ) : (
            "Select rental dates to view prices"
          )}
        </Button>
      </Paper>

      {/* Mobile Bottom Navigation */}
      <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0, display: { md: "none" }, zIndex: 1100 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={location.pathname}
          sx={{ height: 64, borderTop: "1px solid", borderColor: "grey.100" }}
        >
          <BottomNavigationAction component={Link} to="/" value="/" label="Home" icon={<HomeIcon />} />
          <BottomNavigationAction label="Category" icon={<Category />} />
          <BottomNavigationAction label="Search" icon={<Search />} />
          <BottomNavigationAction label="Cart" icon={<ShoppingCart />} />
        </BottomNavigation>
      </Paper>

      <DateSelectionDialog
        open={dateDialogOpen}
        onClose={() => setDateDialogOpen(false)}
        onSelect={setDateRange}
        initialRange={dateRange}
      />
    </Box>
  );
}