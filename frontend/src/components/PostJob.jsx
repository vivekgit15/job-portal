import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import API from "../lib/axiosInstance";

const PostJob = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    salary: "",
    employmentType: "Full-time",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  // ✅ FIXED handleChange (Correct and Safe)
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    // Clear error for this field
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  // ✅ FIXED validation
  const validate = () => {
    const newErrors = {};

    if (form.title.trim().length < 3)
      newErrors.title = "Job title must be at least 3 characters";

    if (form.description.trim().length < 10)
      newErrors.description = "Description must be at least 10 characters";

    if (!form.location.trim())
      newErrors.location = "Location is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await API.post("/jobs/create", form);
      setSuccess("Job posted successfully!");

      // Reset form (string values only)
      setForm({
        title: "",
        description: "",
        requirements: "",
        location: "",
        salary: "",
        employmentType: "Full-time",
      });
    } catch (error) {
      console.error("Job posting error:", error);
    }
  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b1120] to-[#05080f]" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.04]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(0,255,120,0.12),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05),transparent_70%)]" />

      {/* Centered Card */}
      <div className="relative z-10 flex justify-center items-start pt-32 pb-20">
        <Card className="w-full max-w-2xl bg-[#0d1522]/70 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(0,255,120,0.06)] rounded-xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-white">
              Post a New Job
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit}>
              
              {/* TITLE */}
              <div>
                <Label className="text-gray-200 p-2">Job Title</Label>
                <Input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="bg-white/10 text-white border-white/20"
                  placeholder="Enter job title"
                />
                {errors.title && (
                  <p className="text-red-400 text-sm">{errors.title}</p>
                )}
              </div>

              {/* DESCRIPTION */}
              <div>
                <Label className="text-gray-200 p-2">Description</Label>
                <Textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="bg-white/10 text-white border-white/20"
                  placeholder="Describe the role"
                />
                {errors.description && (
                  <p className="text-red-400 text-sm">{errors.description}</p>
                )}
              </div>

              {/* REQUIREMENTS */}
              <div>
                <Label className="text-gray-200 p-2">Requirements</Label>
                <Textarea
                  name="requirements"
                  value={form.requirements}
                  onChange={handleChange}
                  className="bg-white/10 text-white border-white/20"
                  placeholder="List job requirements"
                />
              </div>

              {/* LOCATION */}
              <div>
                <Label className="text-gray-200 p-2">Location</Label>
                <Input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="bg-white/10 text-white border-white/20"
                  placeholder="City, Country"
                />
                {errors.location && (
                  <p className="text-red-400 text-sm">{errors.location}</p>
                )}
              </div>

              {/* SALARY */}
              <div>
                <Label className="text-gray-200 p-2">Salary</Label>
                <Input
                  name="salary"
                  value={form.salary}
                  onChange={handleChange}
                  className="bg-white/10 text-white border-white/20"
                  placeholder="Salary range"
                />
              </div>

              {/* EMPLOYMENT TYPE */}
              <div>
                <Label className="text-gray-200 p-2">Employment Type</Label>
                <select
                  name="employmentType"
                  value={form.employmentType}
                  onChange={handleChange}
                  className="w-full h-10 bg-white/10 text-white border border-white/20 rounded-md px-2"
                >
                  <option value="Full-time" className="text-black">
                    Full-time
                  </option>
                  <option value="Part-time" className="text-black">
                    Part-time
                  </option>
                  <option value="Internship" className="text-black">
                    Internship
                  </option>
                </select>
              </div>

              {/* SUBMIT BUTTON */}
              <Button
                className="bg-green-500 hover:bg-green-600 text-black font-semibold w-40 mx-auto block"
              >
                Post Job
              </Button>

              {success && <p className="text-green-400 text-center">{success}</p>}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostJob;
