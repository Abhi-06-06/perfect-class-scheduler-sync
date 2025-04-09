
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
  // Get all non-break time slots for display, ordered by start time
  const displayTimeSlots = TIME_SLOTS.filter(slot => !slot.isBreak)
    .sort((a, b) => {
      // Convert time strings to comparable values (e.g., "9:00" becomes 900)
      const timeToNumber = (timeStr: string) => {
        const [hour, minute] = timeStr.split(':').map(Number);
        return hour * 100 + minute;
      };
      
      return timeToNumber(a.startTime) - timeToNumber(b.startTime);
    });
  
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
                {timeSlot.isLabSession && 
                  <div className="text-xs text-acd-primary">(Lab)</div>
                }
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
              
              {displayTimeSlots.map(timeSlot => {
                // Check if this time slot should be a break cell
                const isBreakTime = breakTimeSlots.some(breakSlot => {
                  const breakStart = breakSlot.startTime;
                  const breakEnd = breakSlot.endTime;
                  const slotStart = timeSlot.startTime;
                  const slotEnd = timeSlot.endTime;
                  
                  // Check if the time ranges overlap
                  return (slotStart <= breakEnd && slotEnd >= breakStart);
                });
                
                if (isBreakTime) {
                  return renderBreakCell();
                }
                
                const entries = findEntries(day, timeSlot.id);
                
                if (entries.length === 0) {
                  return <TableCell key={`${day}-${timeSlot.id}`} className="border"></TableCell>;
                }
                
                return (
                  <TableCell 
                    key={`${day}-${timeSlot.id}`} 
                    className="border p-1"
                  >
                    <div className="flex flex-col gap-1">
                      {entries.map(entry => {
                        const { course, teacher, classroom } = getCourseDetails(entry);
                        return (
                          <div 
                            key={entry.id}
                            className={`p-2 rounded border h-full ${
                              entry.isLabSession 
                                ? "bg-blue-50 border-blue-200" 
                                : "bg-acd-light border-acd-secondary/20"
                            }`}
                          >
                            <div className="font-medium text-acd-primary">
                              {course?.subjectCode}
                              {entry.isLabSession && " (Lab)"}
                            </div>
                            {entry.batch && (
                              <div className="text-xs font-semibold">Batch {entry.batch}</div>
                            )}
                            {!filterTeacherId && (
                              <div className="text-xs text-gray-500">{teacher?.name}</div>
                            )}
                            {showClassroom && classroom && (
                              <div className="text-xs mt-1 bg-acd-primary/10 inline-block px-1 rounded">
                                {classroom.name}
                              </div>
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
