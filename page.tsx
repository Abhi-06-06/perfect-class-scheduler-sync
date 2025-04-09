'use client';

import React, { useState } from "react";

type Subject = {
  id: string;
  name: string;
  teacher: string;
  duration: number;
};

type Slot = {
  day: string;
  time: string;
  room: string;
};

type Timetable = Record<string, Slot[]>;

const subjects: Subject[] = [
  { id: "1", name: "Math", teacher: "Prof. A", duration: 1 },
  { id: "2", name: "Physics", teacher: "Prof. B", duration: 2 },
];

const slots: Slot[] = [
  { day: "Monday", time: "9:00-10:00", room: "101" },
  { day: "Monday", time: "10:00-11:00", room: "102" },
  { day: "Tuesday", time: "9:00-10:00", room: "101" },
];

function generateTimetable(subjects: Subject[], slots: Slot[]): Timetable {
  const timetable: Timetable = {};
  const usedSlots = new Set<string>();

  for (const subject of subjects) {
    for (const slot of slots) {
      const key = `${slot.day}-${slot.time}-${slot.room}`;
      if (!usedSlots.has(key)) {
        if (!timetable[subject.teacher]) timetable[subject.teacher] = [];
        timetable[subject.teacher].push(slot);
        usedSlots.add(key);
        break;
      }
    }
  }

  return timetable;
}

export default function GeneratePage() {
  const [timetable, setTimetable] = useState<Timetable | null>(null);

  const handleGenerate = () => {
    const result = generateTimetable(subjects, slots);
    setTimetable(result);
  };

  return (
    <div className="p-4">
      <button
        onClick={handleGenerate}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Generate Timetable
      </button>

      {timetable && (
        <div className="mt-6">
          <h2 className="text-xl font-bold">Generated Timetable</h2>
          <div className="mt-2">
            {Object.entries(timetable).map(([teacher, slots], index) => (
              <div key={index} className="mb-4">
                <h3 className="font-semibold">{teacher}</h3>
                <ul className="list-disc pl-6">
                  {slots.map((slot, idx) => (
                    <li key={idx}>{slot.day}, {slot.time} in Room {slot.room}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
