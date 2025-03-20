import { useState } from "react";
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

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // Since we're using API key authentication which doesn't allow writes,
      // let's create a copy-pastable format for the user to manually add to their spreadsheet
      const rowData = [
        values.teamName,
        values.projectName,
        values.projectDescription || "",
        values.studentId1,
        values.studentId2 || "",
        values.studentId3 || ""
      ];
      
      // Reset form
      form.reset();
      
      // Show success message with data
      toast({
        title: "Registration data prepared",
        description: "Copy this data to add to your spreadsheet: " + rowData.join(", "),
        duration: 10000, // Show for 10 seconds
      });
      
      // Also show an alert with the data for easier copying
      alert("Registration successful! Please copy this data to add to your Google Sheet:\n\n" + rowData.join("\t"));
      
    } catch (error) {
      toast({
        title: "Form processing failed",
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
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-700">
                  <strong>Note:</strong> This form will validate your data and provide you with formatted information that you can manually copy into your Google Sheet. Direct writing to the spreadsheet requires OAuth 2.0 authentication which is beyond the scope of this demo.
                </p>
              </div>
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
                        <FormControl>
                          <Input placeholder="Enter your team name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="projectName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Name <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your project name" {...field} />
                        </FormControl>
                        <FormMessage />
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
                    
                    <FormField
                      control={form.control}
                      name="studentId1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Student ID 1 <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Enter 13-digit student ID" {...field} />
                          </FormControl>
                          <FormDescription>
                            Required: Enter a 13-digit student ID
                          </FormDescription>
                          <FormMessage />
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
                            <FormControl>
                              <Input placeholder="Enter 13-digit student ID (optional)" {...field} />
                            </FormControl>
                            <FormDescription>
                              Optional: Enter a 13-digit student ID
                            </FormDescription>
                            <FormMessage />
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
                            <FormControl>
                              <Input placeholder="Enter 13-digit student ID (optional)" {...field} />
                            </FormControl>
                            <FormDescription>
                              Optional: Enter a 13-digit student ID
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                    >
                      {isSubmitting ? "Submitting..." : "Register Project"}
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