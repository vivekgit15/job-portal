import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full bg-[#0a0f1c] text-white overflow-hidden">

      {/* GLOBAL BACKGROUND EFFECTS */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b1120] to-[#05080f]" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.06]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(0,255,120,0.12),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04),transparent_70%)]" />

      {/* CONTENT WRAPPER */}
      <div className="relative z-10">

        {/* ================= HERO SECTION ================= */}
        <section className="pt-32 pb-24 px-6 text-center">

          <div className="inline-block bg-[#0f181f] border border-white/10 backdrop-blur-md px-4 py-1 rounded-full text-sm text-green-400 mb-6">
            Ethical Job Matching
          </div>

          <h1 className="text-6xl font-extrabold leading-tight">
            Find Your Next{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 drop-shadow-[0_0_30px_rgba(0,255,120,0.3)]">
              Opportunity
            </span>
          </h1>

          <p className="text-gray-400 max-w-2xl mx-auto mt-4 text-lg">
            Discover jobs, apply instantly, and boost your career. No filters, no noise—just genuine opportunities.
          </p>

          <div className="flex justify-center gap-4 mt-10">
            <Link to="/login">
              <Button className="bg-green-500 hover:bg-green-600 text-black font-semibold px-6 py-3 rounded-xl shadow-lg">
                Find Jobs
              </Button>
            </Link>

            <Link to="/login">
              <Button className="bg-[#111827] border border-white/10 hover:bg-[#16202c] text-white px-6 py-3 rounded-xl">
                Post a Job
              </Button>
            </Link>
          </div>
        </section>

        {/* ================= FEATURES SECTION ================= */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Why Choose Us?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* CARD TEMPLATE */}
            {[
              {
                icon: "🧑‍💼",
                title: "For Job Seekers",
                desc: "Search jobs, track applications, and apply instantly with ease.",
              },
              {
                icon: "🏢",
                title: "For Employers",
                desc: "Post jobs, manage applicants, and hire the right talent quickly.",
              },
              {
                icon: "⚡",
                title: "Fast & Secure",
                desc: "Built with MERN stack for speed, security, and smooth performance.",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="bg-[#0d1522] border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:border-green-500/30 hover:shadow-[0_0_25px_rgba(0,255,120,0.15)] transition-all"
              >
                <CardHeader>
                  <div className="w-fit h-14 flex items-center justify-center bg-green-100/10 text-green-400 rounded-xl text-3xl mb-3">
                    {item.icon}
                  </div>
                  <CardTitle className="text-xl text-white">{item.title}</CardTitle>
                  <CardDescription className="text-gray-400">{item.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}

          </div>
        </section>

        {/* ================= HOW IT WORKS SECTION ================= */}
        <section className="py-24">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">How It Works</h2>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-14 text-center">

            {[
              { icon: "📝", title: "Create Profile", desc: "Signup as jobseeker or employer within seconds." },
              { icon: "🔍", title: "Search or Post Jobs", desc: "Browse new jobs or create openings easily." },
              { icon: "🤝", title: "Apply & Get Hired", desc: "Fast applications, quick hiring decisions." },
            ].map((item, i) => (
              <div key={i}>
                <div className="text-6xl mb-4">{item.icon}</div>
                <h3 className="font-semibold text-2xl text-white mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}

          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <footer className="bg-gray-950 text-gray-300 py-14 mt-10 border-t border-gray-800">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 px-6">

            <div>
              <h3 className="font-bold text-xl text-white mb-3">Job Portal</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                A platform built to simplify hiring and job searching—secure, fast, and easy to use.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-3">Job Seekers</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/login" className="hover:text-white transition">Find Jobs</Link></li>
                <li><Link to="/applications/my" className="hover:text-white transition">My Applications</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-3">Employers</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/post-job" className="hover:text-white transition">Post a Job</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition">Manage Jobs</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-3">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a className="hover:text-white transition cursor-pointer">About Us</a></li>
                <li><a className="hover:text-white transition cursor-pointer">Contact</a></li>
              </ul>
            </div>
          </div>

          <Separator className="my-8 bg-gray-700" />

          <div className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Job Portal • All Rights Reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}
