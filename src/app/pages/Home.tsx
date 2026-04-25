import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router";
import { api } from "../api";
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid,
} from "@mui/material";
import { ChevronRight } from "@mui/icons-material";
import { ModernItemCard } from "../components/ModernItemCard";
import { CategoryCard } from "../components/CategoryCard";
import { useAuth } from "../context/AuthContext";
import { CATEGORIES_DATA } from "../utils/constants";

// Import local images for floating 3D elements
import cameraImg from "../../assets/categories/camera.png";
import gamingImg from "../../assets/categories/gaming.png";
import trekkingImg from "../../assets/categories/trekking.png";
import actioncamImg from "../../assets/categories/actioncam.png";
import ridingImg from "../../assets/categories/riding.png";

// Debug Log as requested
console.log("Floating Images Loaded:", { cameraImg, gamingImg, trekkingImg, actioncamImg, ridingImg });

export interface Item {
  _id: string;
  name: string;
  category: string;
  condition: string;
  pricePerDay: number;
  location: string;
  image: string;
  description: string;
  rating: number;
  reviewCount: number;
  totalQuantity: number;
  availableQuantity: number;
  bookingCount?: number;
}

export function Home() {
  const { isAuthenticated, token } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  
  const searchTerm = searchParams.get("search")?.toLowerCase() || "";

  useEffect(() => {
    fetch("http://localhost:5000/api/items")
    .then(res => res.json())
    .then(data => setItems(data))
    .catch(err => console.log(err))
    .finally(() => setLoading(false));
  }, []); // Token dependency ensures re-fetch if auth state changes

  if (loading) {
    return (
      <Container sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h5" color="text.secondary">Loading RentIt Gear...</Typography>
      </Container>
    );
  }

  // Basic safe filter
  const filteredItems = Array.isArray(items) ? items.filter(item => 
    item?.name?.toLowerCase().includes(searchTerm) || 
    item?.description?.toLowerCase().includes(searchTerm) ||
    item?.category?.toLowerCase().includes(searchTerm)
  ) : [];

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)", position: "relative", overflow: "hidden" }}>
      {/* Subtle Background Elements */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", top: "-10%", left: "-10%", width: "50vw", height: "50vw",
          background: "radial-gradient(circle, rgba(124,58,237,0.05) 0%, rgba(255,255,255,0) 70%)",
          borderRadius: "50%", zIndex: 0, pointerEvents: "none"
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{
          position: "absolute", bottom: "10%", right: "-10%", width: "60vw", height: "60vw",
          background: "radial-gradient(circle, rgba(79,70,229,0.05) 0%, rgba(255,255,255,0) 70%)",
          borderRadius: "50%", zIndex: 0, pointerEvents: "none"
        }}
      />

      {/* Hero Section */}
      <Box
        className="hero"
        component={motion.div}
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 15, ease: "linear", repeat: Infinity }}
        sx={{
          position: "relative",
          zIndex: 1,
          pt: { xs: 8, md: 12 },
          pb: { xs: 12, md: 16 },
          mb: 8,
          background: "linear-gradient(270deg, #4F46E5, #7C3AED, #06B6D4)",
          backgroundSize: "200% 200%",
          borderRadius: { md: "0 0 60px 60px" },
          // Removed overflow: "hidden" so 3D elements are not clipped
        }}
      >
        {/* Floating Elements */}
        
        {/* Camera - Top Left (In front, zIndex: 3) */}
        <motion.img
          src={cameraImg}
          alt="Camera"
          animate={{ y: [0, -15, 0], rotate: [0, 8, -4, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0 }}
          style={{ 
            position: "absolute", top: "10%", left: "8%", width: "12%", minWidth: "100px", 
            opacity: 1, display: "block", visibility: "visible", zIndex: 3,
            filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.4))", pointerEvents: "none" 
          }}
        />
        
        {/* Gaming Console - Top Right (Behind glass, zIndex: 1) */}
        <motion.img
          src={gamingImg}
          alt="Gaming"
          animate={{ y: [0, 20, 0], rotate: [0, -6, 5, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{ 
            position: "absolute", top: "15%", right: "8%", width: "14%", minWidth: "110px", 
            opacity: 1, display: "block", visibility: "visible", zIndex: 1,
            filter: "drop-shadow(0 15px 25px rgba(0,0,0,0.3))", pointerEvents: "none" 
          }}
        />
        
        {/* Trekking Bag - Bottom Right (In front, zIndex: 3) */}
        <motion.img
          src={trekkingImg}
          alt="Trekking"
          animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{ 
            position: "absolute", bottom: "10%", right: "12%", width: "13%", minWidth: "105px", 
            opacity: 1, display: "block", visibility: "visible", zIndex: 3,
            filter: "drop-shadow(0 25px 35px rgba(0,0,0,0.5))", pointerEvents: "none" 
          }}
        />
        
        {/* Drone / Action Cam - Bottom Left (Behind glass, zIndex: 1) */}
        <motion.img
          src={actioncamImg}
          alt="Drone"
          animate={{ y: [0, 15, 0], rotate: [0, -8, 6, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          style={{ 
            position: "absolute", bottom: "15%", left: "10%", width: "15%", minWidth: "120px", 
            opacity: 1, display: "block", visibility: "visible", zIndex: 1,
            filter: "drop-shadow(0 15px 25px rgba(0,0,0,0.3))", pointerEvents: "none" 
          }}
        />
        
        {/* Headphones / Riding Gear - Mid Right (In front, zIndex: 3) */}
        <motion.img
          src={ridingImg}
          alt="Headphones"
          animate={{ y: [0, -25, 0], rotate: [0, 7, -7, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          style={{ 
            position: "absolute", top: "50%", right: "4%", width: "11%", minWidth: "100px", 
            opacity: 1, display: "block", visibility: "visible", zIndex: 3,
            filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.4))", pointerEvents: "none" 
          }}
        />

        <Container maxWidth="md" sx={{ position: "relative", zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Box
              sx={{
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(30px)",
                border: "1px solid rgba(255, 255, 255, 0.4)",
                borderRadius: "32px",
                p: { xs: 4, md: 6 },
                textAlign: "center",
                boxShadow: "0 30px 60px rgba(0,0,0,0.3), inset 0 0 20px rgba(255, 255, 255, 0.2)",
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900,
                  color: "white",
                  mb: 3,
                  fontSize: { xs: "2.5rem", md: "4rem" },
                  letterSpacing: "-0.02em",
                  textShadow: "0 2px 10px rgba(0,0,0,0.2)",
                }}
              >
                Rent Anything, Anytime
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: "rgba(255,255,255,0.9)",
                  mb: 6,
                  maxWidth: "600px",
                  mx: "auto",
                  fontWeight: 500,
                  lineHeight: 1.6,
                }}
              >
                Premium rental experience for all your temporary needs. From gaming to trekking, we've got you covered.
              </Typography>

              <Box sx={{ display: "flex", gap: 3, justifyContent: "center", flexWrap: "wrap", mt: 4 }}>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="contained"
                    size="large"
                    component={Link}
                    to="/items"
                    sx={{
                      borderRadius: "30px",
                      px: 6,
                      py: 2,
                      fontSize: "1.1rem",
                      fontWeight: 800,
                      textTransform: "none",
                      background: "linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)",
                      color: "white",
                      boxShadow: "0 10px 25px rgba(6, 182, 212, 0.5)",
                      border: "none",
                      "&:hover": {
                        background: "linear-gradient(135deg, #0891B2 0%, #2563EB 100%)",
                        boxShadow: "0 15px 40px rgba(6, 182, 212, 0.8)",
                      },
                    }}
                  >
                    Browse All Gear
                  </Button>
                </motion.div>
                {!isAuthenticated && (
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      component={Link}
                      to="/signup"
                      variant="outlined"
                      size="large"
                      sx={{
                        borderRadius: "30px",
                        px: 6,
                        py: 2,
                        fontSize: "1.1rem",
                        fontWeight: 800,
                        textTransform: "none",
                        color: "white",
                        borderColor: "rgba(255,255,255,0.7)",
                        borderWidth: 2,
                        backdropFilter: "blur(10px)",
                        "&:hover": {
                          borderColor: "white",
                          bgcolor: "rgba(255,255,255,0.2)",
                          boxShadow: "0 10px 25px rgba(255,255,255,0.3)",
                        },
                      }}
                    >
                      Get Started
                    </Button>
                  </motion.div>
                )}
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Top Categories Section */}
      <Container sx={{ mb: 8, position: "relative", zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#1e293b" }}>
              Top Categories
            </Typography>
            <Button 
              onClick={() => navigate("/items")}
              endIcon={<ChevronRight />} 
              sx={{ textTransform: "none", fontWeight: 700, color: "#4F46E5" }}
            >
              View All
            </Button>
          </Box>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >

        <Box
          sx={{
            display: "flex",
            gap: 3,
            overflowX: "auto",
            pb: 2,
            px: 1,
            "::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
          }}
        >
          {CATEGORIES_DATA.map((cat) => (
            <CategoryCard key={cat.name} name={cat.name} image={cat.image} />
          ))}
        </Box>
        </motion.div>
      </Container>

      {/* Main Inventory Grid */}
      <Container sx={{ mb: 12, position: "relative", zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#1e293b", mb: 4 }}>
            Explore Our Inventory
          </Typography>
        </motion.div>
        
        {(!filteredItems || filteredItems.length === 0) ? (
          <Box sx={{ textAlign: "center", py: 8, bgcolor: "grey.50", borderRadius: "20px" }}>
            <Typography variant="h6" color="text.secondary">
              No items available.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredItems.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  style={{ height: "100%" }}
                >
                  <ModernItemCard item={item} />
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}