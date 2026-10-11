import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import MainLayout from "./layouts/MainLayout";

import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/home/Home";
import Jobs from "./pages/Jobs";
import Companies from "./pages/Companies";
import Salaries from "./pages/Salaries";
import Resources from "./pages/Resources";
import Placeholder from "./pages/Placeholder";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <BrowserRouter>

      <AuthProvider>

        <Routes>

          {/* Public Routes */}

          <Route element={<MainLayout />}>

            <Route
              path="/"
              element={<Home />}
            />

            <Route
              path="/jobs"
              element={<Jobs />}
            />

            <Route
              path="/companies"
              element={<Companies />}
            />

            <Route
              path="/salaries"
              element={<Salaries />}
            />

            <Route
              path="/resources"
              element={<Resources />}
            />

            <Route
              path="/employers"
              element={<Placeholder />}
            />

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/register"
              element={<Register />}
            />

          </Route>


          {/* Protected Routes */}

          <Route element={<ProtectedRoute />}>

            <Route
              path="/dashboard/*"
              element={<Dashboard />}
            />

            <Route element={<MainLayout />}>

              <Route
                path="/profile"
                element={<Profile />}
              />

            </Route>

          </Route>

          <Route
            path="*"
            element={<NotFound />}
          />

        </Routes>

      </AuthProvider>

    </BrowserRouter>
  );
};

export default App;
