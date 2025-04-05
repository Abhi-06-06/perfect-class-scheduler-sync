
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
  Day
} from "@/types";
import { DAYS_OF_WEEK, TIME_SLOTS } from "@/data/mockData";

interface TimetableGridProps {
  timetable: TimetableEntry[];
  courses: Course[];
  teachers: Teacher[];
  classrooms: Classroom[];
  filterTeacherId?: string;
  showClassroom?: boolean;
}

const TimetableGrid = ({
  timetable,
  courses,
  teachers,
  classrooms,
  filterTeacherId,
  showClassroom = true
}: TimetableGridProps) => {
  // Filter timeslots to exclude breaks
  const displayTimeSlots = TIME_SLOTS.filter(slot => !slot.isBreak);
  
  // Filter timetable if a teacher ID is provided
  const filteredTimetable = filterTeacherId 
    ? timetable.filter(entry => entry.teacherId === filterTeacherId)
    : timetable;
  
  // Helper to get course, teacher, and classroom details
  const getCourseDetails = (entry: TimetableEntry) => {
    const course = courses.find(c => c.id === entry.courseId);
    const teacher = teachers.find(t => t.id === entry.teacherId);
    const classroom = classrooms.find(c => c.id === entry.classroomId);
    
    return { course, teacher, classroom };
  };
  
  // Find timetable entry for a specific day and time slot
  const findEntry = (day: Day, timeSlotId: string) => {
    return filteredTimetable.find(
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
              </TableCell>
              
              {DAYS_OF_WEEK.map(day => {
                const entry = findEntry(day, timeSlot.id);
                
                if (!entry) {
                  return <TableCell key={`${day}-${timeSlot.id}`} className="border"></TableCell>;
                }
                
                const { course, teacher, classroom } = getCourseDetails(entry);
                
                return (
                  <TableCell 
                    key={`${day}-${timeSlot.id}`} 
                    className="border p-1"
                  >
                    <div className="bg-acd-light p-2 rounded border border-acd-secondary/20 h-full">
                      <div className="font-medium text-acd-primary">{course?.name}</div>
                      <div className="text-sm text-gray-600">{course?.subjectCode}</div>
                      {!filterTeacherId && (
                        <div className="text-xs text-gray-500">{teacher?.name}</div>
                      )}
                      {showClassroom && (
                        <div className="text-xs mt-1 bg-acd-primary/10 inline-block px-1 rounded">
                          {classroom?.name} {classroom?.isLab ? "(Lab)" : ""}
                        </div>
                      )}
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
