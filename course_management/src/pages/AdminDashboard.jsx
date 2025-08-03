import React from "react";
import AddCollegeForm from "../pages/AddCollegeForm";
import CollegeTable from "../pages/CollegeTable";
import { Link } from "react-router-dom";

// Example inside JSX
<Link to="/public" className="text-blue-600 hover:underline">
  Go to Public View
</Link>


export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* LEFT SIDE: Add Form */}
        <div className="md:w-1/3 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Add New Course</h2>
          <AddCollegeForm />
        </div>

        {/* RIGHT SIDE: Table + CSV */}
        <div className="md:w-2/3 bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Manage Courses</h2>
            <div className="space-x-4 text-sm font-medium">
            </div>
          </div>
          <CollegeTable />
        </div>
      </div>
    </div>
  );
}
