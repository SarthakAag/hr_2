import type { Metadata } from "next";
import "./globals.css";
import { MSWProvider } from "@/components/MSWProvider";

export const metadata: Metadata = {
  title: "HR Workflow Designer",
  description: "Visual HR workflow builder — Tredence Studio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "'Inter', system-ui, sans-serif" }}>
        <MSWProvider>{children}</MSWProvider>
      </body>
    </html>
  );
}