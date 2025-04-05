
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TimetableGrid from "./TimetableGrid";
import TeacherView from "./TeacherView";
import InputForms from "./InputForms";
import GenerateTimetable from "./GenerateTimetable";
import { Teacher, Classroom, Course, TimetableEntry } from "@/types";
import { SAMPLE_TEACHERS, SAMPLE_CLASSROOMS, SAMPLE_COURSES, EMPTY_TIMETABLE } from "@/data/mockData";

const Dashboard = () => {
  const [teachers, setTeachers] = useState<Teacher[]>(SAMPLE_TEACHERS);
  const [classrooms, setClassrooms] = useState<Classroom[]>(SAMPLE_CLASSROOMS);
  const [courses, setCourses] = useState<Course[]>(SAMPLE_COURSES);
  const [timetable, setTimetable] = useState<TimetableEntry[]>(EMPTY_TIMETABLE);
  const [activeTab, setActiveTab] = useState("timetable");
  
  const handleAddTeacher = (teacher: Omit<Teacher, "id">) => {
    const newTeacher: Teacher = {
      ...teacher,
      id: `t${teachers.length + 1}`
    };
    setTeachers([...teachers, newTeacher]);
  };
  
  const handleAddClassroom = (classroom: Omit<Classroom, "id">) => {
    const newClassroom: Classroom = {
      ...classroom,
      id: `c${classrooms.length + 1}`
    };
    setClassrooms([...classrooms, newClassroom]);
  };
  
  const handleAddCourse = (course: Omit<Course, "id">) => {
    const newCourse: Course = {
      ...course,
      id: `crs${courses.length + 1}`
    };
    setCourses([...courses, newCourse]);
  };
  
  const handleGenerateTimetable = (entries: TimetableEntry[]) => {
    setTimetable(entries);
    setActiveTab("timetable");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto">
          <TabsTrigger value="timetable">Timetable</TabsTrigger>
          <TabsTrigger value="teachers">Teacher View</TabsTrigger>
          <TabsTrigger value="input">Input Data</TabsTrigger>
          <TabsTrigger value="generate">Generate</TabsTrigger>
        </TabsList>
        
        <TabsContent value="timetable" className="space-y-4">
          <h2 className="text-2xl font-bold text-acd-dark mb-4">Master Timetable</h2>
          {timetable.length > 0 ? (
            <TimetableGrid
              timetable={timetable}
              courses={courses}
              teachers={teachers}
              classrooms={classrooms}
            />
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-xl font-medium text-gray-600 mb-2">No Timetable Generated Yet</h3>
              <p className="text-gray-500">
                Go to the "Generate" tab to create a new timetable.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="teachers">
          <TeacherView
            teachers={teachers}
            timetable={timetable}
            courses={courses}
            classrooms={classrooms}
          />
        </TabsContent>
        
        <TabsContent value="input">
          <InputForms
            teachers={teachers}
            classrooms={classrooms}
            courses={courses}
            onAddTeacher={handleAddTeacher}
            onAddClassroom={handleAddClassroom}
            onAddCourse={handleAddCourse}
          />
        </TabsContent>
        
        <TabsContent value="generate">
          <GenerateTimetable
            teachers={teachers}
            classrooms={classrooms}
            courses={courses}
            onGenerateTimetable={handleGenerateTimetable}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
