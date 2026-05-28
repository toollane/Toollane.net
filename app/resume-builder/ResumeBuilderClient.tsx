"use client";

import { useState } from "react";

import jsPDF from "jspdf";

export default function ResumeBuilderClient() {
  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [jobTitle, setJobTitle] =
    useState("");

  const [skills, setSkills] =
    useState("");

  const [experience, setExperience] =
    useState("");

  const generateResume = () => {
    const pdf = new jsPDF();

    pdf.setFontSize(26);

    pdf.text(name, 20, 30);

    pdf.setFontSize(14);

    pdf.text(
      `Email: ${email}`,
      20,
      50
    );

    pdf.text(
      `Job Title: ${jobTitle}`,
      20,
      70
    );

    pdf.text(
      "Skills:",
      20,
      100
    );

    pdf.text(
      skills,
      20,
      115
    );

    pdf.text(
      "Experience:",
      20,
      150
    );

    pdf.text(
      experience,
      20,
      165
    );

    pdf.save("resume.pdf");
  };

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Resume Builder
        </h2>

        <p className="text-black/60 leading-7">
          Create professional resume
          PDFs instantly for job
          applications and careers.
        </p>
      </div>

      <input
        value={name}
        onChange={(event) =>
          setName(
            event.target.value
          )
        }
        placeholder="Full Name"
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <input
        value={email}
        onChange={(event) =>
          setEmail(
            event.target.value
          )
        }
        placeholder="Email Address"
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <input
        value={jobTitle}
        onChange={(event) =>
          setJobTitle(
            event.target.value
          )
        }
        placeholder="Job Title"
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <textarea
        value={skills}
        onChange={(event) =>
          setSkills(
            event.target.value
          )
        }
        placeholder="Skills"
        rows={4}
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <textarea
        value={experience}
        onChange={(event) =>
          setExperience(
            event.target.value
          )
        }
        placeholder="Work Experience"
        rows={6}
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <button
        onClick={generateResume}
        disabled={
          !name ||
          !email ||
          !jobTitle
        }
        className="bg-black text-white rounded-2xl px-6 py-4 font-semibold disabled:opacity-50"
      >
        Generate Resume PDF
      </button>
    </div>
  );
}