import { Link } from "react-router-dom";

import React, { useEffect, useState, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../api/firebase";
<Link to="/admin" className="text-sm text-blue-600 hover:underline">
  Admin Panel
</Link>


export default function PublicView() {
  const [colleges, setColleges] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    college: "",
    course: "",
    city: "",
    province: "",
    intake: "All Intakes"
  });

  useEffect(() => {
    async function fetchData() {
      const snapshot = await getDocs(collection(db, "colleges"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setColleges(data);
    }

    fetchData();
  }, []);

  const filteredColleges = useMemo(() => {
    return colleges.filter((item) => {
      return (
        (search === "" || Object.values(item).some((value) =>
          String(value).toLowerCase().includes(search.toLowerCase())
        )) &&
        (filters.college === "" || item.college.toLowerCase().includes(filters.college.toLowerCase())) &&
        (filters.course === "" || item.course.toLowerCase().includes(filters.course.toLowerCase())) &&
        (filters.city === "" || item.city.toLowerCase().includes(filters.city.toLowerCase())) &&
        (filters.province === "" || item.province.toLowerCase().includes(filters.province.toLowerCase())) &&
        (filters.intake === "All Intakes" || item.intakes?.includes(filters.intake))
      );
    });
  }, [colleges, search, filters]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Find Your Perfect Course</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by any keyword"
          className="p-2 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by college..."
          className="p-2 border rounded"
          value={filters.college}
          onChange={(e) => setFilters({ ...filters, college: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filter by course..."
          className="p-2 border rounded"
          value={filters.course}
          onChange={(e) => setFilters({ ...filters, course: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filter by city..."
          className="p-2 border rounded"
          value={filters.city}
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filter by province..."
          className="p-2 border rounded"
          value={filters.province}
          onChange={(e) => setFilters({ ...filters, province: e.target.value })}
        />
        <select
          className="p-2 border rounded"
          value={filters.intake}
          onChange={(e) => setFilters({ ...filters, intake: e.target.value })}
        >
          <option>All Intakes</option>
          <option>Jan 2025</option>
          <option>May 2025</option>
          <option>Sep 2025</option>
          <option>Jan 2026</option>
          <option>May 2026</option>
          <option>Sep 2026</option>
        </select>
      </div>

      <div className="flex justify-end mb-4">
        <button
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
          onClick={() =>
            setFilters({
              college: "",
              course: "",
              city: "",
              province: "",
              intake: "All Intakes"
            }) || setSearch("")
          }
        >
          Reset All
        </button>
      </div>

      {/* Table */}
      <div className="overflow-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-left px-4 py-2">College</th>
              <th className="text-left px-4 py-2">Course</th>
              <th className="text-left px-4 py-2">Duration</th>
              <th className="text-left px-4 py-2">City / Province</th>
              <th className="text-left px-4 py-2">Intake</th>
            </tr>
          </thead>
          <tbody>
            {filteredColleges.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-2">{item.college}</td>
                <td className="px-4 py-2">{item.course}</td>
                <td className="px-4 py-2">{item.duration}</td>
                <td className="px-4 py-2">
                  {item.city}
                  <br />
                  <span className="text-sm text-gray-500">{item.province}</span>
                </td>
                <td className="px-4 py-2 space-x-1">
                  {item.intakes?.map((intake, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs inline-block"
                    >
                      {intake}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
            {filteredColleges.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No courses found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
