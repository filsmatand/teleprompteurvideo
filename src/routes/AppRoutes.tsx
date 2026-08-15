
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Profile from "../pages/profile/profile";
import NewScript from "../pages/scripts/NewScript";
import Scripts from "../pages/scripts/Scripts";
import Dashboard from "../pages/Dashboard";
import AppLayout from "../layouts/AppLayout";
import Onboarding from "../pages/Onboarding";
import Recording from "../pages/recordings/Recordings";
import LoadingScreen from "../components/LoadingScreen";

import Login from "../pages/Login";
import Register from "../pages/Register";

export default function AppRoutes() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  // Affiche le loading au démarrage
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {/* Pages sans layout */}
      <Route path="/" element={<Onboarding />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Pages avec AppLayout */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/scripts" element={<Scripts />} />
        <Route path="/recordings" element={<Recording />} />
        <Route path="/script/new" element={<NewScript />} />
      </Route>
    </Routes>
  );
}

