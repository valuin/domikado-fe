import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/app/components/ui/sheet";
import { Menu, BarChart3, Users, Building2, Coins } from "lucide-react";

interface HeaderProps {
  selectedIndex: string;
  onIndexChange: (index: string) => void;
}

export const Header = ({ selectedIndex, onIndexChange }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    {
      id: "student-performance",
      label: "Student Performance",
      description: "Academic achievement & learning outcomes",
      icon: BarChart3,
    },
    {
      id: "educator-workforce",
      label: "Teaching Staff",
      description: "Teacher quality & distribution",
      icon: Users,
    },
    {
      id: "infrastructure",
      label: "Infrastructure",
      description: "Buildings & digital facilities",
      icon: Building2,
    },
    {
      id: "budget-allocation",
      label: "Budget Allocation",
      description: "Financial resource distribution",
      icon: Coins,
    },
  ];

  return (
    <header className="sticky top-0 z-1000 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              EduDashboard
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant={selectedIndex === item.id ? "default" : "ghost"}
                onClick={() => onIndexChange(item.id)}
                className="flex flex-col items-start p-3 h-auto min-w-[140px]"
              >
                <div className="flex items-center space-x-2 mb-1">
                  <item.icon className="h-4 w-4" />
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
                <span className="text-xs opacity-70 text-left">
                  {item.description}
                </span>
              </Button>
            ))}
          </nav>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Education Indices
                </h2>
                {navigationItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={selectedIndex === item.id ? "default" : "ghost"}
                    onClick={() => {
                      onIndexChange(item.id);
                      setIsOpen(false);
                    }}
                    className="flex items-start p-4 h-auto justify-start"
                  >
                    <div className="flex flex-col items-start space-y-1">
                      <div className="flex items-center space-x-2">
                        <item.icon className="h-4 w-4" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <span className="text-xs opacity-70 text-left">
                        {item.description}
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
