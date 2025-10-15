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
  <div className="flex justify-center items-center min-h-screen bg-background/95 py-10 px-4 relative overflow-hidden">

    {/* 🌈 Animated gradient background */}
    <div className="absolute inset-0 -z-10 animate-gradient bg-gradient-to-r from-primary/5 via-transparent to-primary/10 blur-3xl opacity-70" />

    {/* Floating decorative orbs */}
    <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float-slow" />
    <div className="absolute bottom-10 right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-float-slower" />

    <Card className="relative w-full max-w-3xl rounded-2xl border border-border/40 shadow-2xl bg-background/80 backdrop-blur-md overflow-hidden transition-all duration-700 hover:shadow-primary/20 hover:border-primary/30 animate-fadeInUp">
      
      {/* Header */}
      <CardHeader className="bg-gradient-to-r from-primary/15 via-primary/5 to-transparent border-b border-border/30 py-8 px-8">
        <CardTitle className="text-3xl font-semibold text-foreground flex items-center gap-4 tracking-wide">
          <div className="p-3 rounded-lg bg-primary/10 animate-pulse-slow">
            <FileText className="h-7 w-7 text-primary" />
          </div>
          Project Requirements
        </CardTitle>
      </CardHeader>

      {/* Content */}
      <CardContent className="p-10">
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="group relative animate-slideUp delay-[100ms]">
              <Label htmlFor="client_name" className="block text-base font-medium text-foreground mb-3">
                Client Name *
              </Label>
              <Input
                id="client_name"
                value={project.client_name}
                onChange={(e) =>
                  setProject({ ...project, client_name: e.target.value })
                }
                placeholder="Enter client name"
                className="peer border-input bg-background/70 backdrop-blur-sm rounded-lg px-4 py-3 text-[1rem] text-foreground placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 hover:scale-[1.01]"
                required
              />
              <div className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all duration-300 peer-focus:w-full" />
            </div>

            <div className="group relative animate-slideUp delay-[200ms]">
              <Label htmlFor="project_title" className="block text-base font-medium text-foreground mb-3">
                Project Title *
              </Label>
              <Input
                id="project_title"
                value={project.project_title}
                onChange={(e) =>
                  setProject({ ...project, project_title: e.target.value })
                }
                placeholder="Enter project title"
                className="peer border-input bg-background/70 backdrop-blur-sm rounded-lg px-4 py-3 text-[1rem] text-foreground placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 hover:scale-[1.01]"
                required
              />
              <div className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all duration-300 peer-focus:w-full" />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="group relative animate-slideUp delay-[300ms]">
              <Label htmlFor="project_type" className="block text-base font-medium text-foreground mb-3">
                Project Type *
              </Label>
              <Select
                value={project.project_type}
                onValueChange={(value: any) =>
                  setProject({ ...project, project_type: value })
                }
              >
                <SelectTrigger className="border-input bg-background/70 backdrop-blur-sm rounded-lg px-4 py-3 text-[1rem] text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 hover:scale-[1.01]">
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

            <div className="group relative animate-slideUp delay-[400ms]">
              <Label htmlFor="estimated_area" className="block text-base font-medium text-foreground mb-3">
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
                placeholder="Enter estimated area"
                className="peer border-input bg-background/70 backdrop-blur-sm rounded-lg px-4 py-3 text-[1rem] text-foreground placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 hover:scale-[1.01]"
                required
              />
              <div className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all duration-300 peer-focus:w-full" />
            </div>
          </div>

          {/* Description */}
          <div className="animate-slideUp delay-[500ms]">
            <Label htmlFor="project_description" className="text-base font-medium text-foreground mb-3 block">
              Project Description *
            </Label>
            <Textarea
              id="project_description"
              value={project.project_description}
              onChange={(e) =>
                setProject({ ...project, project_description: e.target.value })
              }
              placeholder="Tell the AI about your project requirements..."
              className="min-h-[160px] border-input bg-background/70 backdrop-blur-sm rounded-lg px-4 py-3 text-[1rem] text-foreground placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 hover:scale-[1.01]"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6 animate-fadeIn delay-[700ms]">
            <Button
              type="submit"
              className="relative overflow-hidden bg-primary text-primary-foreground font-semibold text-lg px-12 py-4 rounded-lg shadow-xl transition-all duration-500 hover:shadow-primary/40 hover:scale-[1.05]"
            >
              <span className="relative z-10 tracking-wide">
                {isLoading ? "Generating Quote..." : "Generate Quote"}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary to-primary/90 opacity-0 hover:opacity-100 transition-opacity duration-500" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
);

}
