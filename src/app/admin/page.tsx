"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

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
                <Image
                  src={`/api/submissions/${submission.id}?type=space`}
                  alt="공간 사진"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}
          {submission.hasReferenceImage && (
            <div>
              <p className="text-xs font-medium text-gray-400 mb-2">참고 이미지</p>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                <Image
                  src={`/api/submissions/${submission.id}?type=reference`}
                  alt="참고 이미지"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}
          {submission.hasGeneratedImage && (
            <div>
              <p className="text-xs font-medium text-gray-400 mb-2">AI 생성 이미지</p>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                <Image
                  src={`/api/submissions/${submission.id}?type=generated`}
                  alt="AI 생성 이미지"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* 정보 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 연락처 */}
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

        {/* Step 1 */}
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

        {/* Step 2 */}
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

        {/* Step 3 */}
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

        {/* Step 4 - 추가 요청사항 */}
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

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    fetchSubmissions();
  }, [fetchSubmissions]);

  const selected = submissions.find((s) => s.id === selectedId) ?? null;

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
              <h1 className="text-base font-bold text-gray-900">견적 요청 관리</h1>
              <p className="text-xs text-gray-400">AI 인테리어 견적 비교 서비스</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              총 {submissions.length}건
            </span>
            <button
              onClick={fetchSubmissions}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              새로고침
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
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
                    {/* 아바타 */}
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
