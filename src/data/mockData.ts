
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
  { id: "slot1", startTime: "10:00", endTime: "11:00", displayName: "1" },
  { id: "slot2", startTime: "11:00", endTime: "12:00", displayName: "2" },
  { id: "recess1", startTime: "12:00", endTime: "12:45", isBreak: true, displayName: "Recess" },
  { id: "slot3", startTime: "12:45", endTime: "1:45", displayName: "3" },
  { id: "slot4", startTime: "1:45", endTime: "2:45", displayName: "4" },
  { id: "recess2", startTime: "2:45", endTime: "3:00", isBreak: true, displayName: "Recess" },
  { id: "slot5", startTime: "3:00", endTime: "4:00", displayName: "5" },
  { id: "slot6", startTime: "4:00", endTime: "5:00", displayName: "6" },
  { id: "lab1", startTime: "10:00", endTime: "12:00", isLabSession: true, displayName: "1-2 Lab" },
  { id: "lab2", startTime: "12:45", endTime: "2:45", isLabSession: true, displayName: "3-4 Lab" },
  { id: "lab3", startTime: "3:00", endTime: "5:00", isLabSession: true, displayName: "5-6 Lab" }
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

// Demo data for teachers
export const SAMPLE_TEACHERS: Teacher[] = [
  {
    id: "teacher1",
    name: "Dr. Patel",
    subjects: ["Data Structures", "Algorithms", "Computer Networks"],
    maxConsecutiveLectures: 2
  },
  {
    id: "teacher2",
    name: "Prof. Sharma",
    subjects: ["Mathematics", "Statistics"],
    maxConsecutiveLectures: 3
  },
  {
    id: "teacher3",
    name: "Dr. Kumar",
    subjects: ["Database Systems", "Operating Systems"],
    maxConsecutiveLectures: 2
  },
  {
    id: "teacher4",
    name: "Prof. Singh",
    subjects: ["Computer Architecture", "Digital Logic Design"],
    maxConsecutiveLectures: 2
  },
  {
    id: "teacher5",
    name: "Dr. Gupta",
    subjects: ["Software Engineering", "Project Management"],
    maxConsecutiveLectures: 3
  }
];

// Demo data for classrooms
export const SAMPLE_CLASSROOMS: Classroom[] = [
  {
    id: "room101",
    name: "101",
    capacity: 60,
    isLab: false
  },
  {
    id: "room102",
    name: "102",
    capacity: 60,
    isLab: false
  },
  {
    id: "room103",
    name: "103",
    capacity: 60,
    isLab: false,
    yearAssigned: 1
  },
  {
    id: "lab201",
    name: "L201",
    capacity: 30,
    isLab: true
  },
  {
    id: "lab202",
    name: "L202",
    capacity: 30,
    isLab: true
  }
];

// Demo data for courses
export const SAMPLE_COURSES: Course[] = [
  {
    id: "course1",
    name: "Data Structures and Algorithms",
    subjectCode: "DSA",
    requiredSessions: 3,
    requiresLab: true,
    teacherId: "teacher1",
    year: 2,
    batches: ["A", "B"]
  },
  {
    id: "course2",
    name: "Mathematics for Computing",
    subjectCode: "M4C",
    requiredSessions: 4,
    requiresLab: false,
    teacherId: "teacher2",
    year: 1
  },
  {
    id: "course3",
    name: "Database Management Systems",
    subjectCode: "DBMS",
    requiredSessions: 3,
    requiresLab: true,
    teacherId: "teacher3",
    year: 2,
    batches: ["A", "B", "C"]
  },
  {
    id: "course4",
    name: "Computer Organization",
    subjectCode: "CO",
    requiredSessions: 3,
    requiresLab: false,
    teacherId: "teacher4",
    year: 1
  },
  {
    id: "course5",
    name: "Software Engineering",
    subjectCode: "SE",
    requiredSessions: 2,
    requiresLab: false,
    teacherId: "teacher5",
    year: 3
  }
];

export const EMPTY_TIMETABLE: TimetableEntry[] = [];

// Sample timetable entries
export const SAMPLE_TIMETABLE: TimetableEntry[] = [
  // Regular lectures
  {
    id: "entry1",
    dayOfWeek: "Monday",
    timeSlotId: "slot1",
    courseId: "course2", // Mathematics
    teacherId: "teacher2",
    classroomId: "room101",
    year: 1
  },
  {
    id: "entry2",
    dayOfWeek: "Monday",
    timeSlotId: "slot2",
    courseId: "course4", // Computer Organization
    teacherId: "teacher4",
    classroomId: "room101",
    year: 1
  },
  {
    id: "entry3",
    dayOfWeek: "Monday",
    timeSlotId: "slot3",
    courseId: "course2", // Mathematics
    teacherId: "teacher2",
    classroomId: "room101",
    year: 1
  },
  {
    id: "entry4",
    dayOfWeek: "Tuesday",
    timeSlotId: "slot1",
    courseId: "course1", // DSA
    teacherId: "teacher1",
    classroomId: "room102",
    year: 2
  },
  {
    id: "entry5",
    dayOfWeek: "Tuesday",
    timeSlotId: "slot2",
    courseId: "course3", // DBMS
    teacherId: "teacher3",
    classroomId: "room102",
    year: 2
  },
  {
    id: "entry6",
    dayOfWeek: "Tuesday",
    timeSlotId: "slot5",
    courseId: "course5", // Software Engineering
    teacherId: "teacher5",
    classroomId: "room103",
    year: 3
  },
  {
    id: "entry7",
    dayOfWeek: "Wednesday",
    timeSlotId: "slot3",
    courseId: "course4", // Computer Organization
    teacherId: "teacher4",
    classroomId: "room101",
    year: 1
  },
  {
    id: "entry8",
    dayOfWeek: "Wednesday",
    timeSlotId: "slot4",
    courseId: "course1", // DSA
    teacherId: "teacher1",
    classroomId: "room102",
    year: 2
  },
  {
    id: "entry9",
    dayOfWeek: "Thursday",
    timeSlotId: "slot2",
    courseId: "course2", // Mathematics
    teacherId: "teacher2",
    classroomId: "room101",
    year: 1
  },
  {
    id: "entry10",
    dayOfWeek: "Thursday",
    timeSlotId: "slot3",
    courseId: "course3", // DBMS
    teacherId: "teacher3",
    classroomId: "room102",
    year: 2
  },
  
  // Lab sessions
  {
    id: "entry11",
    dayOfWeek: "Monday",
    timeSlotId: "lab3", // 3:00-5:00
    courseId: "course1", // DSA Lab
    teacherId: "teacher1",
    classroomId: "lab201",
    batch: "A",
    isLabSession: true,
    year: 2
  },
  {
    id: "entry12",
    dayOfWeek: "Wednesday",
    timeSlotId: "lab1", // 10:00-12:00
    courseId: "course1", // DSA Lab
    teacherId: "teacher1",
    classroomId: "lab201",
    batch: "B",
    isLabSession: true,
    year: 2
  },
  {
    id: "entry13",
    dayOfWeek: "Tuesday",
    timeSlotId: "lab3", // 3:00-5:00
    courseId: "course3", // DBMS Lab
    teacherId: "teacher3",
    classroomId: "lab202",
    batch: "A",
    isLabSession: true,
    year: 2
  },
  {
    id: "entry14",
    dayOfWeek: "Thursday",
    timeSlotId: "lab1", // 10:00-12:00
    courseId: "course3", // DBMS Lab
    teacherId: "teacher3",
    classroomId: "lab202",
    batch: "B",
    isLabSession: true,
    year: 2
  },
  {
    id: "entry15",
    dayOfWeek: "Friday",
    timeSlotId: "lab1", // 10:00-12:00
    courseId: "course3", // DBMS Lab
    teacherId: "teacher3",
    classroomId: "lab202",
    batch: "C",
    isLabSession: true,
    year: 2
  }
];
