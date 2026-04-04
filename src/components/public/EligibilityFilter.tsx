"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface EligibilityFilterProps {
  currentQualification?: string;
  currentAge?: string;
}

const qualifications = [
  { value: "tenth", label: "10th Pass", labelHi: "10वीं पास" },
  { value: "twelfth", label: "12th Pass", labelHi: "12वीं पास" },
  { value: "graduate", label: "Graduate", labelHi: "ग्रेजुएट" },
  { value: "post_graduate", label: "Post Graduate", labelHi: "पोस्ट ग्रेजुएट" },
];

export default function EligibilityFilter({
  currentQualification,
  currentAge,
}: EligibilityFilterProps) {
  const router = useRouter();
  const [qualification, setQualification] = useState(currentQualification || "");
  const [age, setAge] = useState(currentAge || "");

  function handleFilter() {
    const params = new URLSearchParams();
    if (qualification) params.set("qualification", qualification);
    if (age) params.set("age", age);
    router.push(`/eligibility?${params.toString()}`);
  }

  return (
    <div className="mt-6 flex flex-wrap items-end gap-4 rounded-xl border border-border/60 bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="flex-1 min-w-[180px]">
        <label className="mb-1.5 block text-sm font-medium text-foreground">Qualification</label>
        <select
          value={qualification}
          onChange={(e) => setQualification(e.target.value)}
          className="w-full rounded-lg border border-border/80 bg-card px-4 py-2.5 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="">Select qualification</option>
          {qualifications.map((q) => (
            <option key={q.value} value={q.value}>
              {q.label} ({q.labelHi})
            </option>
          ))}
        </select>
      </div>

      <div className="w-[120px]">
        <label className="mb-1.5 block text-sm font-medium text-foreground">Age</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Your age"
          min="14"
          max="65"
          className="w-full rounded-lg border border-border/80 bg-card px-4 py-2.5 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <button
        onClick={handleFilter}
        className="rounded-lg bg-primary px-7 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark hover:shadow-md active:scale-[0.98]"
      >
        Find Jobs
      </button>
    </div>
  );
}
