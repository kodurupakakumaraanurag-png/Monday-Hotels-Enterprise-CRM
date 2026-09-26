import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";

export const metadata: Metadata = {
  title: "Monday Hotels | Enterprise CRM & Hospitality Operations",
  description: "Next-generation Luxury Hospitality CRM, Revenue Management, and Sales Pipeline Operations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#F7F4EC] text-[#18332B] min-h-screen">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
