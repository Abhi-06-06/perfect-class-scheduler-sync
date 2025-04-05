
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-acd-dark mb-2">
              <span className="text-acd-primary">ACD</span>Sync
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Automatic timetable generator for your university. Create conflict-free schedules 
              respecting all constraints with just a few clicks.
            </p>
          </div>
          
          <Dashboard />
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2025 ACDSync - University Timetable Management System</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
