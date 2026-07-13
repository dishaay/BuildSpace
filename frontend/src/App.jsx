import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomeFeedPage from "./pages/HomeFeedPage";
import DeveloperProfilePage from "./pages/DeveloperProfilePage";
import CommunitiesPage from "./pages/CommunitiesPage";
import HackathonFinderPage from "./pages/HackathonFinderPage";
import ProjectShowcasePage from "./pages/ProjectShowcasePage";
import EditProfilePage from "./pages/EditProfilePage";
import CreateProject from "./pages/projects/createProject";
import EditProject from "./pages/projects/EditProject";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/feed" element={<HomeFeedPage />} />
        <Route path="/profile" element={<DeveloperProfilePage />} />
        <Route path="/communities" element={<CommunitiesPage />} />
        <Route path="/hackathons" element={<HackathonFinderPage />} />
        <Route path="/projects" element={<ProjectShowcasePage />} />
        <Route path="/profile/edit" element={<EditProfilePage />} />
        <Route path="/projects/create" element={<CreateProject />} />
        <Route path="/projects/edit/:id" element={<EditProject />} />
      </Routes>
    </BrowserRouter>
  );
}
