"use client";

import Image from "next/image";
import { CompanyProfile } from "@/lib/types";

export default function ProfileView({ profile }: { profile: CompanyProfile }) {
  const labelCls = "text-xs font-medium text-gray-400";
  const valueCls = "text-sm text-gray-800 mt-0.5";
  const emptyText = <span className="text-xs text-gray-300 italic">미입력</span>;

  const val = (v: string | number | null | undefined) =>
    v !== null && v !== undefined && v !== "" ? <p className={valueCls}>{v}</p> : emptyText;

  // JSONB 필드가 문자열로 올 경우 파싱
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toArr = (v: any): string[] | null => {
    if (!v) return null;
    if (Array.isArray(v)) return v;
    try { return JSON.parse(v); } catch { return null; }
  };

  const chips = (arr: string[] | string | null | undefined, color: string) => {
    const parsed = toArr(arr);
    return parsed && parsed.length > 0 ? (
      <div className="flex flex-wrap gap-1.5 mt-1">
        {parsed.map((s) => (
          <span key={s} className={`rounded-full px-2.5 py-1 text-xs font-medium ${color}`}>{s}</span>
        ))}
      </div>
    ) : emptyText;
  };

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
      {toArr(profile.strengths)?.length ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-bold text-gray-700 mb-3">강점</h3>
          <div className="flex flex-wrap gap-2">
            {toArr(profile.strengths)!.map((s) => (
              <span key={s} className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-600">{s}</span>
            ))}
          </div>
        </div>
      ) : null}

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
