import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import "../src/styles/main.css";
import Footer from "./components/Footer";
import SignUp from "./views/SignUp";
import LogIn from "./views/LogIn";
import About from "./views/About";
import Home from "./views/Home";
import NavBar from "./components/NavBar";
import Experiences from "./views/Experiences";
import Map from "./views/Map";
import ErrorPage from "./views/ErrorPage";
import ExperienceDetails from "./views/ExperienceDetails";
import Wildlife from "./views/ExperienceTypes/Wildlife";
import Hiking from "./views/ExperienceTypes/Hiking";
import ExpLayout from "./components/ExpLayout";
import Profile from "./views/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Submit from "./views/Submit";
import { ExperiencesContextProvider } from "./context/ExperiencesContext";
import { AuthContextProvider } from "./context/AuthContext";
import ExperienceWithCHook from "./components/ExperienceWithCHook";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />} errorElement={<ErrorPage />}>
        <Route index element={<Home />} />
        <Route path="experiences" element={<ExpLayout />}>
          <Route index element={<Experiences />} />
          <Route path="all" element={<Experiences />} />
          <Route path="hiking" element={<Hiking />} />
          <Route path="wildlife" element={<Wildlife />} />
        </Route>
        <Route
          path="experiences/:experienceTitle"
          element={<ExperienceDetails />}
        />
        <Route path="custom" element={<ExperienceWithCHook />} />

        <Route path="map" element={<Map />} />
        <Route path="about" element={<About />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="login" element={<LogIn />} />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="submit"
          element={
            <ProtectedRoute>
              <Submit />
            </ProtectedRoute>
          }
        />
      </Route>
    )
  );

  return (
    <>
      <div className="mainBody">
        <AuthContextProvider>
          <ExperiencesContextProvider>
            <RouterProvider router={router} />
          </ExperiencesContextProvider>
          <Footer />
        </AuthContextProvider>
      </div>
    </>
  );
}

const Root = () => {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};

export default App;
