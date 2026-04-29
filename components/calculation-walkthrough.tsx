'use client';

import React, { useState } from 'react';
import { AssessmentResult, FeatureScore } from '@/lib/saw-engine';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Sweet spot parameters — mirrors saw-engine.ts constants
const SS: Record<string, { L: number; U: number; min: number; max: number }> = {
  BMI_normalized:         { L: 18.5, U: 24.9, min: 10,  max: 80  },
  SleepTime_normalized:   { L: 7,    U: 8,    min: 1,   max: 24  },
  BMIScale_normalized:    { L: 3,    U: 4,    min: 1,   max: 10  },
  SystolicBP_normalized:  { L: 90,   U: 120,  min: 70,  max: 200 },
  DiastolicBP_normalized: { L: 60,   U: 80,   min: 40,  max: 130 },
};

function fmt(n: number, d = 4) {
  return n.toFixed(d);
}

function sweetSpotFormula(feat: string, x: number, r: number): string {
  const p = SS[feat];
  if (!p) return `r = ${fmt(r)}`;
  const { L, U, min, max } = p;
  if (x >= L && x <= U) {
    return `${L} ≤ ${x} ≤ ${U}  →  r = 1.0000`;
  }
  if (x < L) {
    return `x < L  →  r = 1 − (${L}−${x}) / (${L}−${min}) = 1 − ${fmt(L - x, 2)} / ${fmt(L - min, 2)} = ${fmt(r)}`;
  }
  return `x > U  →  r = 1 − (${x}−${U}) / (${max}−${U}) = 1 − ${fmt(x - U, 2)} / ${fmt(max - U, 2)} = ${fmt(r)}`;
}

function getFormula(f: FeatureScore): string {
  const { feature, numericRaw: x, normalizedValue: r, normType } = f;

  if (normType === 'Binary') {
    return `r = ${x}  (biner, langsung dipakai)`;
  }
  if (normType === 'SweetSpot') {
    return sweetSpotFormula(feature, x, r);
  }
  if (normType === 'Ordinal') {
    if (feature === 'GenHealth') {
      return `r = (5 − ${x}) / 4 = ${fmt(5 - x)} / 4 = ${fmt(r)}`;
    }
    // CholesterolLevel, GlucoseLevel
    return `r = (${x} − 1) / 2 = ${fmt(x - 1)} / 2 = ${fmt(r)}`;
  }
  // MinMax
  if (feature === 'AgeCategory') {
    return `r = (${x} − 1) / (13 − 1) = ${fmt(x - 1, 0)} / 12 = ${fmt(r)}`;
  }
  if (feature === 'PhysicalHealth' || feature === 'MentalHealth') {
    return `r = ${x} / 30 = ${fmt(r)}`;
  }
  return `r = ${fmt(r)}`;
}

// ─── Collapsible Step ────────────────────────────────────────────────────────

function Step({
  number,
  title,
  badge,
  children,
  defaultOpen = false,
}: {
  number: number;
  title: string;
  badge?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-clinical-primary text-white text-xs font-bold flex items-center justify-center">
            {number}
          </span>
          <span className="font-semibold text-gray-800">{title}</span>
          {badge && (
            <span className="text-xs font-mono bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
              {badge}
            </span>
          )}
        </div>
        {open ? (
          <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gray-500 flex-shrink-0" />
        )}
      </button>
      {open && <div className="px-5 py-4 bg-white">{children}</div>}
    </div>
  );
}

// ─── Normalization Table ──────────────────────────────────────────────────────

function NormTable({ features }: { features: FeatureScore[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left py-2 px-3 font-semibold text-gray-600">Fitur</th>
            <th className="text-left py-2 px-3 font-semibold text-gray-600">Metode</th>
            <th className="text-left py-2 px-3 font-semibold text-gray-600 min-w-[320px]">Formula & Substitusi</th>
            <th className="text-right py-2 px-3 font-semibold text-gray-600">r_ij</th>
          </tr>
        </thead>
        <tbody>
          {features.map((f) => (
            <tr key={f.feature} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-2 px-3 font-medium text-gray-800 whitespace-nowrap">{f.displayName}</td>
              <td className="py-2 px-3">
                <span
                  className={`px-1.5 py-0.5 rounded text-xs font-semibold ${
                    f.normType === 'Binary'    ? 'bg-gray-100 text-gray-600' :
                    f.normType === 'SweetSpot' ? 'bg-purple-100 text-purple-700' :
                    f.normType === 'Ordinal'   ? 'bg-amber-100 text-amber-700' :
                                                 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {f.normType}
                </span>
              </td>
              <td className="py-2 px-3 font-mono text-gray-700">{getFormula(f)}</td>
              <td className="text-right py-2 px-3 font-mono font-bold text-blue-600">
                {fmt(f.normalizedValue)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── SAW Score Table ──────────────────────────────────────────────────────────

function SawTable({
  features,
  vScore,
  lambda,
  label,
}: {
  features: FeatureScore[];
  vScore: number;
  lambda: number;
  label: string;
}) {
  // Sort by weight descending for display
  const sorted = [...features].sort((a, b) => b.weight - a.weight);
  let running = 0;

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-2 px-3 font-semibold text-gray-600">Fitur (j)</th>
              <th className="text-right py-2 px-3 font-semibold text-gray-600">w_j</th>
              <th className="text-right py-2 px-3 font-semibold text-gray-600">r_ij</th>
              <th className="text-right py-2 px-3 font-semibold text-gray-600">w_j × r_ij</th>
              <th className="text-right py-2 px-3 font-semibold text-gray-600">Kumulatif</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((f) => {
              running += f.contribution;
              return (
                <tr key={f.feature} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-3 font-medium text-gray-800">{f.displayName}</td>
                  <td className="text-right py-2 px-3 font-mono text-purple-600">
                    {fmt(f.weight)}
                  </td>
                  <td className="text-right py-2 px-3 font-mono text-blue-600">
                    {fmt(f.normalizedValue)}
                  </td>
                  <td className="text-right py-2 px-3 font-mono text-emerald-600 font-semibold">
                    {fmt(f.contribution)}
                  </td>
                  <td className="text-right py-2 px-3 font-mono text-gray-500">
                    {fmt(running)}
                  </td>
                </tr>
              );
            })}
            <tr className="bg-blue-50 font-bold border-t-2 border-blue-200">
              <td className="py-2 px-3 text-blue-800" colSpan={3}>
                {label} = Σ(w_j × r_ij)
              </td>
              <td className="text-right py-2 px-3 font-mono text-blue-700" colSpan={2}>
                {fmt(vScore)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-blue-50 rounded-lg text-xs font-mono text-blue-800">
        λ{label.slice(-1)} = {lambda} &nbsp;→&nbsp; kontribusi ke V_final = {lambda} × {fmt(vScore)} = {fmt(lambda * vScore)}
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function CalculationWalkthrough({ result }: { result: AssessmentResult }) {
  const { v1Score, v2Score, vFinal, riskCategory, riskPercentage } = result;

  const thresholdRows = [
    { label: 'Low',      range: '< 0.25',         active: vFinal < 0.25 },
    { label: 'Moderate', range: '0.25 – 0.45',     active: vFinal >= 0.25 && vFinal < 0.45 },
    { label: 'High',     range: '≥ 0.45',          active: vFinal >= 0.45 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <span className="text-clinical-primary">∑</span>
          Mekanisme Perhitungan SAW — Step by Step
        </CardTitle>
        <p className="text-sm text-gray-500">
          Buka setiap langkah untuk melihat detail kalkulasi internal model
        </p>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* Step 1 – Stage 1 Normalisasi */}
        <Step number={1} title="Normalisasi Fitur — Stage 1" badge="15 fitur Heart dataset">
          <p className="text-xs text-gray-600 mb-3">
            Setiap nilai raw dikonversi ke skala [0, 1] menggunakan metode yang sesuai dengan
            karakteristik klinisnya. Sweet Spot memberi nilai 1.0 di rentang optimal dan menurun
            linear di luar batas.
          </p>
          <NormTable features={result.stage1Features} />
        </Step>

        {/* Step 2 – Stage 1 SAW */}
        <Step number={2} title="SAW Score Stage 1 (V1)" badge="V = Σ(w_j × r_ij)">
          <p className="text-xs text-gray-600 mb-3">
            Bobot Stage 1 diperoleh dari <strong>gradient descent</strong> yang dilatih pada
            319.795 pasien BRFSS 2020 (ROC-AUC = 0.8044, pos_weight = 10.68 untuk class imbalance).
            Setiap bobot merepresentasikan kontribusi relatif fitur terhadap risiko kardiovaskular.
          </p>
          <SawTable
            features={result.stage1Features}
            vScore={v1Score}
            lambda={0.70}
            label="V1"
          />
        </Step>

        {/* Step 3 – Stage 2 Normalisasi */}
        <Step number={3} title="Normalisasi Fitur — Stage 2" badge="9 fitur Cardio dataset">
          <p className="text-xs text-gray-600 mb-3">
            Fitur tekanan darah dan biokimia dinormalisasi dengan Sweet Spot karena nilai
            optimal secara klinis berada di tengah rentang (bukan ekstrem). Rentang optimal
            mengacu standar klinis internasional.
          </p>
          <NormTable features={result.stage2Features} />
        </Step>

        {/* Step 4 – Stage 2 SAW */}
        <Step number={4} title="SAW Score Stage 2 (V2)" badge="V = Σ(w_j × r_ij)">
          <p className="text-xs text-gray-600 mb-3">
            Bobot Stage 2 dihitung menggunakan <strong>Information Entropy</strong> dari
            70.000 pasien Cardio dataset. Fitur dengan variasi lebih besar mendapat bobot lebih
            tinggi karena memiliki daya diskriminasi lebih kuat.
          </p>
          <SawTable
            features={result.stage2Features}
            vScore={v2Score}
            lambda={0.30}
            label="V2"
          />
        </Step>

        {/* Step 5 – Integrasi */}
        <Step number={5} title="Integrasi Dua Stage" badge="V_final = λ₁V1 + λ₂V2" defaultOpen>
          <div className="space-y-4">
            <p className="text-xs text-gray-600">
              Lambda (λ) mencerminkan bobot kepercayaan masing-masing stage. Stage 1 mendapat
              λ = 0.70 karena dilatih pada dataset lebih besar dan tervalidasi secara klinis.
              Stage 2 mendapat λ = 0.30 sebagai pelengkap dengan fitur biokimia.
            </p>

            <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-green-400 space-y-1">
              <div className="text-gray-400">{'// Integrasi Multi-Stage SAW'}</div>
              <div>λ₁ = 0.70 &nbsp;&nbsp; (Stage 1 — Heart dataset)</div>
              <div>λ₂ = 0.30 &nbsp;&nbsp; (Stage 2 — Cardio dataset)</div>
              <div className="mt-2">
                V_final = λ₁ × V1 + λ₂ × V2
              </div>
              <div>
                V_final = 0.70 × {fmt(v1Score)} + 0.30 × {fmt(v2Score)}
              </div>
              <div>
                V_final = {fmt(0.70 * v1Score)} + {fmt(0.30 * v2Score)}
              </div>
              <div className="text-yellow-300 font-bold mt-1">
                V_final = {fmt(vFinal)} &nbsp;({riskPercentage}%)
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="text-blue-600 font-semibold">V1 × λ₁</p>
                <p className="text-2xl font-bold text-blue-700 mt-1">{fmt(0.70 * v1Score, 4)}</p>
                <p className="text-gray-500">0.70 × {fmt(v1Score)}</p>
              </div>
              <div className="flex items-center justify-center text-2xl font-bold text-gray-400">+</div>
              <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                <p className="text-purple-600 font-semibold">V2 × λ₂</p>
                <p className="text-2xl font-bold text-purple-700 mt-1">{fmt(0.30 * v2Score, 4)}</p>
                <p className="text-gray-500">0.30 × {fmt(v2Score)}</p>
              </div>
            </div>
          </div>
        </Step>

        {/* Step 6 – Kategorisasi */}
        <Step number={6} title="Kategorisasi Risiko" badge={`V_final = ${fmt(vFinal)} → ${riskCategory}`} defaultOpen>
          <div className="space-y-3">
            <p className="text-xs text-gray-600">
              Threshold ditetapkan berdasarkan percentile distribusi V_final pada populasi
              training (P33 = 0.2318, P66 = 0.3553) dan dikalibrasi ulang untuk skala raw
              weighted-sum tanpa normalisasi akhir.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-2 px-4 font-semibold text-gray-600">Kategori</th>
                    <th className="text-left py-2 px-4 font-semibold text-gray-600">Kondisi</th>
                    <th className="text-left py-2 px-4 font-semibold text-gray-600">V_final Pasien</th>
                    <th className="text-left py-2 px-4 font-semibold text-gray-600">Hasil</th>
                  </tr>
                </thead>
                <tbody>
                  {thresholdRows.map((row) => (
                    <tr
                      key={row.label}
                      className={`border-b ${row.active ? 'bg-clinical-primary/5 font-bold' : ''}`}
                    >
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            row.label === 'Low'      ? 'bg-green-100 text-green-700' :
                            row.label === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                                                       'bg-red-100 text-red-700'
                          }`}
                        >
                          {row.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-gray-700">{row.range}</td>
                      <td className="py-3 px-4 font-mono text-gray-700">{fmt(vFinal)}</td>
                      <td className="py-3 px-4">
                        {row.active ? (
                          <span className="text-clinical-primary font-bold">✓ MATCH</span>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div
              className={`p-4 rounded-lg border-2 text-center font-bold text-lg ${
                riskCategory === 'Low'      ? 'bg-green-50 border-green-300 text-green-700' :
                riskCategory === 'Moderate' ? 'bg-yellow-50 border-yellow-300 text-yellow-700' :
                                              'bg-red-50 border-red-300 text-red-700'
              }`}
            >
              V_final = {fmt(vFinal)} &nbsp;→&nbsp; Kategori: {riskCategory} Risk ({riskPercentage}%)
            </div>
          </div>
        </Step>

      </CardContent>
    </Card>
  );
}
