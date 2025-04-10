
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
    
    // Track batches with lab sessions for each day to ensure constraint 4 (max 2 batches with labs per day)
    const dayLabBatches: Record<string, Set<string>> = {};
    DAYS_OF_WEEK.forEach(day => {
      dayLabBatches[day] = new Set<string>();
    });
    
    // Schedule for each batch
    batches.forEach(batch => {
      console.log(`Scheduling for year ${year}, batch ${batch}`);
      
      // Track days where this batch already has lab sessions (constraint 5: one lab per batch per day)
      const batchLabDays = new Set<string>();
      
      // Schedule lab sessions first as they're more constrained
      labCourses.forEach(course => {
        if (!course.batches?.includes(batch)) return;
        
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
        let sessionsAssigned = 0;
        const maxAttempts = 200;
        let attempts = 0;
        
        while (attempts < maxAttempts) {
          attempts++;
          
          // Pick a random day
          const dayIndex = Math.floor(Math.random() * DAYS_OF_WEEK.length);
          const day = DAYS_OF_WEEK[dayIndex];
          
          // CONSTRAINT 5: Skip if this batch already has a lab on this day
          if (batchLabDays.has(day)) {
            continue;
          }
          
          // CONSTRAINT 4: Skip if day already has 2 batches with labs
          if (dayLabBatches[day].size >= 2) {
            continue;
          }
          
          // Try to find two consecutive slots
          const startSlotIndex = Math.floor(Math.random() * (regularSlots.length - 1));
          const slot1 = regularSlots[startSlotIndex];
          const slot2 = regularSlots[startSlotIndex + 1];
          
          // Ensure slots are consecutive and not break slots
          if (!slot1 || !slot2 || slot1.isBreak || slot2.isBreak) {
            continue;
          }
          
          // Pick a random lab
          const labIndex = Math.floor(Math.random() * yearLabs.length);
          const lab = yearLabs[labIndex];
          
          // Check if these slots are available for this batch, lab, and teacher
          const batchConflict = timetable.some(entry => 
            entry.dayOfWeek === day && 
            entry.batch === batch &&
            (entry.timeSlotId === slot1.id || entry.timeSlotId === slot2.id)
          );
          
          const labConflict = timetable.some(entry => 
            entry.dayOfWeek === day && 
            entry.classroomId === lab.id &&
            (entry.timeSlotId === slot1.id || entry.timeSlotId === slot2.id)
          );
          
          // CONSTRAINT 3: Check if teacher would exceed consecutive lecture limit
          const teacherSlots = timetable
            .filter(entry => entry.dayOfWeek === day && entry.teacherId === teacher.id)
            .map(entry => regularSlots.findIndex(s => s.id === entry.timeSlotId))
            .sort((a, b) => a - b);
          
          const currentSlot1Index = regularSlots.findIndex(s => s.id === slot1.id);
          const currentSlot2Index = regularSlots.findIndex(s => s.id === slot2.id);
          
          let wouldExceedConsecutiveLimit = false;
          const maxConsecutive = teacher.maxConsecutiveLectures || 2;
          
          if (teacherSlots.length > 0) {
            // Check if adding these two slots would create too many consecutive lectures
            const allSlots = [...teacherSlots, currentSlot1Index, currentSlot2Index].sort((a, b) => a - b);
            let consecutive = 1;
            let maxConsecutiveFound = 1;
            
            for (let i = 1; i < allSlots.length; i++) {
              if (allSlots[i] === allSlots[i-1] + 1) {
                consecutive++;
              } else {
                consecutive = 1;
              }
              maxConsecutiveFound = Math.max(maxConsecutiveFound, consecutive);
            }
            
            if (maxConsecutiveFound > maxConsecutive) {
              wouldExceedConsecutiveLimit = true;
            }
          }
          
          if (!batchConflict && !labConflict && !wouldExceedConsecutiveLimit) {            
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
            
            // Mark that this batch now has a lab on this day
            batchLabDays.add(day);
            
            // Mark that this day now has one more batch with a lab
            dayLabBatches[day].add(batch);
            
            break; // Lab scheduled successfully
          }
        }
        
        if (attempts >= maxAttempts) {
          console.warn(`Failed to schedule lab for course ${course.name} for batch ${batch} after ${maxAttempts} attempts`);
        }
      });
      
      // Now schedule regular lectures for this batch
      regularCourses.concat(labCourses).forEach(course => {
        if (course.batches && !course.batches.includes(batch)) return;
        
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
        
        // Calculate required sessions (fewer needed if course has lab)
        const sessionsNeeded = course.requiresLab ? 
          Math.max(1, course.requiredSessions - 2) : // Reduce for lab courses
          course.requiredSessions;
        
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
          
          // Pick a random classroom
          const classroomIndex = Math.floor(Math.random() * suitableClassrooms.length);
          const classroom = suitableClassrooms[classroomIndex];
          
          // Check if this slot is available for this batch, classroom, and teacher
          const batchConflict = timetable.some(entry => 
            entry.dayOfWeek === day && 
            entry.timeSlotId === timeSlot.id && 
            entry.batch === batch
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
          
          // CONSTRAINT 3: Improved check for consecutive lecture limit
          const teacherSlots = timetable
            .filter(entry => entry.dayOfWeek === day && entry.teacherId === teacher.id)
            .map(entry => regularSlots.findIndex(s => s.id === entry.timeSlotId))
            .sort((a, b) => a - b);
          
          const currentSlotIndex = regularSlots.findIndex(s => s.id === timeSlot.id);
          
          let wouldExceedConsecutiveLimit = false;
          const maxConsecutive = teacher.maxConsecutiveLectures || 2;
          
          if (teacherSlots.length > 0) {
            // Check if adding this slot would create too many consecutive lectures
            const allSlots = [...teacherSlots, currentSlotIndex].sort((a, b) => a - b);
            let consecutive = 1;
            let maxConsecutiveFound = 1;
            
            for (let i = 1; i < allSlots.length; i++) {
              if (allSlots[i] === allSlots[i-1] + 1) {
                consecutive++;
              } else {
                consecutive = 1;
              }
              maxConsecutiveFound = Math.max(maxConsecutiveFound, consecutive);
            }
            
            if (maxConsecutiveFound > maxConsecutive) {
              wouldExceedConsecutiveLimit = true;
            }
          }
          
          if (!batchConflict && !classroomConflict && !teacherConflict && !wouldExceedConsecutiveLimit) {
            timetable.push({
              id: `entry${entryId++}`,
              dayOfWeek: day,
              timeSlotId: timeSlot.id,
              courseId: course.id,
              teacherId: teacher.id,
              classroomId: classroom.id,
              batch,
              year
            });
            
            sessionsAssigned++;
          }
        }
        
        if (attempts >= maxAttempts && sessionsAssigned < sessionsNeeded) {
          console.warn(`Failed to schedule all sessions for course ${course.name} for batch ${batch}. 
                       Scheduled ${sessionsAssigned}/${sessionsNeeded} sessions.`);
        }
      });
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
