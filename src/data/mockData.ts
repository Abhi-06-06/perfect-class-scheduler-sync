
import { Classroom, Course, Teacher, TimeSlot, TimetableEntry, Day, Batch, YearGroup } from "@/types";

export const DAYS_OF_WEEK: Day[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

export const BATCHES: Batch[] = ["A", "B", "C", "D", "E", "F"];

export const TIME_SLOTS: TimeSlot[] = [
  { id: "slot1", startTime: "10:00", endTime: "11:00", displayName: "1" },
  { id: "slot2", startTime: "11:00", endTime: "12:00", displayName: "2" },
  { id: "recess1", startTime: "12:00", endTime: "12:45", isBreak: true, displayName: "Recess" },
  { id: "recess2", startTime: "12:45", endTime: "1:45", isBreak: true, displayName: "Recess" },
  { id: "slot3", startTime: "1:45", endTime: "2:45", displayName: "3" },
  { id: "slot4", startTime: "2:45", endTime: "3:45", displayName: "4" },
  { id: "slot5", startTime: "3:45", endTime: "4:45", displayName: "5" }
];

// Modified year groups with variable batch counts
export const YEAR_GROUPS: YearGroup[] = [
  {
    id: "year1",
    year: 1,
    batches: ["A", "B", "C", "D", "E", "F"],
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
    batches: ["A", "B", "C"],
    courses: []
  },
  {
    id: "year4",
    year: 4,
    batches: ["A", "B"],
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
    isLab: false,
    yearAssigned: 1
  },
  {
    id: "room102",
    name: "102",
    capacity: 60,
    isLab: false,
    yearAssigned: 1
  },
  {
    id: "room103",
    name: "103",
    capacity: 60,
    isLab: false,
    yearAssigned: 1
  },
  {
    id: "room104",
    name: "104",
    capacity: 60,
    isLab: false,
    yearAssigned: 1
  },
  {
    id: "room105",
    name: "105",
    capacity: 60,
    isLab: false,
    yearAssigned: 1
  },
  {
    id: "room106",
    name: "106",
    capacity: 60,
    isLab: false,
    yearAssigned: 1
  },
  {
    id: "room201",
    name: "201",
    capacity: 60,
    isLab: false,
    yearAssigned: 2
  },
  {
    id: "room202",
    name: "202",
    capacity: 60,
    isLab: false,
    yearAssigned: 2
  },
  {
    id: "room203",
    name: "203",
    capacity: 60,
    isLab: false,
    yearAssigned: 2
  },
  {
    id: "lab201",
    name: "L201",
    capacity: 15,
    isLab: true,
    yearAssigned: 1
  },
  {
    id: "lab202",
    name: "L202",
    capacity: 15,
    isLab: true,
    yearAssigned: 1
  },
  {
    id: "lab203",
    name: "L203",
    capacity: 15,
    isLab: true,
    yearAssigned: 1
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
    year: 1,
    batches: ["A", "B", "C", "D", "E", "F"]
  },
  {
    id: "course2",
    name: "Mathematics for Computing",
    subjectCode: "M4C",
    requiredSessions: 4,
    requiresLab: false,
    teacherId: "teacher2",
    year: 1,
    batches: ["A", "B", "C", "D", "E", "F"]
  },
  {
    id: "course3",
    name: "Database Management Systems",
    subjectCode: "DBMS",
    requiredSessions: 3,
    requiresLab: true,
    teacherId: "teacher3",
    year: 1,
    batches: ["A", "B", "C", "D", "E", "F"]
  },
  {
    id: "course4",
    name: "Computer Organization",
    subjectCode: "CO",
    requiredSessions: 3,
    requiresLab: true,
    teacherId: "teacher4",
    year: 1,
    batches: ["A", "B", "C", "D", "E", "F"]
  },
  {
    id: "course5",
    name: "Software Engineering",
    subjectCode: "SE",
    requiredSessions: 2,
    requiresLab: true,
    teacherId: "teacher5",
    year: 1,
    batches: ["A", "B", "C", "D", "E", "F"]
  },
  {
    id: "course6",
    name: "Programming Fundamentals",
    subjectCode: "PF",
    requiredSessions: 2,
    requiresLab: false,
    teacherId: "teacher1",
    year: 1,
    batches: ["A", "B", "C", "D", "E", "F"]
  }
];

export const EMPTY_TIMETABLE: TimetableEntry[] = [];

// Sample timetable entries
export const SAMPLE_TIMETABLE: TimetableEntry[] = [
  // First Year - Batch A
  {
    id: "entry1",
    dayOfWeek: "Monday",
    timeSlotId: "slot1",
    courseId: "course2", // Mathematics
    teacherId: "teacher2",
    classroomId: "room101",
    year: 1,
    batch: "A"
  },
  {
    id: "entry2",
    dayOfWeek: "Monday",
    timeSlotId: "slot2",
    courseId: "course1", // DSA
    teacherId: "teacher1",
    classroomId: "room101",
    year: 1,
    batch: "A"
  },
  {
    id: "entry3",
    dayOfWeek: "Monday",
    timeSlotId: "slot3",
    courseId: "course3", // DBMS
    teacherId: "teacher3",
    classroomId: "room101",
    year: 1,
    batch: "A"
  },
  {
    id: "entry4",
    dayOfWeek: "Monday",
    timeSlotId: "slot4",
    courseId: "course3", // DBMS (Lab)
    teacherId: "teacher3",
    classroomId: "lab201",
    isLabSession: true,
    year: 1,
    batch: "A"
  },
  {
    id: "entry5",
    dayOfWeek: "Monday",
    timeSlotId: "slot5",
    courseId: "course3", // DBMS (Lab continued)
    teacherId: "teacher3",
    classroomId: "lab201",
    isLabSession: true,
    year: 1,
    batch: "A"
  },
  
  // First Year - Batch B
  {
    id: "entry6",
    dayOfWeek: "Monday",
    timeSlotId: "slot1",
    courseId: "course1", // DSA
    teacherId: "teacher1",
    classroomId: "room102",
    year: 1,
    batch: "B"
  },
  {
    id: "entry7",
    dayOfWeek: "Monday",
    timeSlotId: "slot2",
    courseId: "course2", // Mathematics
    teacherId: "teacher2",
    classroomId: "room102",
    year: 1,
    batch: "B"
  },
  {
    id: "entry8",
    dayOfWeek: "Monday",
    timeSlotId: "slot3",
    courseId: "course4", // CO
    teacherId: "teacher4",
    classroomId: "room102",
    year: 1,
    batch: "B"
  },
  {
    id: "entry9",
    dayOfWeek: "Monday",
    timeSlotId: "slot4",
    courseId: "course4", // CO (Lab)
    teacherId: "teacher4",
    classroomId: "lab202",
    isLabSession: true,
    year: 1,
    batch: "B"
  },
  {
    id: "entry10",
    dayOfWeek: "Monday",
    timeSlotId: "slot5",
    courseId: "course4", // CO (Lab continued)
    teacherId: "teacher4",
    classroomId: "lab202",
    isLabSession: true,
    year: 1,
    batch: "B"
  },
  
  // First Year - Batch C
  {
    id: "entry11",
    dayOfWeek: "Monday",
    timeSlotId: "slot1",
    courseId: "course3", // DBMS
    teacherId: "teacher3",
    classroomId: "room103",
    year: 1,
    batch: "C"
  },
  {
    id: "entry12",
    dayOfWeek: "Monday",
    timeSlotId: "slot2",
    courseId: "course4", // CO
    teacherId: "teacher4",
    classroomId: "room103",
    year: 1,
    batch: "C"
  },
  {
    id: "entry13",
    dayOfWeek: "Monday",
    timeSlotId: "slot3",
    courseId: "course5", // SE
    teacherId: "teacher5",
    classroomId: "room103",
    year: 1,
    batch: "C"
  },
  {
    id: "entry14",
    dayOfWeek: "Monday",
    timeSlotId: "slot4",
    courseId: "course5", // SE (Lab)
    teacherId: "teacher5",
    classroomId: "lab203",
    isLabSession: true,
    year: 1,
    batch: "C"
  },
  {
    id: "entry15",
    dayOfWeek: "Monday",
    timeSlotId: "slot5",
    courseId: "course5", // SE (Lab continued)
    teacherId: "teacher5",
    classroomId: "lab203",
    isLabSession: true,
    year: 1,
    batch: "C"
  },
];
