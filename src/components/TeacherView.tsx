
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TimetableGrid from "./TimetableGrid";
import { Teacher, TimetableEntry, Course, Classroom } from "@/types";

interface TeacherViewProps {
  teachers: Teacher[];
  timetable: TimetableEntry[];
  courses: Course[];
  classrooms: Classroom[];
}

const TeacherView = ({ teachers, timetable, courses, classrooms }: TeacherViewProps) => {
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold">Teacher Schedule</CardTitle>
        <div className="flex justify-between items-center pt-2">
          <Select
            value={selectedTeacherId}
            onValueChange={setSelectedTeacherId}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select a teacher" />
            </SelectTrigger>
            <SelectContent>
              {teachers.map(teacher => (
                <SelectItem key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {selectedTeacherId ? (
          <>
            <TeacherInfo teacher={teachers.find(t => t.id === selectedTeacherId)} />
            <div className="mt-4">
              <TimetableGrid
                timetable={timetable}
                courses={courses}
                teachers={teachers}
                classrooms={classrooms}
                filterTeacherId={selectedTeacherId}
                showClassroom={true}
              />
            </div>
          </>
        ) : (
          <div className="text-center py-10 text-gray-500">
            Select a teacher to view their schedule
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const TeacherInfo = ({ teacher }: { teacher: Teacher | undefined }) => {
  if (!teacher) return null;
  
  return (
    <div className="bg-acd-light p-4 rounded-md mb-4">
      <h3 className="font-semibold text-lg text-acd-dark">{teacher.name}</h3>
      <div className="mt-2">
        <div className="text-sm text-gray-600">
          <span className="font-medium">Subjects:</span>{" "}
          {teacher.subjects.join(", ")}
        </div>
        <div className="text-sm text-gray-600">
          <span className="font-medium">Max consecutive lectures:</span>{" "}
          {teacher.maxConsecutiveLectures || 2}
        </div>
      </div>
    </div>
  );
};

export default TeacherView;
