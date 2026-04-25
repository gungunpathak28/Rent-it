import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { OwnerDashboard } from "./pages/OwnerDashboard";
import { RenterDashboard } from "./pages/RenterDashboard";
import { AddItem } from "./pages/AddItem";
import { EditItem } from "./pages/EditItem";
import { OwnerOrders } from "./pages/OwnerOrders";
import { ItemDetails } from "./pages/ItemDetails";
import { BookItem } from "./pages/BookItem";
import { Payment } from "./pages/Payment";
import { AllItems } from "./pages/AllItems";
import { NotFound } from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Profile } from "./pages/Profile";
import { Cart } from "./pages/Cart";
import { Billing } from "./pages/Billing";
import { AdminDashboard } from "./pages/AdminDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "items", Component: AllItems },
      { path: "login", Component: Login },
      { path: "signup", Component: Signup },
      { path: "item/:id", Component: ItemDetails },
      {
        path: "owner",
        element: <ProtectedRoute allowedRole="owner" />,
        children: [
          { path: "dashboard", Component: OwnerDashboard },
          { path: "orders", Component: OwnerOrders },
          { path: "add-item", Component: AddItem },
          { path: "edit-item/:id", Component: EditItem },
        ],
      },
      {
        path: "renter",
        element: <ProtectedRoute allowedRole="renter" />,
        children: [
          { path: "dashboard", Component: RenterDashboard },
          { path: "book/:id", Component: BookItem },
          { path: "payment/:bookingId", Component: Payment },
        ],
      },
      {
        path: "admin",
        element: <ProtectedRoute allowedRole="admin" />,
        children: [
          { path: "dashboard", Component: AdminDashboard },
        ],
      },
      {
        path: "",
        element: <ProtectedRoute />,
        children: [
          { path: "profile", Component: Profile },
          { path: "cart", Component: Cart },
          { path: "billing", Component: Billing },
        ],
      },
      { path: "*", Component: NotFound },
    ],
  },
]);
