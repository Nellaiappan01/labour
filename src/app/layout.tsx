// src/app/layout.tsx
import "../styles/casual-labour.css";
import React from "react";

export const metadata = {
  title: "ESCEE - Casual Labour",
  description: "Submit casual labour attendance"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
