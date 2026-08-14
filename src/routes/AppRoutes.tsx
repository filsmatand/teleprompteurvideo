import { Routes, Route } from "react-router-dom";

import NewScript from "../pages/scripts/NewScript";
import Dashboard from "../pages/Dashboard";
import AppLayout from "../layouts/AppLayout";
import Onboarding from "../pages/Onboarding";

import Recording from "../pages/recordings/Recordings";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Page d'accueil */}
      <Route path="/" element={<Onboarding />} />

      {/* Pages de l'application */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Tu pourras ajouter les autres pages ici */}
        {/* <Route path="/scripts" element={<Scripts />} /> */}
        {/* <Route path="/progress" element={<Progress />} /> */}
        {/* <Route path="/profile" element={<Profile />} /> */}
        <Route path="/recordings" element={<Recording />} />
        <Route path="//script/new" element={<NewScript />} />
      </Route>
    </Routes>
  );
}