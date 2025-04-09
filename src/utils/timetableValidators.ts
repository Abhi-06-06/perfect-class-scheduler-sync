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

  // Check batch lab constraints (no more than one lab per day per batch)
  const batchLabConflicts = findBatchLabConflicts(timetable);
  if (batchLabConflicts.length > 0) {
    errors.push({
      type: "BATCH_LAB_CONFLICT",
      message: "A batch has more than one lab session scheduled on the same day",
      affectedEntries: batchLabConflicts
    });
  }

  // Check more than two batch labs in a day
  const dayLabLimitConflicts = findDayLabLimitConflicts(timetable);
  if (dayLabLimitConflicts.length > 0) {
    errors.push({
      type: "DAY_LAB_LIMIT_CONFLICT",
      message: "More than two batches have lab sessions scheduled on the same day",
      affectedEntries: dayLabLimitConflicts
    });
  }
  
  // Check for lab and lecture overlaps for the same year
  const labLectureOverlapConflicts = findLabLectureOverlapConflicts(timetable);
  if (labLectureOverlapConflicts.length > 0) {
    errors.push({
      type: "LAB_LECTURE_OVERLAP_CONFLICT",
      message: "A lab session and a lecture for the same year are scheduled at the same time",
      affectedEntries: labLectureOverlapConflicts
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
 * Finds conflicts where labs and lectures for the same year overlap
 */
export function findLabLectureOverlapConflicts(timetable: TimetableEntry[]): TimetableEntry[] {
  const conflicts: TimetableEntry[] = [];
  const yearTimeSlotMap: Record<string, TimetableEntry[]> = {};

  // Group by day, timeslot, and year
  timetable.forEach(entry => {
    if (!entry.year) return;
    
    const key = `${entry.dayOfWeek}_${entry.timeSlotId}_${entry.year}`;
    if (!yearTimeSlotMap[key]) {
      yearTimeSlotMap[key] = [];
    }
    yearTimeSlotMap[key].push(entry);
  });

  // Find conflicts where a lab and a lecture for the same year are at the same time
  Object.values(yearTimeSlotMap).forEach(entries => {
    if (entries.length > 1) {
      const hasLab = entries.some(entry => entry.isLabSession);
      const hasLecture = entries.some(entry => !entry.isLabSession && !entry.batch);
      
      // If both a lab and a regular lecture are scheduled at the same time for the same year
      if (hasLab && hasLecture) {
        conflicts.push(...entries);
      }
    }
  });

  return conflicts;
}

/**
 * Finds conflicts where a batch has more than one lab in a day
 */
export function findBatchLabConflicts(timetable: TimetableEntry[]): TimetableEntry[] {
  const conflicts: TimetableEntry[] = [];
  const batchDayLabMap: Record<string, TimetableEntry[]> = {};

  // Group lab sessions by batch and day
  timetable.forEach(entry => {
    if (entry.isLabSession && entry.batch) {
      const key = `${entry.batch}_${entry.dayOfWeek}_${entry.year}`;
      if (!batchDayLabMap[key]) {
        batchDayLabMap[key] = [];
      }
      batchDayLabMap[key].push(entry);
    }
  });

  // Find conflicts
  Object.values(batchDayLabMap).forEach(entries => {
    if (entries.length > 1) {
      conflicts.push(...entries);
    }
  });

  return conflicts;
}

/**
 * Finds conflicts where more than two batches have labs on the same day
 */
export function findDayLabLimitConflicts(timetable: TimetableEntry[]): TimetableEntry[] {
  const conflicts: TimetableEntry[] = [];
  const dayYearLabMap: Record<string, Set<string>> = {};
  const dayYearEntries: Record<string, TimetableEntry[]> = {};

  // Group lab sessions by day and year, count unique batches
  timetable.forEach(entry => {
    if (entry.isLabSession && entry.batch && entry.year) {
      const key = `${entry.dayOfWeek}_${entry.year}`;
      if (!dayYearLabMap[key]) {
        dayYearLabMap[key] = new Set();
        dayYearEntries[key] = [];
      }
      dayYearLabMap[key].add(entry.batch);
      dayYearEntries[key].push(entry);
    }
  });

  // Find days with more than 2 batches having labs
  Object.entries(dayYearLabMap).forEach(([key, batches]) => {
    if (batches.size > 2) {
      conflicts.push(...dayYearEntries[key]);
    }
  });

  return conflicts;
}
