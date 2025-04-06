
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Teacher, Classroom, Course, Batch } from "@/types";

interface ViewDataProps {
  teachers: Teacher[];
  classrooms: Classroom[];
  courses: Course[];
}

const ViewData = ({ teachers, classrooms, courses }: ViewDataProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-acd-dark mb-4">Data Summary</h2>

      <Tabs defaultValue="teachers" className="w-full">
        <TabsList className="w-full grid grid-cols-3 mb-4">
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
          <TabsTrigger value="classrooms">Classrooms</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
        </TabsList>

        <TabsContent value="teachers">
          <Card>
            <CardHeader>
              <CardTitle>Teachers</CardTitle>
              <CardDescription>
                View all registered teachers and their details
              </CardDescription>
            </CardHeader>
            <CardContent>
              {teachers.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  No teachers have been added yet
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Subjects</TableHead>
                      <TableHead>Max Consecutive Lectures</TableHead>
                      <TableHead>Year Assigned</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teachers.map((teacher) => (
                      <TableRow key={teacher.id}>
                        <TableCell>{teacher.name}</TableCell>
                        <TableCell>{teacher.subjects.join(", ")}</TableCell>
                        <TableCell>{teacher.maxConsecutiveLectures || 2}</TableCell>
                        <TableCell>
                          {teacher.yearAssigned 
                            ? `${teacher.yearAssigned}${getOrdinalSuffix(teacher.yearAssigned)} Year` 
                            : "Any Year"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classrooms">
          <Card>
            <CardHeader>
              <CardTitle>Classrooms</CardTitle>
              <CardDescription>
                View all registered classrooms and their details
              </CardDescription>
            </CardHeader>
            <CardContent>
              {classrooms.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  No classrooms have been added yet
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Year Assigned</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classrooms.map((classroom) => (
                      <TableRow key={classroom.id}>
                        <TableCell>{classroom.name}</TableCell>
                        <TableCell>{classroom.capacity}</TableCell>
                        <TableCell>{classroom.isLab ? "Laboratory" : "Classroom"}</TableCell>
                        <TableCell>
                          {classroom.yearAssigned 
                            ? `${classroom.yearAssigned}${getOrdinalSuffix(classroom.yearAssigned)} Year` 
                            : "Any Year"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <CardTitle>Courses</CardTitle>
              <CardDescription>
                View all registered courses and their details
              </CardDescription>
            </CardHeader>
            <CardContent>
              {courses.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  No courses have been added yet
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Subject Code</TableHead>
                      <TableHead>Sessions/Week</TableHead>
                      <TableHead>Lab Required</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Assigned Teacher</TableHead>
                      <TableHead>Lab Batches</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.map((course) => {
                      const teacher = teachers.find(t => t.id === course.teacherId);
                      return (
                        <TableRow key={course.id}>
                          <TableCell>{course.name}</TableCell>
                          <TableCell>{course.subjectCode}</TableCell>
                          <TableCell>{course.requiredSessions}</TableCell>
                          <TableCell>{course.requiresLab ? "Yes" : "No"}</TableCell>
                          <TableCell>
                            {course.year 
                              ? `${course.year}${getOrdinalSuffix(course.year)} Year` 
                              : ""}
                          </TableCell>
                          <TableCell>{teacher?.name || "Unknown"}</TableCell>
                          <TableCell>
                            {course.batches && course.batches.length > 0 
                              ? course.batches.join(", ") 
                              : course.requiresLab ? "All Batches" : "N/A"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper function to get ordinal suffix for numbers
function getOrdinalSuffix(num: number): string {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) {
    return "st";
  }
  if (j === 2 && k !== 12) {
    return "nd";
  }
  if (j === 3 && k !== 13) {
    return "rd";
  }
  return "th";
}

export default ViewData;
