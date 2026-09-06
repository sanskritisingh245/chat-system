import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Authentication/LoginPage";
import SignupPage from "./pages/Authentication/SignupPage";
import AdminDashboardPage from "./pages/Admin/DashboardPage";
import SupervisorDashboardPage from "./pages/Supervisor/DashBoardPage";
import SupervisorConversationPage from "./pages/Supervisor/ConversationPage";
import AgentDashboardPage from "./pages/Agent/DashboardPage";
import AgentConversationPage from "./pages/Agent/ConversationPage";
import CandidateDashboardPage from "./pages/Candidate/DashboardPage";
import CandidateConversationPage from "./pages/Candidate/ConversationPage";


export function App() {
  return (
            <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<LoginPage onLogin={() => {}} />} />
                <Route path="/signup" element={<SignupPage />} />

                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />

                <Route path="/supervisor/dashboard" element={<SupervisorDashboardPage />} />
                <Route path="/supervisor/conversation/:id" element={<SupervisorConversationPage />} />

                <Route path="/agent/dashboard" element={<AgentDashboardPage />} />
                <Route path="/agent/conversation/:id" element={<AgentConversationPage />} />

                <Route path="/candidate/dashboard" element={<CandidateDashboardPage />} />
                <Route path="/candidate/conversation/:id" element={<CandidateConversationPage />} />
            </Routes>
        </BrowserRouter>
    );
}


export default App;
