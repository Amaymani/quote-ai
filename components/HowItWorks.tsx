import { Boxes, ClipboardList, Sparkles } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: <Boxes className="h-10 w-10 text-primary" />,
    title: "1. Manage Inventory",
    description:
      "Easily add, update, and organize your products. Our intuitive interface gives you full control over your stock details.",
  },
  {
    icon: <ClipboardList className="h-10 w-10 text-primary" />,
    title: "2. Fill Quotation Details",
    description:
      "Select products from your inventory and input customer details to create a new quotation request in seconds.",
  },
  {
    icon: <Sparkles className="h-10 w-10 text-primary" />,
    title: "3. Get AI-Generated PDF",
    description:
      "Our AI intelligently crafts a professional quotation PDF for you. Review, download, and send it to your clients with one click.",
  },
];

export function HowItWorks() {
  return (
    <section className="w-full flex justify-center bg-white py-12 md:py-20 lg:py-24 my-30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
              How It Works
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Get Your Quotation in 3 Simple Steps
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our platform streamlines the entire quotation process, from managing inventory to generating professional-grade documents powered by AI.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:gap-16 mt-12">
          {features.map((feature, index) => (
            <Card key={index} className="drop-shadow-lg hover:drop-shadow-2xl transition-shadow duration-800">
              <CardHeader className="flex flex-col items-center text-center gap-4">
                {feature.icon}
                <div className="space-y-1">
                  <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                  <CardDescription>
                    {feature.description}
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}