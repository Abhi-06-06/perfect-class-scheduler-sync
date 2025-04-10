
import { 
  Teacher, Classroom, Course, TimetableEntry, Batch
} from "@/types";

/**
 * Schedules lab sessions for courses
 */
export function scheduleLabSessions(
  timetable: TimetableEntry[],
  labCourses: Course[],
  teachers: Teacher[],
  batches: string[],
  yearLabs: Classroom[],
  regularSlots: any[],
  DAYS_OF_WEEK: string[],
  year: number,
  startEntryId: number
): TimetableEntry[] {
  let entryId = startEntryId;
  let updatedTimetable = [...timetable];
  
  // First, try to schedule labs for different batches at the same time
  // This helps to better utilize available time slots
  labCourses.forEach(course => {
    if (!course.batches || course.batches.length === 0) return;
    
    const courseBatches = course.batches;
    const teacher = teachers.find(t => t.id === course.teacherId);
    
    if (!teacher) {
      console.warn(`Teacher not found for course ${course.name}`);
      return;
    }
    
    if (yearLabs.length === 0) {
      console.warn(`No labs available for year ${year}`);
      return;
    }
    
    // Try each day and time slot for parallel lab sessions
    DAYS_OF_WEEK.forEach(day => {
      // Skip if we've already assigned all batches for this course
      const remainingBatches = courseBatches.filter(batch => {
        // Check if this batch already has a lab for this course on this day
        return !updatedTimetable.some(entry => 
          entry.dayOfWeek === day && 
          entry.courseId === course.id && 
          entry.batch === batch && 
          entry.isLabSession
        );
      });
      
      if (remainingBatches.length === 0) return;
      
      // Try each possible time slot
      for (let slotIndex = 0; slotIndex < regularSlots.length - 1; slotIndex++) {
        const slot1 = regularSlots[slotIndex];
        const slot2 = regularSlots[slotIndex + 1];
        
        // Skip break slots
        if (slot1.isBreak || slot2.isBreak) continue;
        
        // Check if teacher is available for these slots
        const teacherBusy = updatedTimetable.some(entry =>
          entry.dayOfWeek === day &&
          entry.teacherId === teacher.id &&
          (entry.timeSlotId === slot1.id || entry.timeSlotId === slot2.id)
        );
        
        if (teacherBusy) continue;
        
        // Try to schedule multiple batches at the same time in different labs
        const batchesToSchedule = [...remainingBatches];
        const scheduledBatches: string[] = [];
        
        while (batchesToSchedule.length > 0 && yearLabs.length > scheduledBatches.length) {
          const batch = batchesToSchedule.shift();
          if (!batch) break;
          
          // Check if this batch is already busy
          const batchBusy = updatedTimetable.some(entry =>
            entry.dayOfWeek === day &&
            entry.batch === batch &&
            (entry.timeSlotId === slot1.id || entry.timeSlotId === slot2.id)
          );
          
          if (batchBusy) continue;
          
          // Find an available lab for this batch
          const availableLabs = yearLabs.filter(lab => {
            // Check if lab is already in use for these time slots
            return !updatedTimetable.some(entry =>
              entry.dayOfWeek === day &&
              entry.classroomId === lab.id &&
              (entry.timeSlotId === slot1.id || entry.timeSlotId === slot2.id)
            );
          });
          
          if (availableLabs.length === 0) continue;
          
          // Pick the first available lab
          const lab = availableLabs[0];
          
          // Add first lab session
          updatedTimetable.push({
            id: `entry${entryId++}`,
            dayOfWeek: day,
            timeSlotId: slot1.id,
            courseId: course.id,
            teacherId: teacher.id,
            classroomId: lab.id,
            batch: batch as Batch,
            isLabSession: true,
            year
          });
          
          // Add second consecutive lab session
          updatedTimetable.push({
            id: `entry${entryId++}`,
            dayOfWeek: day,
            timeSlotId: slot2.id,
            courseId: course.id,
            teacherId: teacher.id,
            classroomId: lab.id,
            batch: batch as Batch,
            isLabSession: true,
            year
          });
          
          scheduledBatches.push(batch);
        }
      }
    });
  });
  
  // Schedule any remaining lab sessions sequentially
  batches.forEach(batch => {
    console.log(`Scheduling for year ${year}, batch ${batch}`);
    
    labCourses.forEach(course => {
      if (!course.batches?.includes(batch as Batch)) return;
      
      // Check if this batch already has labs scheduled for this course
      const hasLabScheduled = updatedTimetable.some(entry => 
        entry.courseId === course.id && 
        entry.batch === batch && 
        entry.isLabSession
      );
      
      if (hasLabScheduled) return;
      
      const teacher = teachers.find(t => t.id === course.teacherId);
      if (!teacher) {
        console.warn(`Teacher not found for course ${course.name}`);
        return;
      }
      
      if (yearLabs.length === 0) {
        console.warn(`No labs available for year ${year}`);
        return;
      }
      
      // Try to schedule 2 consecutive slots for lab
      const maxAttempts = 100;
      let attempts = 0;
      
      while (attempts < maxAttempts) {
        attempts++;
        
        // Pick a random day
        const dayIndex = Math.floor(Math.random() * DAYS_OF_WEEK.length);
        const day = DAYS_OF_WEEK[dayIndex];
        
        // Skip if this batch already has a lab for this course on this day
        const hasLabOnThisDay = updatedTimetable.some(entry => 
          entry.dayOfWeek === day && 
          entry.courseId === course.id && 
          entry.batch === batch && 
          entry.isLabSession
        );
        
        if (hasLabOnThisDay) continue;
        
        // Try to find two consecutive slots
        const startSlotIndex = Math.floor(Math.random() * (regularSlots.length - 1));
        const slot1 = regularSlots[startSlotIndex];
        const slot2 = regularSlots[startSlotIndex + 1];
        
        // Ensure slots are consecutive and not break slots
        if (!slot1 || !slot2 || slot1.isBreak || slot2.isBreak) {
          continue;
        }
        
        // Check if these slots are available for this batch
        const batchConflict = updatedTimetable.some(entry => 
          entry.dayOfWeek === day && 
          entry.batch === batch &&
          (entry.timeSlotId === slot1.id || entry.timeSlotId === slot2.id)
        );
        
        if (batchConflict) continue;
        
        // Check if teacher is available
        const teacherConflict = updatedTimetable.some(entry => 
          entry.dayOfWeek === day && 
          entry.teacherId === teacher.id &&
          (entry.timeSlotId === slot1.id || entry.timeSlotId === slot2.id)
        );
        
        if (teacherConflict) continue;
        
        // Find an available lab room
        const availableLabs = yearLabs.filter(lab => {
          // Check if lab is already in use for these time slots
          return !updatedTimetable.some(entry =>
            entry.dayOfWeek === day &&
            entry.classroomId === lab.id &&
            (entry.timeSlotId === slot1.id || entry.timeSlotId === slot2.id)
          );
        });
        
        if (availableLabs.length === 0) continue;
        
        // Pick a random lab from available ones
        const labIndex = Math.floor(Math.random() * availableLabs.length);
        const lab = availableLabs[labIndex];
        
        // Add first lab session
        updatedTimetable.push({
          id: `entry${entryId++}`,
          dayOfWeek: day,
          timeSlotId: slot1.id,
          courseId: course.id,
          teacherId: teacher.id,
          classroomId: lab.id,
          batch: batch as Batch,
          isLabSession: true,
          year
        });
        
        // Add second consecutive lab session
        updatedTimetable.push({
          id: `entry${entryId++}`,
          dayOfWeek: day,
          timeSlotId: slot2.id,
          courseId: course.id,
          teacherId: teacher.id,
          classroomId: lab.id,
          batch: batch as Batch,
          isLabSession: true,
          year
        });
        
        break; // Lab scheduled successfully
      }
      
      if (attempts >= maxAttempts) {
        console.warn(`Failed to schedule lab for course ${course.name} for batch ${batch} after ${maxAttempts} attempts`);
      }
    });
  });
  
  return updatedTimetable;
}
