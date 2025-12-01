import { Routes, Route } from "react-router";
import { type JSX } from "react";

// Pages (only required pages)
import Dashboard from "./pages/root/dashboard/page";
import Login from "./pages/auth/Login";
import Profile from "./pages/profile/page";
import Error from "./pages/root/error-mangement/Error";


const routesConfig = [
  { path: "/", element: <Login />, title: "Login" },
  { path: "/dashboard", element: <Dashboard />, title: "Dashboard" },
  { path: "/profile", element: <Profile />, title: "Profile" },

  
  { path: "/error", element: <Error />, title: "Error" },
  { path: "*", element: <Error />, title: "404" },
];

// Title Wrapper
const TitleWrapper = ({ title, children }) => {
  document.title = title;
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {routesConfig.map(({ path, element, title }) => (
        <Route
          key={path}
          path={path}
          element={<TitleWrapper title={title}>{element}</TitleWrapper>}
        />
      ))}
    </Routes>
  );
};

export default AppRoutes;
