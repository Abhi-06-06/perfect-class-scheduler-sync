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
  { id: "slot3", startTime: "12:45", endTime: "1:45", displayName: "3" },
  { id: "slot4", startTime: "1:45", endTime: "2:45", displayName: "4" },
  { id: "slot5", startTime: "2:45", endTime: "3:45", displayName: "5" },
  { id: "slot6", startTime: "3:45", endTime: "4:45", displayName: "6" }
];

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

export const SAMPLE_TEACHERS: Teacher[] = [
  {
    id: "teacher1",
    name: "Dr. Patel",
    subjects: ["Data Structures", "Algorithms", "Computer Networks"],
    maxConsecutiveLectures: 3
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
    maxConsecutiveLectures: 3
  },
  {
    id: "teacher4",
    name: "Prof. Singh",
    subjects: ["Computer Architecture", "Digital Logic Design"],
    maxConsecutiveLectures: 3
  },
  {
    id: "teacher5",
    name: "Dr. Gupta",
    subjects: ["Software Engineering", "Project Management"],
    maxConsecutiveLectures: 3
  }
];

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

export const SAMPLE_COURSES: Course[] = [
  {
    id: "course1",
    name: "Data Structures and Algorithms",
    subjectCode: "DSA",
    requiredSessions: 3,
    requiresLab: true,
    teacherId: "teacher1",
    year: 1,
    batches: ["A", "B", "C", "D"]
  },
  {
    id: "course2",
    name: "Mathematics for Computing",
    subjectCode: "M4C",
    requiredSessions: 2,
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
    year: 1,
    batches: ["A", "B", "C", "D"]
  },
  {
    id: "course4",
    name: "Computer Organization",
    subjectCode: "CO",
    requiredSessions: 2,
    requiresLab: false,
    teacherId: "teacher4",
    year: 1
  }
];

export const EMPTY_TIMETABLE: TimetableEntry[] = [];

export const SAMPLE_TIMETABLE: TimetableEntry[] = [
  // Monday - Common Lectures
  {
    id: "entry1",
    dayOfWeek: "Monday",
    timeSlotId: "slot1",
    courseId: "course2", // Mathematics (common lecture)
    teacherId: "teacher2",
    classroomId: "room101",
    year: 1
  },
  {
    id: "entry2",
    dayOfWeek: "Monday",
    timeSlotId: "slot2",
    courseId: "course4", // Computer Organization (common lecture)
    teacherId: "teacher4",
    classroomId: "room101",
    year: 1
  },
  
  // Monday - Lab Sessions for Batch A and B
  {
    id: "entry3",
    dayOfWeek: "Monday",
    timeSlotId: "slot3",
    courseId: "course1", // DSA Lab - Batch A
    teacherId: "teacher1",
    classroomId: "lab201",
    batch: "A",
    isLabSession: true,
    year: 1
  },
  {
    id: "entry4",
    dayOfWeek: "Monday",
    timeSlotId: "slot4",
    courseId: "course1", // DSA Lab - Batch A (continued)
    teacherId: "teacher1",
    classroomId: "lab201",
    batch: "A",
    isLabSession: true,
    year: 1
  },
  {
    id: "entry5",
    dayOfWeek: "Monday",
    timeSlotId: "slot3",
    courseId: "course3", // DBMS Lab - Batch B
    teacherId: "teacher3",
    classroomId: "lab202",
    batch: "B",
    isLabSession: true,
    year: 1
  },
  {
    id: "entry6",
    dayOfWeek: "Monday",
    timeSlotId: "slot4",
    courseId: "course3", // DBMS Lab - Batch B (continued)
    teacherId: "teacher3",
    classroomId: "lab202",
    batch: "B",
    isLabSession: true,
    year: 1
  },
  
  // Tuesday - Common Lectures and Lab Sessions
  {
    id: "entry7",
    dayOfWeek: "Tuesday",
    timeSlotId: "slot1",
    courseId: "course2", // Mathematics (common lecture)
    teacherId: "teacher2",
    classroomId: "room101",
    year: 1
  },
  {
    id: "entry8",
    dayOfWeek: "Tuesday",
    timeSlotId: "slot2",
    courseId: "course4", // Computer Organization (common lecture)
    teacherId: "teacher4",
    classroomId: "room101",
    year: 1
  },
  {
    id: "entry9",
    dayOfWeek: "Tuesday",
    timeSlotId: "slot3",
    courseId: "course3", // DBMS Lab - Batch C
    teacherId: "teacher3",
    classroomId: "lab201",
    batch: "C",
    isLabSession: true,
    year: 1
  },
  {
    id: "entry10",
    dayOfWeek: "Tuesday",
    timeSlotId: "slot4",
    courseId: "course3", // DBMS Lab - Batch C (continued)
    teacherId: "teacher3",
    classroomId: "lab201",
    batch: "C",
    isLabSession: true,
    year: 1
  },
  {
    id: "entry11",
    dayOfWeek: "Tuesday",
    timeSlotId: "slot3",
    courseId: "course1", // DSA Lab - Batch D
    teacherId: "teacher1",
    classroomId: "lab202",
    batch: "D",
    isLabSession: true,
    year: 1
  },
  {
    id: "entry12",
    dayOfWeek: "Tuesday",
    timeSlotId: "slot4",
    courseId: "course1", // DSA Lab - Batch D (continued)
    teacherId: "teacher1",
    classroomId: "lab202",
    batch: "D",
    isLabSession: true,
    year: 1
  },
  
  // Wednesday - Common Lectures
  {
    id: "entry13",
    dayOfWeek: "Wednesday",
    timeSlotId: "slot1",
    courseId: "course4", // Computer Organization (common lecture)
    teacherId: "teacher4",
    classroomId: "room101",
    year: 1
  },
  {
    id: "entry14",
    dayOfWeek: "Wednesday",
    timeSlotId: "slot2",
    courseId: "course2", // Mathematics (common lecture)
    teacherId: "teacher2",
    classroomId: "room101",
    year: 1
  },
  
  // Thursday - Common Lectures
  {
    id: "entry15",
    dayOfWeek: "Thursday",
    timeSlotId: "slot1",
    courseId: "course1", // DSA (common lecture)
    teacherId: "teacher1",
    classroomId: "room101",
    year: 1
  },
  {
    id: "entry16",
    dayOfWeek: "Thursday",
    timeSlotId: "slot2",
    courseId: "course3", // DBMS (common lecture)
    teacherId: "teacher3",
    classroomId: "room101",
    year: 1
  },
  
  // Thursday - Lab Sessions for different batches with different courses
  {
    id: "entry17",
    dayOfWeek: "Thursday",
    timeSlotId: "slot3",
    courseId: "course1", // DSA Lab - Batch C
    teacherId: "teacher1",
    classroomId: "lab201",
    batch: "C",
    isLabSession: true,
    year: 1
  },
  {
    id: "entry18",
    dayOfWeek: "Thursday",
    timeSlotId: "slot4",
    courseId: "course1", // DSA Lab - Batch C (continued)
    teacherId: "teacher1",
    classroomId: "lab201",
    batch: "C",
    isLabSession: true,
    year: 1
  },
  {
    id: "entry19",
    dayOfWeek: "Thursday",
    timeSlotId: "slot3",
    courseId: "course3", // DBMS Lab - Batch A
    teacherId: "teacher3",
    classroomId: "lab202",
    batch: "A",
    isLabSession: true,
    year: 1
  },
  {
    id: "entry20",
    dayOfWeek: "Thursday",
    timeSlotId: "slot4",
    courseId: "course3", // DBMS Lab - Batch A (continued)
    teacherId: "teacher3",
    classroomId: "lab202",
    batch: "A",
    isLabSession: true,
    year: 1
  },
  
  // Friday - Common Lectures
  {
    id: "entry21",
    dayOfWeek: "Friday",
    timeSlotId: "slot1",
    courseId: "course1", // DSA (common lecture)
    teacherId: "teacher1",
    classroomId: "room101",
    year: 1
  },
  {
    id: "entry22",
    dayOfWeek: "Friday",
    timeSlotId: "slot2",
    courseId: "course3", // DBMS (common lecture)
    teacherId: "teacher3",
    classroomId: "room101",
    year: 1
  },
  
  // Friday - Lab Sessions 
  {
    id: "entry23",
    dayOfWeek: "Friday",
    timeSlotId: "slot3",
    courseId: "course3", // DBMS Lab - Batch D
    teacherId: "teacher3",
    classroomId: "lab201",
    batch: "D",
    isLabSession: true,
    year: 1
  },
  {
    id: "entry24",
    dayOfWeek: "Friday",
    timeSlotId: "slot4",
    courseId: "course3", // DBMS Lab - Batch D (continued)
    teacherId: "teacher3",
    classroomId: "lab201",
    batch: "D",
    isLabSession: true,
    year: 1
  },
  {
    id: "entry25",
    dayOfWeek: "Friday",
    timeSlotId: "slot3",
    courseId: "course1", // DSA Lab - Batch B
    teacherId: "teacher1",
    classroomId: "lab202",
    batch: "B",
    isLabSession: true,
    year: 1
  },
  {
    id: "entry26",
    dayOfWeek: "Friday",
    timeSlotId: "slot4",
    courseId: "course1", // DSA Lab - Batch B (continued)
    teacherId: "teacher1",
    classroomId: "lab202",
    batch: "B",
    isLabSession: true,
    year: 1
  },
  
  // Saturday - Special sessions
  {
    id: "entry27",
    dayOfWeek: "Saturday",
    timeSlotId: "slot1",
    courseId: "course1", // DSA (common lecture)
    teacherId: "teacher1",
    classroomId: "room101",
    year: 1
  },
  {
    id: "entry28",
    dayOfWeek: "Saturday",
    timeSlotId: "slot2",
    courseId: "course3", // DBMS (common lecture)
    teacherId: "teacher3",
    classroomId: "room101",
    year: 1
  }
];
