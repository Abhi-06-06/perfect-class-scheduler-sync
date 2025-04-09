
import { 
  Teacher, Classroom, Course, TimetableEntry, Timetable, Batch
} from "@/types";
import { TIME_SLOTS, DAYS_OF_WEEK } from "@/data/mockData";
import { validateTimetable } from "./timetableValidators";
import { getTeacherTimetable, getYearTimetable } from "./timetableFilters";

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

  // Get all non-break time slots (both regular and lab slots)
  const availableTimeSlots = TIME_SLOTS.filter(slot => !slot.isBreak);
  
  // Schedule all courses (both lectures and labs)
  courses.forEach(course => {
    const teacher = teachers.find(t => t.id === course.teacherId);
    if (!teacher) return;

    // Schedule regular lectures first
    if (course.requiredSessions > 0) {
      // Find suitable classrooms for regular lectures
      const suitableClassrooms = classrooms.filter(c => 
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
        
        // Pick a random time slot (only regular, non-lab slots)
        const regularSlots = availableTimeSlots.filter(slot => !slot.isLabSession);
        const slotIndex = Math.floor(Math.random() * regularSlots.length);
        const timeSlot = regularSlots[slotIndex];
        
        // Pick a random classroom
        const classroomIndex = Math.floor(Math.random() * suitableClassrooms.length);
        const classroom = suitableClassrooms[classroomIndex];
        
        // Check if this slot is already taken for this classroom, teacher, or year group
        const conflict = timetable.some(entry => 
          entry.dayOfWeek === day && 
          entry.timeSlotId === timeSlot.id && 
          (
            entry.classroomId === classroom.id || 
            entry.teacherId === teacher.id ||
            (entry.year === course.year && !entry.batch) // Same year, regular lecture
          )
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
    }

    // Schedule lab sessions (if required)
    if (course.requiresLab && course.batches && course.batches.length > 0) {
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
          
          // Pick a random lab slot (only lab slots)
          const labSlots = availableTimeSlots.filter(slot => slot.isLabSession);
          if (labSlots.length === 0) break; // No lab slots available
          
          const labSlotIndex = Math.floor(Math.random() * labSlots.length);
          const labSlot = labSlots[labSlotIndex];
          
          // Pick a random lab
          const labIndex = Math.floor(Math.random() * suitableLabs.length);
          const lab = suitableLabs[labIndex];
          
          // Check for any conflicts:
          // 1. Lab already in use
          const labConflict = timetable.some(entry => 
            entry.dayOfWeek === day && 
            entry.timeSlotId === labSlot.id && 
            entry.classroomId === lab.id
          );
          
          // 2. Teacher already teaching
          const teacherConflict = timetable.some(entry => 
            entry.dayOfWeek === day && 
            entry.timeSlotId === labSlot.id && 
            entry.teacherId === teacher.id
          );
          
          // 3. Batch already has a lab on this day
          const batchLabConflict = timetable.some(entry => 
            entry.dayOfWeek === day && 
            entry.batch === batch && 
            entry.isLabSession &&
            entry.year === course.year
          );
          
          // 4. Year has a lecture at same time (any student would have a conflict)
          const yearLectureConflict = timetable.some(entry => 
            entry.dayOfWeek === day && 
            entry.timeSlotId === labSlot.id && 
            entry.year === course.year && 
            !entry.batch // Regular lecture for the whole year
          );
          
          // 5. Check if there are already two batches with labs on this day
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
          
          // If no conflicts, add the lab session
          if (!labConflict && !teacherConflict && !batchLabConflict && 
              !yearLectureConflict && !tooManyBatchesWithLabs) {
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
    }
  });

  return { entries: timetable };
}

// Re-export the validation function for backward compatibility
export { validateTimetable };
