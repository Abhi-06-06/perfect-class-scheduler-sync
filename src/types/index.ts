
export type TimeSlot = {
  id: string;
  startTime: string;
  endTime: string;
  isBreak?: boolean;
};

export type Teacher = {
  id: string;
  name: string;
  subjects: string[];
  availableSlots?: string[]; // IDs of available TimeSlots
  maxConsecutiveLectures?: number;
};

export type Classroom = {
  id: string;
  name: string;
  capacity: number;
  isLab: boolean;
};

export type Course = {
  id: string;
  name: string;
  subjectCode: string;
  requiredSessions: number;
  requiresLab: boolean;
  teacherId: string;
};

export type TimetableEntry = {
  id: string;
  dayOfWeek: string; // Monday, Tuesday, etc.
  timeSlotId: string;
  courseId: string;
  teacherId: string;
  classroomId: string;
};

export type Day = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";

export type Timetable = {
  entries: TimetableEntry[];
};

export type ValidationError = {
  type: string;
  message: string;
  affectedEntries?: TimetableEntry[];
};
