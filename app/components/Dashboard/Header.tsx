import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { GraduationCap, Menu, User } from "lucide-react";

interface HeaderProps {
  selectedIndex: string;
  onIndexChange: (index: string) => void;
}

const educationIndices = [
  { value: "student-performance", label: "Student Performance Index" },
  { value: "budget-allocation", label: "Budget Allocation Index" },
  { value: "infrastructure", label: "Infrastructure Index" },
  { value: "educator-workforce", label: "Educator Workforce Index" },
];

export const Header = ({ selectedIndex, onIndexChange }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-primary shadow-card border-b border-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-primary-foreground" />
              <div>
                <h1 className="text-xl font-bold text-primary-foreground">
                  National Education Dashboard
                </h1>
                <p className="text-xs text-primary-foreground/80">
                  Republic of Indonesia
                </p>
              </div>
            </div>
          </div>

          {/* Main Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#"
              className="text-primary-foreground/90 hover:text-primary-foreground font-medium transition-colors"
            >
              Home
            </a>
            <a
              href="#"
              className="text-primary-foreground/90 hover:text-primary-foreground font-medium transition-colors"
            >
              Data
            </a>
            <a
              href="#"
              className="text-primary-foreground/90 hover:text-primary-foreground font-medium transition-colors"
            >
              Simulation
            </a>
            <a
              href="#"
              className="text-primary-foreground/90 hover:text-primary-foreground font-medium transition-colors"
            >
              About
            </a>
          </nav>

          {/* Index Selector and User Menu */}
          <div className="flex items-center space-x-4">
            {/* Index Selector */}
            <div className="hidden lg:block">
              <Select value={selectedIndex} onValueChange={onIndexChange}>
                <SelectTrigger className="w-64 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
                  <SelectValue placeholder="Select education index" />
                </SelectTrigger>
                <SelectContent>
                  {educationIndices.map((index) => (
                    <SelectItem key={index.value} value={index.value}>
                      {index.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* User Menu */}
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <User className="h-4 w-4 mr-2" />
              Login
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-primary-foreground/20 py-4">
            <div className="space-y-4">
              {/* Mobile Index Selector */}
              <div className="lg:hidden">
                <Select value={selectedIndex} onValueChange={onIndexChange}>
                  <SelectTrigger className="w-full bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
                    <SelectValue placeholder="Select education index" />
                  </SelectTrigger>
                  <SelectContent>
                    {educationIndices.map((index) => (
                      <SelectItem key={index.value} value={index.value}>
                        {index.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Mobile Navigation Links */}
              <div className="flex flex-col space-y-2">
                <a
                  href="#"
                  className="text-primary-foreground/90 hover:text-primary-foreground font-medium py-2"
                >
                  Home
                </a>
                <a
                  href="#"
                  className="text-primary-foreground/90 hover:text-primary-foreground font-medium py-2"
                >
                  Data
                </a>
                <a
                  href="#"
                  className="text-primary-foreground/90 hover:text-primary-foreground font-medium py-2"
                >
                  Simulation
                </a>
                <a
                  href="#"
                  className="text-primary-foreground/90 hover:text-primary-foreground font-medium py-2"
                >
                  About
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
