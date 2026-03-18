"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { AdminSubmission } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import LoginForm from "@/components/admin/LoginForm";
import SubmissionDetail from "@/components/admin/SubmissionDetail";
import CompanyManagementTab from "@/components/admin/CompanyManagementTab";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [submissions, setSubmissions] = useState<AdminSubmission[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"submissions" | "companies">("submissions");

  // 인증 상태 확인
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/login");
        if (res.ok) {
          setAuthenticated(true);
        }
      } catch {
        /* not authenticated */
      } finally {
        setAuthChecking(false);
      }
    })();
  }, []);

  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/submissions");
      const data = await res.json();
      if (data.submissions) {
        setSubmissions(data.submissions);
      } else {
        setError("데이터 로딩 실패");
      }
    } catch {
      setError("서버 연결 실패");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authenticated) fetchSubmissions();
  }, [authenticated, fetchSubmissions]);

  const selected = submissions.find((s) => s.id === selectedId) ?? null;

  // 네비게이션 메뉴
  const [navOpen, setNavOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setNavOpen(false);
      }
    };
    if (navOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [navOpen]);

  const NAV_LINKS = [
    { label: "랜딩 페이지", href: "/", desc: "메인 랜딩" },
    { label: "견적 요청 폼", href: "/form", desc: "고객 폼" },
    { label: "업체 로그인", href: "/company/login", desc: "업체 포털" },
    { label: "업체 회원가입", href: "/company/register", desc: "업체 포털" },
    { label: "업체 대시보드", href: "/company/dashboard", desc: "업체 포털" },
  ];

  // 인증 확인 중
  if (authChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-gray-200 border-t-orange-500" style={{ borderWidth: "3px" }} />
      </div>
    );
  }

  // 미인증 → 로그인 폼
  if (!authenticated) {
    return <LoginForm onLogin={() => setAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white text-sm font-bold">
              A
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900">관리자 대시보드</h1>
              <p className="text-xs text-gray-400">AI 인테리어 견적 비교 서비스</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {activeTab === "submissions" && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                총 {submissions.length}건
              </span>
            )}
            <button
              onClick={fetchSubmissions}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              새로고침
            </button>

            {/* 페이지 이동 메뉴 */}
            <div ref={navRef} className="relative">
              <button
                onClick={() => setNavOpen(!navOpen)}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1.5"
              >
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                페이지 이동
              </button>
              {navOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-white border border-gray-200 shadow-lg py-2 z-50">
                  <p className="px-4 py-1.5 text-[10px] font-semibold text-gray-300 uppercase tracking-wider">서비스 페이지</p>
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      onClick={() => setNavOpen(false)}
                      className="flex items-center justify-between px-4 py-2.5 hover:bg-orange-50 transition-colors"
                    >
                      <span className="text-sm text-gray-700">{link.label}</span>
                      <span className="text-[10px] text-gray-300">{link.desc}</span>
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <p className="px-4 py-1.5 text-[10px] font-semibold text-gray-300 uppercase tracking-wider">고객 페이지 (ID 필요)</p>
                    {submissions.length > 0 && (
                      <Link
                        href={`/my/${submissions[0].id}`}
                        target="_blank"
                        onClick={() => setNavOpen(false)}
                        className="flex items-center justify-between px-4 py-2.5 hover:bg-orange-50 transition-colors"
                      >
                        <span className="text-sm text-gray-700">최근 견적 상태 페이지</span>
                        <span className="text-[10px] text-gray-300">/my/[id]</span>
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 탭 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <nav className="flex gap-6">
            <button
              onClick={() => { setActiveTab("submissions"); setSelectedId(null); }}
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "submissions"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              견적 요청
            </button>
            <button
              onClick={() => { setActiveTab("companies"); setSelectedId(null); }}
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "companies"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              업체 관리
            </button>
          </nav>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {activeTab === "companies" ? (
          <CompanyManagementTab />
        ) : loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-gray-200 border-t-orange-500" style={{ borderWidth: "3px" }} />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-sm text-red-500">{error}</p>
            <button onClick={fetchSubmissions} className="mt-4 text-sm text-orange-500 hover:underline">
              다시 시도
            </button>
          </div>
        ) : selected ? (
          <SubmissionDetail
            submission={selected}
            onBack={() => setSelectedId(null)}
            onStatusChange={(id, status) => {
              setSubmissions((prev) =>
                prev.map((s) => (s.id === id ? { ...s, status } : s))
              );
            }}
          />
        ) : submissions.length === 0 ? (
          <div className="text-center py-20">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <svg className="h-8 w-8 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-sm text-gray-400">아직 접수된 견적 요청이 없습니다</p>
          </div>
        ) : (
          <div className="space-y-3">
            {submissions.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedId(s.id)}
                className="w-full text-left rounded-xl bg-white border border-gray-200 p-5 hover:border-orange-200 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50 text-sm font-bold text-orange-500">
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">{s.name}</span>
                        <span className="text-xs text-gray-400">{s.phone}</span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-400">
                        <span>{formatDate(s.createdAt, true)}</span>
                        <span>·</span>
                        <span>{s.spaceType} {s.region}</span>
                        {s.budget && (
                          <>
                            <span>·</span>
                            <span>{s.budget}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {s.hasGeneratedImage && (
                      <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-600">AI</span>
                    )}
                    {s.hasSpacePhoto && (
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">사진</span>
                    )}
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      s.status === "quoted" ? "bg-green-100 text-green-600" :
                      s.status === "matching" ? "bg-blue-100 text-blue-600" :
                      "bg-gray-100 text-gray-500"
                    }`}>
                      {s.status === "quoted" ? "견적도착" : s.status === "matching" ? "매칭중" : "접수"}
                    </span>
                    <svg className="h-4 w-4 text-gray-300" viewBox="0 0 16 16" fill="none">
                      <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
