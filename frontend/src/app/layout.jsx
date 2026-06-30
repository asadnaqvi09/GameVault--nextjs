import { workSans, satoshi } from "../lib/fonts";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import SmoothScroll from "@/components/shared/SmoothScroll";
import StoreProvider from '@/store/provider/storeProvider';
import { ToastProvider } from '@/context/ToastContext';
import "./global.css";

export const metadata = {
  title: "GameVault",
  description: "Your ultimate destination for premium PC games. Discover the latest releases, legendary titles, and exclusive deals. Fast, secure, and always evolving.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${satoshi.variable} ${workSans.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col">
          <StoreProvider>
          <ToastProvider>
          <SmoothScroll />
          <Navbar />
          {children}
          <Footer />
          </ToastProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
