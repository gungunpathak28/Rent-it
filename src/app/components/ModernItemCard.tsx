import { Box, Card, CardContent, CardMedia, Typography, Rating, Chip, IconButton } from "@mui/material";
import { motion } from "framer-motion";
import { FavoriteBorder, LocationOn, TrendingUp } from "@mui/icons-material";
import { Link } from "react-router";
import { Item } from "../pages/Home";

interface ModernItemCardProps {
  item: Item;
}

export function ModernItemCard({ item }: ModernItemCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 200 }}
      style={{ height: "100%" }}
    >
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "24px",
        overflow: "hidden",
        position: "relative",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        border: "1px solid rgba(255, 255, 255, 0.5)",
        boxShadow: "0 10px 30px -10px rgba(0,0,0,0.08)",
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(10px)",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 20px 40px -10px rgba(124, 58, 237, 0.15)",
          borderColor: "rgba(124, 58, 237, 0.2)",
        },
      }}
    >
      {/* Wishlist Icon */}
      <IconButton
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          bgcolor: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(4px)",
          color: "text.secondary",
          "&:hover": { bgcolor: "white", color: "error.main" },
          zIndex: 1,
        }}
        size="small"
      >
        <FavoriteBorder fontSize="small" />
      </IconButton>

      {/* Badges Overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 12,
          left: 12,
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
        }}
      >
        <Box sx={{ display: "flex", gap: 0.5 }}>
          {item.availableQuantity === 0 ? (
            <Chip
              label="Sold Out"
              size="small"
              sx={{ bgcolor: "error.main", color: "white", fontWeight: 700, fontSize: "10px" }}
            />
          ) : (
            <Chip
              label="In Stock"
              size="small"
              sx={{ bgcolor: "success.main", color: "white", fontWeight: 700, fontSize: "10px" }}
            />
          )}

          {item.rating >= 4.5 && (
            <Chip
              label="⭐ Top Rated"
              size="small"
              sx={{ bgcolor: "rgba(255, 215, 0, 0.9)", color: "black", fontWeight: 700, fontSize: "10px" }}
            />
          )}
        </Box>

        {item.bookingCount && item.bookingCount > 5 && (
          <Chip
            label="🔥 Popular"
            size="small"
            sx={{ 
              bgcolor: "error.light", 
              color: "white", 
              fontWeight: 700, 
              fontSize: "10px",
              width: "fit-content"
            }}
          />
        )}
      </Box>

      <Link to={`/item/${item._id}`} style={{ textDecoration: "none", color: "inherit" }}>
        <Box sx={{ position: "relative", pt: "75%" }}>
          <CardMedia
            component="img"
            image={item.image || "https://via.placeholder.com/300"}
            alt={item.name}
            onError={(e: any) => {
              e.target.src = "https://via.placeholder.com/300";
            }}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              lineHeight: 1.2,
              mb: 0.5,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              height: "2.4em",
            }}
          >
            {item.name}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
            <Rating value={item.rating} precision={0.1} readOnly size="small" />
            <Typography variant="caption" sx={{ ml: 0.5, color: "text.secondary" }}>
              ({item.reviewCount})
            </Typography>
          </Box>

          {/* Urgency Message */}
          {item.availableQuantity > 0 && item.availableQuantity <= 2 && (
            <Typography variant="caption" sx={{ color: "error.main", fontWeight: 700, display: "block", mb: 0.5 }}>
              Hurry! Likely to be rented soon
            </Typography>
          )}
          {item.bookingCount && item.bookingCount > 5 && (
            <Typography variant="caption" sx={{ color: "error.main", fontWeight: 700, display: "block", mb: 0.5 }}>
              High demand – book जल्दी
            </Typography>
          )}

          <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <LocationOn sx={{ fontSize: 14, mr: 0.5 }} /> {item.location}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "baseline" }}>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 800 }}>
                ₹{item.pricePerDay}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                /day
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Link>
    </Card>
    </motion.div>
  );
}
