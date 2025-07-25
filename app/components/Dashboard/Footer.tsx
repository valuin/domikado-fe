import { Card, CardContent } from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import { Database, Users, Mail, ExternalLink } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-muted/30 !pt-0 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
    
        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © 2024 Ministry of Education, Culture, Research, and Technology. All
            rights reserved.
          </div>
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <span className="hover:text-foreground cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-foreground cursor-pointer">
              Terms of Service
            </span>
            <span className="hover:text-foreground cursor-pointer">
              API Documentation
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
