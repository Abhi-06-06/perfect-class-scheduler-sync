
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Globe className="h-6 w-6 text-acd-primary mr-2" />
          <h1 className="text-xl font-bold text-acd-dark">
            <span className="text-acd-primary">ACD</span>
            <span>Sync</span>
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-acd-primary transition-colors">Dashboard</a>
            <a href="#" className="text-gray-600 hover:text-acd-primary transition-colors">Timetables</a>
            <a href="#" className="text-gray-600 hover:text-acd-primary transition-colors">Teachers</a>
            <a href="#" className="text-gray-600 hover:text-acd-primary transition-colors">Classrooms</a>
          </nav>
          
          <Button variant="outline" className="border-acd-primary text-acd-primary hover:bg-acd-primary hover:text-white">
            Login
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
