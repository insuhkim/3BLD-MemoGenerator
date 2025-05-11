import "./styles/global.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Memo Generator",
  description: "Memo Generator for 3x3 blindfolded",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
