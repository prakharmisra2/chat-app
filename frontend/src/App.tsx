import Navbar from "./components/Navbar";
import {Routes, Route} from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import LogInPage from "./pages/LogInPage.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";


const App = () => {
  return (
    <div>
      <Navbar/>
      <Routes>
         <Route path = "/" element={<HomePage/>} />
         <Route path = "/signup" element={<SignUpPage/>} />
         <Route path = "/login" element={<LogInPage/>} />
         <Route path = "/setting" element={<SettingsPage/>} />
         <Route path = "/profile" element={<ProfilePage/>} />
      </Routes>

    </div>
  );
}
export default App;