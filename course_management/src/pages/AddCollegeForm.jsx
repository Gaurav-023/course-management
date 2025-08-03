import React, { useState } from "react";
import { db } from "../api/firebase";
import { collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore";

export default function AddCollegeForm() {
  const [college, setCollege] = useState("");
  const [course, setCourse] = useState("");
  const [duration, setDuration] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [intake, setIntake] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const intakeArray = intake
      .split(",")
      .map((i) => i.trim())
      .filter((i) => i !== "");

    const newEntry = {
      college: college.trim(),
      course: course.trim(),
      duration: duration.trim(),
      city: city.trim(),
      province: province.trim(),
      intakes: intakeArray,
    };

    const snapshot = await getDocs(collection(db, "colleges"));
    let duplicateDoc = null;

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (
        data.college === newEntry.college &&
        data.course === newEntry.course &&
        data.duration === newEntry.duration &&
        data.city === newEntry.city &&
        data.province === newEntry.province
      ) {
        duplicateDoc = { id: docSnap.id, ...data };
      }
    });

    if (duplicateDoc) {
      const existingIntakes = duplicateDoc.intakes || [];
      const updatedIntakes = Array.from(
        new Set([...existingIntakes, ...intakeArray])
      );

      await updateDoc(doc(db, "colleges", duplicateDoc.id), {
        intakes: updatedIntakes,
      });
      alert("Course intake updated.");
    } else {
      await addDoc(collection(db, "colleges"), newEntry);
      alert("New course added.");
    }

    // Reset form
    setCollege("");
    setCourse("");
    setDuration("");
    setCity("");
    setProvince("");
    setIntake("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="College Name"
        className="w-full border rounded px-3 py-2"
        value={college}
        onChange={(e) => setCollege(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Course"
        className="w-full border rounded px-3 py-2"
        value={course}
        onChange={(e) => setCourse(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Duration"
        className="w-full border rounded px-3 py-2"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="City"
        className="w-full border rounded px-3 py-2"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Province"
        className="w-full border rounded px-3 py-2"
        value={province}
        onChange={(e) => setProvince(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Intake (e.g., Jan, Sep)"
        className="w-full border rounded px-3 py-2"
        value={intake}
        onChange={(e) => setIntake(e.target.value)}
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
}
