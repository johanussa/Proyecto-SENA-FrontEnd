import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import Footer from "./components/footer/Footer";
import Sidebar from "./components/sidebar/Sidebar";
import InstructorPage from "./pages/instructorPage/InstructorPage";
import ManagementShedule from "./pages/managementShedule/ManagementShedule";
import ManagementUser from "./pages/managementUser/ManagementUser";
import UserRegisterPage from "./pages/registerUser/UserRegisterPage";
import WelcomeLoginPage from "./pages/welcomeAndLogin/WelcomeLoginPage";

const client = new ApolloClient({
  uri: "https://sena-sanf-back.vercel.app/",
  cache: new InMemoryCache()
});

function App() {
  return (
    <ApolloProvider client={ client }>
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
    </ApolloProvider> 
  );
}

export default App;
