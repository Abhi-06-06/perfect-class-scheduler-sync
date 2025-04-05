
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
import { Teacher, Classroom, Course } from "@/types";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface InputFormsProps {
  teachers: Teacher[];
  classrooms: Classroom[];
  courses: Course[];
  onAddTeacher: (teacher: Omit<Teacher, "id">) => void;
  onAddClassroom: (classroom: Omit<Classroom, "id">) => void;
  onAddCourse: (course: Omit<Course, "id">) => void;
}

const InputForms = ({
  teachers,
  classrooms,
  courses,
  onAddTeacher,
  onAddClassroom,
  onAddCourse
}: InputFormsProps) => {
  const [activeTab, setActiveTab] = useState("teachers");

  return (
    <Tabs defaultValue="teachers" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="teachers">Teachers</TabsTrigger>
        <TabsTrigger value="classrooms">Classrooms</TabsTrigger>
        <TabsTrigger value="courses">Courses</TabsTrigger>
      </TabsList>
      
      <TabsContent value="teachers">
        <TeacherForm onAddTeacher={onAddTeacher} />
      </TabsContent>
      
      <TabsContent value="classrooms">
        <ClassroomForm onAddClassroom={onAddClassroom} />
      </TabsContent>
      
      <TabsContent value="courses">
        <CourseForm 
          onAddCourse={onAddCourse} 
          teachers={teachers} 
        />
      </TabsContent>
    </Tabs>
  );
};

// Teacher Form
const teacherSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  subjects: z.string().min(3, { message: "Enter at least one subject" }),
  maxConsecutiveLectures: z.coerce.number().min(1).max(6)
});

const TeacherForm = ({ onAddTeacher }: { onAddTeacher: (teacher: Omit<Teacher, "id">) => void }) => {
  const form = useForm<z.infer<typeof teacherSchema>>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      name: "",
      subjects: "",
      maxConsecutiveLectures: 2
    }
  });

  const onSubmit = (data: z.infer<typeof teacherSchema>) => {
    const subjects = data.subjects.split(",").map(subject => subject.trim());
    onAddTeacher({
      name: data.name,
      subjects,
      maxConsecutiveLectures: data.maxConsecutiveLectures
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
            
            <Button type="submit" className="bg-acd-primary hover:bg-acd-primary/90">
              Add Teacher
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

// Classroom Form
const classroomSchema = z.object({
  name: z.string().min(2, { message: "Room name must be at least 2 characters" }),
  capacity: z.coerce.number().min(1, { message: "Capacity must be at least 1" }),
  isLab: z.boolean().default(false)
});

type ClassroomFormData = z.infer<typeof classroomSchema>;

const ClassroomForm = ({ onAddClassroom }: { onAddClassroom: (classroom: Omit<Classroom, "id">) => void }) => {
  const form = useForm<ClassroomFormData>({
    resolver: zodResolver(classroomSchema),
    defaultValues: {
      name: "",
      capacity: 30,
      isLab: false
    }
  });

  const onSubmit = (data: ClassroomFormData) => {
    // Explicitly create an object that matches the required Omit<Classroom, "id"> type
    const newClassroom: Omit<Classroom, "id"> = {
      name: data.name,
      capacity: data.capacity,
      isLab: data.isLab
    };
    onAddClassroom(newClassroom);
    form.reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Classroom</CardTitle>
        <CardDescription>
          Enter classroom details to add it to the system
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
                  <FormLabel>Room Name</FormLabel>
                  <FormControl>
                    <Input placeholder="A101" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacity</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isLab"
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
                      This is a laboratory
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            
            <Button type="submit" className="bg-acd-primary hover:bg-acd-primary/90">
              Add Classroom
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

// Course Form
const courseSchema = z.object({
  name: z.string().min(3, { message: "Course name must be at least 3 characters" }),
  subjectCode: z.string().min(3, { message: "Subject code must be at least 3 characters" }),
  requiredSessions: z.coerce.number().min(1).max(10),
  requiresLab: z.boolean().default(false),
  teacherId: z.string({ required_error: "Please select a teacher" })
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
      teacherId: ""
    }
  });

  const onSubmit = (data: CourseFormData) => {
    // Explicitly create an object that matches the required Omit<Course, "id"> type
    const newCourse: Omit<Course, "id"> = {
      name: data.name,
      subjectCode: data.subjectCode,
      requiredSessions: data.requiredSessions,
      requiresLab: data.requiresLab,
      teacherId: data.teacherId
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
                      Requires laboratory
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            
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
