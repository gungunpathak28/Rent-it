import jsPDF from "jspdf";

export const generateReceipt = (booking: any, userName: string) => {
  const doc = new jsPDF();
  const item = booking.itemId;

  // Header
  doc.setFontSize(22);
  doc.setTextColor(45, 58, 141); // Primary Color
  doc.text("RentIt Official Receipt", 105, 20, { align: "center" });

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Booking ID: ${booking._id}`, 105, 30, { align: "center" });

  // Divider
  doc.setDrawColor(200);
  doc.line(20, 35, 190, 35);

  // User Details
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  doc.text("Billed To:", 20, 50);
  doc.setFont("helvetica", "normal");
  doc.text(userName, 20, 57);

  // Date Details
  doc.setFont("helvetica", "bold");
  doc.text("Date Issued:", 140, 50);
  doc.setFont("helvetica", "normal");
  doc.text(new Date().toLocaleDateString(), 140, 57);

  // Rental Item Details
  doc.setFillColor(248, 249, 250);
  doc.rect(20, 70, 170, 60, "F");
  
  doc.setFont("helvetica", "bold");
  doc.text("Rental Details", 25, 80);
  doc.setFont("helvetica", "normal");
  
  doc.text(`Item: ${item.name}`, 25, 90);
  doc.text(`Category: ${item.category}`, 25, 100);
  doc.text(`Start Date: ${new Date(booking.startDate).toLocaleString()}`, 25, 110);
  doc.text(`End Date: ${new Date(booking.endDate).toLocaleString()}`, 25, 120);

  // Price Calculation
  doc.setFont("helvetica", "bold");
  doc.text("Summary", 140, 80);
  doc.setFont("helvetica", "normal");
  doc.text(`Price/Day: INR ${item.pricePerDay}`, 140, 90);
  
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`Total Paid: INR ${booking.totalAmount}`, 140, 115);

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.setFont("helvetica", "italic");
  doc.text("Thank you for choosing RentIt – Your Trusted Sharing Economy Hub.", 105, 160, { align: "center" });

  // Save the PDF
  doc.save(`receipt_${booking._id}.pdf`);
};
