"use client";

import { useState } from "react";
import { Calculator, ChevronDown, ChevronUp, IndianRupee, Info } from "lucide-react";

const formatCurrency = (amount: number) =>
  amount.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

// Standard 7th CPC Minimum Basic Pay per level
const PAY_LEVELS: Record<number, number> = {
  1: 18000,
  2: 19900,
  3: 21700,
  4: 25500,
  5: 29200,
  6: 35400,
  7: 44900,
  8: 47600,
  9: 53100,
  10: 56100,
  11: 67700,
  12: 78800,
  13: 123100,
  14: 144200,
};

// Current DA Rate (e.g. 50%)
const DA_RATE = 0.5;

// HRA Rates for X, Y, Z cities
const HRA_RATES = {
  X: 0.3, // 30% for X class (Tier 1)
  Y: 0.2, // 20% for Y class (Tier 2)
  Z: 0.1, // 10% for Z class (Tier 3)
};

export default function SalaryCalculator({ initialLevel = 1 }: { initialLevel?: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [level, setLevel] = useState<number>(initialLevel);
  const [cityClass, setCityClass] = useState<"X" | "Y" | "Z">("Z");

  const basicPay = PAY_LEVELS[level] || 18000;
  const da = basicPay * DA_RATE;
  
  // HRA calculation based on city class
  let hra = basicPay * HRA_RATES[cityClass];
  // Minimum HRA limits (e.g., if DA >= 50%)
  if (cityClass === "X" && hra < 5400) hra = 5400;
  if (cityClass === "Y" && hra < 3600) hra = 3600;
  if (cityClass === "Z" && hra < 1800) hra = 1800;

  // TA (Transport Allowance) simplified calculation
  let ta = 0;
  if (level >= 9) ta = 7200;
  else if (level >= 3) ta = 3600;
  else ta = 1350;
  
  // DA on TA
  const daOnTa = ta * DA_RATE;

  const grossSalary = basicPay + da + hra + ta + daOnTa;
  
  // Standard Deductions (NPS 10% of Basic+DA, CGHS, CGEGIS)
  const nps = (basicPay + da) * 0.1;
  const cghs = level >= 6 ? 650 : 250;
  const cgegis = 60;
  const totalDeductions = nps + cghs + cgegis;

  const inHandSalary = grossSalary - totalDeductions;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="group flex w-full items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-4 transition-all hover:bg-primary/10 hover:border-primary/40 dark:bg-primary/10 dark:hover:bg-primary/20"
      >
        <span className="flex items-center gap-2 font-semibold text-primary">
          <Calculator className="h-5 w-5" />
          Estimate Take-Home Salary (7th CPC)
        </span>
        <ChevronDown className="h-5 w-5 text-primary transition-transform group-hover:translate-y-0.5" />
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
      <button
        onClick={() => setIsOpen(false)}
        className="flex w-full items-center justify-between border-b border-border/50 bg-primary/5 p-4 transition-colors hover:bg-primary/10"
      >
        <span className="flex items-center gap-2 font-bold text-primary">
          <Calculator className="h-5 w-5" />
          Salary Calculator (7th Pay Commission)
        </span>
        <ChevronUp className="h-5 w-5 text-primary" />
      </button>

      <div className="p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Level Selection */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Pay Matrix Level</label>
            <select
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {Object.keys(PAY_LEVELS).map((lvl) => (
                <option key={lvl} value={lvl}>
                  Level {lvl} (Basic: ₹{PAY_LEVELS[Number(lvl)].toLocaleString("en-IN")})
                </option>
              ))}
            </select>
          </div>

          {/* City Class Selection */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">City Category (for HRA)</label>
            <select
              value={cityClass}
              onChange={(e) => setCityClass(e.target.value as "X" | "Y" | "Z")}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="X">X City (Tier 1 - Delhi, Mumbai, etc.) - {HRA_RATES.X * 100}%</option>
              <option value="Y">Y City (Tier 2 - State Capitals) - {HRA_RATES.Y * 100}%</option>
              <option value="Z">Z City (Tier 3 - Other Places) - {HRA_RATES.Z * 100}%</option>
            </select>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* Earnings */}
          <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
            <h4 className="mb-3 font-semibold text-foreground">Earnings</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Basic Pay</span>
                <span className="font-medium text-foreground">{formatCurrency(basicPay)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">DA (Dearness Allowance - {DA_RATE * 100}%)</span>
                <span className="font-medium text-foreground">{formatCurrency(da)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">HRA (House Rent Allowance)</span>
                <span className="font-medium text-foreground">{formatCurrency(hra)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">TA + DA on TA</span>
                <span className="font-medium text-foreground">{formatCurrency(ta + daOnTa)}</span>
              </div>
              <div className="mt-2 flex justify-between border-t border-border pt-2 font-semibold">
                <span className="text-foreground">Gross Salary</span>
                <span className="text-primary">{formatCurrency(grossSalary)}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
            <h4 className="mb-3 font-semibold text-foreground">Deductions (Est.)</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">NPS (10% of Basic+DA)</span>
                <span className="font-medium text-foreground">{formatCurrency(nps)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">CGHS (Health Scheme)</span>
                <span className="font-medium text-foreground">{formatCurrency(cghs)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">CGEGIS (Insurance)</span>
                <span className="font-medium text-foreground">{formatCurrency(cgegis)}</span>
              </div>
              <div className="mt-2 flex justify-between border-t border-border pt-2 font-semibold">
                <span className="text-foreground">Total Deductions</span>
                <span className="text-red-500">{formatCurrency(totalDeductions)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Final Result */}
        <div className="mt-6 flex items-center justify-between rounded-lg bg-primary p-5 text-primary-foreground shadow-lg">
          <div>
            <h3 className="text-sm font-medium text-primary-foreground/80">Estimated In-Hand Salary / Month</h3>
            <div className="mt-1 flex items-center gap-1 text-2xl font-bold md:text-3xl">
              <IndianRupee className="h-6 w-6 md:h-8 md:w-8" />
              {inHandSalary.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </div>
          </div>
          <div className="hidden rounded-full bg-white/20 p-3 sm:block">
            <Calculator className="h-8 w-8" />
          </div>
        </div>

        <p className="mt-4 flex items-start gap-1.5 text-xs text-muted-foreground">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            <strong>Disclaimer:</strong> This is an approximate calculation based on standard 7th CPC rules. Actual salary may vary depending on specific state rules, allowances, professional taxes, and other deductions.
          </span>
        </p>
      </div>
    </div>
  );
}
