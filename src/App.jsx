import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./components/footer/Footer";
import Sidebar from "./components/sidebar/Sidebar";
import ManagementShedule from "./pages/managementShedule/ManagementShedule";
import ManagementUser from "./pages/managementUser/ManagementUser";
import UserRegisterPage from "./pages/registerUser/UserRegisterPage";
import WelcomeLoginPage from "./pages/welcomeAndLogin/WelcomeLoginPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={ <WelcomeLoginPage /> } />
        <Route path='/user-register' element={ <UserRegisterPage /> } />
        <Route path='/sidebar' element={ <Sidebar /> } />
        <Route path='/footer' element={ <Footer /> } />
        <Route path='/users' element={ <ManagementUser /> } />
        <Route path='/shedule' element={ <ManagementShedule /> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
