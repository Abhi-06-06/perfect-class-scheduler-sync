import { Classroom, Course, Teacher, TimeSlot, TimetableEntry, Day, Batch, YearGroup } from "@/types";

export const DAYS_OF_WEEK: Day[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

export const BATCHES: Batch[] = ["A", "B", "C", "D"];

export const TIME_SLOTS: TimeSlot[] = [
  { id: "slot1", startTime: "10:00", endTime: "11:00" },
  { id: "slot2", startTime: "11:00", endTime: "12:00" },
  { id: "recess1", startTime: "12:00", endTime: "12:30", isBreak: true },
  { id: "slot3", startTime: "12:30", endTime: "13:30" },
  { id: "slot4", startTime: "13:30", endTime: "14:30" },
  { id: "slot5", startTime: "14:30", endTime: "15:30" },
  { id: "slot6", startTime: "15:30", endTime: "16:30" },
  { id: "slot7", startTime: "16:30", endTime: "17:00" },
  { id: "lab1", startTime: "10:00", endTime: "12:00", isLabSession: true },
  { id: "lab2", startTime: "12:30", endTime: "14:30", isLabSession: true },
  { id: "lab3", startTime: "14:30", endTime: "16:30", isLabSession: true },
  { id: "lab4", startTime: "15:00", endTime: "17:00", isLabSession: true }
];

export const YEAR_GROUPS: YearGroup[] = [
  {
    id: "year1",
    year: 1,
    batches: ["A", "B", "C", "D"],
    courses: []
  },
  {
    id: "year2",
    year: 2,
    batches: ["A", "B", "C", "D"],
    courses: []
  },
  {
    id: "year3",
    year: 3,
    batches: ["A", "B", "C", "D"],
    courses: []
  },
  {
    id: "year4",
    year: 4,
    batches: ["A", "B", "C", "D"],
    courses: []
  }
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
  { id: "c1", name: "A101", capacity: 60, isLab: false, yearAssigned: 1 },
  { id: "c2", name: "A102", capacity: 60, isLab: false, yearAssigned: 2 },
  { id: "c3", name: "B201", capacity: 60, isLab: false, yearAssigned: 3 },
  { id: "c4", name: "B202", capacity: 60, isLab: false, yearAssigned: 4 },
  { id: "lab1", name: "L101", capacity: 30, isLab: true },
  { id: "lab2", name: "L102", capacity: 30, isLab: true }
];

export const SAMPLE_COURSES: Course[] = [
  {
    id: "crs1",
    name: "Calculus I",
    subjectCode: "MATH101",
    requiredSessions: 4,
    requiresLab: false,
    teacherId: "t1",
    year: 1
  },
  {
    id: "crs2",
    name: "Programming Fundamentals",
    subjectCode: "CS101",
    requiredSessions: 3,
    requiresLab: true,
    teacherId: "t2",
    year: 1, 
    batches: ["A", "B", "C", "D"]
  },
  {
    id: "crs3",
    name: "Physics I",
    subjectCode: "PHY101",
    requiredSessions: 3,
    requiresLab: true,
    teacherId: "t3",
    year: 1,
    batches: ["A", "B", "C", "D"]
  },
  {
    id: "crs4",
    name: "Circuit Theory",
    subjectCode: "ECE201",
    requiredSessions: 3,
    requiresLab: true,
    teacherId: "t4",
    year: 2,
    batches: ["A", "B", "C", "D"]
  },
  {
    id: "crs5",
    name: "Data Structures",
    subjectCode: "CS202",
    requiredSessions: 2,
    requiresLab: true,
    teacherId: "t2",
    year: 2,
    batches: ["A", "B", "C", "D"]
  }
];

export const EMPTY_TIMETABLE: TimetableEntry[] = [];

export const SAMPLE_TIMETABLE: TimetableEntry[] = [
  {
    id: "entry1",
    dayOfWeek: "Monday",
    timeSlotId: "slot1",
    courseId: "crs1",
    teacherId: "t1",
    classroomId: "c1",
    year: 1
  },
  {
    id: "entry2",
    dayOfWeek: "Monday",
    timeSlotId: "lab1",
    courseId: "crs2",
    teacherId: "t2",
    classroomId: "lab1",
    batch: "A",
    isLabSession: true,
    year: 1
  },
  {
    id: "entry3",
    dayOfWeek: "Monday",
    timeSlotId: "lab1",
    courseId: "crs3",
    teacherId: "t3",
    classroomId: "lab2",
    batch: "B",
    isLabSession: true,
    year: 1
  }
];
