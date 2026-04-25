import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from "@mui/material";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format, addDays, isSameDay } from "date-fns";

interface DateSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (range: DateRange | undefined) => void;
  initialRange?: DateRange;
}

export function DateSelectionDialog({
  open,
  onClose,
  onSelect,
  initialRange,
}: DateSelectionDialogProps) {
  const [range, setRange] = useState<DateRange | undefined>(initialRange);

  // Auto-calculate +24 hours when 'from' is selected and 'to' is missing
  useEffect(() => {
    if (range?.from && !range.to) {
      const nextDay = addDays(range.from, 1);
      setRange({ from: range.from, to: nextDay });
    }
  }, [range?.from]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "24px" } }}>
      <DialogTitle sx={{ fontWeight: 800, color: "#2D3A8D" }}>Select Rental Dates</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 2 }}>
          <DayPicker
            mode="range"
            selected={range}
            onSelect={setRange}
            numberOfMonths={1}
            disabled={{ before: new Date() }}
            styles={{
              caption: { color: "#2D3A8D", fontWeight: 700 }
            }}
          />
          
          <Box sx={{ mt: 3, p: 2, bgcolor: "grey.50", borderRadius: "16px", width: "100%", textAlign: "center" }}>
            {range?.from ? (
              <>
                <Typography variant="subtitle2" sx={{ color: "text.secondary", mb: 0.5 }}>RENTAL PERIOD</Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "primary.main" }}>
                  {format(range.from, "MMM dd, yyyy")} 
                  {range.to && ` — ${format(range.to, "MMM dd, yyyy")}`}
                </Typography>
                {range.to && (
                  <Typography variant="body2" sx={{ color: "success.main", fontWeight: 700, mt: 1 }}>
                    {isSameDay(addDays(range.from, 1), range.to) 
                      ? `Return by: ${format(range.to, "p")} (Exactly 24h)`
                      : `Return by: ${format(range.to, "p")} on ${format(range.to, "MMM dd")}`
                    }
                  </Typography>
                )}
              </>
            ) : (
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                Select a start date to begin
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, justifyContent: "space-between" }}>
        <Button onClick={() => setRange(undefined)} color="inherit" sx={{ fontWeight: 700 }}>Reset</Button>
        <Box>
          <Button onClick={onClose} color="inherit" sx={{ mr: 1, fontWeight: 700 }}>Cancel</Button>
          <Button
            onClick={() => {
              onSelect(range);
              onClose();
            }}
            variant="contained"
            disabled={!range?.from}
            sx={{ borderRadius: "20px", px: 4, fontWeight: 700 }}
          >
            Confirm Dates
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
