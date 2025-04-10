
import { 
  Teacher, Classroom, Course, TimetableEntry, Timetable, TimeSlot
} from "@/types";
import { validateTimetable } from "./timetableValidators";
import { generateTimetable } from "./timetableCore";

// Re-export the core generation function
export { generateTimetable };

// Re-export the validation function for backward compatibility
export { validateTimetable };
