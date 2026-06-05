"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type ExperienceItem = {
  id: string;
  role: string;
  company: string;
  location: string;
  start: string;
  end: string;
  description: string;
};

type EducationItem = {
  id: string;
  degree: string;
  school: string;
  location: string;
  start: string;
  end: string;
};

type Template = "modern" | "classic" | "minimal";

export default function ResumeBuilderClient() {
  const [template, setTemplate] = useState<Template>("modern");
  const [fullName, setFullName] = useState("Alex Johnson");
  const [headline, setHeadline] = useState("Marketing Manager");
  const [email, setEmail] = useState("alex@example.com");
  const [phone, setPhone] = useState("+49 123 456789");
  const [location, setLocation] = useState("Berlin, Germany");
  const [website, setWebsite] = useState("https://example.com");
  const [summary, setSummary] = useState(
    "Results-driven marketing professional with experience in growth strategy, content marketing, SEO and campaign optimization."
  );

  const [skills, setSkills] = useState(
    "SEO, Content Strategy, Google Analytics, Paid Ads, Email Marketing, Conversion Optimization"
  );

  const [experience, setExperience] = useState<ExperienceItem[]>([
    {
      id: crypto.randomUUID(),
      role: "Marketing Manager",
      company: "Growth Studio",
      location: "Berlin",
      start: "2023",
      end: "Present",
      description:
        "Led multi-channel marketing campaigns, improved organic traffic and optimized conversion funnels across landing pages and email campaigns.",
    },
    {
      id: crypto.randomUUID(),
      role: "Content Strategist",
      company: "Digital Agency",
      location: "Remote",
      start: "2020",
      end: "2023",
      description:
        "Planned SEO content calendars, managed editorial workflows and improved search visibility for B2B and SaaS clients.",
    },
  ]);

  const [education, setEducation] = useState<EducationItem[]>([
    {
      id: crypto.randomUUID(),
      degree: "B.A. Business Administration",
      school: "Example University",
      location: "Munich",
      start: "2016",
      end: "2020",
    },
  ]);

  const [error, setError] = useState("");

  const parsedSkills = useMemo(() => {
    return skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
  }, [skills]);

  function validateResume() {
    if (!fullName.trim()) {
      setError("Full name is required.");
      return false;
    }

    if (!headline.trim()) {
      setError("Professional headline is required.");
      return false;
    }

    if (!email.trim()) {
      setError("Email is required.");
      return false;
    }

    setError("");
    return true;
  }

  function updateExperience(
    id: string,
    field: keyof ExperienceItem,
    value: string
  ) {
    setExperience((current) =>
      current.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  }

  function updateEducation(id: string, field: keyof EducationItem, value: string) {
    setEducation((current) =>
      current.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  }

  function addExperience() {
    setExperience((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        role: "Job Title",
        company: "Company",
        location: "City",
        start: "2024",
        end: "Present",
        description: "Describe your responsibilities, results and achievements.",
      },
    ]);
  }

  function addEducation() {
    setEducation((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        degree: "Degree or Certification",
        school: "School or Institution",
        location: "City",
        start: "2020",
        end: "2024",
      },
    ]);
  }

  function removeExperience(id: string) {
    setExperience((current) => current.filter((item) => item.id !== id));
  }

  function removeEducation(id: string) {
    setEducation((current) => current.filter((item) => item.id !== id));
  }

  function printResume() {
    if (!validateResume()) return;
    window.print();
  }

  async function copyResumeText() {
    if (!validateResume()) return;

    const text = [
      fullName,
      headline,
      `${email} | ${phone} | ${location} | ${website}`,
      "",
      "SUMMARY",
      summary,
      "",
      "SKILLS",
      parsedSkills.join(", "),
      "",
      "EXPERIENCE",
      ...experience.flatMap((item) => [
        `${item.role} — ${item.company}`,
        `${item.location} | ${item.start} - ${item.end}`,
        item.description,
        "",
      ]),
      "EDUCATION",
      ...education.flatMap((item) => [
        `${item.degree} — ${item.school}`,
        `${item.location} | ${item.start} - ${item.end}`,
        "",
      ]),
    ].join("\n");

    await navigator.clipboard.writeText(text);
  }

  function resetExample() {
    setTemplate("modern");
    setFullName("Alex Johnson");
    setHeadline("Marketing Manager");
    setEmail("alex@example.com");
    setPhone("+49 123 456789");
    setLocation("Berlin, Germany");
    setWebsite("https://example.com");
    setSummary(
      "Results-driven marketing professional with experience in growth strategy, content marketing, SEO and campaign optimization."
    );
    setSkills(
      "SEO, Content Strategy, Google Analytics, Paid Ads, Email Marketing, Conversion Optimization"
    );
    setExperience([
      {
        id: crypto.randomUUID(),
        role: "Marketing Manager",
        company: "Growth Studio",
        location: "Berlin",
        start: "2023",
        end: "Present",
        description:
          "Led multi-channel marketing campaigns, improved organic traffic and optimized conversion funnels across landing pages and email campaigns.",
      },
      {
        id: crypto.randomUUID(),
        role: "Content Strategist",
        company: "Digital Agency",
        location: "Remote",
        start: "2020",
        end: "2023",
        description:
          "Planned SEO content calendars, managed editorial workflows and improved search visibility for B2B and SaaS clients.",
      },
    ]);
    setEducation([
      {
        id: crypto.randomUUID(),
        degree: "B.A. Business Administration",
        school: "Example University",
        location: "Munich",
        start: "2016",
        end: "2020",
      },
    ]);
    setError("");
  }

  const templateClass =
    template === "classic"
      ? "font-serif"
      : template === "minimal"
        ? "font-sans"
        : "font-sans";

  return (
    <div className="grid gap-8">
      <div className="print:hidden">
        <h1 className="text-3xl font-black tracking-tight text-black sm:text-4xl">
          Resume Builder
        </h1>

        <p className="mt-4 text-sm leading-7 text-black/60 sm:text-base">
          Build a professional resume with contact details, summary, skills,
          experience, education and a print-ready CV preview.
        </p>
      </div>

      <div className="rounded-[2rem] border border-black/10 bg-[#fff8df] p-6 print:hidden">
        <h2 className="text-lg font-black text-black">Mobile-friendly CV builder</h2>

        <ul className="mt-4 grid gap-3 text-sm leading-6 text-black/70">
          <li>• Edit your resume section by section</li>
          <li>• Add multiple jobs and education entries</li>
          <li>• Copy plain text for applications</li>
          <li>• Use browser print to save as PDF</li>
        </ul>
      </div>

      {error && <ToolErrorBox message={error} />}

      <div className="grid gap-6 print:hidden">
        <label className="block">
          <span className="text-sm font-bold text-black">Template style</span>

          <select
            value={template}
            onChange={(event) => setTemplate(event.target.value as Template)}
            className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
          >
            <option value="modern">Modern</option>
            <option value="classic">Classic</option>
            <option value="minimal">Minimal</option>
          </select>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Full name" value={fullName} onChange={setFullName} />
          <Input label="Professional headline" value={headline} onChange={setHeadline} />
          <Input label="Email" value={email} onChange={setEmail} />
          <Input label="Phone" value={phone} onChange={setPhone} />
          <Input label="Location" value={location} onChange={setLocation} />
          <Input label="Website / LinkedIn" value={website} onChange={setWebsite} />
        </div>

        <Textarea label="Professional summary" value={summary} onChange={setSummary} />

        <Textarea
          label="Skills comma-separated"
          value={skills}
          onChange={setSkills}
        />

        <ToolResultBox title="Experience">
          <div className="grid gap-5">
            {experience.map((item) => (
              <div key={item.id} className="rounded-[2rem] border border-black/10 bg-white p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="Role" value={item.role} onChange={(value) => updateExperience(item.id, "role", value)} />
                  <Input label="Company" value={item.company} onChange={(value) => updateExperience(item.id, "company", value)} />
                  <Input label="Location" value={item.location} onChange={(value) => updateExperience(item.id, "location", value)} />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input label="Start" value={item.start} onChange={(value) => updateExperience(item.id, "start", value)} />
                    <Input label="End" value={item.end} onChange={(value) => updateExperience(item.id, "end", value)} />
                  </div>
                </div>

                <Textarea
                  label="Description"
                  value={item.description}
                  onChange={(value) => updateExperience(item.id, "description", value)}
                />

                <button
                  type="button"
                  onClick={() => removeExperience(item.id)}
                  className="mt-4 rounded-2xl bg-red-500 px-5 py-3 text-sm font-bold text-white"
                >
                  Remove experience
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addExperience}
            className="mt-5 rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
          >
            Add experience
          </button>
        </ToolResultBox>

        <ToolResultBox title="Education">
          <div className="grid gap-5">
            {education.map((item) => (
              <div key={item.id} className="rounded-[2rem] border border-black/10 bg-white p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="Degree" value={item.degree} onChange={(value) => updateEducation(item.id, "degree", value)} />
                  <Input label="School" value={item.school} onChange={(value) => updateEducation(item.id, "school", value)} />
                  <Input label="Location" value={item.location} onChange={(value) => updateEducation(item.id, "location", value)} />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input label="Start" value={item.start} onChange={(value) => updateEducation(item.id, "start", value)} />
                    <Input label="End" value={item.end} onChange={(value) => updateEducation(item.id, "end", value)} />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeEducation(item.id)}
                  className="mt-4 rounded-2xl bg-red-500 px-5 py-3 text-sm font-bold text-white"
                >
                  Remove education
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addEducation}
            className="mt-5 rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
          >
            Add education
          </button>
        </ToolResultBox>
      </div>

      <ToolResultBox title="Resume preview">
        <div
          className={`rounded-[2rem] border border-black/10 bg-white p-6 text-black print:border-0 print:p-0 ${templateClass}`}
        >
          <div
            className={`${
              template === "modern"
                ? "border-b-4 border-black pb-6"
                : "border-b border-black/10 pb-6"
            }`}
          >
            <h2 className="text-4xl font-black tracking-tight">{fullName}</h2>
            <div className="mt-2 text-lg font-bold text-black/70">{headline}</div>

            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-black/60">
              <span>{email}</span>
              <span>{phone}</span>
              <span>{location}</span>
              <span>{website}</span>
            </div>
          </div>

          <section className="mt-8">
            <SectionTitle title="Summary" />
            <p className="mt-3 text-sm leading-7 text-black/70">{summary}</p>
          </section>

          <section className="mt-8">
            <SectionTitle title="Skills" />
            <div className="mt-3 flex flex-wrap gap-2">
              {parsedSkills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-black/10 bg-[#fff8df] px-3 py-2 text-xs font-bold text-black"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <SectionTitle title="Experience" />

            <div className="mt-4 grid gap-6">
              {experience.map((item) => (
                <div key={item.id}>
                  <div className="flex flex-col justify-between gap-1 sm:flex-row">
                    <div>
                      <div className="font-black">{item.role}</div>
                      <div className="text-sm font-bold text-black/60">
                        {item.company} • {item.location}
                      </div>
                    </div>

                    <div className="text-sm font-bold text-black/50">
                      {item.start} - {item.end}
                    </div>
                  </div>

                  <p className="mt-2 text-sm leading-7 text-black/70">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <SectionTitle title="Education" />

            <div className="mt-4 grid gap-4">
              {education.map((item) => (
                <div key={item.id} className="flex flex-col justify-between gap-1 sm:flex-row">
                  <div>
                    <div className="font-black">{item.degree}</div>
                    <div className="text-sm font-bold text-black/60">
                      {item.school} • {item.location}
                    </div>
                  </div>

                  <div className="text-sm font-bold text-black/50">
                    {item.start} - {item.end}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </ToolResultBox>

      <div className="flex flex-col gap-3 sm:flex-row print:hidden">
        <button
          type="button"
          onClick={printResume}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
        >
          Print / Save PDF
        </button>

        <button
          type="button"
          onClick={copyResumeText}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
        >
          Copy resume text
        </button>

        <button
          type="button"
          onClick={resetExample}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
        >
          Reset example
        </button>
      </div>

      <ToolInfoBox>
        Tailor your resume for each application. Use measurable results where
        possible, such as revenue, traffic, conversion rate, team size or time
        saved.
      </ToolInfoBox>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-black">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="mt-4 block">
      <span className="text-sm font-bold text-black">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 min-h-[130px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 text-sm leading-7 text-black outline-none transition focus:border-black"
      />
    </label>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <h3 className="text-xs font-black uppercase tracking-[0.25em] text-black/40">
      {title}
    </h3>
  );
}