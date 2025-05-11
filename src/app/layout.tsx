import "./styles/globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Memo Generator",
  description: "Memo Generator for 3x3 blindfolded",
  icons: {
    icon: "/icons/eyemask.png",
  },
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
