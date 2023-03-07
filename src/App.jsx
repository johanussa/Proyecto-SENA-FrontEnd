import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./components/footer/Footer";
import Sidebar from "./components/sidebar/Sidebar";
import InstructorPage from "./pages/instructorPage/InstructorPage";
import ManagementShedule from "./pages/managementShedule/ManagementShedule";
import ManagementUser from "./pages/managementUser/ManagementUser";
import UserRegisterPage from "./pages/registerUser/UserRegisterPage";
import WelcomeLoginPage from "./pages/welcomeAndLogin/WelcomeLoginPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/sidebar' element={ <Sidebar /> } />
        <Route path='/' element={ <WelcomeLoginPage /> } />
        <Route path='/shedule' element={ <ManagementShedule /> } />
        <Route path='/user-register' element={ <UserRegisterPage /> } />
        <Route path='/instructor' element={ <InstructorPage /> } />
        <Route path='/users' element={ <ManagementUser /> } />
        <Route path='/footer' element={ <Footer /> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
