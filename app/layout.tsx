import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "AI Night at the Museum",
  description:
    "An evidence-led prehistoric museum mystery for OpenAI Build Week 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
