// src/constants.js
const INTAKE_SCHEDULE = [
  { label: 'Jan', month: 1 },
  { label: 'May', month: 5 },
  { label: 'Sep', month: 9 },
];

export function getUpcomingIntakes(count = 6) {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  let year = now.getFullYear();
  let idx = INTAKE_SCHEDULE.findIndex(i => i.month > currentMonth);
  if (idx === -1) {
    idx = 0;
    year++;
  }

  return Array.from({ length: count }, (_, i) => {
    const sched = INTAKE_SCHEDULE[(idx + i) % INTAKE_SCHEDULE.length];
    const yearOffset = Math.floor((idx + i) / INTAKE_SCHEDULE.length);
    const optYear = year + yearOffset;
    const label = `${sched.label} ${optYear}`;
    return { label, value: label };
  });
}
import { addDoc, collection } from 'firebase/firestore';

// inside App():
const handleAdd = async (data) => {
  console.log('handleAdd received:', data);
  const docRef = await addDoc(collection(db, 'colleges'), data);
  console.log('New doc created with ID:', docRef.id);
  await loadColleges();
};

