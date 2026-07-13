import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AnimatedBackground from "../components/AnimatedBackground";

export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden isolate">
      {/* Global ML background layer shared by all pages */}
      <AnimatedBackground />

      {/* Fixed navbar (z-50) */}
      <Navbar />

      {/* Content (z-10) */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <main className="flex-1 pt-16">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
