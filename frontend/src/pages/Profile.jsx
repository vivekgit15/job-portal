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

  // Update form fields
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Save updated profile
  const saveProfile = async () => {
    setSaving(true);
    await API.put("/user/update", profile);
    setSaving(false);
    alert("Profile updated!");
  };

  // Upload profile photo
  const uploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhotoUploading(true);

    const formData = new FormData();
    formData.append("photo", file);

    const res = await API.post("/user/upload-photo", formData);
    setProfile(res.data.user);

    setPhotoUploading(false);
  };

  // Upload resume (only jobseeker)
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

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      
      {/* BG */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b1120] to-[#05080f]" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.04]" />

      <div className="relative z-10 flex gap-8 px-10 pt-32 pb-20">

        {/* SIDEBAR */}
        <ProfileSidebar user={profile} />

        {/* MAIN CONTENT */}
        <div className="flex-1 space-y-8">

          {/* --- Profile Info Card --- */}
          <Card className="bg-[#0d1522]/70 border border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-3xl text-white">My Profile</CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">

              {/* UPLOAD PHOTO */}
              <div className="flex items-center gap-6">
                <img
                  src={profile.profilePhoto || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
                  className="w-24 h-24 rounded-full border border-white/20 object-cover"
                />
                <label className="cursor-pointer px-4 py-2 bg-white/20 rounded-md hover:bg-white/30">
                  {photoUploading ? "Uploading..." : "Upload Photo"}
                  <input type="file" className="hidden" onChange={uploadPhoto} />
                </label>
              </div>

              {/* NAME */}
              <div>
                <Label>Name</Label>
                <Input
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="bg-white/10 text-white border-white/20"
                />
              </div>

              {/* PHONE */}
              <div>
                <Label>Phone</Label>
                <Input
                  name="phone"
                  value={profile.phone || ""}
                  onChange={handleChange}
                  className="bg-white/10 text-white border-white/20"
                />
              </div>

              {/* BIO */}
              <div>
                <Label>Bio</Label>
                <Textarea
                  name="bio"
                  value={profile.bio || ""}
                  onChange={handleChange}
                  className="bg-white/10 text-white border-white/20"
                />
              </div>

              {/* SKILLS */}
              <div>
                <Label>Skills (comma separated)</Label>
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

              {/* EXPERIENCE */}
              <div>
                <Label>Experience</Label>
                <Textarea
                  name="experience"
                  value={profile.experience || ""}
                  onChange={handleChange}
                  className="bg-white/10 text-white border-white/20"
                />
              </div>

              {/* EDUCATION */}
              <div>
                <Label>Education</Label>
                <Textarea
                  name="education"
                  value={profile.education || ""}
                  onChange={handleChange}
                  className="bg-white/10 text-white border-white/20"
                />
              </div>

              {/* SAVE BUTTON */}
              <Button
                onClick={saveProfile}
                disabled={saving}
                className="w-full bg-green-500 text-black hover:bg-green-600 font-semibold"
              >
                {saving ? "Saving..." : "Save Profile"}
              </Button>

            </CardContent>
          </Card>

          {/* --- Resume Section (ONLY JOBSEEKER) --- */}
          {profile.role === "jobseeker" && (
            <Card className="bg-[#0d1522]/70 border border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>My Resume</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">

                {profile.resume ? (
                  <div className="flex items-center gap-4 bg-white/5 p-3 rounded-md border border-white/10">
                    <span className="text-green-400 text-2xl">📄</span>
                    <a href={profile.resume} target="_blank" className="underline text-blue-300">
                      View Resume
                    </a>
                  </div>
                ) : (
                  <p>No resume uploaded yet.</p>
                )}

                <label className="cursor-pointer bg-white/20 px-4 py-2 rounded-md hover:bg-white/30">
                  {resumeUploading ? "Uploading..." : "Upload Resume"}
                  <input type="file" className="hidden" onChange={uploadResume} />
                </label>

              </CardContent>
            </Card>
          )}

        </div>

      </div>
    </div>
  );
}
