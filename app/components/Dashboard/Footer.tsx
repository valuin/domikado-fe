import { Card, CardContent } from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import { Database, Users, Mail, ExternalLink } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Data Sources */}
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Database className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Data Sources</h3>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Ministry of Education</span>
                  <ExternalLink className="h-3 w-3" />
                </div>
                <div className="flex items-center justify-between">
                  <span>Central Statistics Agency</span>
                  <ExternalLink className="h-3 w-3" />
                </div>
                <div className="flex items-center justify-between">
                  <span>PISA Assessment Results</span>
                  <ExternalLink className="h-3 w-3" />
                </div>
                <div className="flex items-center justify-between">
                  <span>National Education Standards</span>
                  <ExternalLink className="h-3 w-3" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About */}
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Users className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">About</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The National Education Dashboard provides comprehensive insights
                into Indonesia's education system, supporting data-driven
                decision making for education policy and resource allocation.
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Mail className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Contact</h3>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Education Data Analytics Team</p>
                <p>Ministry of Education, Culture, Research, and Technology</p>
                <p className="text-primary hover:text-primary/80 cursor-pointer">
                  info@Edquity.go.id
                </p>
                <p>+62 21 3456 7890</p>
              </div>
            </CardContent>
          </Card>
        </div>

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
