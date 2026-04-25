export const indianCities = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Surat",
  "Kanpur",
  "Nagpur",
  "Indore",
  "Thane",
  "Bhopal",
  "Visakhapatnam",
  "Patna",
  "Vadodara",
  "Ghaziabad",
];

export const categories = [
  "Tools",
  "Electronics",
  "Appliances",
  "Furniture",
  "Sports Equipment",
  "Musical Instruments",
  "Cameras & Photography",
  "Party Supplies",
  "Camping Gear",
  "Gaming Consoles",
];

export const conditions = ["New", "Like New", "Good", "Fair"];

export interface Item {
  id: string;
  ownerId: string;
  name: string;
  category: string;
  condition: string;
  pricePerDay: number;
  location: string;
  image: string;
  description: string;
  availability: string[];
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface Booking {
  id: string;
  itemId: string;
  renterId: string;
  ownerId: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
  paymentStatus: "pending" | "paid";
}

export interface Review {
  id: string;
  bookingId: string;
  itemId: string;
  renterId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export function initializeMockData() {
  if (!localStorage.getItem("rentit_items")) {
    const mockItems: Item[] = [
      {
        id: "1",
        ownerId: "mock-owner-1",
        name: "Professional DSLR Camera",
        category: "Cameras & Photography",
        condition: "Like New",
        pricePerDay: 800,
        location: "Mumbai",
        image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800",
        description: "Canon EOS 5D Mark IV with 24-70mm lens. Perfect for weddings, events, and professional photography.",
        availability: [],
        rating: 4.8,
        reviewCount: 24,
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        ownerId: "mock-owner-2",
        name: "Power Drill Set",
        category: "Tools",
        condition: "Good",
        pricePerDay: 200,
        location: "Bangalore",
        image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800",
        description: "Complete power drill set with multiple bits and accessories. Great for home improvement projects.",
        availability: [],
        rating: 4.5,
        reviewCount: 18,
        createdAt: new Date().toISOString(),
      },
      {
        id: "3",
        ownerId: "mock-owner-1",
        name: "PlayStation 5 Console",
        category: "Gaming Consoles",
        condition: "New",
        pricePerDay: 500,
        location: "Delhi",
        image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800",
        description: "Latest PS5 with 2 controllers and popular games. Perfect for gaming parties or trying before buying.",
        availability: [],
        rating: 4.9,
        reviewCount: 32,
        createdAt: new Date().toISOString(),
      },
      {
        id: "4",
        ownerId: "mock-owner-3",
        name: "Camping Tent (4 Person)",
        category: "Camping Gear",
        condition: "Like New",
        pricePerDay: 300,
        location: "Pune",
        image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800",
        description: "Spacious 4-person tent with rainfly. Ideal for weekend camping trips and outdoor adventures.",
        availability: [],
        rating: 4.6,
        reviewCount: 15,
        createdAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem("rentit_items", JSON.stringify(mockItems));
  }
}

export function getItems(): Item[] {
  return JSON.parse(localStorage.getItem("rentit_items") || "[]");
}

export function getItemById(id: string): Item | undefined {
  const items = getItems();
  return items.find((item) => item.id === id);
}

export function addItem(item: Omit<Item, "id" | "createdAt">): Item {
  const items = getItems();
  const newItem: Item = {
    ...item,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  items.push(newItem);
  localStorage.setItem("rentit_items", JSON.stringify(items));
  return newItem;
}

export function updateItem(id: string, updates: Partial<Item>): Item | undefined {
  const items = getItems();
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return undefined;

  items[index] = { ...items[index], ...updates };
  localStorage.setItem("rentit_items", JSON.stringify(items));
  return items[index];
}

export function deleteItem(id: string): boolean {
  const items = getItems();
  const filtered = items.filter((item) => item.id !== id);
  localStorage.setItem("rentit_items", JSON.stringify(filtered));
  return filtered.length < items.length;
}

export function getBookings(): Booking[] {
  return JSON.parse(localStorage.getItem("rentit_bookings") || "[]");
}

export function addBooking(booking: Omit<Booking, "id" | "createdAt">): Booking {
  const bookings = getBookings();
  const newBooking: Booking = {
    ...booking,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  bookings.push(newBooking);
  localStorage.setItem("rentit_bookings", JSON.stringify(bookings));
  return newBooking;
}

export function updateBooking(id: string, updates: Partial<Booking>): Booking | undefined {
  const bookings = getBookings();
  const index = bookings.findIndex((b) => b.id === id);
  if (index === -1) return undefined;

  bookings[index] = { ...bookings[index], ...updates };
  localStorage.setItem("rentit_bookings", JSON.stringify(bookings));
  return bookings[index];
}

export function getReviews(): Review[] {
  return JSON.parse(localStorage.getItem("rentit_reviews") || "[]");
}

export function addReview(review: Omit<Review, "id" | "createdAt">): Review {
  const reviews = getReviews();
  const newReview: Review = {
    ...review,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  reviews.push(newReview);
  localStorage.setItem("rentit_reviews", JSON.stringify(reviews));

  // Update item rating
  const itemReviews = reviews.filter((r) => r.itemId === review.itemId);
  itemReviews.push(newReview);
  const avgRating = itemReviews.reduce((sum, r) => sum + r.rating, 0) / itemReviews.length;

  updateItem(review.itemId, {
    rating: Math.round(avgRating * 10) / 10,
    reviewCount: itemReviews.length,
  });

  return newReview;
}
// 🔥 KEEP ALL YOUR OLD CODE ABOVE SAME

// ✅ NEW FUNCTION (REAL BACKEND FETCH)
export async function fetchItemsFromAPI(): Promise<Item[]> {
  try {
    const res = await fetch("http://localhost:5000/api/items");
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("API error, using local data");
    return getItems(); // fallback
  }
}

// ✅ NEW FUNCTION (ADD ITEM TO BACKEND)
export async function addItemToAPI(item: Omit<Item, "id" | "createdAt">) {
  try {
    const res = await fetch("http://localhost:5000/api/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("API failed, saving locally");
    return addItem(item); // fallback
  }
}

// ✅ NEW FUNCTION (FETCH BOOKINGS FROM API)
export async function fetchBookingsFromAPI(): Promise<Booking[]> {
  try {
    const res = await fetch("http://localhost:5000/api/bookings");
    const data = await res.json();
    return data;
  } catch (error) {
    return getBookings();
  }
}

// 🔥 KEEP ALL BELOW SAME