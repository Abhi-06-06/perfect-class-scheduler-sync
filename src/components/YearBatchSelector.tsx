
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Batch } from "@/types";
import { BATCHES } from "@/data/mockData";

interface YearBatchSelectorProps {
  onYearChange: (year: number | undefined) => void;
  onBatchChange: (batch: Batch | undefined) => void;
  selectedYear?: number;
  selectedBatch?: Batch;
}

const YearBatchSelector = ({
  onYearChange,
  onBatchChange,
  selectedYear,
  selectedBatch
}: YearBatchSelectorProps) => {
  const handleYearChange = (value: string) => {
    if (value === "all") {
      onYearChange(undefined);
    } else {
      onYearChange(parseInt(value));
    }
  };

  const handleBatchChange = (value: string) => {
    if (value === "") {
      onBatchChange(undefined);
    } else {
      onBatchChange(value as Batch);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Timetable</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="year-select">Year</Label>
          <Select 
            onValueChange={handleYearChange} 
            value={selectedYear?.toString() || "all"}
          >
            <SelectTrigger id="year-select">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              <SelectItem value="1">1st Year</SelectItem>
              <SelectItem value="2">2nd Year</SelectItem>
              <SelectItem value="3">3rd Year</SelectItem>
              <SelectItem value="4">4th Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {selectedYear && (
          <div>
            <Label htmlFor="batch-select" className="mb-2 block">Batch</Label>
            <ToggleGroup 
              type="single" 
              value={selectedBatch || ""} 
              onValueChange={handleBatchChange}
              className="justify-start"
            >
              <ToggleGroupItem value="" aria-label="All Batches">All</ToggleGroupItem>
              {BATCHES.map(batch => (
                <ToggleGroupItem 
                  key={batch} 
                  value={batch} 
                  aria-label={`Batch ${batch}`}
                >
                  {batch}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default YearBatchSelector;
