import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { TimetableEntry, Teacher, Classroom, Course, ValidationError } from "@/types";
import { generateTimetable, validateTimetable } from "@/utils/timetableGenerator";
import { TIME_SLOTS, SAMPLE_TIMETABLE } from "@/data/mockData";
import { useToast } from "@/components/ui/use-toast";

interface GenerateTimetableProps {
  teachers: Teacher[];
  classrooms: Classroom[];
  courses: Course[];
  onGenerateTimetable: (timetable: TimetableEntry[]) => void;
}

const GenerateTimetable = ({
  teachers,
  classrooms,
  courses,
  onGenerateTimetable
}: GenerateTimetableProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [generationResult, setGenerationResult] = useState<"success" | "error" | null>(null);
  const [emptyTimetableWarning, setEmptyTimetableWarning] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerate = () => {
    setIsGenerating(true);
    setValidationErrors([]);
    setGenerationResult(null);
    setEmptyTimetableWarning(null);
    
    console.log("Starting timetable generation with data:", {
      teachers: teachers.length,
      classrooms: classrooms.length,
      courses: courses.length
    });
    
    // Simple validation to ensure we have the required data
    if (teachers.length === 0 || classrooms.length === 0 || courses.length === 0) {
      setValidationErrors([
        {
          type: "MISSING_DATA",
          message: "You need to add teachers, classrooms, and courses before generating a timetable"
        }
      ]);
      setIsGenerating(false);
      setGenerationResult("error");
      
      toast({
        title: "Missing Data",
        description: "Add teachers, classrooms, and courses before generating a timetable.",
        variant: "destructive"
      });
      
      return;
    }
    
    // Check if courses have year assignments
    const coursesWithoutYear = courses.filter(course => !course.year);
    if (coursesWithoutYear.length > 0) {
      setValidationErrors([
        {
          type: "INCOMPLETE_DATA",
          message: `${coursesWithoutYear.length} courses don't have year assignments. All courses must be assigned to a year.`
        }
      ]);
      setIsGenerating(false);
      setGenerationResult("error");
      
      toast({
        title: "Incomplete Data",
        description: "All courses must be assigned to a year.",
        variant: "destructive"
      });
      
      return;
    }
    
    // Check for minimum classroom requirements
    const yearsWithCourses = new Set(courses.map(c => c.year));
    const yearsWithClassrooms = new Set();
    
    classrooms.forEach(classroom => {
      if (classroom.yearAssigned) {
        yearsWithClassrooms.add(classroom.yearAssigned);
      } else {
        // If no year assigned, it's available for all years
        yearsWithCourses.forEach(year => yearsWithClassrooms.add(year));
      }
    });
    
    // Find years that have courses but no classrooms
    const yearsWithoutClassrooms = Array.from(yearsWithCourses).filter(year => !yearsWithClassrooms.has(year));
    
    if (yearsWithoutClassrooms.length > 0) {
      setValidationErrors([
        {
          type: "MISSING_CLASSROOMS",
          message: `Years ${yearsWithoutClassrooms.join(', ')} have courses but no assigned classrooms.`
        }
      ]);
      setIsGenerating(false);
      setGenerationResult("error");
      
      toast({
        title: "Missing Classrooms",
        description: `Years ${yearsWithoutClassrooms.join(', ')} have courses but no assigned classrooms.`,
        variant: "destructive"
      });
      
      return;
    }
    
    // Generate the timetable
    setTimeout(() => {
      try {
        console.log("Calling generateTimetable function");
        const { entries } = generateTimetable(teachers, classrooms, courses);
        console.log(`Generated ${entries.length} timetable entries`);
        
        if (entries.length === 0) {
          setEmptyTimetableWarning("The timetable generator couldn't create any entries. Check that you have enough classrooms, teachers, and courses with matching year assignments.");
          setGenerationResult("error");
          
          toast({
            title: "Generation Failed",
            description: "No entries could be generated. Check your input data or use sample data.",
            variant: "destructive"
          });
        } else {
          // Validate the generated timetable
          const errors = validateTimetable(entries, teachers, classrooms, courses, TIME_SLOTS);
          
          if (errors.length > 0) {
            setValidationErrors(errors);
            setGenerationResult("error");
            
            toast({
              title: "Validation Errors",
              description: "The generated timetable has some conflicts.",
              variant: "destructive"
            });
          } else {
            onGenerateTimetable(entries);
            setGenerationResult("success");
            
            toast({
              title: "Success",
              description: `Generated timetable with ${entries.length} entries.`,
              variant: "default"
            });
          }
        }
      } catch (error) {
        console.error("Error generating timetable:", error);
        setValidationErrors([
          {
            type: "GENERATION_ERROR",
            message: "An error occurred while generating the timetable. Please try again."
          }
        ]);
        setGenerationResult("error");
        
        toast({
          title: "Generation Error",
          description: "An unexpected error occurred. Check the console for details.",
          variant: "destructive"
        });
      } finally {
        setIsGenerating(false);
      }
    }, 1500); // Simulated delay for generation
  };

  const loadSampleData = () => {
    // Load the sample timetable directly
    onGenerateTimetable(SAMPLE_TIMETABLE);
    setValidationErrors([]);
    setGenerationResult("success");
    
    toast({
      title: "Sample Data Loaded",
      description: "Sample timetable data has been loaded for demonstration.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Timetable</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <InfoCard 
              title="Teachers" 
              count={teachers.length} 
              message={teachers.length === 0 ? "Add teachers first" : "Teachers ready"} 
              variant={teachers.length === 0 ? "warning" : "success"} 
            />
            <InfoCard 
              title="Classrooms" 
              count={classrooms.length} 
              message={classrooms.length === 0 ? "Add classrooms first" : "Classrooms ready"} 
              variant={classrooms.length === 0 ? "warning" : "success"} 
            />
            <InfoCard 
              title="Courses" 
              count={courses.length} 
              message={courses.length === 0 ? "Add courses first" : "Courses ready"} 
              variant={courses.length === 0 ? "warning" : "success"} 
            />
          </div>
          
          {emptyTimetableWarning && (
            <Alert variant="default" className="mb-4 bg-yellow-50 border-yellow-200">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertTitle className="text-yellow-800">Generation Warning</AlertTitle>
              <AlertDescription className="text-yellow-700">
                {emptyTimetableWarning}
              </AlertDescription>
            </Alert>
          )}
          
          {validationErrors.length > 0 && (
            <div className="mb-4">
              {validationErrors.map((error, index) => (
                <Alert variant="destructive" key={index} className="mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{error.type.replace(/_/g, " ")}</AlertTitle>
                  <AlertDescription>
                    {error.message}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}
          
          {generationResult === "success" && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Success</AlertTitle>
              <AlertDescription className="text-green-700">
                Timetable generated successfully!
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex flex-col md:flex-row gap-4">
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating}
              className="flex-1 bg-acd-primary hover:bg-acd-primary/90"
            >
              {isGenerating ? "Generating..." : "Generate Timetable"}
            </Button>
            
            <Button 
              onClick={loadSampleData}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Load Sample Data
            </Button>
          </div>
          
          <div className="text-xs text-gray-500 mt-2">
            <p>The timetable generator will attempt to create a schedule that satisfies all constraints:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>No classroom will have more than one lecture at a time</li>
              <li>Break times will be respected (12:00-12:45pm)</li>
              <li>Consecutive lectures will be scheduled only when needed for a class</li>
              <li>All batch students will attend common lectures together</li>
              <li>Lab sessions will be scheduled as double periods</li>
              <li>Different batches will have different lab rooms at the same time</li>
              <li>A batch will not have multiple labs for the same course on the same day</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface InfoCardProps {
  title: string;
  count: number;
  message: string;
  variant: "success" | "warning" | "error";
}

const InfoCard = ({ title, count, message, variant }: InfoCardProps) => {
  const bgColor = 
    variant === "success" ? "bg-green-50 border-green-200" :
    variant === "warning" ? "bg-yellow-50 border-yellow-200" :
    "bg-red-50 border-red-200";
  
  const textColor = 
    variant === "success" ? "text-green-700" :
    variant === "warning" ? "text-yellow-700" :
    "text-red-700";
  
  const icon = 
    variant === "success" ? <CheckCircle className="h-4 w-4 text-green-600" /> :
    variant === "warning" ? <Info className="h-4 w-4 text-yellow-600" /> :
    <AlertCircle className="h-4 w-4 text-red-600" />;
  
  return (
    <div className={`p-3 rounded-md border ${bgColor}`}>
      <div className="flex items-center justify-between">
        <span className="font-medium">{title}</span>
        <span className={`text-lg font-bold ${textColor}`}>{count}</span>
      </div>
      <div className="flex items-center mt-1">
        {icon}
        <span className={`text-xs ml-1 ${textColor}`}>{message}</span>
      </div>
    </div>
  );
};

export default GenerateTimetable;
