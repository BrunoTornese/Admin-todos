import AuthProvider from "@/auth/components/AuthProvider";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Mi Dashboard",
  description: " Dashboard creado a modo de practicar NextJs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <html lang="es">
        <body className={inter.className}>{children}</body>
      </html>
    </AuthProvider>
  );
}
