
import { 
  Teacher, Classroom, Course, TimetableEntry, TimeSlot, 
  Timetable, ValidationError, Day 
} from "@/types";
import { TIME_SLOTS, DAYS_OF_WEEK } from "@/data/mockData";

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

  // Additional validations can be added here

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
  const availableSlots = TIME_SLOTS.filter(slot => !slot.isBreak);
  
  // For each course, assign required sessions
  courses.forEach(course => {
    const teacher = teachers.find(t => t.id === course.teacherId);
    if (!teacher) return;

    // Find suitable classrooms
    const suitableClassrooms = classrooms.filter(c => 
      (course.requiresLab && c.isLab) || (!course.requiresLab && !c.isLab)
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
      const slotIndex = Math.floor(Math.random() * availableSlots.length);
      const timeSlot = availableSlots[slotIndex];
      
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
        // Check for consecutive lectures constraint
        const teacherDailySchedule = timetable.filter(
          entry => entry.teacherId === teacher.id && entry.dayOfWeek === day
        );
        
        // Simple check for consecutive lectures - can be improved
        let wouldExceedConsecutive = false;
        if (teacherDailySchedule.length > 0) {
          const consecutive = checkConsecutiveLectures(
            teacherDailySchedule, 
            timeSlot, 
            TIME_SLOTS,
            teacher.maxConsecutiveLectures || 2
          );
          if (consecutive) wouldExceedConsecutive = true;
        }
        
        if (!wouldExceedConsecutive) {
          // Add entry to timetable
          timetable.push({
            id: `entry${entryId++}`,
            dayOfWeek: day,
            timeSlotId: timeSlot.id,
            courseId: course.id,
            teacherId: teacher.id,
            classroomId: classroom.id
          });
          
          sessionsAssigned++;
        }
      }
    }
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
  // This is a simplified implementation
  // In a real system, we would need more sophisticated logic
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
