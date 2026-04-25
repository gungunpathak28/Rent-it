import { Box, Typography, Paper } from "@mui/material";

interface CategoryCardProps {
  name: string;
  image: string;
  onClick?: () => void;
}

export function CategoryCard({ name, image, onClick }: CategoryCardProps) {
  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: "pointer",
        textAlign: "center",
        width: 120,
        flexShrink: 0,
        "&:hover .category-image": {
          transform: "scale(1.15)",
        },
        "&:hover .category-paper": {
          borderColor: "#7C3AED",
          boxShadow: "0 12px 28px rgba(124, 58, 237, 0.15)",
          transform: "translateY(-6px)",
        },
      }}
    >
      <Paper
        className="category-paper"
        elevation={0}
        sx={{
          width: 100,
          height: 100,
          mx: "auto",
          mb: 1.5,
          borderRadius: "24px",
          border: "2px solid",
          borderColor: "grey.100",
          overflow: "hidden",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 1.5,
          bgcolor: "white",
          boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
        }}
      >
        <Box
          className="category-image"
          component="img"
          src={image}
          onError={(e: any) => {
            e.target.src = "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=300&h=300";
          }}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "16px",
            transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </Paper>
      <Typography
        variant="caption"
        sx={{
          fontWeight: 700,
          color: "text.primary",
          display: "block",
          px: 1,
          lineHeight: 1.2,
        }}
      >
        {name}
      </Typography>
    </Box>
  );
}
