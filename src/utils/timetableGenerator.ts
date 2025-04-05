import { 
  Teacher, Classroom, Course, TimetableEntry, TimeSlot, 
  Timetable, ValidationError, Day, Batch 
} from "@/types";
import { TIME_SLOTS, DAYS_OF_WEEK, BATCHES } from "@/data/mockData";

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

  return errors;
}

/**
 * Finds conflicts where a classroom has multiple lectures at the same time
 */
function findClassroomConflicts(timetable: TimetableEntry[]): TimetableEntry[] {
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
function findBreakTimeConflicts(
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
function findConsecutiveLectureConflicts(
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
 * Finds conflicts where a batch has more than one lab in a day
 */
function findBatchLabConflicts(timetable: TimetableEntry[]): TimetableEntry[] {
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
function findDayLabLimitConflicts(timetable: TimetableEntry[]): TimetableEntry[] {
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

/**
 * Generates a timetable based on given constraints
 */
export function generateTimetable(
  teachers: Teacher[],
  classrooms: Classroom[],
  courses: Course[]
): Timetable {
  // Start with an empty timetable
  let timetable: TimetableEntry[] = [];
  let entryId = 1;

  // Get non-break time slots
  const regularSlots = TIME_SLOTS.filter(slot => !slot.isBreak && !slot.isLabSession);
  const labSlots = TIME_SLOTS.filter(slot => !slot.isBreak && slot.isLabSession);
  
  // Schedule lectures first (non-lab sessions)
  courses.forEach(course => {
    const teacher = teachers.find(t => t.id === course.teacherId);
    if (!teacher) return;

    // Find suitable classrooms based on year and lab requirements
    const suitableClassrooms = classrooms.filter(c => 
      (!course.requiresLab || !course.batches) && // Regular lectures only here
      !c.isLab && 
      (!c.yearAssigned || c.yearAssigned === course.year)
    );
    
    if (suitableClassrooms.length === 0) return;

    // Distribute sessions across the week
    let sessionsAssigned = 0;
    let attempts = 0;
    const maxAttempts = 100; // Prevent infinite loops

    while (sessionsAssigned < course.requiredSessions && attempts < maxAttempts) {
      attempts++;
      
      // Pick a random day
      const dayIndex = Math.floor(Math.random() * DAYS_OF_WEEK.length);
      const day = DAYS_OF_WEEK[dayIndex];
      
      // Pick a random time slot
      const slotIndex = Math.floor(Math.random() * regularSlots.length);
      const timeSlot = regularSlots[slotIndex];
      
      // Pick a random classroom
      const classroomIndex = Math.floor(Math.random() * suitableClassrooms.length);
      const classroom = suitableClassrooms[classroomIndex];
      
      // Check if this slot is already taken for this classroom or teacher
      const conflict = timetable.some(entry => 
        entry.dayOfWeek === day && 
        entry.timeSlotId === timeSlot.id && 
        (entry.classroomId === classroom.id || entry.teacherId === teacher.id)
      );
      
      if (!conflict) {
        // Add entry to timetable
        timetable.push({
          id: `entry${entryId++}`,
          dayOfWeek: day,
          timeSlotId: timeSlot.id,
          courseId: course.id,
          teacherId: teacher.id,
          classroomId: classroom.id,
          year: course.year
        });
        
        sessionsAssigned++;
      }
    }
  });

  // Now schedule lab sessions
  courses.forEach(course => {
    if (!course.requiresLab || !course.batches || course.batches.length === 0) return;
    
    const teacher = teachers.find(t => t.id === course.teacherId);
    if (!teacher) return;

    // Find suitable labs
    const suitableLabs = classrooms.filter(c => c.isLab);
    if (suitableLabs.length === 0) return;
    
    // For each batch, schedule a lab session
    course.batches.forEach(batch => {
      let labAssigned = false;
      let attempts = 0;
      const maxAttempts = 200; // More attempts for labs as they're harder to schedule
      
      while (!labAssigned && attempts < maxAttempts) {
        attempts++;
        
        // Pick a random day
        const dayIndex = Math.floor(Math.random() * DAYS_OF_WEEK.length);
        const day = DAYS_OF_WEEK[dayIndex];
        
        // Pick a random lab slot
        const labSlotIndex = Math.floor(Math.random() * labSlots.length);
        const labSlot = labSlots[labSlotIndex];
        
        // Pick a random lab
        const labIndex = Math.floor(Math.random() * suitableLabs.length);
        const lab = suitableLabs[labIndex];
        
        // Check if this lab is available
        const labConflict = timetable.some(entry => 
          entry.dayOfWeek === day && 
          entry.timeSlotId === labSlot.id && 
          entry.classroomId === lab.id
        );
        
        // Check if teacher is available
        const teacherConflict = timetable.some(entry => 
          entry.dayOfWeek === day && 
          entry.timeSlotId === labSlot.id && 
          entry.teacherId === teacher.id
        );
        
        // Check if this batch already has a lab on this day
        const batchLabConflict = timetable.some(entry => 
          entry.dayOfWeek === day && 
          entry.batch === batch && 
          entry.isLabSession &&
          entry.year === course.year
        );
        
        // Check if there are already two batches with labs on this day
        const batchesWithLabsOnDay = new Set(
          timetable
            .filter(entry => 
              entry.dayOfWeek === day && 
              entry.isLabSession && 
              entry.year === course.year &&
              entry.batch
            )
            .map(entry => entry.batch)
        );
        
        const tooManyBatchesWithLabs = batchesWithLabsOnDay.size >= 2;
        
        if (!labConflict && !teacherConflict && !batchLabConflict && !tooManyBatchesWithLabs) {
          // Add lab session to timetable
          timetable.push({
            id: `entry${entryId++}`,
            dayOfWeek: day,
            timeSlotId: labSlot.id,
            courseId: course.id,
            teacherId: teacher.id,
            classroomId: lab.id,
            batch,
            isLabSession: true,
            year: course.year
          });
          
          labAssigned = true;
        }
      }
    });
  });

  return { entries: timetable };
}

/**
 * Helper to check if adding a new timeslot would exceed consecutive lecture limit
 */
function checkConsecutiveLectures(
  existingSchedule: TimetableEntry[],
  newTimeSlot: TimeSlot,
  allTimeSlots: TimeSlot[],
  maxConsecutive: number
): boolean {
  return false;
}

/**
 * Filters timetable entries for a specific teacher
 */
export function getTeacherTimetable(
  timetable: TimetableEntry[],
  teacherId: string
): TimetableEntry[] {
  return timetable.filter(entry => entry.teacherId === teacherId);
}

/**
 * Filters timetable entries for a specific year and optionally a batch
 */
export function getYearTimetable(
  timetable: TimetableEntry[],
  year: number,
  batch?: Batch
): TimetableEntry[] {
  let filtered = timetable.filter(entry => entry.year === year);
  
  if (batch) {
    filtered = filtered.filter(entry => 
      // Include entries specifically for this batch or entries with no batch (lectures for all)
      entry.batch === batch || (!entry.batch && !entry.isLabSession)
    );
  }
  
  return filtered;
}
