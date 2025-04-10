
import { 
  Teacher, Classroom, Course, TimetableEntry, Timetable
} from "@/types";
import { TIME_SLOTS, DAYS_OF_WEEK } from "@/data/mockData";
import { scheduleRegularLectures } from "./timetableRegularLectures";
import { scheduleLabSessions } from "./timetableLabSessions";

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
    const allBatches = new Set<string>();
    yearCourses.forEach(course => {
      if (course.batches) {
        course.batches.forEach(batch => allBatches.add(batch));
      }
    });
    
    const batches = Array.from(allBatches);
    console.log(`Year ${year} has ${batches.length} batches: ${batches.join(', ')}`);
    
    // First schedule lab sessions - they are more constrained
    timetable = scheduleLabSessions(
      timetable, 
      labCourses, 
      teachers, 
      batches, 
      yearLabs, 
      regularSlots, 
      DAYS_OF_WEEK, 
      year, 
      entryId
    );
    
    // Update entryId based on the number of entries added
    entryId = timetable.length + 1;
    
    // Then schedule regular lectures
    timetable = scheduleRegularLectures(
      timetable,
      regularCourses,
      teachers,
      yearClassrooms,
      regularSlots,
      DAYS_OF_WEEK,
      year,
      entryId
    );
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
