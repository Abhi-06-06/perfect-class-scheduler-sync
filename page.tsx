
'use client';

import React, { useState, useEffect } from "react";
import Dashboard from "@/components/Dashboard";
import { SAMPLE_TIMETABLE } from "@/data/mockData";
import { useToast } from "@/components/ui/use-toast";

export default function TimetablePage() {
  const [initialized, setInitialized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize with sample data on first load
    if (!initialized) {
      // Check if localStorage already has a timetable
      const storedTimetable = localStorage.getItem('timetable');
      
      if (!storedTimetable || JSON.parse(storedTimetable).length === 0) {
        // Initialize with sample data
        localStorage.setItem('timetable', JSON.stringify(SAMPLE_TIMETABLE));
        
        toast({
          title: "Sample Data Loaded",
          description: "Sample timetable data has been loaded for demonstration.",
        });
      }
      
      setInitialized(true);
    }
  }, [initialized, toast]);

  return (
    <div>
      <Dashboard />
    </div>
  );
}
