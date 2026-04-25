import { useState, useEffect } from "react";
import { 
  Box, Typography, Paper, Grid, Avatar, Button, TextField, CircularProgress, Alert
} from "@mui/material";
import { Edit, Save, Close, AccountCircle } from "@mui/icons-material";
import { api } from "../api";

export function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  
  // Edit State
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const fetchProfile = async () => {
    try {
      const data = await api("/api/users/me");
      setProfile(data);
      setName(data.name || "");
      setPhoneNumber(data.phoneNumber || "");
      setProfileImage(data.profileImage || "");
    } catch (err: any) {
      setError("Failed to load profile data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/users/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, phoneNumber, profileImage })
      });
      
      const data = await res.json();
      if (res.ok) {
        setProfile(data);
        setIsEditing(false);
      } else {
        setError(data.message || "Failed to update profile");
      }
    } catch (err: any) {
      setError("Network error updating profile");
    }
  };

  if (loading) {
    return <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 6 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>My Profile</Typography>
      
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Paper sx={{ p: 4, borderRadius: "16px", boxShadow: "0 8px 24px rgba(0,0,0,0.05)" }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
             <Avatar 
                src={isEditing ? profileImage : (profile?.profileImage || "")} 
                alt={profile?.name}
                sx={{ width: 150, height: 150, mx: "auto", mb: 2, bgcolor: "primary.main" }}
             >
                {!profile?.profileImage && <AccountCircle sx={{ fontSize: 80 }} />}
             </Avatar>
             
             {isEditing && (
               <TextField 
                 size="small"
                 placeholder="Image URL" 
                 fullWidth 
                 value={profileImage}
                 onChange={(e) => setProfileImage(e.target.value)}
                 sx={{ mb: 2 }}
               />
             )}
             
             <Typography variant="subtitle1" sx={{ color: "text.secondary", textTransform: "capitalize", fontWeight: 700 }}>
                 {profile?.role} Account
             </Typography>
          </Grid>
          
          <Grid item xs={12} md={8}>
            {isEditing ? (
              <Box>
                <TextField 
                  fullWidth label="Full Name" value={name} onChange={(e) => setName(e.target.value)} sx={{ mb: 3 }}
                />
                <TextField 
                  fullWidth label="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} sx={{ mb: 3 }}
                />
                <TextField 
                  fullWidth label="Email" value={profile?.email} disabled helperText="Email cannot be changed" sx={{ mb: 3 }}
                />
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button variant="contained" startIcon={<Save />} onClick={handleUpdate}>Save Changes</Button>
                  <Button variant="outlined" color="error" startIcon={<Close />} onClick={() => setIsEditing(false)}>Cancel</Button>
                </Box>
              </Box>
            ) : (
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>{profile?.name}</Typography>
                <Typography variant="body1" sx={{ color: "text.secondary", mb: 3 }}>{profile?.email}</Typography>
                
                <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: "12px", mb: 3 }}>
                    <Typography variant="body2" color="text.secondary">Phone Number</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{profile?.phoneNumber}</Typography>
                </Box>

                <Button variant="outlined" startIcon={<Edit />} onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
