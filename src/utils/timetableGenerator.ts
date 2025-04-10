
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
  console.log("Starting timetable generation with:", { 
    teachersCount: teachers.length, 
    classroomsCount: classrooms.length, 
    coursesCount: courses.length 
  });
  
  // Start with an empty timetable
  let timetable: TimetableEntry[] = [];
  let entryId = 1;

  // Get non-break time slots
  const regularSlots = TIME_SLOTS.filter(slot => !slot.isBreak);
  
  // Group courses by year
  const coursesByYear: Record<number, Course[]> = {};
  courses.forEach(course => {
    if (!course.year) {
      console.warn("Found course without year assignment:", course);
      return;
    }
    
    if (!coursesByYear[course.year]) {
      coursesByYear[course.year] = [];
    }
    coursesByYear[course.year].push(course);
  });
  
  console.log("Courses grouped by year:", Object.keys(coursesByYear));
  
  // Process each year's courses
  Object.entries(coursesByYear).forEach(([yearStr, yearCourses]) => {
    const year = parseInt(yearStr);
    console.log(`Processing year ${year} with ${yearCourses.length} courses`);
    
    // Find classrooms assigned to this year
    const yearClassrooms = classrooms.filter(c => 
      !c.isLab && 
      (!c.yearAssigned || c.yearAssigned === year)
    );
    
    const yearLabs = classrooms.filter(c => 
      c.isLab && 
      (!c.yearAssigned || c.yearAssigned === year)
    );
    
    console.log(`Year ${year} has ${yearClassrooms.length} regular classrooms and ${yearLabs.length} labs`);
    
    if (yearClassrooms.length === 0) {
      console.warn(`No classrooms assigned for year ${year}, skipping`);
      return;
    }
    
    // Get courses that need lab sessions
    const labCourses = yearCourses.filter(c => c.requiresLab && c.batches && c.batches.length > 0);
    const regularCourses = yearCourses.filter(c => !c.requiresLab || !c.batches);
    
    console.log(`Year ${year} has ${labCourses.length} lab courses and ${regularCourses.length} regular courses`);
    
    // For each batch, create a weekly schedule
    const allBatches = new Set<Batch>();
    yearCourses.forEach(course => {
      if (course.batches) {
        course.batches.forEach(batch => allBatches.add(batch));
      }
    });
    
    const batches = Array.from(allBatches);
    console.log(`Year ${year} has ${batches.length} batches: ${batches.join(', ')}`);
    
    // Track allocated labs to avoid conflicts
    const labAllocation: Record<string, {batch: Batch, course: Course}> = {};
    
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
          return !timetable.some(entry => 
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
          const teacherBusy = timetable.some(entry =>
            entry.dayOfWeek === day &&
            entry.teacherId === teacher.id &&
            (entry.timeSlotId === slot1.id || entry.timeSlotId === slot2.id)
          );
          
          if (teacherBusy) continue;
          
          // Try to schedule multiple batches at the same time in different labs
          const batchesToSchedule = [...remainingBatches];
          const scheduledBatches: Batch[] = [];
          
          while (batchesToSchedule.length > 0 && yearLabs.length > scheduledBatches.length) {
            const batch = batchesToSchedule.shift();
            if (!batch) break;
            
            // Check if this batch is already busy
            const batchBusy = timetable.some(entry =>
              entry.dayOfWeek === day &&
              entry.batch === batch &&
              (entry.timeSlotId === slot1.id || entry.timeSlotId === slot2.id)
            );
            
            if (batchBusy) continue;
            
            // Find an available lab for this batch
            const availableLabs = yearLabs.filter(lab => {
              // Check if lab is already in use for these time slots
              return !timetable.some(entry =>
                entry.dayOfWeek === day &&
                entry.classroomId === lab.id &&
                (entry.timeSlotId === slot1.id || entry.timeSlotId === slot2.id)
              );
            });
            
            if (availableLabs.length === 0) continue;
            
            // Pick the first available lab
            const lab = availableLabs[0];
            
            // Add first lab session
            timetable.push({
              id: `entry${entryId++}`,
              dayOfWeek: day,
              timeSlotId: slot1.id,
              courseId: course.id,
              teacherId: teacher.id,
              classroomId: lab.id,
              batch,
              isLabSession: true,
              year
            });
            
            // Add second consecutive lab session
            timetable.push({
              id: `entry${entryId++}`,
              dayOfWeek: day,
              timeSlotId: slot2.id,
              courseId: course.id,
              teacherId: teacher.id,
              classroomId: lab.id,
              batch,
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
        if (!course.batches?.includes(batch)) return;
        
        // Check if this batch already has labs scheduled for this course
        const hasLabScheduled = timetable.some(entry => 
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
          const hasLabOnThisDay = timetable.some(entry => 
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
          const batchConflict = timetable.some(entry => 
            entry.dayOfWeek === day && 
            entry.batch === batch &&
            (entry.timeSlotId === slot1.id || entry.timeSlotId === slot2.id)
          );
          
          if (batchConflict) continue;
          
          // Check if teacher is available
          const teacherConflict = timetable.some(entry => 
            entry.dayOfWeek === day && 
            entry.teacherId === teacher.id &&
            (entry.timeSlotId === slot1.id || entry.timeSlotId === slot2.id)
          );
          
          if (teacherConflict) continue;
          
          // Find an available lab room
          const availableLabs = yearLabs.filter(lab => {
            // Check if lab is already in use for these time slots
            return !timetable.some(entry =>
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
          timetable.push({
            id: `entry${entryId++}`,
            dayOfWeek: day,
            timeSlotId: slot1.id,
            courseId: course.id,
            teacherId: teacher.id,
            classroomId: lab.id,
            batch,
            isLabSession: true,
            year
          });
          
          // Add second consecutive lab session
          timetable.push({
            id: `entry${entryId++}`,
            dayOfWeek: day,
            timeSlotId: slot2.id,
            courseId: course.id,
            teacherId: teacher.id,
            classroomId: lab.id,
            batch,
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
        const batchConflict = timetable.some(entry => 
          entry.dayOfWeek === day && 
          entry.timeSlotId === timeSlot.id && 
          entry.year === year
        );
        
        const classroomConflict = timetable.some(entry => 
          entry.dayOfWeek === day && 
          entry.timeSlotId === timeSlot.id && 
          entry.classroomId === classroom.id
        );
        
        const teacherConflict = timetable.some(entry => 
          entry.dayOfWeek === day && 
          entry.timeSlotId === timeSlot.id && 
          entry.teacherId === teacher.id
        );
        
        // If consecutive, check second slot too
        let secondSlotConflict = false;
        if (scheduleConsecutive && secondTimeSlot) {
          const batchConflict2 = timetable.some(entry => 
            entry.dayOfWeek === day && 
            entry.timeSlotId === secondTimeSlot.id && 
            entry.year === year
          );
          
          const classroomConflict2 = timetable.some(entry => 
            entry.dayOfWeek === day && 
            entry.timeSlotId === secondTimeSlot.id && 
            entry.classroomId === classroom.id
          );
          
          const teacherConflict2 = timetable.some(entry => 
            entry.dayOfWeek === day && 
            entry.timeSlotId === secondTimeSlot.id && 
            entry.teacherId === teacher.id
          );
          
          secondSlotConflict = batchConflict2 || classroomConflict2 || teacherConflict2;
        }
        
        if (!batchConflict && !classroomConflict && !teacherConflict && (!scheduleConsecutive || !secondSlotConflict)) {
          // Add first lecture
          timetable.push({
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
            timetable.push({
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
  });
  
  console.log(`Timetable generation complete. Created ${timetable.length} entries.`);
  
  if (timetable.length === 0) {
    console.warn("No timetable entries were generated. This could be due to:");
    console.warn("- No courses, teachers, or classrooms configured");
    console.warn("- Year assignments missing or not matching between entities");
    console.warn("- Insufficient classrooms/labs for the required constraints");
    console.warn("Check your input data and try again.");
  }

  return { entries: timetable };
}

// Re-export the validation function for backward compatibility
export { validateTimetable };
