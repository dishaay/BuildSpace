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
import CreateHackathonPage from "./pages/hackathons/CreateHackathonPage";
import EditHackathonPage from "./pages/hackathons/EditHackathonPage";
import HackathonDetailsPage from "./pages/hackathons/HackathonDetailsPage";
import MyHackathonsPage from "./pages/hackathons/MyHackathonsPage";
import JoinRequestsPage from "./pages/hackathons/JoinRequestsPage";
import ProjectDetails from "./pages/projects/ProjectDetails";
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
        <Route path="/hackathons/new" element={<CreateHackathonPage />} />
        <Route path="/hackathons/:id" element={<HackathonDetailsPage />} />

<Route path="/hackathons/:id/edit" element={<EditHackathonPage />} />
<Route path="/hackathons/mine" element={<MyHackathonsPage />} />
<Route path="/hackathons/:id/requests" element={<JoinRequestsPage />} />
<Route
    path="/projects/:id"
    element={<ProjectDetails/>}
/>
      </Routes>
    </BrowserRouter>
  );
}
