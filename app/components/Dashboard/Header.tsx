import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/app/components/ui/sheet";
import { Menu, BarChart3, Users, Building2, Coins } from "lucide-react";

interface HeaderProps {
  selectedIndex: string;
  onIndexChange: (index: string) => void;
}

export const Header = () => {
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
              EdQuity
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
