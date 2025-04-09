
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  TimetableEntry, 
  Course, 
  Teacher, 
  Classroom, 
  TimeSlot,
  Day,
  Batch
} from "@/types";
import { DAYS_OF_WEEK, TIME_SLOTS } from "@/data/mockData";

interface TimetableGridProps {
  timetable: TimetableEntry[];
  courses: Course[];
  teachers: Teacher[];
  classrooms: Classroom[];
  filterTeacherId?: string;
  filterYear?: number;
  filterBatch?: Batch;
  showClassroom?: boolean;
}

const TimetableGrid = ({
  timetable,
  courses,
  teachers,
  classrooms,
  filterTeacherId,
  filterYear,
  filterBatch,
  showClassroom = true
}: TimetableGridProps) => {
  // Get all timeslots, excluding break time slots for display
  const displayTimeSlots = TIME_SLOTS.filter(slot => !slot.isBreak);
  const breakTimeSlots = TIME_SLOTS.filter(slot => slot.isBreak);
  
  // Apply filters to the timetable
  let filteredTimetable = timetable;
  
  if (filterTeacherId) {
    filteredTimetable = filteredTimetable.filter(entry => entry.teacherId === filterTeacherId);
  }
  
  if (filterYear) {
    filteredTimetable = filteredTimetable.filter(entry => entry.year === filterYear);
  }
  
  if (filterBatch) {
    filteredTimetable = filteredTimetable.filter(entry => 
      // Include entries specifically for this batch or entries with no batch (lectures for all)
      entry.batch === filterBatch || (!entry.batch && !entry.isLabSession)
    );
  }
  
  // Helper to get course, teacher, and classroom details
  const getCourseDetails = (entry: TimetableEntry) => {
    const course = courses.find(c => c.id === entry.courseId);
    const teacher = teachers.find(t => t.id === entry.teacherId);
    const classroom = classrooms.find(c => c.id === entry.classroomId);
    
    return { course, teacher, classroom };
  };
  
  // Find timetable entry for a specific day and time slot
  const findEntries = (day: Day, timeSlotId: string) => {
    return filteredTimetable.filter(
      entry => entry.dayOfWeek === day && entry.timeSlotId === timeSlotId
    );
  };

  // Format the entry in the compact style seen in the reference image
  const formatEntry = (entry: TimetableEntry, course?: Course, classroom?: Classroom) => {
    if (!course) return "";
    
    // Format as: SUBJECT-BATCH(TYPE), ROOM
    let formatted = course.subjectCode;
    
    // Add batch if available (with hyphen)
    if (entry.batch) {
      formatted += `-${entry.batch}`;
    }
    
    // Add classroom info in parentheses if requested
    if (showClassroom && classroom) {
      formatted += `(${classroom.name})`;
    }
    
    return formatted;
  };

  // Function to render a break cell
  const renderBreakCell = () => (
    <TableCell className="border bg-gray-100 text-center font-medium text-gray-500">
      Recess
    </TableCell>
  );

  return (
    <div className="overflow-x-auto">
      <Table className="border-collapse w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="bg-gray-100 w-20 text-center">Day/Time</TableHead>
            {displayTimeSlots.map(timeSlot => (
              <TableHead key={timeSlot.id} className="bg-gray-100 font-medium text-center">
                {timeSlot.displayName || `${timeSlot.startTime}-${timeSlot.endTime}`}
                <div className="text-xs text-gray-500">
                  {timeSlot.startTime} - {timeSlot.endTime}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {DAYS_OF_WEEK.map(day => (
            <TableRow key={day}>
              <TableCell className="bg-gray-50 font-medium">
                {day}
              </TableCell>
              
              {displayTimeSlots.map((timeSlot) => {
                // Check if this time slot should be a break cell
                const breakTimeSlot = breakTimeSlots.find(slot => 
                  slot.startTime >= timeSlot.startTime && slot.endTime <= timeSlot.endTime
                );
                
                if (breakTimeSlot) {
                  return renderBreakCell();
                }
                
                const entries = findEntries(day, timeSlot.id);
                
                if (entries.length === 0) {
                  return <TableCell key={`${day}-${timeSlot.id}`} className="border"></TableCell>;
                }
                
                return (
                  <TableCell 
                    key={`${day}-${timeSlot.id}`} 
                    className="border text-center p-1 text-sm"
                  >
                    <div className="flex flex-col items-center justify-center gap-1">
                      {entries.map((entry, index) => {
                        const { course, classroom } = getCourseDetails(entry);
                        return (
                          <div 
                            key={entry.id}
                            className={`${
                              entry.isLabSession 
                                ? "text-blue-600" 
                                : "text-red-600"
                            } font-medium ${index > 0 ? "mt-1" : ""}`}
                          >
                            {formatEntry(entry, course, classroom)}
                            {classroom && !entry.batch && (
                              <span className="text-xs ml-1">{classroom.name}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TimetableGrid;
