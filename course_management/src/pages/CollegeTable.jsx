import React, { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../api/firebase';
import Papa from 'papaparse';

export default function CollegeTable() {
  const [colleges, setColleges] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const fetchColleges = async () => {
    const data = await getDocs(collection(db, 'colleges'));
    setColleges(data.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'colleges', id));
    fetchColleges();
  };

  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        const importedData = results.data;
        for (let item of importedData) {
          try {
            await addDoc(collection(db, 'colleges'), {
              college: item.College || '',
              course: item.Course || '',
              duration: item.Duration || '',
              city: item.City || '',
              province: item.Province || '',
              intakes: item.Intakes ? item.Intakes.split(';') : [],
            });
          } catch (err) {
            console.error('Error importing row:', err);
          }
        }
        fetchColleges();
      },
    });
  };

  const handleExportCSV = () => {
    const headers = ['College', 'Course', 'Duration', 'City', 'Province', 'Intakes'];
    const rows = colleges.map(college => [
      college.college,
      college.course,
      college.duration,
      college.city,
      college.province,
      (college.intakes || []).join(';')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(value => `"${value}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'courses.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEdit = (college) => {
    setEditId(college.id);
    setEditData({ ...college, intakes: (college.intakes || []).join(';') });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setEditId(null);
    setEditData({});
  };

  const handleSave = async (id) => {
    const docRef = doc(db, 'colleges', id);
    const updated = {
      ...editData,
      intakes: editData.intakes.split(';').map(i => i.trim())
    };
    await updateDoc(docRef, updated);
    setEditId(null);
    setEditData({});
    fetchColleges();
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manage Courses</h2>
        <div className="flex items-center gap-4 text-sm text-blue-600">
           <label className="cursor-pointer">
             Import CSV
           <input
           type="file"
           accept=".csv"
           onChange={handleImportCSV}
                  className="hidden"
          />
           </label>
          <button onClick={handleExportCSV} className="hover:underline">
           Export CSV
          </button>
          </div>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            {['College', 'Course', 'City', 'Intake', 'Actions'].map((head) => (
              <th key={head} className="py-2 font-semibold">
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {colleges.map((college) => (
            <tr key={college.id} className="border-b">
              {editId === college.id ? (
                <>
                  <td className="py-2">
                    <input
                      name="college"
                      value={editData.college}
                      onChange={handleEditChange}
                      className="border p-1 w-full"
                    />
                  </td>
                  <td className="py-2">
                    <input
                      name="course"
                      value={editData.course}
                      onChange={handleEditChange}
                      className="border p-1 w-full"
                    />
                    <input
                      name="duration"
                      value={editData.duration}
                      onChange={handleEditChange}
                      className="border p-1 w-full text-sm mt-1"
                    />
                  </td>
                  <td className="py-2">
                    <input
                      name="city"
                      value={editData.city}
                      onChange={handleEditChange}
                      className="border p-1 w-full"
                    />
                    <input
                      name="province"
                      value={editData.province}
                      onChange={handleEditChange}
                      className="border p-1 w-full text-sm mt-1"
                    />
                  </td>
                  <td className="py-2">
                    <input
                      name="intakes"
                      value={editData.intakes}
                      onChange={handleEditChange}
                      className="border p-1 w-full"
                    />
                  </td>
                  <td className="py-2 flex gap-2">
                    <button
                      onClick={() => handleSave(college.id)}
                      className="text-green-600 hover:underline"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="text-gray-600 hover:underline"
                    >
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td className="py-2 font-bold">{college.college}</td>
                  <td className="py-2">
                    {college.course}
                    <br />
                    <span className="text-gray-500 text-sm">{college.duration}</span>
                  </td>
                  <td className="py-2">
                    {college.city}
                    <br />
                    <span className="text-gray-500 text-sm">{college.province}</span>
                  </td>
                  <td className="py-2">{college.intakes?.join(', ')}</td>
                  <td className="py-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(college)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(college.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
          {colleges.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center text-gray-500 py-4">
                No courses added yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
