"use client";

import { Zap, ShieldCheck, LayoutGrid, UserCheck } from "lucide-react";

// ============================================================================
// 데이터
// ============================================================================

const BENEFITS = [
  { icon: Zap, label: "2~3일 내 견적 답변" },
  { icon: ShieldCheck, label: "100% 무료 서비스" },
  { icon: LayoutGrid, label: "100개 이상 업체 비교" },
  { icon: UserCheck, label: "계약 강요 없음" },
] as const;

// ============================================================================
// 메인 컴포넌트
// ============================================================================

export default function QuickBenefits() {
  return (
    <div className="w-full border-b border-gray-100 bg-white px-5 py-4 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-3xl">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {BENEFITS.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon className="h-5 w-5 flex-shrink-0 text-orange-500" strokeWidth={1.8} />
              <span className="text-sm font-medium text-gray-700">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
