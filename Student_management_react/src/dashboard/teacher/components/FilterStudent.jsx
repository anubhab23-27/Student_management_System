import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

function FilterStudent({
  batch,
  setBatch,
  sectionn,
  setSectionn,
  onApply,
  showDate = false,
  date,
  setDate,
}) {
  return (
    <div>
      <h2 className="text-xl font-bold my-4">Filter Students</h2>

      <div className="flex justify-between my-2">
        {/* Optional Date Picker */}
        {showDate && (
          <input
            type="date"
            value={date || ""}
            onChange={(e) => setDate(e.target.value)}
            className="border px-3 py-2 rounded-md"
          />
        )}

        {/* Filters */}
        <div style={{ display: "flex", gap: "15px" }}>
          <Select onValueChange={(value) => setBatch(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Batch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2026-28">2026-28</SelectItem>
              <SelectItem value="2027-29">2027-29</SelectItem>
              <SelectItem value="2028-30">2028-30</SelectItem>
              <SelectItem value="2029-31">2029-31</SelectItem>
              <SelectItem value="2030-32">2030-32</SelectItem>
              <SelectItem value="2031-33">2031-33</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => setSectionn(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Section" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">A</SelectItem>
              <SelectItem value="B">B</SelectItem>
              <SelectItem value="C">C</SelectItem>
              <SelectItem value="D">D</SelectItem>
              <SelectItem value="E">E</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={onApply}>Apply Filter</Button>
        </div>
      </div>
    </div>
  );
}

export default FilterStudent;
