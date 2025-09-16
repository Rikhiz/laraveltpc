import React from "react";
import Header from "@/Components/Header";

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="max-w-7xl mx-auto p-6">{children}</main>
    </div>
  );
}
