
export type TimeSlot = {
  id: string;
  startTime: string;
  endTime: string;
  isBreak?: boolean;
  isLabSession?: boolean; // Double duration slots for lab sessions
  displayName?: string;  // For showing in the header (like "1", "2", etc.)
};

export type Batch = "A" | "B" | "C" | "D" | "E" | "F";

export type Teacher = {
  id: string;
  name: string;
  subjects: string[];
  availableSlots?: string[]; // IDs of available TimeSlots
  maxConsecutiveLectures?: number;
  yearAssigned?: number; // Which year this teacher is primarily assigned to
};

export type Classroom = {
  id: string;
  name: string;
  capacity: number;
  isLab: boolean;
  yearAssigned?: number; // 1-4 for year assignment
};

export type Course = {
  id: string;
  name: string;
  subjectCode: string;
  requiredSessions: number;
  requiresLab: boolean;
  teacherId: string;
  year?: number; // 1-4 for which year students
  batches?: Batch[]; // Which batches this course is for
};

export type TimetableEntry = {
  id: string;
  dayOfWeek: string; // Monday, Tuesday, etc.
  timeSlotId: string;
  courseId: string;
  teacherId: string;
  classroomId: string;
  batch?: Batch; // Optional batch assignment (mainly for lab sessions)
  isLabSession?: boolean;
  year?: number; // 1-4 for which year students
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

// Engineering program specific types
export type YearGroup = {
  id: string;
  year: number; // 1-4
  batches: Batch[];
  courses: string[]; // Course IDs assigned to this year
};
