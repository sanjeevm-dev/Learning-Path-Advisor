import { Routes, Route } from "react-router-dom";
import Navigation from "./components/ui/Navigation";
import AdvisorPage from "./components/pages/AdvisorPage";
import NotFound from "./components/pages/not-found";
import AdminPage from "./components/pages/AdminPage";
import LibraryPage from "./components/pages/LibraryPage";
import ResourceDetail from "./components/pages/ResourceDetail";
import "./App.css";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-foreground">
      <Navigation />
      <Routes>
        <Route path="/" element={<LibraryPage />} />
        <Route path="/advisor" element={<AdvisorPage />} />
        <Route path="/resources/:id" element={<ResourceDetail />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
