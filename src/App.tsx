import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RequireRole from "./components/RequireRole";

import Landing from "./pages/public/Landing";
import SignUp from "./pages/public/SignUp";
import Login from "./pages/public/Login";
import RoleSelect from "./pages/public/RoleSelect";

import DonorLayout from "./layouts/DonorLayout";
import DonorDashboard from "./pages/donor/Dashboard";
import NewDonation from "./pages/donor/NewDonation";
import DonorHistory from "./pages/donor/History";
import DonorBadges from "./pages/donor/Badges";

import RecipientLayout from "./layouts/RecipientLayout";
import RecipientHome from "./pages/recipient/Home";
import RequestHelp from "./pages/recipient/RequestHelp";
import Browse from "./pages/recipient/Browse";
import ConfirmPickup from "./pages/recipient/ConfirmPickup";
import RecipientHistory from "./pages/recipient/History";

import AdminLayout from "./layouts/AdminLayout";
import AdminOverview from "./pages/admin/Overview";
import AdminQueue from "./pages/admin/Queue";
import AdminDonations from "./pages/admin/Donations";
import AdminRequests from "./pages/admin/Requests";
import AdminReports from "./pages/admin/Reports";
import AdminVerify from "./pages/admin/Verify";
import Analytics from "./pages/admin/Analytics";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/roles" element={<RoleSelect />} />

        <Route
          path="/donor"
          element={
            <RequireRole role="donor">
              <DonorLayout />
            </RequireRole>
          }
        >
          <Route index element={<DonorDashboard />} />
          <Route path="new" element={<NewDonation />} />
          <Route path="history" element={<DonorHistory />} />
          <Route path="badges" element={<DonorBadges />} />
        </Route>

        <Route
          path="/recipient"
          element={
            <RequireRole role="recipient">
              <RecipientLayout />
            </RequireRole>
          }
        >
          <Route index element={<RecipientHome />} />
          <Route path="request" element={<RequestHelp />} />
          <Route path="browse" element={<Browse />} />
          <Route path="confirm" element={<ConfirmPickup />} />
          <Route path="history" element={<RecipientHistory />} />
        </Route>

        <Route
          path="/admin"
          element={
            <RequireRole role="admin">
              <AdminLayout />
            </RequireRole>
          }
        >
          <Route index element={<AdminOverview />} />
          <Route path="queue" element={<AdminQueue />} />
          <Route path="donations" element={<AdminDonations />} />
          <Route path="requests" element={<AdminRequests />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="verify" element={<AdminVerify />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
