"use client";

import { useState } from "react";
import Image from "next/image";
import { CompanyProfile } from "@/lib/types";
import { REGIONS, SPECIALTIES, STYLES } from "@/lib/utils";
import ChipSelector from "./ChipSelector";
import TagInput from "./TagInput";

export default function ProfileEditForm({
  profile,
  onSave,
  onCancel,
}: {
  profile: CompanyProfile;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(profile);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const set = (field: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleUpload = async (field: "logo_url" | "main_image_url") => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      setUploading(true);
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/companies/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (data.url) set(field, data.url);
      } catch {
        /* ignore */
      } finally {
        setUploading(false);
      }
    };
    input.click();
  };

  const handleSave = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/companies/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: form.company_name,
          representative_name: form.representative_name,
          business_number: form.business_number,
          founded_year: form.founded_year,
          employee_count: form.employee_count,
          phone: form.phone,
          website_url: form.website_url,
          instagram_url: form.instagram_url,
          blog_url: form.blog_url,
          service_regions: form.service_regions,
          specialties: form.specialties,
          preferred_styles: form.preferred_styles,
          min_budget: form.min_budget,
          max_budget: form.max_budget,
          min_area: form.min_area,
          max_area: form.max_area,
          total_projects: form.total_projects,
          years_in_business: form.years_in_business,
          certifications: form.certifications,
          warranty_period: form.warranty_period,
          warranty_description: form.warranty_description,
          introduction: form.introduction,
          strengths: form.strengths,
          logo_url: form.logo_url,
          main_image_url: form.main_image_url,
          intro_video_url: form.intro_video_url,
        }),
      });
      if (res.ok) {
        setMsg("저장되었습니다.");
        onSave();
      } else {
        setMsg("저장 실패");
      }
    } catch {
      setMsg("서버 연결 실패");
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-300";
  const labelCls = "block text-xs font-medium text-gray-500 mb-1.5";

  return (
    <div className="space-y-8">
      {/* 기본 정보 */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-bold text-gray-700 mb-4">기본 정보</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>업체명 *</label>
            <input className={inputCls} value={form.company_name} onChange={(e) => set("company_name", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>대표자명</label>
            <input className={inputCls} value={form.representative_name || ""} onChange={(e) => set("representative_name", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>사업자번호</label>
            <input className={inputCls} value={form.business_number || ""} onChange={(e) => set("business_number", e.target.value)} placeholder="000-00-00000" />
          </div>
          <div>
            <label className={labelCls}>설립연도</label>
            <input className={inputCls} type="number" value={form.founded_year || ""} onChange={(e) => set("founded_year", e.target.value ? parseInt(e.target.value) : null)} placeholder="2020" />
          </div>
          <div>
            <label className={labelCls}>직원수</label>
            <input className={inputCls} value={form.employee_count || ""} onChange={(e) => set("employee_count", e.target.value)} placeholder="5~10명" />
          </div>
          <div>
            <label className={labelCls}>연락처</label>
            <input className={inputCls} value={form.phone || ""} onChange={(e) => set("phone", e.target.value)} placeholder="010-0000-0000" />
          </div>
          <div>
            <label className={labelCls}>웹사이트</label>
            <input className={inputCls} value={form.website_url || ""} onChange={(e) => set("website_url", e.target.value)} placeholder="https://" />
          </div>
          <div>
            <label className={labelCls}>인스타그램</label>
            <input className={inputCls} value={form.instagram_url || ""} onChange={(e) => set("instagram_url", e.target.value)} placeholder="https://instagram.com/..." />
          </div>
          <div>
            <label className={labelCls}>블로그</label>
            <input className={inputCls} value={form.blog_url || ""} onChange={(e) => set("blog_url", e.target.value)} placeholder="https://blog.naver.com/..." />
          </div>
        </div>
      </section>

      {/* 이미지 */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-bold text-gray-700 mb-4">로고 / 대표 이미지</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-400 mb-2">로고</p>
            {form.logo_url && (
              <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100 mb-2">
                <Image src={form.logo_url} alt="로고" fill className="object-cover" />
              </div>
            )}
            <button type="button" onClick={() => handleUpload("logo_url")} disabled={uploading} className="text-xs text-orange-500 hover:underline">
              {uploading ? "업로드 중..." : "이미지 업로드"}
            </button>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-2">대표 이미지</p>
            {form.main_image_url && (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100 mb-2">
                <Image src={form.main_image_url} alt="대표 이미지" fill className="object-cover" />
              </div>
            )}
            <button type="button" onClick={() => handleUpload("main_image_url")} disabled={uploading} className="text-xs text-orange-500 hover:underline">
              {uploading ? "업로드 중..." : "이미지 업로드"}
            </button>
          </div>
        </div>
        <div className="mt-4">
          <label className={labelCls}>소개 영상 URL</label>
          <input className={inputCls} value={form.intro_video_url || ""} onChange={(e) => set("intro_video_url", e.target.value)} placeholder="https://youtube.com/..." />
        </div>
      </section>

      {/* 서비스 정보 */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-bold text-gray-700 mb-4">서비스 정보</h3>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>서비스 지역</label>
            <ChipSelector options={REGIONS} selected={form.service_regions || []} onChange={(v) => set("service_regions", v)} />
          </div>
          <div>
            <label className={labelCls}>전문 분야</label>
            <ChipSelector options={SPECIALTIES} selected={form.specialties || []} onChange={(v) => set("specialties", v)} />
          </div>
          <div>
            <label className={labelCls}>선호 스타일</label>
            <ChipSelector options={STYLES} selected={form.preferred_styles || []} onChange={(v) => set("preferred_styles", v)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>최소 예산 (만원)</label>
              <input className={inputCls} type="number" value={form.min_budget || ""} onChange={(e) => set("min_budget", e.target.value ? parseInt(e.target.value) : null)} />
            </div>
            <div>
              <label className={labelCls}>최대 예산 (만원)</label>
              <input className={inputCls} type="number" value={form.max_budget || ""} onChange={(e) => set("max_budget", e.target.value ? parseInt(e.target.value) : null)} />
            </div>
            <div>
              <label className={labelCls}>최소 면적 (평)</label>
              <input className={inputCls} type="number" value={form.min_area || ""} onChange={(e) => set("min_area", e.target.value ? parseInt(e.target.value) : null)} />
            </div>
            <div>
              <label className={labelCls}>최대 면적 (평)</label>
              <input className={inputCls} type="number" value={form.max_area || ""} onChange={(e) => set("max_area", e.target.value ? parseInt(e.target.value) : null)} />
            </div>
          </div>
        </div>
      </section>

      {/* 경력/신뢰 */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-bold text-gray-700 mb-4">경력 / 신뢰</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className={labelCls}>총 시공 건수</label>
            <input className={inputCls} type="number" value={form.total_projects} onChange={(e) => set("total_projects", parseInt(e.target.value) || 0)} />
          </div>
          <div>
            <label className={labelCls}>업력 (년)</label>
            <input className={inputCls} type="number" value={form.years_in_business || ""} onChange={(e) => set("years_in_business", e.target.value ? parseInt(e.target.value) : null)} />
          </div>
          <div>
            <label className={labelCls}>AS 보증기간</label>
            <input className={inputCls} value={form.warranty_period || ""} onChange={(e) => set("warranty_period", e.target.value)} placeholder="2년" />
          </div>
        </div>
        <div className="mb-4">
          <label className={labelCls}>AS 보증 설명</label>
          <textarea className={inputCls + " h-20 resize-none"} value={form.warranty_description || ""} onChange={(e) => set("warranty_description", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>자격증 / 인증</label>
          <TagInput tags={form.certifications || []} onChange={(v) => set("certifications", v)} placeholder="자격증명 입력 후 Enter" />
        </div>
      </section>

      {/* 소개 */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-bold text-gray-700 mb-4">소개</h3>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>업체 소개글</label>
            <textarea className={inputCls + " h-32 resize-none"} value={form.introduction || ""} onChange={(e) => set("introduction", e.target.value)} placeholder="업체에 대해 자유롭게 소개해주세요." />
          </div>
          <div>
            <label className={labelCls}>강점</label>
            <TagInput tags={form.strengths || []} onChange={(v) => set("strengths", v)} placeholder="강점 입력 후 Enter" />
          </div>
        </div>
      </section>

      {/* 저장/취소 */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-orange-500 px-8 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-40 transition-colors"
        >
          {saving ? "저장 중..." : "저장"}
        </button>
        <button
          onClick={onCancel}
          className="rounded-lg border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
        >
          취소
        </button>
        {msg && <p className={`text-sm ${msg === "저장되었습니다." ? "text-green-600" : "text-red-500"}`}>{msg}</p>}
      </div>
    </div>
  );
}
