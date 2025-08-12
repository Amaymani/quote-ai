"use client";
import { use, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileText, Quote } from "lucide-react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { set } from "mongoose";
import QuoteSkeleton from "@/components/LoadingComp";




export interface ProjectInput {
  client_name: string;
  project_title: string;
  project_type:
    | "Acoustic"
    | "Cladding"
    | "Soundproofing"
    | "Other"
    | "Weatherproofing / Waterproofing"
    | "Fireproofing";
  project_description: string;
  estimated_area?: number;
}

export default function ProjectForm() {
  const [project, setProject] = useState<ProjectInput>({
    client_name: "",
    project_title: "",
    project_type: "Acoustic",
    project_description: "",
    estimated_area: undefined,
  });
  const [responseAI, setResponseAI] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);


  

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <QuoteSkeleton />;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center ">
        <QuoteSkeleton />
      </div>
    );}



  const handleSubmit = async (e: React.FormEvent) =>{
    e.preventDefault();
    const isFormValid =
      project.client_name &&
      project.project_title &&
      project.project_description &&
      project.estimated_area &&
      project.project_type;

    if (!isFormValid) {
      alert("fill all the fields");
      return;
    }

    try{
      setIsLoading(true);
      const res= await axios.post("/api/get-quote", {
        client_name: project.client_name,
        project_title: project.project_title,
        project_type: project.project_type,
        project_description: project.project_description,
        estimated_area: project.estimated_area,
        user_email: session?.user?.email,
      });
      setIsLoading(false);
      
      setResponseAI(res.data);
      console.log("AI Response:", res.data);
      router.push(`/quote/${res.data.quote_id}`);
    }
    catch (error) {
      console.error("Error generating AI response:", error);
      alert("An error occurred while generating the quote. Please try again.");
    }
  };

  return (
    <div className="flex justify-center bg-background">
      <Card className="shadow-medium border-border m-4 lg:w-[60%]">
        <CardHeader className="bg-gradient-subtle">
          <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Project Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="client_name"
                  className="text-sm font-medium text-foreground"
                >
                  Client Name *
                </Label>
                <Input
                  id="client_name"
                  value={project.client_name}
                  onChange={(e) =>
                    setProject({ ...project, client_name: e.target.value })
                  }
                  placeholder="Enter client name"
                  className="border-input focus:ring-primary focus:border-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="project_title"
                  className="text-sm font-medium text-foreground"
                >
                  Project Title *
                </Label>
                <Input
                  id="project_title"
                  value={project.project_title}
                  onChange={(e) =>
                    setProject({ ...project, project_title: e.target.value })
                  }
                  placeholder="Enter project title"
                  className="border-input focus:ring-primary focus:border-primary"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="project_type"
                  className="text-sm font-medium text-foreground"
                >
                  Project Type *
                </Label>
                <Select
                  value={project.project_type}
                  onValueChange={(value: any) =>
                    setProject({ ...project, project_type: value })
                  }
                >
                  <SelectTrigger className="border-input focus:ring-primary focus:border-primary">
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Acoustic">Acoustic</SelectItem>
                    <SelectItem value="Cladding">Cladding</SelectItem>
                    <SelectItem value="Soundproofing">Soundproofing</SelectItem>
                    <SelectItem value="Weatherproofing / Waterproofing">
                      Weatherproofing / Waterproofing
                    </SelectItem>
                    <SelectItem value="Fireproofing">Fireproofing</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="estimated_area"
                  className="text-sm font-medium text-foreground"
                >
                  Estimated Area (sq ft) *
                </Label>
                <Input
                  id="estimated_area"
                  type="number"
                  value={project.estimated_area || ""}
                  onChange={(e) =>
                    setProject({
                      ...project,
                      estimated_area: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    })
                  }
                  placeholder="Enter estimated area in square feet"
                  className="border-input focus:ring-primary focus:border-primary"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="project_description"
                className="text-sm font-medium text-foreground"
              >
                Project Description *
              </Label>
              <div className="relative">
                <Textarea
                  id="project_description"
                  value={project.project_description}
                  onChange={(e) =>
                    setProject({
                      ...project,
                      project_description: e.target.value,
                    })
                  }
                  placeholder="Tell the AI about your project requirements and expectations..."
                  className="min-h-[120px] border-input focus:ring-primary focus:border-primary pr-12"
                  required
                />
              </div>
              <div className="flex items-center justify-center mt-5 w-full">
                <Button
                  type="submit"
                  // disabled={!isFormValid || isLoading}
                  className=" bg-primary hover:opacity-90 text-primary-foreground w-60 font-medium py-2.5 transition-smooth shadow-medium hover:shadow-large"
                >
                  {isLoading ? "Generating Quote..." : "Generate Quote"}
                  
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
