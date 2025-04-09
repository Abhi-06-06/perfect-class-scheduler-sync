import { useState } from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Teacher, Classroom, Course, Batch } from "@/types";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BATCHES } from "@/data/mockData";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash } from "lucide-react";

interface InputFormsProps {
  teachers: Teacher[];
  classrooms: Classroom[];
  courses: Course[];
  onAddTeacher: (teacher: Omit<Teacher, "id">) => void;
  onAddClassroom: (classroom: Omit<Classroom, "id">) => void;
  onAddCourse: (course: Omit<Course, "id">) => void;
  onDeleteAllTeachers?: () => void;
  onDeleteAllClassrooms?: () => void;
  onDeleteAllCourses?: () => void;
}

const InputForms = ({
  teachers,
  classrooms,
  courses,
  onAddTeacher,
  onAddClassroom,
  onAddCourse,
  onDeleteAllTeachers,
  onDeleteAllClassrooms,
  onDeleteAllCourses
}: InputFormsProps) => {
  const [activeTab, setActiveTab] = useState("teachers");

  const handleDeleteTeacher = () => {
    if (onDeleteAllTeachers) {
      onDeleteAllTeachers();
    }
  };

  const handleDeleteClassroom = () => {
    if (onDeleteAllClassrooms) {
      onDeleteAllClassrooms();
    }
  };

  const handleDeleteCourse = () => {
    if (onDeleteAllCourses) {
      onDeleteAllCourses();
    }
  };

  return (
    <Tabs defaultValue="teachers" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="teachers">Teachers</TabsTrigger>
        <TabsTrigger value="classrooms">Classrooms</TabsTrigger>
        <TabsTrigger value="courses">Courses</TabsTrigger>
      </TabsList>
      
      <TabsContent value="teachers">
        <div className="mb-4 flex justify-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash className="mr-2 h-4 w-4" />
                Delete All Teachers
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will delete all teachers data. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteTeacher}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <TeacherForm onAddTeacher={onAddTeacher} />
      </TabsContent>
      
      <TabsContent value="classrooms">
        <div className="mb-4 flex justify-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash className="mr-2 h-4 w-4" />
                Delete All Classrooms
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will delete all classrooms data. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteClassroom}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <ClassroomForm onAddClassroom={onAddClassroom} />
      </TabsContent>
      
      <TabsContent value="courses">
        <div className="mb-4 flex justify-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash className="mr-2 h-4 w-4" />
                Delete All Courses
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will delete all courses data. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteCourse}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <CourseForm 
          onAddCourse={onAddCourse} 
          teachers={teachers} 
        />
      </TabsContent>
    </Tabs>
  );
};

const teacherSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  subjects: z.string().min(3, { message: "Enter at least one subject" }),
  maxConsecutiveLectures: z.coerce.number().min(1).max(6),
  yearCommitment: z.string().optional()
});

const TeacherForm = ({ onAddTeacher }: { onAddTeacher: (teacher: Omit<Teacher, "id">) => void }) => {
  const form = useForm<z.infer<typeof teacherSchema>>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      name: "",
      subjects: "",
      maxConsecutiveLectures: 2,
      yearCommitment: ""
    }
  });

  const onSubmit = (data: z.infer<typeof teacherSchema>) => {
    const subjects = data.subjects.split(",").map(subject => subject.trim());
    onAddTeacher({
      name: data.name,
      subjects,
      maxConsecutiveLectures: data.maxConsecutiveLectures,
      yearAssigned: data.yearCommitment ? parseInt(data.yearCommitment) : undefined
    });
    form.reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Teacher</CardTitle>
        <CardDescription>
          Enter teacher details to add them to the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teacher Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Prof. John Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="subjects"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subjects (comma separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="Mathematics, Statistics" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="maxConsecutiveLectures"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Consecutive Lectures</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} max={6} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="yearCommitment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year Commitment (Optional)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a year (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Any Year</SelectItem>
                      <SelectItem value="1">1st Year</SelectItem>
                      <SelectItem value="2">2nd Year</SelectItem>
                      <SelectItem value="3">3rd Year</SelectItem>
                      <SelectItem value="4">4th Year</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="bg-acd-primary hover:bg-acd-primary/90">
              Add Teacher
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

const classroomSchema = z.object({
  year: z.string({ required_error: "Please select a year" }),
  classroomCount: z.coerce.number().min(1, { message: "At least 1 classroom is required" }),
  labCount: z.coerce.number().min(0, { message: "Lab count must be 0 or more" }),
  classCapacity: z.coerce.number().min(10, { message: "Classroom capacity must be at least 10" }),
  labCapacity: z.coerce.number().min(10, { message: "Lab capacity must be at least 10" })
});

type ClassroomFormData = z.infer<typeof classroomSchema>;

const ClassroomForm = ({ onAddClassroom }: { onAddClassroom: (classroom: Omit<Classroom, "id">) => void }) => {
  const form = useForm<ClassroomFormData>({
    resolver: zodResolver(classroomSchema),
    defaultValues: {
      year: "",
      classroomCount: 1,
      labCount: 0,
      classCapacity: 60,
      labCapacity: 15
    }
  });
  
  const onSubmit = (data: ClassroomFormData) => {
    const yearNum = parseInt(data.year);
    
    for (let i = 0; i < data.classroomCount; i++) {
      const newClassroom: Omit<Classroom, "id"> = {
        name: `R${yearNum}${i + 1}`,
        capacity: data.classCapacity,
        isLab: false,
        yearAssigned: yearNum
      };
      onAddClassroom(newClassroom);
    }
    
    for (let i = 0; i < data.labCount; i++) {
      const newLab: Omit<Classroom, "id"> = {
        name: `L${yearNum}${i + 1}`,
        capacity: data.labCapacity,
        isLab: true,
        yearAssigned: yearNum
      };
      onAddClassroom(newLab);
    }
    
    form.reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Classrooms</CardTitle>
        <CardDescription>
          Enter the number of classrooms and labs for a specific year
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">1st Year</SelectItem>
                      <SelectItem value="2">2nd Year</SelectItem>
                      <SelectItem value="3">3rd Year</SelectItem>
                      <SelectItem value="4">4th Year</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="classroomCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Classrooms</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="classCapacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Classroom Capacity</FormLabel>
                    <FormControl>
                      <Input type="number" min={10} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="labCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Labs</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="labCapacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lab Capacity</FormLabel>
                    <FormControl>
                      <Input type="number" min={10} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit" className="bg-acd-primary hover:bg-acd-primary/90">
              Add Classrooms
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

const courseSchema = z.object({
  name: z.string().min(3, { message: "Course name must be at least 3 characters" }),
  subjectCode: z.string().min(2, { message: "Subject code must be at least 2 characters" }),
  requiredSessions: z.coerce.number().min(1).max(10),
  requiresLab: z.boolean().default(false),
  teacherId: z.string({ required_error: "Please select a teacher" }),
  year: z.string({ required_error: "Please select a year" }),
  batches: z.array(z.string()).optional()
});

type CourseFormData = z.infer<typeof courseSchema>;

const CourseForm = ({ 
  onAddCourse, 
  teachers 
}: { 
  onAddCourse: (course: Omit<Course, "id">) => void;
  teachers: Teacher[];
}) => {
  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: "",
      subjectCode: "",
      requiredSessions: 3,
      requiresLab: false,
      teacherId: "",
      year: "",
      batches: []
    }
  });

  const requiresLab = form.watch("requiresLab");

  const onSubmit = (data: CourseFormData) => {
    const newCourse: Omit<Course, "id"> = {
      name: data.name,
      subjectCode: data.subjectCode,
      requiredSessions: data.requiredSessions,
      requiresLab: data.requiresLab,
      teacherId: data.teacherId,
      year: parseInt(data.year),
      batches: requiresLab && data.batches?.length ? data.batches as Batch[] : undefined
    };
    onAddCourse(newCourse);
    form.reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Course</CardTitle>
        <CardDescription>
          Enter course details to add it to the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Introduction to Programming" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="subjectCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject Code</FormLabel>
                  <FormControl>
                    <Input placeholder="CS101" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">1st Year</SelectItem>
                      <SelectItem value="2">2nd Year</SelectItem>
                      <SelectItem value="3">3rd Year</SelectItem>
                      <SelectItem value="4">4th Year</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="requiredSessions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Required Sessions per Week</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} max={10} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="requiresLab"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Requires laboratory (integrated with lecture slots)
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            
            {requiresLab && (
              <FormField
                control={form.control}
                name="batches"
                render={() => (
                  <FormItem>
                    <FormLabel>Select Batches for Lab Sessions</FormLabel>
                    <div className="grid grid-cols-2 gap-2">
                      {BATCHES.map((batch) => (
                        <FormField
                          key={batch}
                          control={form.control}
                          name="batches"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={batch}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(batch)}
                                    onCheckedChange={(checked) => {
                                      const currentValue = field.value || [];
                                      const newValue = checked
                                        ? [...currentValue, batch]
                                        : currentValue.filter((value) => value !== batch);
                                      field.onChange(newValue);
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                  Batch {batch}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="teacherId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assigned Teacher</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a teacher" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {teachers.map(teacher => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          {teacher.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="bg-acd-primary hover:bg-acd-primary/90">
              Add Course
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default InputForms;
