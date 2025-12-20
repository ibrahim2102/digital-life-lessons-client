import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import PrivateRoute from "./PrivateRoute";
import Pricing from "../pages/Pricing/Pricing/Pricing";
import DashboardLayout from "../layouts/DashBoardLayout";
import AddLessons from "../pages/Dashboard/AddLessons/AddLessons";
import DashboardHome from "../pages/Dashboard/DashboardHome/DashboardHome";
import MyLessons from "../pages/Dashboard/MyLessons/MyLessons";
import UpdateLesson from "../pages/Dashboard/UpdateLesson/UpdateLesson";
import MyFavourites from "../pages/Dashboard/MyFavourites/MyFavourites";
import MyProfile from "../pages/Dashboard/MyProfile/MyProfile";
import AdminRoute from "./AdminRoute";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboardHome from "../pages/AdminDashboard/AdminDashboardHome/AdminDashboardHome";
import ManageUsers from "../pages/AdminDashboard/ManageUsers/ManageUsers";
import ManageLessons from "../pages/AdminDashboard/ManageLessons/ManageLessons";
import ReportedLessons from "../pages/AdminDashboard/ReportedLessons/ReportedLessons";
import Payment from "../pages/Pricing/Payment/Payment";
import PaymentSuccess from "../pages/Pricing/PaymentSuccess/PaymentSuccess";
import DetailsLessons from "../pages/DetailsLessons/DetailsLessons";
import DetailsLessonInformation from "../pages/DetailsLessonInformation/DetailsLessonInformation";
import CreatorProfile from "../pages/CreatorProfile/CreatorProfile";
import ErrorPage from "../components/ErrorPage/ErrorPage";
import AdminProfile from "../pages/AdminDashboard/AdminProfile/AdminProfile";
import PaymentCancel from "../pages/Pricing/PaymentCancel/PaymentCancel";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        Component: Home
      },
      {
        path: 'pricing',
        element: <PrivateRoute><Pricing /></PrivateRoute>
      },
      {
        path: 'payment',
        element: <PrivateRoute><Payment /></PrivateRoute>
      },
      {
        path: 'payment-success',
        element: <PrivateRoute><PaymentSuccess /></PrivateRoute>
      },
      {
        path: 'payment-cancel',
        Component: PaymentCancel
      },
      {
        path: 'details-lessons',
        Component: DetailsLessons
      },
      {
        path: 'details-lessons/:id',
        element: <PrivateRoute><DetailsLessonInformation /></PrivateRoute>
      },
      {
        path: 'creator-profile/:email',
        Component: CreatorProfile
      },
      {
        path: 'login',
        Component: Login
      },
      {
        path: 'register',
        Component: Register
      }
    ]
  },
  {
    path: 'dashboard',
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        Component: DashboardHome
      },
      {
        path: 'add-lessons',
        Component: AddLessons
      },
      {
        path: 'my-lessons',
        Component: MyLessons
      },
      {
        path: 'update-lesson/:id',
        Component: UpdateLesson
      },
      {
        path: 'my-favourites',
        Component: MyFavourites
      },
      {
        path: 'my-profile',
        Component: MyProfile
      }
    ]
  },
  {
    path: 'admin',
    element: <AdminRoute><AdminLayout /></AdminRoute>,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        Component: AdminDashboardHome
      },
      {
        path: 'users',
        Component: ManageUsers
      },
      {
        path: 'lessons',
        Component: ManageLessons
      },
      {
        path: 'reported-lessons',
        Component: ReportedLessons
      },
      {
        path: 'profile',
        Component: AdminProfile
      }
    ]
  },
  {
    path: '*',
    Component: ErrorPage
  }
]);