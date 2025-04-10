
import { 
  Teacher, Classroom, Course, TimetableEntry
} from "@/types";

/**
 * Schedules regular lectures for courses
 */
export function scheduleRegularLectures(
  timetable: TimetableEntry[],
  regularCourses: Course[],
  teachers: Teacher[],
  yearClassrooms: Classroom[],
  regularSlots: any[],
  DAYS_OF_WEEK: string[],
  year: number,
  startEntryId: number
): TimetableEntry[] {
  let entryId = startEntryId;
  let updatedTimetable = [...timetable];
  
  // Now schedule regular lectures for common sessions (for all batches)
  regularCourses.forEach(course => {
    const teacher = teachers.find(t => t.id === course.teacherId);
    if (!teacher) {
      console.warn(`Teacher not found for course ${course.name}`);
      return;
    }
    
    // Get suitable classrooms
    const suitableClassrooms = yearClassrooms;
    if (suitableClassrooms.length === 0) {
      console.warn(`No suitable classrooms for year ${year}`);
      return;
    }
    
    // Calculate required sessions
    const sessionsNeeded = course.requiredSessions;
    
    let sessionsAssigned = 0;
    let attempts = 0;
    const maxAttempts = 100;
    
    while (sessionsAssigned < sessionsNeeded && attempts < maxAttempts) {
      attempts++;
      
      // Pick a random day
      const dayIndex = Math.floor(Math.random() * DAYS_OF_WEEK.length);
      const day = DAYS_OF_WEEK[dayIndex];
      
      // Pick a random time slot
      const slotIndex = Math.floor(Math.random() * regularSlots.length);
      const timeSlot = regularSlots[slotIndex];
      
      if (timeSlot.isBreak) continue;
      
      // Check if we should schedule consecutive lectures
      // For simplicity, let's just have a 30% chance of scheduling consecutive lectures if possible
      const scheduleConsecutive = Math.random() < 0.3 && slotIndex < regularSlots.length - 1;
      const secondTimeSlot = scheduleConsecutive ? regularSlots[slotIndex + 1] : null;
      
      if (secondTimeSlot && secondTimeSlot.isBreak) continue;
      
      // Pick a random classroom
      const classroomIndex = Math.floor(Math.random() * suitableClassrooms.length);
      const classroom = suitableClassrooms[classroomIndex];
      
      // Check for conflicts for first slot
      // For common lectures, we need to ensure no batch of this year has a conflict
      const batchConflict = updatedTimetable.some(entry => 
        entry.dayOfWeek === day && 
        entry.timeSlotId === timeSlot.id && 
        entry.year === year
      );
      
      const classroomConflict = updatedTimetable.some(entry => 
        entry.dayOfWeek === day && 
        entry.timeSlotId === timeSlot.id && 
        entry.classroomId === classroom.id
      );
      
      const teacherConflict = updatedTimetable.some(entry => 
        entry.dayOfWeek === day && 
        entry.timeSlotId === timeSlot.id && 
        entry.teacherId === teacher.id
      );
      
      // If consecutive, check second slot too
      let secondSlotConflict = false;
      if (scheduleConsecutive && secondTimeSlot) {
        const batchConflict2 = updatedTimetable.some(entry => 
          entry.dayOfWeek === day && 
          entry.timeSlotId === secondTimeSlot.id && 
          entry.year === year
        );
        
        const classroomConflict2 = updatedTimetable.some(entry => 
          entry.dayOfWeek === day && 
          entry.timeSlotId === secondTimeSlot.id && 
          entry.classroomId === classroom.id
        );
        
        const teacherConflict2 = updatedTimetable.some(entry => 
          entry.dayOfWeek === day && 
          entry.timeSlotId === secondTimeSlot.id && 
          entry.teacherId === teacher.id
        );
        
        secondSlotConflict = batchConflict2 || classroomConflict2 || teacherConflict2;
      }
      
      if (!batchConflict && !classroomConflict && !teacherConflict && (!scheduleConsecutive || !secondSlotConflict)) {
        // Add first lecture
        updatedTimetable.push({
          id: `entry${entryId++}`,
          dayOfWeek: day,
          timeSlotId: timeSlot.id,
          courseId: course.id,
          teacherId: teacher.id,
          classroomId: classroom.id,
          year
        });
        
        sessionsAssigned++;
        
        // Add second lecture if doing consecutive
        if (scheduleConsecutive && secondTimeSlot && !secondSlotConflict && sessionsAssigned < sessionsNeeded) {
          updatedTimetable.push({
            id: `entry${entryId++}`,
            dayOfWeek: day,
            timeSlotId: secondTimeSlot.id,
            courseId: course.id,
            teacherId: teacher.id,
            classroomId: classroom.id,
            year
          });
          
          sessionsAssigned++;
        }
      }
    }
    
    if (attempts >= maxAttempts && sessionsAssigned < sessionsNeeded) {
      console.warn(`Failed to schedule all sessions for course ${course.name}. 
                   Scheduled ${sessionsAssigned}/${sessionsNeeded} sessions.`);
    }
  });
  
  return updatedTimetable;
}
