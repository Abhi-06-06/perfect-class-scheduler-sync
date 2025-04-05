
import { TimetableEntry, Batch } from "@/types";

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
