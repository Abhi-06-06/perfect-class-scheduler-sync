
import { Classroom, Course, Teacher, TimeSlot, TimetableEntry, Day } from "@/types";

export const DAYS_OF_WEEK: Day[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

export const TIME_SLOTS: TimeSlot[] = [
  { id: "slot1", startTime: "09:00", endTime: "10:00" },
  { id: "slot2", startTime: "10:00", endTime: "11:00" },
  { id: "slot3", startTime: "11:00", endTime: "12:00" },
  { id: "recess1", startTime: "12:00", endTime: "12:45", isBreak: true },
  { id: "slot4", startTime: "12:45", endTime: "13:45" },
  { id: "slot5", startTime: "13:45", endTime: "14:45" },
  { id: "slot6", startTime: "14:45", endTime: "15:45" },
  { id: "recess2", startTime: "15:45", endTime: "16:00", isBreak: true },
  { id: "slot7", startTime: "16:00", endTime: "17:00" },
];

export const SAMPLE_TEACHERS: Teacher[] = [
  {
    id: "t1",
    name: "Dr. Jane Smith",
    subjects: ["Mathematics", "Statistics"],
    maxConsecutiveLectures: 2
  },
  {
    id: "t2",
    name: "Prof. John Davis",
    subjects: ["Computer Science", "Programming"],
    maxConsecutiveLectures: 3
  },
  {
    id: "t3",
    name: "Dr. Robert Johnson",
    subjects: ["Physics"],
    maxConsecutiveLectures: 2
  },
  {
    id: "t4",
    name: "Prof. Emily White",
    subjects: ["Chemistry", "Biology"],
    maxConsecutiveLectures: 2
  }
];

export const SAMPLE_CLASSROOMS: Classroom[] = [
  { id: "c1", name: "A101", capacity: 60, isLab: false },
  { id: "c2", name: "A102", capacity: 40, isLab: false },
  { id: "c3", name: "B201", capacity: 30, isLab: false },
  { id: "c4", name: "L101", capacity: 30, isLab: true },
  { id: "c5", name: "L102", capacity: 25, isLab: true }
];

export const SAMPLE_COURSES: Course[] = [
  {
    id: "crs1",
    name: "Calculus I",
    subjectCode: "MATH101",
    requiredSessions: 4,
    requiresLab: false,
    teacherId: "t1"
  },
  {
    id: "crs2",
    name: "Programming Fundamentals",
    subjectCode: "CS101",
    requiredSessions: 3,
    requiresLab: true,
    teacherId: "t2"
  },
  {
    id: "crs3",
    name: "Physics I",
    subjectCode: "PHY101",
    requiredSessions: 3,
    requiresLab: true,
    teacherId: "t3"
  },
  {
    id: "crs4",
    name: "Chemistry Basics",
    subjectCode: "CHEM101",
    requiredSessions: 3,
    requiresLab: true,
    teacherId: "t4"
  },
  {
    id: "crs5",
    name: "Statistics",
    subjectCode: "MATH202",
    requiredSessions: 2,
    requiresLab: false,
    teacherId: "t1"
  }
];

// Initial empty timetable
export const EMPTY_TIMETABLE: TimetableEntry[] = [];

// A sample pre-generated timetable for demonstration
export const SAMPLE_TIMETABLE: TimetableEntry[] = [
  {
    id: "entry1",
    dayOfWeek: "Monday",
    timeSlotId: "slot1",
    courseId: "crs1",
    teacherId: "t1",
    classroomId: "c1"
  },
  {
    id: "entry2",
    dayOfWeek: "Monday",
    timeSlotId: "slot2",
    courseId: "crs2",
    teacherId: "t2",
    classroomId: "c4"
  },
  {
    id: "entry3",
    dayOfWeek: "Monday",
    timeSlotId: "slot3",
    courseId: "crs3",
    teacherId: "t3",
    classroomId: "c5"
  },
  // More entries would be added for a complete timetable
];
