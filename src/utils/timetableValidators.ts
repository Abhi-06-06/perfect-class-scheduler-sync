import { 
  Teacher, Classroom, Course, TimetableEntry, TimeSlot, 
  ValidationError
} from "@/types";

/**
 * Validates if a timetable meets all constraints
 */
export function validateTimetable(
  timetable: TimetableEntry[],
  teachers: Teacher[],
  classrooms: Classroom[],
  courses: Course[],
  timeSlots: TimeSlot[]
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check classroom conflicts (constraint 1)
  const classroomConflicts = findClassroomConflicts(timetable);
  if (classroomConflicts.length > 0) {
    errors.push({
      type: "CLASSROOM_CONFLICT",
      message: "One or more classrooms have multiple lectures scheduled at the same time",
      affectedEntries: classroomConflicts
    });
  }

  // Check break time slot assignments (constraint 2)
  const breakTimeConflicts = findBreakTimeConflicts(timetable, timeSlots);
  if (breakTimeConflicts.length > 0) {
    errors.push({
      type: "BREAK_TIME_CONFLICT",
      message: "Lectures are scheduled during designated break times",
      affectedEntries: breakTimeConflicts
    });
  }

  // Check same course lab conflicts on same day (no more than one lab per course per batch per day)
  const sameCourseLabConflicts = findSameCourseLabConflicts(timetable);
  if (sameCourseLabConflicts.length > 0) {
    errors.push({
      type: "SAME_COURSE_LAB_CONFLICT",
      message: "A batch has more than one lab session for the same course scheduled on the same day",
      affectedEntries: sameCourseLabConflicts
    });
  }

  // Check for lab batch conflicts (same time, same lab room)
  const labBatchRoomConflicts = findLabBatchRoomConflicts(timetable);
  if (labBatchRoomConflicts.length > 0) {
    errors.push({
      type: "LAB_BATCH_ROOM_CONFLICT",
      message: "Multiple batches are assigned to the same lab room at the same time",
      affectedEntries: labBatchRoomConflicts
    });
  }

  return errors;
}

/**
 * Finds conflicts where a classroom has multiple lectures at the same time
 */
export function findClassroomConflicts(timetable: TimetableEntry[]): TimetableEntry[] {
  const conflicts: TimetableEntry[] = [];
  const timeSlotMap: Record<string, TimetableEntry[]> = {};

  // Group by day, timeslot, and classroom
  timetable.forEach(entry => {
    const key = `${entry.dayOfWeek}_${entry.timeSlotId}_${entry.classroomId}`;
    if (!timeSlotMap[key]) {
      timeSlotMap[key] = [];
    }
    timeSlotMap[key].push(entry);
  });

  // Find conflicts
  Object.values(timeSlotMap).forEach(entries => {
    if (entries.length > 1) {
      conflicts.push(...entries);
    }
  });

  return conflicts;
}

/**
 * Finds conflicts where lectures are scheduled during break times
 */
export function findBreakTimeConflicts(
  timetable: TimetableEntry[],
  timeSlots: TimeSlot[]
): TimetableEntry[] {
  const breakSlotIds = timeSlots
    .filter(slot => slot.isBreak)
    .map(slot => slot.id);

  return timetable.filter(entry => breakSlotIds.includes(entry.timeSlotId));
}

/**
 * Finds conflicts where a batch has more than one lab for the same course in a day
 */
export function findSameCourseLabConflicts(timetable: TimetableEntry[]): TimetableEntry[] {
  const conflicts: TimetableEntry[] = [];
  const batchCourseDayLabMap: Record<string, TimetableEntry[]> = {};

  // Group lab sessions by batch, course, and day
  timetable.forEach(entry => {
    if (entry.isLabSession && entry.batch) {
      const key = `${entry.batch}_${entry.courseId}_${entry.dayOfWeek}_${entry.year}`;
      if (!batchCourseDayLabMap[key]) {
        batchCourseDayLabMap[key] = [];
      }
      batchCourseDayLabMap[key].push(entry);
    }
  });

  // Find conflicts
  Object.values(batchCourseDayLabMap).forEach(entries => {
    if (entries.length > 2) { // Allow at most 2 slots for one lab session (consecutive)
      conflicts.push(...entries);
    }
  });

  return conflicts;
}

/**
 * Finds conflicts where multiple batches are assigned to the same lab room at the same time
 */
export function findLabBatchRoomConflicts(timetable: TimetableEntry[]): TimetableEntry[] {
  const conflicts: TimetableEntry[] = [];
  const labTimeSlotMap: Record<string, TimetableEntry[]> = {};

  // Group lab sessions by day, timeslot, and lab room
  timetable.forEach(entry => {
    if (entry.isLabSession) {
      const key = `${entry.dayOfWeek}_${entry.timeSlotId}_${entry.classroomId}`;
      if (!labTimeSlotMap[key]) {
        labTimeSlotMap[key] = [];
      }
      labTimeSlotMap[key].push(entry);
    }
  });

  // Find conflicts where different batches use the same lab room at the same time
  Object.values(labTimeSlotMap).forEach(entries => {
    if (entries.length > 1) {
      // Check if there are different batches in the same lab room
      const batches = new Set(entries.map(entry => entry.batch));
      if (batches.size > 1) {
        conflicts.push(...entries);
      }
    }
  });

  return conflicts;
}
