import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Home } from "./pages/Home";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Navbar } from "./components/Navbar";
import { Dashboard } from "./pages/Dashboard";
import { CreateSaloon } from "./pages/CreateSalon";
import { Salons } from "./pages/Salons";
import { SalonDetails } from "./pages/SalonDetails";
import { MySalon } from "./pages/MySalon";
import { EditSalon } from "./pages/EditSalon";
import { Profile } from "./pages/Profile";
import { BarberLayout } from "./pages/Layout/BarberLayout";
import { NotFound } from "./pages/NotFound";
import { BarberDashboard } from "./pages/BarberDashboard";
import { UserDashboard } from "./pages/UserDashboard";
import { UserLayout } from "./pages/Layout/UserLayout";
import { Favorites } from "./pages/Favorites";
import { AdminLayout } from "./pages/Layout/AdminLayout";
import { AdminUsers } from "./pages/AdminUsers";
import { AdminSalons } from "./pages/AdminSalons";
import { Logout } from "./components/Logout";
import { AdminHome } from "./pages/AdminHome";
import { ForgetPass } from "./pages/ForgotPass";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register/:role" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/forgot-password" element={<ForgetPass />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/salons" element={<Salons />} />
        <Route path="/salons/:id" element={<SalonDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/user" element={<UserLayout />}>
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="favorites" element={<Favorites />} />
        </Route>
        <Route path="/barber" element={<BarberLayout />}>
          <Route path="dashboard" element={<BarberDashboard />} />
          <Route path="create-salon" element={<CreateSaloon />} />
          <Route path="my-salon" element={<MySalon />} />
          <Route path="edit-salon/:salonId" element={<EditSalon />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="" element={<AdminHome />}></Route>
          <Route path="users" element={<AdminUsers />}></Route>
          <Route path="salons" element={<AdminSalons />}></Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
