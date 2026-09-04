import { createBrowserRouter } from "react-router";
import { lazy, Suspense, type ComponentType } from "react";
import RootLayout from "./layouts/RootLayout";

// Route-level code splitting: each page is a separate chunk that is only
// downloaded when the visitor navigates to it, instead of all pages
// shipping in the initial bundle.
const HomePage = lazy(() => import("./pages/HomePage"));
const ProjectDetailPage = lazy(() => import("./pages/ProjectDetailPage"));
const PublicationDetailPage = lazy(() => import("./pages/PublicationDetailPage"));
const AllPublicationsPage = lazy(() => import("./pages/AllPublicationsPage"));
const BlogDetailPage = lazy(() => import("./pages/BlogDetailPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function withSuspense(Component: ComponentType) {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center text-gray-400">
          Loading…
        </div>
      }
    >
      <Component />
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, element: withSuspense(HomePage) },
      { path: "projects/:slug", element: withSuspense(ProjectDetailPage) },
      { path: "publications", element: withSuspense(AllPublicationsPage) },
      { path: "publications/:slug", element: withSuspense(PublicationDetailPage) },
      { path: "blog/:slug", element: withSuspense(BlogDetailPage) },
      { path: "*", element: withSuspense(NotFoundPage) },
    ],
  },
]);
