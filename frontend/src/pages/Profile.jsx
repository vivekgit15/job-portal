import { useEffect, useState } from "react";
import API from "../lib/axiosInstance";
import ProfileSidebar from "../components/ProfileSidebar";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);

  const fetchProfile = async () => {
    const res = await API.get("/user/me");
    setProfile(res.data);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!profile) return <p className="p-10 text-white">Loading...</p>;

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    setSaving(true);
    await API.put("/user/update", profile);
    setSaving(false);
    alert("Profile updated!");
  };

  const uploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhotoUploading(true);

    const formData = new FormData();
    formData.append("photo", file);

    const res = await API.post("/user/upload-photo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });

    setProfile(res.data.user || res.data.profile || res.data);
    setPhotoUploading(false);
  };

  const deletePhoto = async () => {
    await API.delete("/user/delete-photo", { withCredentials: true });
    fetchProfile();
  };

  const uploadResume = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setResumeUploading(true);

    const formData = new FormData();
    formData.append("resume", file);

    const res = await API.post("/user/upload-resume", formData);
    setProfile(res.data.user);

    setResumeUploading(false);
  };

  const deleteResume = async () => {
    await API.delete("/user/delete-resume", { withCredentials: true });
    fetchProfile();
  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b1120] to-[#05080f]" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />

      <div className="relative z-10 flex gap-8 px-10 pt-32 pb-20">

        {/* SIDEBAR */}
        <ProfileSidebar user={profile} />

        {/* MAIN CONTENT */}
        <div className="flex-1 space-y-10">

          {/* PROFILE INFO */}
          <Card className="bg-[#0d1522]/70 border border-white/10 backdrop-blur-xl shadow-xl">
            <CardHeader>
              <CardTitle className="text-3xl text-white tracking-wide">Profile Information</CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">

              {/* FULL NAME */}
              <div className="space-y-2">
                <Label className="text-gray-300">
                  {profile.role === "employer" ? "Company Name" : "Full Name"}
                </Label>
                <Input
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="bg-white/10 text-white border-white/20"
                />
              </div>

              {/* PHONE OR WEBSITE */}
              <div className="space-y-2">
                <Label className="text-gray-300">
                  {profile.role === "employer" ? "Company Website" : "Phone"}
                </Label>
                <Input
                  name={profile.role === "employer" ? "companyWebsite" : "phone"}
                  value={
                    profile.role === "employer"
                      ? profile.companyWebsite || ""
                      : profile.phone || ""
                  }
                  onChange={handleChange}
                  className="bg-white/10 text-white border-white/20"
                />
              </div>

              {/* BIO OR COMPANY DESCRIPTION */}
              <div className="col-span-1 md:col-span-2 space-y-2">
                <Label className="text-gray-300">
                  {profile.role === "jobseeker" ? "Bio" : "Company Description"}
                </Label>
                <Textarea
                  name={profile.role === "jobseeker" ? "bio" : "companyDescription"}
                  value={
                    profile.role === "jobseeker"
                      ? profile.bio || ""
                      : profile.companyDescription || ""
                  }
                  onChange={handleChange}
                  className="bg-white/10 text-white border-white/20"
                />
              </div>

              {/* SKILLS */}
              {profile.role === "jobseeker" && (
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <Label className="text-gray-300">Skills (comma separated)</Label>
                  <Input
                    name="skills"
                    value={profile.skills?.join(", ") || ""}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        skills: e.target.value.split(",").map((s) => s.trim()),
                      })
                    }
                    className="bg-white/10 text-white border-white/20"
                  />
                </div>
              )}

              {/* EXPERIENCE */}
              {profile.role === "jobseeker" && (
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <Label className="text-gray-300">Experience</Label>
                  <Textarea
                    name="experience"
                    value={profile.experience || ""}
                    onChange={handleChange}
                    className="bg-white/10 text-white border-white/20"
                  />
                </div>
              )}

              {/* EDUCATION */}
              {profile.role === "jobseeker" && (
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <Label className="text-gray-300">Education</Label>
                  <Textarea
                    name="education"
                    value={profile.education || ""}
                    onChange={handleChange}
                    className="bg-white/10 text-white border-white/20"
                  />
                </div>
              )}

              <div className="col-span-1 md:col-span-2">
                <Button
                  onClick={saveProfile}
                  disabled={saving}
                  className="w-full sm:w-1/2 md:w-1/6 bg-green-500 text-black hover:bg-green-600 font-semibold"

                >
                  {saving ? "Saving..." : "Save Profile"}
                </Button>
              </div>

            </CardContent>
          </Card>

          {/* PHOTO / LOGO + RESUME SECTION */}
          <Card className="w-[70%] bg-[#0d1522]/70 border border-white/10 backdrop-blur-xl shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-white tracking-wide">
                {profile.role === "employer" ? "Company Logo" : "Resume & Profile Photo"}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-15 mt-4 flex gap-15">

              {/* RESUME (ONLY JOBSEEKER) */}
              {profile.role === "jobseeker" && (
                <div className="space-y-3">
                  <Label className="text-gray-300">Resume</Label>

                  {profile.resume ? (
                    <div className="flex items-center gap-4 bg-white/5 p-3 rounded-md border border-white/10">
                      <span className="text-green-400 text-2xl">📄</span>
                      <a href={profile.resume} target="_blank" className="underline text-blue-300">
                        View Resume
                      </a>
                    </div>
                  ) : (
                    <p className="text-gray-300">No resume uploaded yet.</p>
                  )}

                  <div className="flex gap-4">
                    <label className="cursor-pointer bg-white/20 px-4 py-2 rounded-md hover:bg-white/30">
                      {resumeUploading ? "Uploading..." : "Upload Resume"}
                      <input type="file" className="hidden" onChange={uploadResume} />
                    </label>

                    {profile.resume && (
                      <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={deleteResume}>
                        Delete Resume
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* PHOTO / COMPANY LOGO */}
              <div className="space-y-3">
                <Label className="text-gray-300">
                  {profile.role === "employer" ? "Company Logo" : "Profile Photo"}
                </Label>

                <div className="flex items-center gap-6">
                  <img
                    src={
                      profile.profilePhoto ||
                      profile.companyLogo ||
                      "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                    }
                    className="w-20 h-20 rounded-full border border-white/20 object-cover"
                  />

                  <label className="cursor-pointer bg-white/20 px-4 py-2 rounded-md hover:bg-white/30">
                    {photoUploading
                      ? "Uploading..."
                      : profile.role === "employer"
                      ? "Upload Logo"
                      : "Upload Photo"}
                    <input type="file" className="hidden" onChange={uploadPhoto} />
                  </label>
                </div>

                {(profile.profilePhoto || profile.companyLogo) && (
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white mt-2"
                    onClick={deletePhoto}
                  >
                    {profile.role === "employer" ? "Delete Logo" : "Delete Photo"}
                  </Button>
                )}
              </div>

            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
