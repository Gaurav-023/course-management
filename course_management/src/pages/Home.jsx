import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Course Management System</h1>
      <div className="space-x-4">
        <Link
          to="/admin"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Admin
        </Link>
        <Link
          to="/public"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Public
        </Link>
        {/* ❌ Removed the Explore link */}
      </div>
    </div>
  );
}
