import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { debounce } from "@/lib/utils";

// Validation schema
const formSchema = z.object({
  teamName: z.string().min(2, {
    message: "Team name must be at least 2 characters.",
  }),
  projectName: z.string().min(2, {
    message: "Project name must be at least 2 characters.",
  }),
  projectDescription: z.string().optional(),
  studentId1: z.string().regex(/^\d{13}$/, {
    message: "Student ID must be a 13-digit number.",
  }),
  studentId2: z.string().regex(/^\d{13}$/, {
    message: "Student ID must be a 13-digit number.",
  }).optional().or(z.literal("")),
  studentId3: z.string().regex(/^\d{13}$/, {
    message: "Student ID must be a 13-digit number.",
  }).optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

export default function Register() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teamNameExists, setTeamNameExists] = useState(false);
  const [checkingTeamName, setCheckingTeamName] = useState(false);
  const [projectNameExists, setProjectNameExists] = useState(false); // Added
  const [checkingProjectName, setCheckingProjectName] = useState(false); // Added
  const [studentIdStatus, setStudentIdStatus] = useState<Record<string, { checking: boolean; exists: boolean }>>({
    studentId1: { checking: false, exists: false },
    studentId2: { checking: false, exists: false },
    studentId3: { checking: false, exists: false },
  });

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamName: "",
      projectName: "",
      projectDescription: "",
      studentId1: "",
      studentId2: "",
      studentId3: "",
    },
  });

  // Create debounced functions for API calls
  const debouncedCheckTeamName = debounce(async (teamName: string) => {
    if (!teamName || teamName.length < 2) {
      setTeamNameExists(false);
      setCheckingTeamName(false);
      return;
    }

    try {
      const response = await apiRequest("GET", `/api/sheets/check-team?teamName=${encodeURIComponent(teamName)}`);
      const data = await response.json();
      setTeamNameExists(data.exists);
    } catch (error) {
      console.error("Error checking team name:", error);
    } finally {
      setCheckingTeamName(false);
    }
  }, 500);

  const debouncedCheckStudentId = debounce(async (studentId: string, fieldName: string) => {
    if (!studentId || !/^\d{13}$/.test(studentId)) {
      setStudentIdStatus(prev => ({
        ...prev,
        [fieldName]: { checking: false, exists: false }
      }));
      return;
    }

    try {
      const response = await apiRequest("GET", `/api/sheets/check-student-id?studentId=${encodeURIComponent(studentId)}`);
      const data = await response.json();
      setStudentIdStatus(prev => ({
        ...prev,
        [fieldName]: { checking: false, exists: data.exists }
      }));
    } catch (error) {
      console.error(`Error checking ${fieldName}:`, error);
      setStudentIdStatus(prev => ({
        ...prev,
        [fieldName]: { checking: false, exists: false }
      }));
    }
  }, 500);

  const debouncedCheckProjectName = debounce(async (projectName: string) => { // Added
    if (!projectName || projectName.length < 2) {
      setProjectNameExists(false);
      setCheckingProjectName(false);
      return;
    }

    try {
      const response = await apiRequest("GET", `/api/sheets/check-project?projectName=${encodeURIComponent(projectName)}`); // Assumed endpoint
      const data = await response.json();
      setProjectNameExists(data.exists);
    } catch (error) {
      console.error("Error checking project name:", error);
    } finally {
      setCheckingProjectName(false);
    }
  }, 500);


  // Watch for form field changes
  const teamName = form.watch("teamName");
  const projectName = form.watch("projectName"); // Added
  const studentId1 = form.watch("studentId1");
  const studentId2 = form.watch("studentId2");
  const studentId3 = form.watch("studentId3");

  // Check for duplicate team name
  useEffect(() => {
    if (teamName && teamName.length >= 2) {
      setCheckingTeamName(true);
      debouncedCheckTeamName(teamName);
    } else {
      setTeamNameExists(false);
      setCheckingTeamName(false);
    }
  }, [teamName]);

  // Check for duplicate project name
  useEffect(() => {
    if (projectName && projectName.length >= 2) {
      setCheckingProjectName(true);
      debouncedCheckProjectName(projectName);
    } else {
      setProjectNameExists(false);
      setCheckingProjectName(false);
    }
  }, [projectName]);

  // Check for duplicate student IDs
  useEffect(() => {
    if (studentId1 && /^\d{13}$/.test(studentId1)) {
      setStudentIdStatus(prev => ({
        ...prev,
        studentId1: { ...prev.studentId1, checking: true }
      }));
      debouncedCheckStudentId(studentId1, "studentId1");
    } else {
      setStudentIdStatus(prev => ({
        ...prev,
        studentId1: { checking: false, exists: false }
      }));
    }
  }, [studentId1]);

  useEffect(() => {
    if (studentId2 && /^\d{13}$/.test(studentId2)) {
      setStudentIdStatus(prev => ({
        ...prev,
        studentId2: { ...prev.studentId2, checking: true }
      }));
      debouncedCheckStudentId(studentId2, "studentId2");
    } else {
      setStudentIdStatus(prev => ({
        ...prev,
        studentId2: { checking: false, exists: false }
      }));
    }
  }, [studentId2]);

  useEffect(() => {
    if (studentId3 && /^\d{13}$/.test(studentId3)) {
      setStudentIdStatus(prev => ({
        ...prev,
        studentId3: { ...prev.studentId3, checking: true }
      }));
      debouncedCheckStudentId(studentId3, "studentId3");
    } else {
      setStudentIdStatus(prev => ({
        ...prev,
        studentId3: { checking: false, exists: false }
      }));
    }
  }, [studentId3]);

  // Check for internal duplicates (same student ID used multiple times in the form)
  const hasDuplicateInternalIds = () => {
    const ids = [studentId1, studentId2, studentId3].filter(id => id && id.length === 13);
    const uniqueIds = new Set(ids);
    return uniqueIds.size !== ids.length;
  };

  const internalDuplicateError = hasDuplicateInternalIds();

  const onSubmit = async (values: FormValues) => {
    // Additional validation before submission
    if (teamNameExists) {
      toast({
        title: "Validation Error",
        description: "Team name already exists. Please choose another name.",
        variant: "destructive",
      });
      return;
    }
    if (projectNameExists) { // Added
      toast({
        title: "Validation Error",
        description: "Project name already exists. Please choose another name.",
        variant: "destructive",
      });
      return;
    }

    // Check if any student ID already exists in the database
    const anyExistingStudentId = Object.values(studentIdStatus).some(status => status.exists);
    if (anyExistingStudentId) {
      toast({
        title: "Validation Error",
        description: "One or more student IDs are already registered. Each student can only be part of one team.",
        variant: "destructive",
      });
      return;
    }

    // Check for internal duplicates
    if (internalDuplicateError) {
      toast({
        title: "Validation Error",
        description: "Each student ID must be unique. You cannot use the same ID multiple times.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Submit data to the API
      await apiRequest("POST", "/api/sheets/register", values);

      // Reset form
      form.reset();
      setTeamNameExists(false);
      setProjectNameExists(false); // Added
      setStudentIdStatus({
        studentId1: { checking: false, exists: false },
        studentId2: { checking: false, exists: false },
        studentId3: { checking: false, exists: false },
      });

      // Show success message
      toast({
        title: "Registration successful",
        description: "Your project information has been saved to Google Sheets.",
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onRefresh={() => {}} />
      <main className="flex-grow">
        <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
          <Card className="bg-white shadow-sm rounded-lg mb-6">
            <CardHeader className="px-4 py-5 sm:px-6">
              <CardTitle className="text-xl font-semibold text-gray-900">Project Registration</CardTitle>
              <CardDescription className="mt-1 text-sm text-gray-500">
                Register your team and project information
              </CardDescription>

            </CardHeader>
            <CardContent className="px-4 py-5 sm:px-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="teamName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team Name <span className="text-red-500">*</span></FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input 
                              placeholder="Enter your team name" 
                              {...field} 
                              className={teamNameExists ? "pr-10 border-red-500" : ""}
                            />
                          </FormControl>
                          {checkingTeamName && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            </div>
                          )}
                          {!checkingTeamName && teamNameExists && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            </div>
                          )}
                          {!checkingTeamName && teamName && teamName.length >= 2 && !teamNameExists && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            </div>
                          )}
                        </div>
                        <FormMessage />
                        {teamNameExists && (
                          <p className="text-sm text-red-500 mt-1">This team name is already taken. Please choose a different name.</p>
                        )}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="projectName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Name <span className="text-red-500">*</span></FormLabel>
                        <div className="relative"> {/* Added div for icon */}
                          <FormControl>
                            <Input placeholder="Enter your project name" {...field} className={projectNameExists ? "pr-10 border-red-500" : ""} />
                          </FormControl>
                          {checkingProjectName && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            </div>
                          )}
                          {!checkingProjectName && projectNameExists && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            </div>
                          )}
                          {!checkingProjectName && projectName && projectName.length >= 2 && !projectNameExists && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            </div>
                          )}
                        </div>
                        <FormMessage />
                        {projectNameExists && (
                          <p className="text-sm text-red-500 mt-1">This project name is already taken. Please choose a different name.</p>
                        )}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="projectDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your project" 
                            className="resize-none h-24"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Optional: Provide a brief description of your project
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-medium text-gray-900 mb-3">Student Information</h3>

                    {internalDuplicateError && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <div className="flex items-center">
                          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                          <p className="text-sm text-red-600">
                            Each student ID must be unique. You cannot use the same ID in multiple fields.
                          </p>
                        </div>
                      </div>
                    )}

                    <FormField
                      control={form.control}
                      name="studentId1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Student ID 1 <span className="text-red-500">*</span></FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input 
                                placeholder="Enter 13-digit student ID" 
                                {...field} 
                                className={studentIdStatus.studentId1.exists ? "pr-10 border-red-500" : ""}
                              />
                            </FormControl>
                            {studentIdStatus.studentId1.checking && (
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                              </div>
                            )}
                            {!studentIdStatus.studentId1.checking && studentIdStatus.studentId1.exists && (
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <AlertCircle className="h-4 w-4 text-red-500" />
                              </div>
                            )}
                            {!studentIdStatus.studentId1.checking && studentId1 && /^\d{13}$/.test(studentId1) && !studentIdStatus.studentId1.exists && (
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              </div>
                            )}
                          </div>
                          <FormDescription>
                            Required: Enter a 13-digit student ID
                          </FormDescription>
                          <FormMessage />
                          {studentIdStatus.studentId1.exists && (
                            <p className="text-sm text-red-500 mt-1">This student ID is already registered. Each student can only be part of one team.</p>
                          )}
                        </FormItem>
                      )}
                    />

                    <div className="mt-4">
                      <FormField
                        control={form.control}
                        name="studentId2"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Student ID 2</FormLabel>
                            <div className="relative">
                              <FormControl>
                                <Input 
                                  placeholder="Enter 13-digit student ID (optional)" 
                                  {...field} 
                                  className={studentIdStatus.studentId2.exists ? "pr-10 border-red-500" : ""}
                                />
                              </FormControl>
                              {studentIdStatus.studentId2.checking && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                </div>
                              )}
                              {!studentIdStatus.studentId2.checking && studentIdStatus.studentId2.exists && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                  <AlertCircle className="h-4 w-4 text-red-500" />
                                </div>
                              )}
                              {!studentIdStatus.studentId2.checking && studentId2 && /^\d{13}$/.test(studentId2) && !studentIdStatus.studentId2.exists && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                </div>
                              )}
                            </div>
                            <FormDescription>
                              Optional: Enter a 13-digit student ID
                            </FormDescription>
                            <FormMessage />
                            {studentIdStatus.studentId2.exists && (
                              <p className="text-sm text-red-500 mt-1">This student ID is already registered. Each student can only be part of one team.</p>
                            )}
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mt-4">
                      <FormField
                        control={form.control}
                        name="studentId3"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Student ID 3</FormLabel>
                            <div className="relative">
                              <FormControl>
                                <Input 
                                  placeholder="Enter 13-digit student ID (optional)" 
                                  {...field}
                                  className={studentIdStatus.studentId3.exists ? "pr-10 border-red-500" : ""}
                                />
                              </FormControl>
                              {studentIdStatus.studentId3.checking && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                </div>
                              )}
                              {!studentIdStatus.studentId3.checking && studentIdStatus.studentId3.exists && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                  <AlertCircle className="h-4 w-4 text-red-500" />
                                </div>
                              )}
                              {!studentIdStatus.studentId3.checking && studentId3 && /^\d{13}$/.test(studentId3) && !studentIdStatus.studentId3.exists && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                </div>
                              )}
                            </div>
                            <FormDescription>
                              Optional: Enter a 13-digit student ID
                            </FormDescription>
                            <FormMessage />
                            {studentIdStatus.studentId3.exists && (
                              <p className="text-sm text-red-500 mt-1">This student ID is already registered. Each student can only be part of one team.</p>
                            )}
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button
                      type="submit"
                      disabled={
                        isSubmitting || 
                        teamNameExists || 
                        projectNameExists || // Added
                        internalDuplicateError || 
                        Object.values(studentIdStatus).some(status => status.exists) ||
                        Object.values(studentIdStatus).some(status => status.checking)
                      }
                      className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : "Register Project"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}