import { createBrowserRouter } from "react-router";
import HomePage from "./pages/HomePage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import PublicationDetailPage from "./pages/PublicationDetailPage";
import AllPublicationsPage from "./pages/AllPublicationsPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import RootLayout from "./layouts/RootLayout";
import NotFoundPage from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "projects/:slug", Component: ProjectDetailPage },
      { path: "publications", Component: AllPublicationsPage },
      { path: "publications/:slug", Component: PublicationDetailPage },
      { path: "blog/:slug", Component: BlogDetailPage },
      { path: "*", Component: NotFoundPage },
    ],
  },
]);
