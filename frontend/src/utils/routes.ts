import HomePage from "../pages/Home/HomePage";
import NotFoundPage from "../pages/NotFoundPage";
import { HOME_PAGE_ROUTE } from "./const";


export const routes = [
  {
    path: HOME_PAGE_ROUTE,
    element: HomePage,
  },
 
  {
    path: "*",
    element: NotFoundPage,
  },
];