import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarDays } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import moment from "moment/moment";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Clock2Icon } from "lucide-react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

function TakeExam() {
  const [batch, setbatch] = useState("");
  const [sectionn, setsectionn] = useState("");
  const [semester, setsemester] = useState("");
  const [testNo, settestNo] = useState("");
  const [students, setStudents] = useState([]);
  const [rowData, setRowData] = useState();
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState("10:30");
  const [duration, setduration] = useState(40);

  // ✅ tracks whether user has attempted to submit
  const [submitted, setSubmitted] = useState(false);

  const [questions, setQuestions] = useState(
    Array.from({ length: 25 }, () => ({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
    })),
  );

  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index].question = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const handleCorrectAnswer = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].correctAnswer = value;
    setQuestions(updated);
  };

  const navigate = useNavigate();

  // ✅ returns true if everything is valid
  const isValid = () => {
    if (!semester || !testNo || !batch || !sectionn) return false;
    return questions.every(
      (q) =>
        q.question.trim() &&
        q.options.every((opt) => opt.trim()) &&
        q.correctAnswer !== "",
    );
  };

  const handlePreview = () => {
    setSubmitted(true);
    if (!isValid()) return; // stop here, red borders will appear

    const examData = {
      date: date.toISOString().split("T")[0],
      startTime,
      duration,
      semester,
      testNo,
      batch,
      sectionn,
      questions,
    };

    navigate("/teacher/exam/preview", { state: examData });
  };

  // ✅ helper: red border class when submitted and field is empty
  const fieldError = (isEmpty) =>
    submitted && isEmpty ? "border-red-500 border-2" : "";

  return (
    <div>
      <h2 className="text-xl font-bold my-4">Schedule a exam</h2>

      <div className="flex justify-between my-2">
        <div className="flex items-center gap-7">
          <Popover>
            <PopoverTrigger className="border px-3 py-2 rounded-md flex items-center gap-2">
              <CalendarDays />
              {moment(date).format("DD-MM-YYYY")}
            </PopoverTrigger>

            <PopoverContent className="p-0 w-auto">
              <Card size="sm" className="mx-auto w-fit">
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="p-0"
                  />
                </CardContent>
                <CardFooter className="border-t bg-card">
                  <FieldGroup>
                    <Field>
                      <div className="space-y-2">
                        <label
                          htmlFor="time-from"
                          className="text-sm font-medium"
                        >
                          Start Time
                        </label>
                        <div className="relative">
                          <input
                            id="time-from"
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full border rounded-md px-3 py-2"
                          />
                        </div>
                      </div>
                    </Field>
                  </FieldGroup>
                </CardFooter>
              </Card>
            </PopoverContent>
          </Popover>

          <div>
            <div className="mx-auto grid w-full max-w-xs gap-3">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="slider-demo-temperature">Duration min:</Label>
                <span className="text-sm text-muted-foreground">
                  {duration}
                </span>
              </div>
              <Slider
                id="slider-duration"
                value={duration}
                onValueChange={setduration}
                min={0}
                max={120}
                step={1}
              />
            </div>
          </div>

          {/* ✅ red ring on SelectTrigger when empty after submit */}
          <Select
            defaultValue=""
            onValueChange={(value) => setsemester(value)}
            required
          >
            <SelectTrigger id="semester" className={fieldError(!semester)}>
              <SelectValue placeholder="Semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="1">Semester-1</SelectItem>
                <SelectItem value="2">Semester-2</SelectItem>
                <SelectItem value="3">Semester-3</SelectItem>
                <SelectItem value="4">Semester-4</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            defaultValue=""
            onValueChange={(value) => settestNo(value)}
            required
          >
            <SelectTrigger id="exam_number" className={fieldError(!testNo)}>
              <SelectValue placeholder="Test no." />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="1">Test-1</SelectItem>
                <SelectItem value="2">Test-2</SelectItem>
                <SelectItem value="3">Test-3</SelectItem>
                <SelectItem value="4">Test-4</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* 🔽 Filters */}
        <div style={{ display: "flex", gap: "15px", marginBottom: "10px" }}>
          <Select
            defaultValue=""
            onValueChange={(value) => setbatch(value)}
            required
          >
            <SelectTrigger id="batch" className={fieldError(!batch)}>
              <SelectValue placeholder="Batch" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="2026-28">2026-28</SelectItem>
                <SelectItem value="2027-29">2027-29</SelectItem>
                <SelectItem value="2028-30">2028-30</SelectItem>
                <SelectItem value="2029-31">2029-31</SelectItem>
                <SelectItem value="2030-32">2030-32</SelectItem>
                <SelectItem value="2031-33">2031-33</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            defaultValue=""
            onValueChange={(value) => setsectionn(value)}
            required
          >
            <SelectTrigger id="section" className={fieldError(!sectionn)}>
              <SelectValue placeholder="Section" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="A">A</SelectItem>
                <SelectItem value="B">B</SelectItem>
                <SelectItem value="C">C</SelectItem>
                <SelectItem value="D">D</SelectItem>
                <SelectItem value="E">E</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Button onClick={handlePreview}>Preview Questions</Button>
        </div>
      </div>

      {/* ✅ single compact error banner — no scrollable giant list */}
      {submitted && !isValid() && (
        <p className="text-red-600 text-sm mt-2 font-medium">
          ⚠️ Some fields are incomplete. Please fill all questions, options, and
          selections highlighted in red.
        </p>
      )}

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-3">Questions</h2>

        <div className="max-h-[457px] overflow-y-auto pr-2 border rounded-lg p-4">
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="border-4 p-4 rounded-lg mb-4">
              {/* Question */}
              <input
                type="text"
                placeholder={`Question ${qIndex + 1}`}
                required
                value={q.question}
                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                className={`w-full border px-3 py-2 rounded mb-3 ${fieldError(!q.question.trim())}`}
              />

              {/* Options */}
              <div className="grid grid-cols-2 gap-3">
                {q.options.map((opt, optIndex) => (
                  <input
                    required
                    key={optIndex}
                    type="text"
                    placeholder={`Option ${optIndex + 1}`}
                    value={opt}
                    onChange={(e) =>
                      handleOptionChange(qIndex, optIndex, e.target.value)
                    }
                    className={`border px-3 py-2 rounded ${fieldError(!opt.trim())}`}
                  />
                ))}
              </div>

              {/* Correct Answer */}
              <Select
                required
                value={q.correctAnswer}
                onValueChange={(value) => handleCorrectAnswer(qIndex, value)}
              >
                <SelectTrigger
                  className={`mt-3 w-full ${fieldError(q.correctAnswer === "")}`}
                >
                  <SelectValue placeholder="Select Correct Answer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Option 1</SelectItem>
                  <SelectItem value="2">Option 2</SelectItem>
                  <SelectItem value="3">Option 3</SelectItem>
                  <SelectItem value="4">Option 4</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TakeExam;
