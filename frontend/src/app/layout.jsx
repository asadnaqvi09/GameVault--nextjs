import { workSans, satoshi } from "../lib/fonts";
import LayoutShell from "@/components/shared/LayoutShell";
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
          <LayoutShell>{children}</LayoutShell>
          </ToastProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
