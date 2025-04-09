
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash } from "lucide-react";
import { Teacher, Classroom, Course } from "@/types";

interface ViewDataProps {
  teachers: Teacher[];
  classrooms: Classroom[];
  courses: Course[];
  onDeleteTeachers?: (ids: string[]) => void;
  onDeleteClassrooms?: (ids: string[]) => void;
  onDeleteCourses?: (ids: string[]) => void;
}

const ViewData = ({ 
  teachers, 
  classrooms, 
  courses,
  onDeleteTeachers,
  onDeleteClassrooms,
  onDeleteCourses
}: ViewDataProps) => {
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [selectedClassrooms, setSelectedClassrooms] = useState<string[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  
  const handleTeacherSelection = (teacherId: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedTeachers([...selectedTeachers, teacherId]);
    } else {
      setSelectedTeachers(selectedTeachers.filter(id => id !== teacherId));
    }
  };
  
  const handleClassroomSelection = (classroomId: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedClassrooms([...selectedClassrooms, classroomId]);
    } else {
      setSelectedClassrooms(selectedClassrooms.filter(id => id !== classroomId));
    }
  };
  
  const handleCourseSelection = (courseId: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedCourses([...selectedCourses, courseId]);
    } else {
      setSelectedCourses(selectedCourses.filter(id => id !== courseId));
    }
  };
  
  const handleSelectAllTeachers = (isChecked: boolean) => {
    if (isChecked) {
      setSelectedTeachers(teachers.map(t => t.id));
    } else {
      setSelectedTeachers([]);
    }
  };
  
  const handleSelectAllClassrooms = (isChecked: boolean) => {
    if (isChecked) {
      setSelectedClassrooms(classrooms.map(c => c.id));
    } else {
      setSelectedClassrooms([]);
    }
  };
  
  const handleSelectAllCourses = (isChecked: boolean) => {
    if (isChecked) {
      setSelectedCourses(courses.map(c => c.id));
    } else {
      setSelectedCourses([]);
    }
  };
  
  const handleDeleteTeachers = () => {
    if (onDeleteTeachers && selectedTeachers.length > 0) {
      onDeleteTeachers(selectedTeachers);
      setSelectedTeachers([]);
    }
  };
  
  const handleDeleteClassrooms = () => {
    if (onDeleteClassrooms && selectedClassrooms.length > 0) {
      onDeleteClassrooms(selectedClassrooms);
      setSelectedClassrooms([]);
    }
  };
  
  const handleDeleteCourses = () => {
    if (onDeleteCourses && selectedCourses.length > 0) {
      onDeleteCourses(selectedCourses);
      setSelectedCourses([]);
    }
  };

  return (
    <Tabs defaultValue="teachers" className="w-full">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="teachers">Teachers ({teachers.length})</TabsTrigger>
        <TabsTrigger value="classrooms">Classrooms ({classrooms.length})</TabsTrigger>
        <TabsTrigger value="courses">Courses ({courses.length})</TabsTrigger>
      </TabsList>
      
      <TabsContent value="teachers">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Teachers</CardTitle>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  size="sm"
                  disabled={selectedTeachers.length === 0}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete Selected ({selectedTeachers.length})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will delete {selectedTeachers.length} selected teacher(s). This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteTeachers}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardHeader>
          <CardContent>
            {teachers.length === 0 ? (
              <div className="text-center p-4 bg-gray-50 rounded-md">
                <p className="text-gray-500">No teachers added yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox 
                          checked={selectedTeachers.length === teachers.length && teachers.length > 0}
                          onCheckedChange={handleSelectAllTeachers}
                        />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Subjects</TableHead>
                      <TableHead className="text-center">Max Consecutive Lectures</TableHead>
                      <TableHead className="text-center">Year Assigned</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teachers.map((teacher) => (
                      <TableRow key={teacher.id}>
                        <TableCell>
                          <Checkbox 
                            checked={selectedTeachers.includes(teacher.id)}
                            onCheckedChange={(checked) => 
                              handleTeacherSelection(teacher.id, checked === true)
                            }
                          />
                        </TableCell>
                        <TableCell className="font-medium">{teacher.name}</TableCell>
                        <TableCell>{teacher.subjects.join(", ")}</TableCell>
                        <TableCell className="text-center">{teacher.maxConsecutiveLectures || 2}</TableCell>
                        <TableCell className="text-center">{teacher.yearAssigned || "Any"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="classrooms">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Classrooms</CardTitle>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  size="sm"
                  disabled={selectedClassrooms.length === 0}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete Selected ({selectedClassrooms.length})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will delete {selectedClassrooms.length} selected classroom(s). This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteClassrooms}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardHeader>
          <CardContent>
            {classrooms.length === 0 ? (
              <div className="text-center p-4 bg-gray-50 rounded-md">
                <p className="text-gray-500">No classrooms added yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox 
                          checked={selectedClassrooms.length === classrooms.length && classrooms.length > 0}
                          onCheckedChange={handleSelectAllClassrooms}
                        />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-center">Capacity</TableHead>
                      <TableHead className="text-center">Type</TableHead>
                      <TableHead className="text-center">Year Assigned</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classrooms.map((classroom) => (
                      <TableRow key={classroom.id}>
                        <TableCell>
                          <Checkbox 
                            checked={selectedClassrooms.includes(classroom.id)}
                            onCheckedChange={(checked) => 
                              handleClassroomSelection(classroom.id, checked === true)
                            }
                          />
                        </TableCell>
                        <TableCell className="font-medium">{classroom.name}</TableCell>
                        <TableCell className="text-center">{classroom.capacity}</TableCell>
                        <TableCell className="text-center">{classroom.isLab ? "Laboratory" : "Classroom"}</TableCell>
                        <TableCell className="text-center">{classroom.yearAssigned || "Any"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="courses">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Courses</CardTitle>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  size="sm"
                  disabled={selectedCourses.length === 0}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete Selected ({selectedCourses.length})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will delete {selectedCourses.length} selected course(s). This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteCourses}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardHeader>
          <CardContent>
            {courses.length === 0 ? (
              <div className="text-center p-4 bg-gray-50 rounded-md">
                <p className="text-gray-500">No courses added yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox 
                          checked={selectedCourses.length === courses.length && courses.length > 0}
                          onCheckedChange={handleSelectAllCourses}
                        />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-center">Code</TableHead>
                      <TableHead className="text-center">Sessions</TableHead>
                      <TableHead className="text-center">Lab</TableHead>
                      <TableHead className="text-center">Year</TableHead>
                      <TableHead>Batches</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell>
                          <Checkbox 
                            checked={selectedCourses.includes(course.id)}
                            onCheckedChange={(checked) => 
                              handleCourseSelection(course.id, checked === true)
                            }
                          />
                        </TableCell>
                        <TableCell className="font-medium">{course.name}</TableCell>
                        <TableCell className="text-center">{course.subjectCode}</TableCell>
                        <TableCell className="text-center">{course.requiredSessions}</TableCell>
                        <TableCell className="text-center">{course.requiresLab ? "Yes" : "No"}</TableCell>
                        <TableCell className="text-center">{course.year}</TableCell>
                        <TableCell>{course.batches?.join(", ") || "All"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ViewData;
