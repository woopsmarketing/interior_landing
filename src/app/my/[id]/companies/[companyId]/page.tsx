"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface CompanyDetail {
  id: string;
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
}

interface CompanyResponseData {
  message: string | null;
  estimated_price: string | null;
  created_at: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function PortfolioCard({ portfolio }: { portfolio: Portfolio }) {
  const [currentImage, setCurrentImage] = useState(0);
  const images = portfolio.image_urls || [];

  return (
    <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
      {images.length > 0 && (
        <div className="relative aspect-video bg-gray-100">
          <Image
            src={images[currentImage]}
            alt={portfolio.title}
            fill
            className="object-cover"
          />
          {images.length > 1 && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === currentImage ? "w-4 bg-white" : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
          {images.length > 1 && (
            <>
              <button
                onClick={() => setCurrentImage((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50"
              >
                <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button
                onClick={() => setCurrentImage((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50"
              >
                <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </>
          )}
        </div>
      )}
      <div className="p-4">
        <h4 className="text-sm font-bold text-gray-800">{portfolio.title}</h4>
        {portfolio.description && (
          <p className="mt-1 text-xs text-gray-500 line-clamp-2">{portfolio.description}</p>
        )}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {portfolio.space_type && <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">{portfolio.space_type}</span>}
          {portfolio.style && <span className="rounded-full bg-purple-50 px-2 py-0.5 text-xs text-purple-600">{portfolio.style}</span>}
          {portfolio.area && <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">{portfolio.area}</span>}
          {portfolio.budget && <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs text-orange-600">{portfolio.budget}</span>}
          {portfolio.region && <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs text-green-600">{portfolio.region}</span>}
          {portfolio.duration && <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">{portfolio.duration}</span>}
        </div>
      </div>
    </div>
  );
}

export default function CompanyDetailPage() {
  const params = useParams();
  const submissionId = params.id as string;
  const companyId = params.companyId as string;

  const [company, setCompany] = useState<CompanyDetail | null>(null);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [response, setResponse] = useState<CompanyResponseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/submissions/${submissionId}/companies/${companyId}`);
        if (res.status === 403) {
          setError("접근 권한이 없습니다.");
          return;
        }
        if (!res.ok) {
          setError("데이터를 불러올 수 없습니다.");
          return;
        }
        const data = await res.json();
        setCompany(data.company);
        setPortfolios(data.portfolios || []);
        setResponse(data.response);
      } catch {
        setError("서버 연결 실패");
      } finally {
        setLoading(false);
      }
    })();
  }, [submissionId, companyId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-orange-200 border-t-orange-500" style={{ borderWidth: "3px" }} />
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <svg className="h-8 w-8 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-gray-500">{error || "업체 정보를 불러올 수 없습니다."}</p>
          <Link href={`/my/${submissionId}`} className="mt-4 inline-block text-sm text-orange-500 hover:underline">
            돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5]">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <Link href={`/my/${submissionId}`} className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">
            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
          <div>
            <h1 className="text-sm font-bold text-gray-900">업체 소개</h1>
            <p className="text-xs text-gray-400">AI 인테리어 견적 비교</p>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-5">
        {/* 업체 기본 정보 카드 */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
          <div className="flex items-start gap-4">
            {company.logo_url ? (
              <div className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-gray-100">
                <Image src={company.logo_url} alt="로고" fill className="object-cover" />
              </div>
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-xl font-bold text-orange-500">
                {company.company_name.charAt(0)}
              </div>
            )}
            <div>
              <h2 className="text-lg font-bold text-gray-900">{company.company_name}</h2>
              {company.representative_name && (
                <p className="text-sm text-gray-500">대표 {company.representative_name}</p>
              )}
              <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-400">
                {company.founded_year && <span>설립 {company.founded_year}년</span>}
                {company.employee_count && <span>직원 {company.employee_count}</span>}
                {company.years_in_business && <span>업력 {company.years_in_business}년</span>}
                {company.total_projects > 0 && <span>시공 {company.total_projects}건</span>}
              </div>
            </div>
          </div>
        </div>

        {/* 견적 응답 */}
        {response && (
          <div className="rounded-2xl bg-orange-50 border border-orange-100 p-6">
            <h3 className="text-sm font-bold text-orange-700 mb-2">견적 응답</h3>
            {response.estimated_price && (
              <p className="text-lg font-bold text-orange-600 mb-2">{response.estimated_price}</p>
            )}
            {response.message && (
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{response.message}</p>
            )}
            <p className="text-xs text-gray-400 mt-3">{formatDate(response.created_at)}</p>
          </div>
        )}

        {/* 소개글 */}
        {company.introduction && (
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-bold text-gray-700 mb-3">업체 소개</h3>
            <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{company.introduction}</p>
          </div>
        )}

        {/* 대표 이미지 */}
        {company.main_image_url && (
          <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            <div className="relative w-full aspect-video">
              <Image src={company.main_image_url} alt="대표 이미지" fill className="object-cover" />
            </div>
          </div>
        )}

        {/* 서비스 정보 */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-bold text-gray-700">서비스 정보</h3>
          {company.service_regions?.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-1.5">서비스 지역</p>
              <div className="flex flex-wrap gap-1.5">
                {company.service_regions.map((r) => (
                  <span key={r} className="rounded-full bg-blue-50 px-2.5 py-1 text-xs text-blue-600">{r}</span>
                ))}
              </div>
            </div>
          )}
          {company.specialties?.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-1.5">전문 분야</p>
              <div className="flex flex-wrap gap-1.5">
                {company.specialties.map((s) => (
                  <span key={s} className="rounded-full bg-purple-50 px-2.5 py-1 text-xs text-purple-600">{s}</span>
                ))}
              </div>
            </div>
          )}
          {company.preferred_styles?.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-1.5">선호 스타일</p>
              <div className="flex flex-wrap gap-1.5">
                {company.preferred_styles.map((s) => (
                  <span key={s} className="rounded-full bg-orange-50 px-2.5 py-1 text-xs text-orange-600">{s}</span>
                ))}
              </div>
            </div>
          )}
          {(company.min_budget || company.max_budget) && (
            <div>
              <p className="text-xs text-gray-400 mb-1">예산 범위</p>
              <p className="text-sm text-gray-700">
                {company.min_budget ? `${company.min_budget.toLocaleString()}만원` : ""}{company.min_budget && company.max_budget ? " ~ " : ""}{company.max_budget ? `${company.max_budget.toLocaleString()}만원` : ""}
              </p>
            </div>
          )}
          {(company.min_area || company.max_area) && (
            <div>
              <p className="text-xs text-gray-400 mb-1">면적 범위</p>
              <p className="text-sm text-gray-700">
                {company.min_area ? `${company.min_area}평` : ""}{company.min_area && company.max_area ? " ~ " : ""}{company.max_area ? `${company.max_area}평` : ""}
              </p>
            </div>
          )}
        </div>

        {/* 경력/신뢰 */}
        {(company.certifications?.length > 0 || company.warranty_period) && (
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 space-y-3">
            <h3 className="text-sm font-bold text-gray-700">경력 / 신뢰</h3>
            {company.certifications?.length > 0 && (
              <div>
                <p className="text-xs text-gray-400 mb-1.5">자격증 / 인증</p>
                <div className="flex flex-wrap gap-1.5">
                  {company.certifications.map((c) => (
                    <span key={c} className="rounded-full bg-green-50 px-2.5 py-1 text-xs text-green-600">{c}</span>
                  ))}
                </div>
              </div>
            )}
            {company.warranty_period && (
              <div>
                <p className="text-xs text-gray-400 mb-1">AS 보증</p>
                <p className="text-sm text-gray-700">{company.warranty_period}</p>
                {company.warranty_description && (
                  <p className="text-xs text-gray-500 mt-1">{company.warranty_description}</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* 강점 */}
        {company.strengths?.length > 0 && (
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-bold text-gray-700 mb-3">강점</h3>
            <div className="flex flex-wrap gap-2">
              {company.strengths.map((s) => (
                <span key={s} className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-600">{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* SNS 링크 */}
        {(company.website_url || company.instagram_url || company.blog_url) && (
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-bold text-gray-700 mb-3">링크</h3>
            <div className="space-y-2">
              {company.website_url && (
                <a href={company.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-orange-500 hover:underline">
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" /></svg>
                  웹사이트
                </a>
              )}
              {company.instagram_url && (
                <a href={company.instagram_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-orange-500 hover:underline">
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M6.5 2A4.5 4.5 0 002 6.5v7A4.5 4.5 0 006.5 18h7a4.5 4.5 0 004.5-4.5v-7A4.5 4.5 0 0013.5 2h-7zM10 6a4 4 0 110 8 4 4 0 010-8zm0 1.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM14.5 5a.75.75 0 110 1.5.75.75 0 010-1.5z" /></svg>
                  인스타그램
                </a>
              )}
              {company.blog_url && (
                <a href={company.blog_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-orange-500 hover:underline">
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" /><path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" /></svg>
                  블로그
                </a>
              )}
            </div>
          </div>
        )}

        {/* 소개 영상 */}
        {company.intro_video_url && (
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-bold text-gray-700 mb-3">소개 영상</h3>
            <a href={company.intro_video_url} target="_blank" rel="noopener noreferrer" className="text-sm text-orange-500 hover:underline">
              영상 보기
            </a>
          </div>
        )}

        {/* 포트폴리오 */}
        {portfolios.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-4">포트폴리오 ({portfolios.length}건)</h3>
            <div className="space-y-4">
              {portfolios.map((p) => (
                <PortfolioCard key={p.id} portfolio={p} />
              ))}
            </div>
          </div>
        )}

        <div className="text-center py-4">
          <Link href={`/my/${submissionId}`} className="text-xs text-gray-400 hover:text-gray-600">
            내 견적 요청으로 돌아가기
          </Link>
        </div>
      </main>
    </div>
  );
}
