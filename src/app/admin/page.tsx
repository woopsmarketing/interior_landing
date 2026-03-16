"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────
interface Submission {
  id: string;
  createdAt: string;
  spaceType: string;
  region: string;
  area: string;
  areaUnknown: boolean;
  currentCondition: string;
  buildingAge: string;
  constructionScope: string;
  desiredTiming: string;
  budget: string;
  constructionPurpose: string;
  scheduleFlexibility: string;
  occupancyDuringWork: string;
  priorities: string[];
  preferredStyles: string[];
  preferredAtmosphere: string;
  currentProblems: string[];
  additionalRequest: string;
  hasSpacePhoto: boolean;
  hasReferenceImage: boolean;
  name: string;
  phone: string;
  email: string;
  contactMethod: string[];
  availableTime: string[];
  agreePrivacy: boolean;
  agreeConsult: boolean;
  agreeMarketing: boolean;
  hasGeneratedImage: boolean;
}

interface Company {
  id: string;
  email: string;
  company_name: string;
  representative_name: string | null;
  phone: string | null;
  status: string;
  created_at: string;
}

// ──────────────────────────────────────────────
// Shared helpers
// ──────────────────────────────────────────────
const FIELD_LABELS: Record<string, string> = {
  spaceType: "공간 유형",
  region: "지역",
  area: "면적",
  currentCondition: "현재 상태",
  buildingAge: "건물 연식",
  constructionScope: "공사 범위",
  desiredTiming: "희망 시기",
  budget: "예산",
  constructionPurpose: "공사 목적",
  scheduleFlexibility: "일정 유연성",
  occupancyDuringWork: "공사 중 거주",
  priorities: "우선순위",
  preferredStyles: "선호 스타일",
  preferredAtmosphere: "선호 분위기",
  currentProblems: "현재 문제점",
  additionalRequest: "추가 요청사항",
  contactMethod: "선호 연락 방법",
  availableTime: "가능 시간대",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function InfoRow({ label, value }: { label: string; value: string | string[] | boolean }) {
  if (value === "" || value === false || (Array.isArray(value) && value.length === 0)) return null;
  const display = Array.isArray(value) ? value.join(", ") : typeof value === "boolean" ? (value ? "예" : "아니오") : value;
  return (
    <div className="flex py-2 border-b border-gray-50 last:border-0">
      <span className="w-28 shrink-0 text-xs font-medium text-gray-400">{label}</span>
      <span className="text-sm text-gray-800">{display}</span>
    </div>
  );
}

// ──────────────────────────────────────────────
// Submission Detail
// ──────────────────────────────────────────────
function SubmissionDetail({ submission, onBack }: { submission: Submission; onBack: () => void }) {
  const [pushMsg, setPushMsg] = useState("");
  const [pushSending, setPushSending] = useState(false);
  const [pushResult, setPushResult] = useState<"success" | "error" | null>(null);

  const handleSendPush = async () => {
    if (!pushMsg.trim()) return;
    setPushSending(true);
    setPushResult(null);
    try {
      const res = await fetch("/api/push/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: submission.id,
          title: "인테리어 견적 알림",
          body: pushMsg,
          url: `/my/${submission.id}`,
        }),
      });
      const data = await res.json();
      setPushResult(data.success ? "success" : "error");
    } catch {
      setPushResult("error");
    } finally {
      setPushSending(false);
    }
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        목록으로
      </button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{submission.name}</h2>
          <p className="text-sm text-gray-400 mt-0.5">{formatDate(submission.createdAt)} · {submission.id}</p>
        </div>
        <div className="flex gap-2">
          {submission.hasSpacePhoto && (
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">공간사진</span>
          )}
          {submission.hasReferenceImage && (
            <span className="rounded-full bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-600">참고이미지</span>
          )}
          {submission.hasGeneratedImage && (
            <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600">AI생성</span>
          )}
        </div>
      </div>

      {/* 이미지 섹션 */}
      {(submission.hasSpacePhoto || submission.hasReferenceImage || submission.hasGeneratedImage) && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {submission.hasSpacePhoto && (
            <div>
              <p className="text-xs font-medium text-gray-400 mb-2">현재 공간 사진</p>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                <Image src={`/api/submissions/${submission.id}?type=space`} alt="공간 사진" fill className="object-cover" />
              </div>
            </div>
          )}
          {submission.hasReferenceImage && (
            <div>
              <p className="text-xs font-medium text-gray-400 mb-2">참고 이미지</p>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                <Image src={`/api/submissions/${submission.id}?type=reference`} alt="참고 이미지" fill className="object-cover" />
              </div>
            </div>
          )}
          {submission.hasGeneratedImage && (
            <div>
              <p className="text-xs font-medium text-gray-400 mb-2">AI 생성 이미지</p>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                <Image src={`/api/submissions/${submission.id}?type=generated`} alt="AI 생성 이미지" fill className="object-cover" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* 정보 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-600">5</span>
            연락처 정보
          </h3>
          <InfoRow label="이름" value={submission.name} />
          <InfoRow label="연락처" value={submission.phone} />
          <InfoRow label="이메일" value={submission.email} />
          <InfoRow label={FIELD_LABELS.contactMethod} value={submission.contactMethod} />
          <InfoRow label={FIELD_LABELS.availableTime} value={submission.availableTime} />
        </div>
        <div className="rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-600">1</span>
            공간 기본 정보
          </h3>
          <InfoRow label={FIELD_LABELS.spaceType} value={submission.spaceType} />
          <InfoRow label={FIELD_LABELS.region} value={submission.region} />
          <InfoRow label={FIELD_LABELS.area} value={submission.areaUnknown ? "잘 모르겠음" : submission.area ? `${submission.area}평` : ""} />
          <InfoRow label={FIELD_LABELS.currentCondition} value={submission.currentCondition} />
          <InfoRow label={FIELD_LABELS.buildingAge} value={submission.buildingAge} />
        </div>
        <div className="rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-600">2</span>
            공사 희망 정보
          </h3>
          <InfoRow label={FIELD_LABELS.constructionScope} value={submission.constructionScope} />
          <InfoRow label={FIELD_LABELS.desiredTiming} value={submission.desiredTiming} />
          <InfoRow label={FIELD_LABELS.budget} value={submission.budget} />
          <InfoRow label={FIELD_LABELS.constructionPurpose} value={submission.constructionPurpose} />
          <InfoRow label={FIELD_LABELS.scheduleFlexibility} value={submission.scheduleFlexibility} />
          <InfoRow label={FIELD_LABELS.occupancyDuringWork} value={submission.occupancyDuringWork} />
        </div>
        <div className="rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-600">3</span>
            취향 및 우선순위
          </h3>
          <InfoRow label={FIELD_LABELS.priorities} value={submission.priorities} />
          <InfoRow label={FIELD_LABELS.preferredStyles} value={submission.preferredStyles} />
          <InfoRow label={FIELD_LABELS.preferredAtmosphere} value={submission.preferredAtmosphere} />
          <InfoRow label={FIELD_LABELS.currentProblems} value={submission.currentProblems} />
        </div>
        {submission.additionalRequest && (
          <div className="rounded-xl border border-gray-200 p-5 lg:col-span-2">
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-600">4</span>
              추가 요청사항
            </h3>
            <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{submission.additionalRequest}</p>
          </div>
        )}
      </div>

      {/* 동의 정보 */}
      <div className="mt-6 rounded-xl bg-gray-50 border border-gray-100 p-4">
        <p className="text-xs font-medium text-gray-400 mb-2">동의 항목</p>
        <div className="flex gap-4 text-xs text-gray-500">
          <span>개인정보 수집: {submission.agreePrivacy ? "동의" : "미동의"}</span>
          <span>상담 연락: {submission.agreeConsult ? "동의" : "미동의"}</span>
          <span>마케팅: {submission.agreeMarketing ? "동의" : "미동의"}</span>
        </div>
      </div>

      {/* 푸시 알림 발송 */}
      <div className="mt-6 rounded-xl border-2 border-orange-200 bg-orange-50/50 p-5">
        <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <svg className="h-4 w-4 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
          고객에게 알림 보내기
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="예: 견적 3건이 도착했습니다. 확인해보세요!"
            value={pushMsg}
            onChange={(e) => setPushMsg(e.target.value)}
            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
          />
          <button
            onClick={handleSendPush}
            disabled={pushSending || !pushMsg.trim()}
            className="shrink-0 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {pushSending ? "발송 중..." : "발송"}
          </button>
        </div>
        {pushResult === "success" && (
          <p className="mt-2 text-xs text-green-600">알림이 발송되었습니다.</p>
        )}
        {pushResult === "error" && (
          <p className="mt-2 text-xs text-red-500">발송 실패. 고객이 알림을 허용하지 않았을 수 있습니다.</p>
        )}
        <a
          href={`/my/${submission.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-xs text-orange-500 hover:underline"
        >
          고객 페이지 보기
          <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3.5 3h5.5v5.5M9 3L3 9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </div>
  );
}


// ──────────────────────────────────────────────
// 업체 관리 탭
// ──────────────────────────────────────────────
function CompanyManagementTab() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const url = filter === "all"
        ? "/api/admin/companies"
        : `/api/admin/companies?status=${filter}`;
      const res = await fetch(url);
      const data = await res.json();
      setCompanies(data.companies || []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleStatusChange = async (id: string, status: string) => {
    setUpdating(id);
    try {
      await fetch(`/api/admin/companies/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchCompanies();
    } catch {
      /* ignore */
    } finally {
      setUpdating(null);
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-600">승인</span>;
      case "rejected":
        return <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-500">거절</span>;
      default:
        return <span className="rounded-full bg-yellow-50 px-2.5 py-0.5 text-xs font-medium text-yellow-600">대기</span>;
    }
  };

  const filters = [
    { value: "all", label: "전체" },
    { value: "pending", label: "대기중" },
    { value: "approved", label: "승인" },
    { value: "rejected", label: "거절" },
  ];

  return (
    <div>
      {/* 필터 */}
      <div className="flex gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              filter === f.value
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-gray-200 border-t-orange-500" style={{ borderWidth: "3px" }} />
        </div>
      ) : companies.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-sm text-gray-400">등록된 업체가 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {companies.map((c) => (
            <div
              key={c.id}
              className="rounded-xl bg-white border border-gray-200 p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50 text-sm font-bold text-orange-500">
                    {c.company_name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">{c.company_name}</span>
                      {statusBadge(c.status)}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-400">
                      <span>{c.email}</span>
                      {c.phone && (
                        <>
                          <span>·</span>
                          <span>{c.phone}</span>
                        </>
                      )}
                      <span>·</span>
                      <span>{formatDate(c.created_at)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {c.status !== "approved" && (
                    <button
                      onClick={() => handleStatusChange(c.id, "approved")}
                      disabled={updating === c.id}
                      className="rounded-lg bg-green-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-600 disabled:opacity-40 transition-colors"
                    >
                      승인
                    </button>
                  )}
                  {c.status !== "rejected" && (
                    <button
                      onClick={() => handleStatusChange(c.id, "rejected")}
                      disabled={updating === c.id}
                      className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600 disabled:opacity-40 transition-colors"
                    >
                      거절
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


// ──────────────────────────────────────────────
// 로그인 폼 컴포넌트
// ──────────────────────────────────────────────
function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        onLogin();
      } else {
        const data = await res.json();
        setError(data.error || "로그인 실패");
      }
    } catch {
      setError("서버 연결 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white text-lg font-bold">
              A
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">관리자 로그인</h1>
              <p className="text-xs text-gray-400">견적 요청 관리 시스템</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-xs font-medium text-gray-500 mb-1.5">
                아이디
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
                placeholder="아이디를 입력하세요"
                autoComplete="username"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-gray-500 mb-1.5">
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
                placeholder="비밀번호를 입력하세요"
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <p className="text-xs text-red-500 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !username.trim() || !password.trim()}
              className="w-full rounded-lg bg-orange-500 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


// ──────────────────────────────────────────────
// Main AdminPage
// ──────────────────────────────────────────────
export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
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

  const [navOpen, setNavOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 메뉴 닫기
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
          <SubmissionDetail submission={selected} onBack={() => setSelectedId(null)} />
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
                        <span>{formatDate(s.createdAt)}</span>
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
                      s.constructionScope ? "bg-orange-50 text-orange-600" : "bg-gray-100 text-gray-400"
                    }`}>
                      {s.constructionScope || "미지정"}
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
