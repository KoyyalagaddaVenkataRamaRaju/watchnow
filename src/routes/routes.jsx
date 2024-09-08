import BookingPage from "../pages/BookingPage/BookingPage";
import CartPage from "../pages/CartPage/CartPage";
import Home from "../pages/Home/Home";
import Register from "../pages/Login/Register";
import Signin from "../pages/Login/Signin";
import MovieDetails from "../pages/MovieDetails/MovieDetails";
import MovieForm from "../pages/MovieForm/MovieForm";

export const routes = [
  { path: '/', element: <Register/> },
  {path:'/login',element:<Signin />},
  {path:'/home',element:<Home/>},
  { path: '/admin', element: <MovieForm /> },
  {path:'/details/:id',element:<MovieDetails/>},
  {path:'/booking/:id',element:<BookingPage/>},
  {path:'/cart',element:<CartPage/>}
];
