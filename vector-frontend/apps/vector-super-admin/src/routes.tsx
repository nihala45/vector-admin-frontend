import { Routes, Route } from "react-router";
import Dashboard from "./pages/root/dashboard/page";
import Login from "./pages/auth/Login";
import Profile from "./pages/profile/page";
import Error from "./pages/root/error-mangement/Error";

import UserManagementListing from "./pages/root/user-management/user-management-list";
import StaffManagementListing from "./pages/root/staff-managemenet/staff-management-list";
import StaffEditForm from "./pages/root/staff-managemenet/staff-edit";
import CourseList from "./pages/course/course-list";
import CourseCreate from "./pages/course/course-create";
import CourseEdit from "./pages/course/course-edit";

// ✅ FIXED IMPORT
import UserCreateForm from "./pages/root/staff-managemenet/create-staff";

const routesConfig = [
  { path: "/", element: <Login />, title: "Login" },
  { path: "/dashboard", element: <Dashboard />, title: "Dashboard" },
  { path: "/profile", element: <Profile />, title: "Profile" },
  { path: "/users", element: <UserManagementListing />, title: "Users" },
 

  { path: "/staff", element: <StaffManagementListing />, title: "Staff" },

  // ✅ FIXED COMPONENT NAME
  { path: "/staff/create", element: <UserCreateForm />, title: "Create Staff" },
 { path: "/course", element: < CourseList/>, title: "course" },
 {path:"/course/create", element:<CourseCreate/>, title:"create course"},
 {path:"/course/edit", element:<CourseEdit/>, title:"edit course"},
  { path: "/staff/edit", element: <StaffEditForm />, title: "Edit Staff" },
  { path: "/error", element: <Error />, title: "Error" },
  { path: "*", element: <Error />, title: "404" },
];

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
