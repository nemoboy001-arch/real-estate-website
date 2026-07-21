"use client";

import { useState } from "react";
import { DollarSign, Percent, Calculator } from "lucide-react";

interface MortgageCalculatorProps {
  propertyPrice: number;
  hoa?: number;
}

export default function MortgageCalculator({ propertyPrice, hoa = 0 }: MortgageCalculatorProps) {
  const [homePrice, setHomePrice] = useState(propertyPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTermYears, setLoanTermYears] = useState(30);

  const insurance = 125;

  // Derivations computed on each render
  const downPaymentAmount = (homePrice * downPaymentPercent) / 100;
  const loanAmount = homePrice - downPaymentAmount;
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;

  let monthlyPayment = 0;
  if (numberOfPayments > 0) {
    if (monthlyRate === 0) {
      monthlyPayment = loanAmount / numberOfPayments;
    } else {
      monthlyPayment =
        (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    }
  }

  const taxes = (homePrice * 0.011) / 12;

  const totalMonthly = monthlyPayment + taxes + insurance + hoa;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
        <Calculator className="h-5 w-5 text-blue-600" />
        Mortgage Calculator
      </h3>
      <p className="text-xs text-slate-500 mt-1">Estimate your monthly mortgage payments</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Sliders / Inputs */}
        <div className="space-y-5">
          {/* Home Price */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
              <span>Home Price</span>
              <span>${homePrice.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={propertyPrice * 0.5}
              max={propertyPrice * 1.5}
              step={10000}
              value={homePrice}
              onChange={(e) => setHomePrice(Number(e.target.value))}
              className="w-full accent-blue-600 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Down Payment */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
              <span>Down Payment ({downPaymentPercent}%)</span>
              <span>${downPaymentAmount.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={5}
              max={50}
              step={1}
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
              className="w-full accent-blue-600 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Interest Rate */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
              <span>Interest Rate</span>
              <span>{interestRate}%</span>
            </div>
            <input
              type="range"
              min={2}
              max={10}
              step={0.1}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-blue-600 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Loan Term */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Loan Term</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLoanTermYears(30)}
                className={`rounded-xl border py-2.5 text-xs font-bold transition-all ${
                  loanTermYears === 30
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                30 Years
              </button>
              <button
                type="button"
                onClick={() => setLoanTermYears(15)}
                className={`rounded-xl border py-2.5 text-xs font-bold transition-all ${
                  loanTermYears === 15
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                15 Years
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="rounded-xl bg-slate-50 p-6 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Estimated Monthly</span>
            <span className="text-3xl font-extrabold text-slate-900 mt-1 block">
              ${Math.round(totalMonthly).toLocaleString()}
            </span>
          </div>

          <div className="mt-6 space-y-3.5 border-t border-slate-200 pt-6 text-xs text-slate-600">
            <div className="flex justify-between">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                Principal & Interest
              </span>
              <span className="font-bold text-slate-900">${Math.round(monthlyPayment).toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                Property Taxes
              </span>
              <span className="font-bold text-slate-900">${Math.round(taxes).toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Home Insurance
              </span>
              <span className="font-bold text-slate-900">${Math.round(insurance).toLocaleString()}</span>
            </div>

            {hoa > 0 && (
              <div className="flex justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                  HOA Dues
                </span>
                <span className="font-bold text-slate-900">${hoa.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
