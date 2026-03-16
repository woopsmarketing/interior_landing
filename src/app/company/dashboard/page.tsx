"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// ────────────── Types ──────────────
interface CompanyProfile {
  id: string;
  email: string;
  company_name: string;
  representative_name: string | null;
  business_number: string | null;
  founded_year: number | null;
  employee_count: string | null;
  phone: string | null;
  website_url: string | null;
  instagram_url: string | null;
  blog_url: string | null;
  service_regions: string[];
  specialties: string[];
  preferred_styles: string[];
  min_budget: number | null;
  max_budget: number | null;
  min_area: number | null;
  max_area: number | null;
  total_projects: number;
  years_in_business: number | null;
  certifications: string[];
  warranty_period: string | null;
  warranty_description: string | null;
  introduction: string | null;
  strengths: string[];
  logo_url: string | null;
  main_image_url: string | null;
  intro_video_url: string | null;
  status: string;
}

interface Portfolio {
  id: string;
  title: string;
  description: string | null;
  space_type: string | null;
  style: string | null;
  area: string | null;
  budget: string | null;
  region: string | null;
  duration: string | null;
  image_urls: string[];
  is_public: boolean;
  created_at: string;
}

interface CompanySubmission {
  id: string;
  created_at: string;
  space_type: string;
  region: string;
  area: string;
  budget: string;
  construction_scope: string;
  desired_timing: string;
  construction_purpose: string;
  additional_request: string;
  hasResponded: boolean;
}

interface CompanyResponse {
  id: string;
  message: string | null;
  estimated_price: string | null;
  created_at: string;
  submissions: {
    id: string;
    space_type: string;
    region: string;
    area: string;
    budget: string;
    construction_scope: string;
    desired_timing: string;
    created_at: string;
  } | null;
}

// ────────────── Constants ──────────────
const REGIONS = [
  "서울", "경기", "인천", "부산", "대구", "광주",
  "대전", "울산", "세종", "강원", "충북", "충남",
  "전북", "전남", "경북", "경남", "제주",
];
const SPECIALTIES = [
  "아파트", "빌라/주택", "오피스텔", "상업공간", "사무실",
  "원룸/투룸", "전원주택", "카페/식당",
];
const STYLES = [
  "모던", "미니멀", "북유럽", "내추럴", "클래식",
  "인더스트리얼", "빈티지", "한국전통", "럭셔리",
];

const TABS = ["내 프로필", "포트폴리오", "견적 요청", "내 응답"] as const;
type TabType = typeof TABS[number];

// ────────────── Helper ──────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

// ────────────── Tag Input Component ──────────────
function TagInput({
  tags,
  onChange,
  placeholder,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder: string;
}) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput("");
  };

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-600"
          >
            {tag}
            <button
              type="button"
              onClick={() => onChange(tags.filter((t) => t !== tag))}
              className="text-orange-400 hover:text-orange-600"
            >
              x
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
          placeholder={placeholder}
          className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
        <button
          type="button"
          onClick={addTag}
          className="shrink-0 rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-200"
        >
          추가
        </button>
      </div>
    </div>
  );
}

// ────────────── Chip Selector ──────────────
function ChipSelector({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}) {
  const toggle = (opt: string) => {
    if (selected.includes(opt)) {
      onChange(selected.filter((s) => s !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => toggle(opt)}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            selected.includes(opt)
              ? "bg-orange-500 text-white"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

// ────────────── Profile View (읽기 전용) ──────────────
function ProfileView({ profile }: { profile: CompanyProfile }) {
  const labelCls = "text-xs font-medium text-gray-400";
  const valueCls = "text-sm text-gray-800 mt-0.5";
  const emptyText = <span className="text-xs text-gray-300 italic">미입력</span>;

  const val = (v: string | number | null | undefined) =>
    v !== null && v !== undefined && v !== "" ? <p className={valueCls}>{v}</p> : emptyText;

  const chips = (arr: string[] | null | undefined, color: string) =>
    arr && arr.length > 0 ? (
      <div className="flex flex-wrap gap-1.5 mt-1">
        {arr.map((s) => (
          <span key={s} className={`rounded-full px-2.5 py-1 text-xs font-medium ${color}`}>{s}</span>
        ))}
      </div>
    ) : emptyText;

  return (
    <div className="space-y-6">
      {/* 상단 카드 */}
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
        <div className="flex items-start gap-4">
          {profile.logo_url ? (
            <div className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-gray-100">
              <Image src={profile.logo_url} alt="로고" fill className="object-cover" />
            </div>
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-xl font-bold text-orange-500">
              {profile.company_name.charAt(0)}
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900">{profile.company_name}</h2>
            {profile.representative_name && (
              <p className="text-sm text-gray-500">대표 {profile.representative_name}</p>
            )}
            <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400">
              {profile.founded_year && <span>설립 {profile.founded_year}년</span>}
              {profile.employee_count && <span>직원 {profile.employee_count}</span>}
              {profile.years_in_business && <span>업력 {profile.years_in_business}년</span>}
              {profile.total_projects > 0 && <span>시공 {profile.total_projects}건</span>}
            </div>
          </div>
        </div>
      </div>

      {/* 대표 이미지 */}
      {profile.main_image_url && (
        <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          <div className="relative w-full aspect-video">
            <Image src={profile.main_image_url} alt="대표 이미지" fill className="object-cover" />
          </div>
        </div>
      )}

      {/* 소개글 */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-bold text-gray-700 mb-3">업체 소개</h3>
        {profile.introduction ? (
          <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{profile.introduction}</p>
        ) : emptyText}
      </div>

      {/* 기본 정보 */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-bold text-gray-700 mb-4">기본 정보</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div><p className={labelCls}>사업자번호</p>{val(profile.business_number)}</div>
          <div><p className={labelCls}>연락처</p>{val(profile.phone)}</div>
          <div><p className={labelCls}>이메일</p>{val(profile.email)}</div>
          <div><p className={labelCls}>웹사이트</p>{profile.website_url ? <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="text-sm text-orange-500 hover:underline mt-0.5 block truncate">{profile.website_url}</a> : emptyText}</div>
          <div><p className={labelCls}>인스타그램</p>{profile.instagram_url ? <a href={profile.instagram_url} target="_blank" rel="noopener noreferrer" className="text-sm text-orange-500 hover:underline mt-0.5 block truncate">{profile.instagram_url}</a> : emptyText}</div>
          <div><p className={labelCls}>블로그</p>{profile.blog_url ? <a href={profile.blog_url} target="_blank" rel="noopener noreferrer" className="text-sm text-orange-500 hover:underline mt-0.5 block truncate">{profile.blog_url}</a> : emptyText}</div>
        </div>
      </div>

      {/* 서비스 정보 */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-bold text-gray-700 mb-4">서비스 정보</h3>
        <div className="space-y-4">
          <div><p className={labelCls}>서비스 지역</p>{chips(profile.service_regions, "bg-blue-50 text-blue-600")}</div>
          <div><p className={labelCls}>전문 분야</p>{chips(profile.specialties, "bg-purple-50 text-purple-600")}</div>
          <div><p className={labelCls}>선호 스타일</p>{chips(profile.preferred_styles, "bg-orange-50 text-orange-600")}</div>
          <div className="grid grid-cols-2 gap-4">
            <div><p className={labelCls}>예산 범위</p>{(profile.min_budget || profile.max_budget) ? <p className={valueCls}>{profile.min_budget ? `${profile.min_budget.toLocaleString()}만원` : ""}{profile.min_budget && profile.max_budget ? " ~ " : ""}{profile.max_budget ? `${profile.max_budget.toLocaleString()}만원` : ""}</p> : emptyText}</div>
            <div><p className={labelCls}>면적 범위</p>{(profile.min_area || profile.max_area) ? <p className={valueCls}>{profile.min_area ? `${profile.min_area}평` : ""}{profile.min_area && profile.max_area ? " ~ " : ""}{profile.max_area ? `${profile.max_area}평` : ""}</p> : emptyText}</div>
          </div>
        </div>
      </div>

      {/* 경력/신뢰 */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-bold text-gray-700 mb-4">경력 / 신뢰</h3>
        <div className="space-y-3">
          <div><p className={labelCls}>자격증 / 인증</p>{chips(profile.certifications, "bg-green-50 text-green-600")}</div>
          <div><p className={labelCls}>AS 보증기간</p>{val(profile.warranty_period)}</div>
          {profile.warranty_description && <div><p className={labelCls}>AS 보증 설명</p><p className={valueCls}>{profile.warranty_description}</p></div>}
        </div>
      </div>

      {/* 강점 */}
      {profile.strengths && profile.strengths.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-bold text-gray-700 mb-3">강점</h3>
          <div className="flex flex-wrap gap-2">
            {profile.strengths.map((s) => (
              <span key={s} className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-600">{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* 소개 영상 */}
      {profile.intro_video_url && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-bold text-gray-700 mb-3">소개 영상</h3>
          <a href={profile.intro_video_url} target="_blank" rel="noopener noreferrer" className="text-sm text-orange-500 hover:underline">{profile.intro_video_url}</a>
        </div>
      )}
    </div>
  );
}

// ────────────── Profile Edit Form ──────────────
function ProfileEditForm({ profile, onSave, onCancel }: { profile: CompanyProfile; onSave: () => void; onCancel: () => void }) {
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

// ────────────── Profile Tab (보기 + 수정 전환) ──────────────
function ProfileTab({ profile, onSave }: { profile: CompanyProfile; onSave: () => void }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <ProfileEditForm
        profile={profile}
        onSave={() => { setEditing(false); onSave(); }}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setEditing(true)}
          className="rounded-lg bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
        >
          프로필 수정
        </button>
      </div>
      <ProfileView profile={profile} />
    </div>
  );
}

// ────────────── Portfolio Tab ──────────────
function PortfolioTab() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [spaceType, setSpaceType] = useState("");
  const [style, setStyle] = useState("");
  const [area, setArea] = useState("");
  const [budget, setBudget] = useState("");
  const [region, setRegion] = useState("");
  const [duration, setDuration] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchPortfolios = useCallback(async () => {
    try {
      const res = await fetch("/api/companies/portfolios");
      const data = await res.json();
      setPortfolios(data.portfolios || []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolios();
  }, [fetchPortfolios]);

  const resetForm = () => {
    setTitle(""); setDescription(""); setSpaceType(""); setStyle("");
    setArea(""); setBudget(""); setRegion(""); setDuration("");
    setImageUrls([]); setEditId(null); setShowForm(false);
  };

  const openEdit = (p: Portfolio) => {
    setEditId(p.id); setTitle(p.title); setDescription(p.description || "");
    setSpaceType(p.space_type || ""); setStyle(p.style || "");
    setArea(p.area || ""); setBudget(p.budget || "");
    setRegion(p.region || ""); setDuration(p.duration || "");
    setImageUrls(p.image_urls || []); setShowForm(true);
  };

  const handleUploadImages = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.onchange = async () => {
      const files = input.files;
      if (!files) return;
      setUploading(true);
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const fd = new FormData();
        fd.append("file", files[i]);
        try {
          const res = await fetch("/api/companies/upload", { method: "POST", body: fd });
          const data = await res.json();
          if (data.url) urls.push(data.url);
        } catch {
          /* skip */
        }
      }
      setImageUrls((prev) => [...prev, ...urls]);
      setUploading(false);
    };
    input.click();
  };

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      const body = {
        title, description, space_type: spaceType, style,
        area, budget, region, duration, image_urls: imageUrls,
      };

      if (editId) {
        await fetch(`/api/companies/portfolios/${editId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        await fetch("/api/companies/portfolios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      resetForm();
      fetchPortfolios();
    } catch {
      /* ignore */
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await fetch(`/api/companies/portfolios/${id}`, { method: "DELETE" });
    fetchPortfolios();
  };

  const inputCls =
    "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-300";

  if (loading) {
    return <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-gray-200 border-t-orange-500" style={{ borderWidth: "3px" }} /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-700">포트폴리오 ({portfolios.length}건)</h3>
        {!showForm && (
          <button onClick={() => { resetForm(); setShowForm(true); }} className="rounded-lg bg-orange-500 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-600 transition-colors">
            + 포트폴리오 추가
          </button>
        )}
      </div>

      {showForm && (
        <div className="rounded-xl border-2 border-orange-200 bg-white p-6 space-y-4">
          <h4 className="text-sm font-bold text-gray-700">{editId ? "포트폴리오 수정" : "새 포트폴리오"}</h4>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">제목 *</label>
            <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="시공 제목" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">설명</label>
            <textarea className={inputCls + " h-20 resize-none"} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">공간유형</label>
              <input className={inputCls} value={spaceType} onChange={(e) => setSpaceType(e.target.value)} placeholder="아파트" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">스타일</label>
              <input className={inputCls} value={style} onChange={(e) => setStyle(e.target.value)} placeholder="모던" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">면적</label>
              <input className={inputCls} value={area} onChange={(e) => setArea(e.target.value)} placeholder="32평" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">예산</label>
              <input className={inputCls} value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="3000만원" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">지역</label>
              <input className={inputCls} value={region} onChange={(e) => setRegion(e.target.value)} placeholder="서울 강남" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">공사기간</label>
              <input className={inputCls} value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="4주" />
            </div>
          </div>

          {/* 이미지 */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">시공 이미지</label>
            <div className="flex flex-wrap gap-3 mb-2">
              {imageUrls.map((url, i) => (
                <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 group">
                  <Image src={url} alt="" fill className="object-cover" />
                  <button
                    onClick={() => setImageUrls((prev) => prev.filter((_, j) => j !== i))}
                    className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={handleUploadImages} disabled={uploading} className="text-xs text-orange-500 hover:underline">
              {uploading ? "업로드 중..." : "+ 이미지 추가"}
            </button>
          </div>

          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving || !title.trim()} className="rounded-lg bg-orange-500 px-6 py-2 text-xs font-semibold text-white hover:bg-orange-600 disabled:opacity-40 transition-colors">
              {saving ? "저장 중..." : editId ? "수정 완료" : "추가"}
            </button>
            <button onClick={resetForm} className="rounded-lg border border-gray-200 px-6 py-2 text-xs font-medium text-gray-500 hover:bg-gray-50 transition-colors">
              취소
            </button>
          </div>
        </div>
      )}

      {/* 목록 */}
      {portfolios.length === 0 && !showForm ? (
        <div className="text-center py-12 text-sm text-gray-400">아직 포트폴리오가 없습니다.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {portfolios.map((p) => (
            <div key={p.id} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
              {p.image_urls && p.image_urls.length > 0 && (
                <div className="relative aspect-video bg-gray-100">
                  <Image src={p.image_urls[0]} alt={p.title} fill className="object-cover" />
                  {p.image_urls.length > 1 && (
                    <span className="absolute bottom-2 right-2 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white">
                      +{p.image_urls.length - 1}
                    </span>
                  )}
                </div>
              )}
              <div className="p-4">
                <h4 className="text-sm font-bold text-gray-800">{p.title}</h4>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {p.space_type && <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">{p.space_type}</span>}
                  {p.style && <span className="rounded-full bg-purple-50 px-2 py-0.5 text-xs text-purple-600">{p.style}</span>}
                  {p.area && <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">{p.area}</span>}
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => openEdit(p)} className="text-xs text-orange-500 hover:underline">수정</button>
                  <button onClick={() => handleDelete(p.id)} className="text-xs text-red-400 hover:underline">삭제</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ────────────── Submissions Tab ──────────────
function SubmissionsTab() {
  const [submissions, setSubmissions] = useState<CompanySubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [respondingId, setRespondingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [estimatedPrice, setEstimatedPrice] = useState("");
  const [sending, setSending] = useState(false);

  const fetchSubmissions = useCallback(async () => {
    try {
      const res = await fetch("/api/companies/submissions");
      const data = await res.json();
      setSubmissions(data.submissions || []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleRespond = async (submissionId: string) => {
    setSending(true);
    try {
      const res = await fetch("/api/companies/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submission_id: submissionId,
          message,
          estimated_price: estimatedPrice,
        }),
      });
      if (res.ok) {
        setRespondingId(null);
        setMessage("");
        setEstimatedPrice("");
        fetchSubmissions();
      }
    } catch {
      /* ignore */
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-gray-200 border-t-orange-500" style={{ borderWidth: "3px" }} /></div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-gray-700">견적 요청 목록 ({submissions.length}건)</h3>
      {submissions.length === 0 ? (
        <div className="text-center py-12 text-sm text-gray-400">아직 견적 요청이 없습니다.</div>
      ) : (
        submissions.map((s) => (
          <div key={s.id} className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gray-400">{formatDate(s.created_at)}</span>
                  {s.hasResponded && (
                    <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-600">응답 완료</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {s.space_type && <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-600">{s.space_type}</span>}
                  {s.region && <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-600">{s.region}</span>}
                  {s.area && <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-600">{s.area}평</span>}
                  {s.budget && <span className="rounded-full bg-orange-50 px-2.5 py-1 text-orange-600">{s.budget}</span>}
                  {s.construction_scope && <span className="rounded-full bg-purple-50 px-2.5 py-1 text-purple-600">{s.construction_scope}</span>}
                  {s.desired_timing && <span className="rounded-full bg-green-50 px-2.5 py-1 text-green-600">{s.desired_timing}</span>}
                </div>
                {s.additional_request && (
                  <p className="mt-2 text-xs text-gray-500 line-clamp-2">{s.additional_request}</p>
                )}
              </div>
              {!s.hasResponded && (
                <button
                  onClick={() => { setRespondingId(respondingId === s.id ? null : s.id); setMessage(""); setEstimatedPrice(""); }}
                  className="shrink-0 rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-600 transition-colors"
                >
                  응답하기
                </button>
              )}
            </div>

            {respondingId === s.id && (
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">예상 견적금액</label>
                  <input
                    value={estimatedPrice}
                    onChange={(e) => setEstimatedPrice(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-300"
                    placeholder="예: 3,000만원"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">메시지</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-300 h-24 resize-none"
                    placeholder="고객에게 전달할 메시지를 작성하세요."
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRespond(s.id)}
                    disabled={sending}
                    className="rounded-lg bg-orange-500 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-600 disabled:opacity-40 transition-colors"
                  >
                    {sending ? "전송 중..." : "응답 전송"}
                  </button>
                  <button
                    onClick={() => setRespondingId(null)}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    취소
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

// ────────────── Responses Tab ──────────────
function ResponsesTab() {
  const [responses, setResponses] = useState<CompanyResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/companies/responses");
        const data = await res.json();
        setResponses(data.responses || []);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-gray-200 border-t-orange-500" style={{ borderWidth: "3px" }} /></div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-gray-700">내 응답 ({responses.length}건)</h3>
      {responses.length === 0 ? (
        <div className="text-center py-12 text-sm text-gray-400">아직 응답한 견적이 없습니다.</div>
      ) : (
        responses.map((r) => (
          <div key={r.id} className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-400">{formatDate(r.created_at)}</span>
              {r.estimated_price && (
                <span className="rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-600">{r.estimated_price}</span>
              )}
            </div>
            {r.submissions && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {r.submissions.space_type && <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">{r.submissions.space_type}</span>}
                {r.submissions.region && <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">{r.submissions.region}</span>}
                {r.submissions.budget && <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">{r.submissions.budget}</span>}
              </div>
            )}
            {r.message && (
              <p className="text-sm text-gray-600">{r.message}</p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

// ────────────── Main Dashboard ──────────────
export default function CompanyDashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("내 프로필");

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/companies/me");
      if (res.status === 401) {
        router.push("/company/login");
        return;
      }
      const data = await res.json();
      if (data.error) {
        router.push("/company/login");
        return;
      }
      setProfile(data);
    } catch {
      router.push("/company/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleLogout = async () => {
    await fetch("/api/companies/login", { method: "DELETE" });
    router.push("/company/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-gray-200 border-t-orange-500" style={{ borderWidth: "3px" }} />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white text-sm font-bold">
              B
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900">{profile.company_name}</h1>
              <p className="text-xs text-gray-400">업체 대시보드</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-50 transition-colors"
          >
            로그아웃
          </button>
        </div>
      </header>

      {/* 탭 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <nav className="flex gap-6 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* 콘텐츠 */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {activeTab === "내 프로필" && (
          <ProfileTab profile={profile} onSave={fetchProfile} />
        )}
        {activeTab === "포트폴리오" && <PortfolioTab />}
        {activeTab === "견적 요청" && <SubmissionsTab />}
        {activeTab === "내 응답" && <ResponsesTab />}
      </main>
    </div>
  );
}
