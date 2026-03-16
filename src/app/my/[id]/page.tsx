"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Submission {
  id: string;
  createdAt: string;
  spaceType: string;
  region: string;
  area: string;
  areaUnknown: boolean;
  constructionScope: string;
  desiredTiming: string;
  budget: string;
  preferredStyles: string[];
  preferredAtmosphere: string;
  additionalRequest: string;
  hasSpacePhoto: boolean;
  hasReferenceImage: boolean;
  hasGeneratedImage: boolean;
  name: string;
}

interface CompanyResponseItem {
  id: string;
  message: string | null;
  estimated_price: string | null;
  created_at: string;
  portfolio_count: number;
  companies: {
    id: string;
    company_name: string;
    logo_url: string | null;
    specialties: string[];
    preferred_styles: string[];
  } | null;
}

const STATUS_STEPS = [
  { label: "견적 요청 접수", desc: "입력하신 정보가 등록되었습니다" },
  { label: "업체 매칭 중", desc: "조건에 맞는 업체를 선별하고 있습니다" },
  { label: "견적 도착", desc: "업체에서 견적을 보내왔습니다" },
] as const;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MySubmissionPage() {
  const params = useParams();
  const id = params.id as string;

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pushStatus, setPushStatus] = useState<"idle" | "subscribed" | "denied" | "unsupported">("idle");
  const [responses, setResponses] = useState<CompanyResponseItem[]>([]);
  const [responsesLoading, setResponsesLoading] = useState(false);

  const fetchSubmission = useCallback(async () => {
    try {
      const res = await fetch(`/api/submissions/${id}`);
      if (!res.ok) throw new Error("not found");
      const data = await res.json();
      setSubmission(data);
    } catch {
      setError("견적 요청 정보를 찾을 수 없습니다.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchResponses = useCallback(async () => {
    setResponsesLoading(true);
    try {
      const res = await fetch(`/api/submissions/${id}/responses`);
      if (res.ok) {
        const data = await res.json();
        setResponses(data.responses || []);
      }
    } catch {
      /* ignore */
    } finally {
      setResponsesLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSubmission();
    fetchResponses();
  }, [fetchSubmission, fetchResponses]);

  // 푸시 알림 구독 상태 확인
  useEffect(() => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setPushStatus("unsupported");
      return;
    }
    if (Notification.permission === "granted") {
      setPushStatus("subscribed");
    } else if (Notification.permission === "denied") {
      setPushStatus("denied");
    }
  }, []);

  const handleSubscribe = async () => {
    if (!("serviceWorker" in navigator)) return;

    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setPushStatus("denied");
        return;
      }

      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      });

      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: id,
          subscription: sub.toJSON(),
          customerName: submission?.name || "",
        }),
      });

      setPushStatus("subscribed");
    } catch (err) {
      console.error("푸시 구독 실패:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-orange-200 border-t-orange-500" style={{ borderWidth: "3px" }} />
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <svg className="h-8 w-8 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  // 현재 상태 (MVP에서는 항상 1단계)
  const currentStatus = 1;

  return (
    <div className="min-h-screen bg-[#FFF9F5]">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white text-sm font-bold">
            AI
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-900">내 견적 요청</h1>
            <p className="text-xs text-gray-400">AI 인테리어 견적 비교</p>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-5">
        {/* 인사 카드 */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
          <p className="text-lg font-bold text-gray-900 mb-1">
            {submission.name}님, 감사합니다
          </p>
          <p className="text-sm text-gray-500">
            {formatDate(submission.createdAt)}에 접수된 견적 요청입니다.
          </p>
        </div>

        {/* 진행 상태 */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-bold text-gray-700 mb-5">진행 상태</h2>
          <ol className="space-y-4">
            {STATUS_STEPS.map((step, i) => {
              const stepNum = i + 1;
              const isDone = stepNum < currentStatus;
              const isActive = stepNum === currentStatus;
              const isPending = stepNum > currentStatus;

              return (
                <li key={stepNum} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      isDone ? "bg-orange-500 text-white" :
                      isActive ? "bg-orange-100 text-orange-600 ring-2 ring-orange-300" :
                      "bg-gray-100 text-gray-300"
                    }`}>
                      {isDone ? (
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : stepNum}
                    </div>
                    {i < STATUS_STEPS.length - 1 && (
                      <div className={`w-0.5 h-6 mt-1 ${isDone ? "bg-orange-300" : "bg-gray-100"}`} />
                    )}
                  </div>
                  <div className="pt-1">
                    <p className={`text-sm font-semibold ${
                      isPending ? "text-gray-300" : "text-gray-800"
                    }`}>
                      {step.label}
                      {isActive && <span className="ml-2 text-xs font-normal text-orange-500">진행 중</span>}
                    </p>
                    <p className={`text-xs mt-0.5 ${isPending ? "text-gray-200" : "text-gray-400"}`}>
                      {step.desc}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* AI 생성 이미지 */}
        {submission.hasGeneratedImage && (
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 pt-5 pb-3">
              <h2 className="text-sm font-bold text-gray-700">AI 인테리어 미리보기</h2>
            </div>
            <div className="relative w-full aspect-video">
              <Image
                src={`/api/submissions/${id}?type=generated`}
                alt="AI 생성 인테리어 이미지"
                fill
                className="object-cover"
              />
            </div>
            <p className="px-4 py-2 text-center text-xs text-gray-400 bg-gray-50">
              AI가 생성한 참고 이미지입니다. 실제 결과와 다를 수 있습니다.
            </p>
          </div>
        )}

        {/* 요청 요약 */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-bold text-gray-700 mb-4">요청 요약</h2>
          <div className="space-y-3">
            {[
              { label: "공간 유형", value: submission.spaceType },
              { label: "지역", value: submission.region },
              { label: "면적", value: submission.areaUnknown ? "잘 모르겠음" : submission.area ? `${submission.area}평` : "" },
              { label: "공사 범위", value: submission.constructionScope },
              { label: "희망 시기", value: submission.desiredTiming },
              { label: "예산", value: submission.budget },
              { label: "선호 스타일", value: submission.preferredStyles?.join(", ") },
              { label: "선호 분위기", value: submission.preferredAtmosphere },
            ].filter((r) => r.value).map((row) => (
              <div key={row.label} className="flex justify-between text-sm">
                <span className="text-gray-400">{row.label}</span>
                <span className="text-gray-800 font-medium">{row.value}</span>
              </div>
            ))}
          </div>
          {submission.additionalRequest && (
            <div className="mt-4 pt-4 border-t border-gray-50">
              <p className="text-xs text-gray-400 mb-1">추가 요청사항</p>
              <p className="text-sm text-gray-700">{submission.additionalRequest}</p>
            </div>
          )}
        </div>

        {/* 업로드 이미지 */}
        {(submission.hasSpacePhoto || submission.hasReferenceImage) && (
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-bold text-gray-700 mb-4">첨부 이미지</h2>
            <div className="grid grid-cols-2 gap-3">
              {submission.hasSpacePhoto && (
                <div>
                  <p className="text-xs text-gray-400 mb-2">현재 공간</p>
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                    <Image
                      src={`/api/submissions/${id}?type=space`}
                      alt="현재 공간 사진"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
              {submission.hasReferenceImage && (
                <div>
                  <p className="text-xs text-gray-400 mb-2">참고 이미지</p>
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                    <Image
                      src={`/api/submissions/${id}?type=reference`}
                      alt="참고 이미지"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 응답 업체 섹션 */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-bold text-gray-700 mb-4">응답 업체</h2>
          {responsesLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-gray-200 border-t-orange-500" style={{ borderWidth: "2px" }} />
            </div>
          ) : responses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-400">아직 업체 응답이 없습니다.</p>
              <p className="text-xs text-gray-300 mt-1">업체에서 견적을 보내면 여기에 표시됩니다.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {responses.map((r) => {
                const company = r.companies;
                if (!company) return null;
                return (
                  <Link
                    key={r.id}
                    href={`/my/${id}/companies/${company.id}`}
                    className="block rounded-xl border border-gray-200 p-4 hover:border-orange-200 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start gap-3">
                      {company.logo_url ? (
                        <div className="relative w-10 h-10 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                          <Image src={company.logo_url} alt="" fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-sm font-bold text-orange-500">
                          {company.company_name.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-900">{company.company_name}</span>
                          {r.estimated_price && (
                            <span className="text-sm font-bold text-orange-600">{r.estimated_price}</span>
                          )}
                        </div>
                        {company.specialties?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {company.specialties.slice(0, 3).map((s) => (
                              <span key={s} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">{s}</span>
                            ))}
                          </div>
                        )}
                        {r.message && (
                          <p className="text-xs text-gray-500 mt-1.5 line-clamp-1">{r.message}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-400">
                          {r.portfolio_count > 0 && <span>포트폴리오 {r.portfolio_count}건</span>}
                        </div>
                      </div>
                      <svg className="h-4 w-4 text-gray-300 shrink-0 mt-2" viewBox="0 0 16 16" fill="none">
                        <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* 푸시 알림 CTA */}
        {pushStatus === "idle" && (
          <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white">
            <p className="text-base font-bold mb-1">견적 도착 알림 받기</p>
            <p className="text-sm text-orange-100 mb-4">
              업체에서 견적을 보내면 즉시 알림을 보내드립니다. 브라우저를 닫아도 알림이 도착합니다.
            </p>
            <button
              onClick={handleSubscribe}
              className="w-full rounded-xl bg-white text-orange-600 py-3 text-sm font-bold hover:bg-orange-50 transition-colors"
            >
              알림 허용하기
            </button>
          </div>
        )}
        {pushStatus === "subscribed" && (
          <div className="rounded-2xl bg-green-50 border border-green-100 p-5 text-center">
            <p className="text-sm font-medium text-green-700">
              알림이 설정되었습니다. 견적이 도착하면 바로 알려드릴게요.
            </p>
          </div>
        )}
        {pushStatus === "denied" && (
          <div className="rounded-2xl bg-gray-50 border border-gray-100 p-5 text-center">
            <p className="text-sm text-gray-500">
              알림이 차단되어 있습니다. 브라우저 설정에서 알림을 허용해주세요.
            </p>
          </div>
        )}

        {/* 하단 안내 */}
        <div className="text-center py-4">
          <p className="text-xs text-gray-300">
            이 페이지를 북마크하시면 언제든 견적 상태를 확인할 수 있습니다.
          </p>
        </div>
      </main>
    </div>
  );
}
