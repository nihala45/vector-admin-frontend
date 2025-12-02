import { Routes, Route } from "react-router";
import Dashboard from "./pages/root/dashboard/page";
import Login from "./pages/auth/Login";
import Profile from "./pages/profile/page";
import Error from "./pages/root/error-mangement/Error";

import UserManagementListing from "./pages/root/user-management/user-management-list";
import StaffManagementListing from "./pages/root/staff-managemenet/staff-management-list";
import StaffEditForm from "./pages/root/staff-managemenet/staff-edit";
import CourseList from "./pages/root/course/course-list";
import CourseCreate from "./pages/root/course/course-create";
import CourseEdit from "./pages/root/course/course-edit";

// ✅ FIXED IMPORT
import UserCreateForm from "./pages/root/staff-managemenet/create-staff";
import CourseViewPage from "./pages/root/course/course.view";
import ModuleCreate from "./pages/root/course/create-module";
import ModuleEdit from "./pages/root/course/module-edit";
import ModuleView from "./pages/root/course/module-view";
import TopicCreate from "./pages/root/course/topic-create";
import TopicEdit from "./pages/root/course/topic-edit";
import TopicView from "./pages/root/course/topic-view";
import VideoCreate from "./pages/root/course/create.video";
import DocumentCreate from "./pages/root/course/create-pdf";
import DocumentEdit from "./pages/root/course/edit-documents";

const routesConfig = [
  { path: "/", element: <Login />, title: "Login" },
  { path: "/dashboard", element: <Dashboard />, title: "Dashboard" },
  { path: "/profile", element: <Profile />, title: "Profile" },
  { path: "/users", element: <UserManagementListing />, title: "Users" },
 

  { path: "/staff", element: <StaffManagementListing />, title: "Staff" },

 
 { path: "/staff/create", element: <UserCreateForm />, title: "Create Staff" },
 { path: "/courses", element: < CourseList/>, title: "course" },
 {path:"/course/create", element:<CourseCreate/>, title:"create course"},
 {path:"/course/edit/:id", element:<CourseEdit/>, title:"edit course"},
 {path:"/course/view/:slug", element:<CourseViewPage/>, title:"view course"},
 {path:"/module/create/:id", element:<ModuleCreate/>, title:"module create"},
 {path:"/module/edit/:id", element:<ModuleEdit/>, title:"module edit"},
 {path:"/module/view/:id", element:<ModuleView/>, title:"module view"},

 {path:"/module/topic/create/:id", element:<TopicCreate/>, title:"topic create"},

 {path:"/topic/edit/:id", element:<TopicEdit/>, title:"topic edit"},
 {path:"/topic/view/:id", element:<TopicView/>, title:"topic view"},

 {path:"/topic/video/create/:id", element:<VideoCreate/>, title:"create video"},
 {path:"/topic/video/create/:id", element:<VideoCreate/>, title:"create video"},

 {path:"/topic/document/create/:id", element:<DocumentCreate/>, title:"create pdf"},
 {path:"/topic/document/edit/:id", element:<DocumentEdit/>, title:"edit document"},











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
