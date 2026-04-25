import { Box, Typography, Button } from "@mui/material";
import { Home } from "@mui/icons-material";
import { Link } from "react-router";

export function NotFound() {
  return (
    <Box sx={{ textAlign: "center", py: 10 }}>
      <Typography variant="h1" sx={{ fontWeight: 700, fontSize: "6rem", mb: 2 }}>
        404
      </Typography>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Page Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        The page you are looking for doesn't exist or has been moved.
      </Typography>
      <Button component={Link} to="/" variant="contained" size="large" startIcon={<Home />}>
        Back to Home
      </Button>
    </Box>
  );
}
