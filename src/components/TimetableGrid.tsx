
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
  // Get all timeslots, including lab sessions
  const displayTimeSlots = TIME_SLOTS.filter(slot => !slot.isBreak);
  
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

  return (
    <div className="overflow-x-auto">
      <Table className="border-collapse w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="bg-gray-100 w-20">Time Slot</TableHead>
            {DAYS_OF_WEEK.map(day => (
              <TableHead key={day} className="bg-gray-100 font-medium">
                {day}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayTimeSlots.map(timeSlot => (
            <TableRow key={timeSlot.id}>
              <TableCell className="bg-gray-50 font-medium">
                {timeSlot.startTime} - {timeSlot.endTime}
                {timeSlot.isLabSession && <span className="text-xs ml-1 text-acd-primary">(Lab)</span>}
              </TableCell>
              
              {DAYS_OF_WEEK.map(day => {
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
                            className={`bg-acd-light p-2 rounded border border-acd-secondary/20 h-full ${
                              entry.isLabSession ? "border-l-4 border-l-acd-primary" : ""
                            }`}
                          >
                            <div className="flex justify-between">
                              <div className="font-medium text-acd-primary">{course?.name}</div>
                              {entry.year && (
                                <div className="text-xs bg-acd-secondary/20 px-1 py-0.5 rounded-sm">
                                  Year {entry.year}
                                </div>
                              )}
                            </div>
                            <div className="text-sm text-gray-600">{course?.subjectCode}</div>
                            {entry.batch && (
                              <div className="text-xs font-semibold">Batch {entry.batch}</div>
                            )}
                            {!filterTeacherId && (
                              <div className="text-xs text-gray-500">{teacher?.name}</div>
                            )}
                            {showClassroom && (
                              <div className="text-xs mt-1 bg-acd-primary/10 inline-block px-1 rounded">
                                {classroom?.name} {classroom?.isLab ? "(Lab)" : ""}
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
