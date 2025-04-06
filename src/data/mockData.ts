
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

export const SAMPLE_TEACHERS: Teacher[] = [];

export const SAMPLE_CLASSROOMS: Classroom[] = [];

export const SAMPLE_COURSES: Course[] = [];

export const EMPTY_TIMETABLE: TimetableEntry[] = [];

export const SAMPLE_TIMETABLE: TimetableEntry[] = [];
