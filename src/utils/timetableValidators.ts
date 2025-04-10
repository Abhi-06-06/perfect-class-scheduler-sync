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

  // Check teacher consecutive lectures (constraint 3)
  const consecutiveLectureConflicts = findConsecutiveLectureConflicts(timetable, teachers, timeSlots);
  if (consecutiveLectureConflicts.length > 0) {
    errors.push({
      type: "CONSECUTIVE_LECTURE_CONFLICT",
      message: "Some teachers have too many consecutive lectures",
      affectedEntries: consecutiveLectureConflicts
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
 * Finds conflicts where teachers have too many consecutive lectures
 */
export function findConsecutiveLectureConflicts(
  timetable: TimetableEntry[],
  teachers: Teacher[],
  timeSlots: TimeSlot[]
): TimetableEntry[] {
  const conflicts: TimetableEntry[] = [];
  const teacherMap = new Map(teachers.map(t => [t.id, t]));

  // Group entries by teacher and day
  const teacherDayMap: Record<string, TimetableEntry[]> = {};
  timetable.forEach(entry => {
    const key = `${entry.teacherId}_${entry.dayOfWeek}`;
    if (!teacherDayMap[key]) {
      teacherDayMap[key] = [];
    }
    teacherDayMap[key].push(entry);
  });

  // Sort each teacher's daily schedule by time slot
  Object.entries(teacherDayMap).forEach(([key, entries]) => {
    const sortedEntries = entries.sort((a, b) => {
      const slotA = timeSlots.findIndex(slot => slot.id === a.timeSlotId);
      const slotB = timeSlots.findIndex(slot => slot.id === b.timeSlotId);
      return slotA - slotB;
    });

    // Check for consecutive lectures
    const teacherId = key.split('_')[0];
    const teacher = teacherMap.get(teacherId);
    if (!teacher) return;

    const maxConsecutive = teacher.maxConsecutiveLectures || 2;
    let consecutive = 1;
    let lastSlotIndex = -2;

    for (let i = 0; i < sortedEntries.length; i++) {
      const entry = sortedEntries[i];
      const currentSlotIndex = timeSlots.findIndex(slot => slot.id === entry.timeSlotId);
      
      if (currentSlotIndex === lastSlotIndex + 1) {
        consecutive++;
      } else {
        consecutive = 1;
      }

      if (consecutive > maxConsecutive) {
        conflicts.push(entry);
      }

      lastSlotIndex = currentSlotIndex;
    }
  });

  return conflicts;
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
