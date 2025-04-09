
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TimetableGrid from "./TimetableGrid";
import TeacherView from "./TeacherView";
import InputForms from "./InputForms";
import ViewData from "./ViewData";
import GenerateTimetable from "./GenerateTimetable";
import YearBatchSelector from "./YearBatchSelector";
import { Teacher, Classroom, Course, TimetableEntry, Batch } from "@/types";
import { SAMPLE_TEACHERS, SAMPLE_CLASSROOMS, SAMPLE_COURSES, EMPTY_TIMETABLE } from "@/data/mockData";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [timetable, setTimetable] = useState<TimetableEntry[]>(EMPTY_TIMETABLE);
  const [activeTab, setActiveTab] = useState("timetable");
  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);
  const [selectedBatch, setSelectedBatch] = useState<Batch | undefined>(undefined);
  const { toast } = useToast();
  
  // Debug log for component mount and state changes
  useEffect(() => {
    console.log("Dashboard mounted or updated with:", {
      teachersCount: teachers.length,
      classroomsCount: classrooms.length,
      coursesCount: courses.length,
      timetableCount: timetable.length
    });
  }, [teachers.length, classrooms.length, courses.length, timetable.length]);
  
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
  
  const handleDeleteTeachers = (teacherIds: string[]) => {
    setTeachers(teachers.filter(t => !teacherIds.includes(t.id)));
    // Clear timetable entries related to deleted teachers
    setTimetable(timetable.filter(entry => !teacherIds.includes(entry.teacherId)));
  };
  
  const handleDeleteClassrooms = (classroomIds: string[]) => {
    setClassrooms(classrooms.filter(c => !classroomIds.includes(c.id)));
    // Clear timetable entries related to deleted classrooms
    setTimetable(timetable.filter(entry => !classroomIds.includes(entry.classroomId)));
  };
  
  const handleDeleteCourses = (courseIds: string[]) => {
    setCourses(courses.filter(c => !courseIds.includes(c.id)));
    // Clear timetable entries related to deleted courses
    setTimetable(timetable.filter(entry => !courseIds.includes(entry.courseId)));
  };
  
  const handleDeleteAllTeachers = () => {
    setTeachers([]);
    setTimetable([]);
  };
  
  const handleDeleteAllClassrooms = () => {
    setClassrooms([]);
    setTimetable([]);
  };
  
  const handleDeleteAllCourses = () => {
    setCourses([]);
    setTimetable([]);
  };
  
  const handleGenerateTimetable = (entries: TimetableEntry[]) => {
    console.log(`Setting timetable with ${entries.length} entries`);
    setTimetable(entries);
    
    if (entries.length > 0) {
      setActiveTab("timetable");
      toast({
        title: "Timetable Generated",
        description: `Created with ${entries.length} entries.`,
        variant: "default"
      });
    } else {
      toast({
        title: "Generation Failed",
        description: "No timetable entries were created. Check your input data.",
        variant: "destructive"
      });
    }
  };
  
  const handleYearChange = (year: number | undefined) => {
    setSelectedYear(year);
    if (!year) {
      setSelectedBatch(undefined);
    }
  };
  
  const handleBatchChange = (batch: Batch | undefined) => {
    setSelectedBatch(batch);
  };

  // Load sample data function
  const loadSampleData = () => {
    if (teachers.length === 0 && classrooms.length === 0 && courses.length === 0) {
      setTeachers(SAMPLE_TEACHERS);
      setClassrooms(SAMPLE_CLASSROOMS);
      setCourses(SAMPLE_COURSES);
      toast({
        title: "Sample Data Loaded",
        description: "Sample teachers, classrooms, and courses have been loaded.",
        variant: "default"
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full max-w-3xl mx-auto">
          <TabsTrigger value="timetable">Timetable</TabsTrigger>
          <TabsTrigger value="teachers">Teacher View</TabsTrigger>
          <TabsTrigger value="viewdata">View Data</TabsTrigger>
          <TabsTrigger value="input">Input Data</TabsTrigger>
          <TabsTrigger value="generate">Generate</TabsTrigger>
        </TabsList>
        
        <TabsContent value="timetable" className="space-y-4">
          <h2 className="text-2xl font-bold text-acd-dark mb-4">Master Timetable</h2>
          
          {timetable.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-1">
                <YearBatchSelector
                  onYearChange={handleYearChange}
                  onBatchChange={handleBatchChange}
                  selectedYear={selectedYear}
                  selectedBatch={selectedBatch}
                />
              </div>
              <div className="lg:col-span-3">
                <TimetableGrid
                  timetable={timetable}
                  courses={courses}
                  teachers={teachers}
                  classrooms={classrooms}
                  filterYear={selectedYear}
                  filterBatch={selectedBatch}
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-xl font-medium text-gray-600 mb-2">No Timetable Generated Yet</h3>
              <p className="text-gray-500 mb-4">
                Go to the "Generate" tab to create a new timetable.
              </p>
              {teachers.length === 0 && classrooms.length === 0 && courses.length === 0 && (
                <button 
                  onClick={loadSampleData}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Load Sample Data
                </button>
              )}
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
        
        <TabsContent value="viewdata">
          <ViewData
            teachers={teachers}
            classrooms={classrooms}
            courses={courses}
            onDeleteTeachers={handleDeleteTeachers}
            onDeleteClassrooms={handleDeleteClassrooms}
            onDeleteCourses={handleDeleteCourses}
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
            onDeleteAllTeachers={handleDeleteAllTeachers}
            onDeleteAllClassrooms={handleDeleteAllClassrooms}
            onDeleteAllCourses={handleDeleteAllCourses}
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
