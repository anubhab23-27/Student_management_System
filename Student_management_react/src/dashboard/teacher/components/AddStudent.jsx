import { PlusSquareIcon } from "lucide-react";
import React from "react";
import { useState } from "react";
import { toast } from "sonner";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";

import { addStudent } from "../../../../service/GlobalApi";

function AddStudent() {
  const [openModal, setOpenModal] = useState(false);
  const [rollError, setRollError] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    rollnumber: "",
    password: "",
    phone: "",
    parent_phone: "",
    batch: "",
    section: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData({
      ...formData,
      [id]: id === "rollnumber" ? Number(value) : value,
    });
  };

  const handleSelect = (key, value) => {
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await addStudent(formData);

      console.log("Response:", res.data);

      toast.success("Student added successfully ✅");
      setOpenModal(false);
    } catch (err) {
      console.error(err);

      // 🔥 THIS IS THE FIX
      const message =
        err.response?.data?.error || // from your backend
        err.response?.data?.message || // fallback (login etc.)
        "Server error";

      toast.error(message); // ✅ show actual error
    }
  };

  return (
    <div>
      {/* <div className="dashboard-card " onClick={() => setOpenModal(true)}>
        <div className=" p-4  mb-2 text-xl">
          <PlusSquareIcon />
        </div>
        <p className="text-sm text-center font-medium">Register new student</p>
      </div> */}
      <Button onClick={() => setOpenModal(true)} className="cursor-pointer" >
        
        <PlusSquareIcon />
        Add new student
      </Button>
      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[400px] p-6 relative">
            {/* close button */}
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setOpenModal(false)}
            >
              <CircleX />
            </button>

            <h2 className="text-xl font-semibold mb-4">Add Student</h2>

            {/* Form $$$$$$$$$$*/}
            {/* name */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="name">Full name</FieldLabel>
                    <Input
                      id="name"
                      onChange={handleChange}
                      autoComplete="off"
                      placeholder="Anupam Roy"
                      required
                    />
                  </Field>

                  {/* Roll number */}
                  <Field data-invalid={rollError}>
                    <FieldLabel>Roll Number</FieldLabel>

                    <InputOTP
                      maxLength={7}
                      value={formData.rollnumber || ""}
                      onChange={(value) => {
                        setFormData({ ...formData, rollnumber: value });
                        setRollError(value.length !== 7);
                      }}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                      </InputOTPGroup>

                      <InputOTPSeparator />

                      <InputOTPGroup>
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                        <InputOTPSlot index={6} />
                      </InputOTPGroup>
                    </InputOTP>

                    {rollError && (
                      <FieldDescription className="text-red-500">
                        Roll number must be exactly 7 digits
                      </FieldDescription>
                    )}
                  </Field>

                  {/* password */}
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      onChange={handleChange}
                      placeholder="Enter password"
                      required
                    />
                    <FieldDescription>
                      The student should remember the password.
                    </FieldDescription>
                  </Field>

                  {/* Phone number */}
                  <Field>
                    <FieldLabel htmlFor="phoneNumber">Phone Number</FieldLabel>
                    <Input
                      id="phone"
                      onChange={handleChange}
                      placeholder="Ex:  6291602800"
                      required
                    />
                  </Field>

                  {/* parent phone number */}
                  <Field>
                    <FieldLabel htmlFor="parentNumber">
                      Parent phone Number
                    </FieldLabel>
                    <Input
                      id="parent_phone"
                      onChange={handleChange}
                      placeholder="Ex:  6291602800"
                    />
                  </Field>

                  {/* Batch section */}
                  <div className="grid grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel htmlFor="checkout-7j9-exp-year-f59">
                        Batch
                      </FieldLabel>
                      <Select
                        defaultValue=""
                        onValueChange={(value) => handleSelect("batch", value)}
                        required
                      >
                        <SelectTrigger id="batch">
                          <SelectValue placeholder="srt-end" />
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
                    </Field>

                    {/* section */}
                    <Field>
                      <FieldLabel htmlFor="checkout-7j9-exp-year-f59">
                        Section
                      </FieldLabel>
                      <Select
                        defaultValue=""
                        onValueChange={(value) =>
                          handleSelect("section", value)
                        }
                        required
                      >
                        <SelectTrigger id="section">
                          <SelectValue placeholder="A,B,C" />
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
                    </Field>
                  </div>

                  {/* submit button */}
                  <Field orientation="horizontal">
                    <Button type="submit">Submit</Button>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => setOpenModal(false)}
                    >
                      Cancel
                    </Button>
                  </Field>
                </FieldGroup>
              </FieldSet>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddStudent;
