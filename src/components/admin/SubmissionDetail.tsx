"use client";

import { useState } from "react";
import Image from "next/image";
import { AdminSubmission } from "@/lib/types";
import { formatDate, SUBMISSION_FIELD_LABELS } from "@/lib/utils";

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

const STATUS_OPTIONS = [
  { value: "received", label: "접수", color: "bg-gray-100 text-gray-600" },
  { value: "matching", label: "매칭 중", color: "bg-blue-100 text-blue-600" },
  { value: "quoted", label: "견적 도착", color: "bg-green-100 text-green-600" },
] as const;

export default function SubmissionDetail({
  submission,
  onBack,
  onStatusChange,
}: {
  submission: AdminSubmission;
  onBack: () => void;
  onStatusChange?: (id: string, status: string) => void;
}) {
  const [currentStatus, setCurrentStatus] = useState(submission.status ?? "received");
  const [statusChanging, setStatusChanging] = useState(false);
  const [statusResult, setStatusResult] = useState<"success" | "error" | null>(null);
  const [pushMsg, setPushMsg] = useState("");
  const [pushSending, setPushSending] = useState(false);
  const [pushResult, setPushResult] = useState<"success" | "error" | null>(null);
  const L = SUBMISSION_FIELD_LABELS;

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return;
    setStatusChanging(true);
    setStatusResult(null);
    try {
      const res = await fetch(`/api/submissions/${submission.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setCurrentStatus(newStatus);
        setStatusResult("success");
        onStatusChange?.(submission.id, newStatus);
      } else {
        setStatusResult("error");
      }
    } catch {
      setStatusResult("error");
    } finally {
      setStatusChanging(false);
    }
  };

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
          <p className="text-sm text-gray-400 mt-0.5">{formatDate(submission.createdAt, true)} · {submission.id}</p>
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

      {/* 상태 변경 */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-700">진행 상태</h3>
          {statusResult === "success" && <span className="text-xs text-green-600">저장됨</span>}
          {statusResult === "error" && <span className="text-xs text-red-500">저장 실패</span>}
        </div>
        <div className="flex gap-2">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleStatusChange(opt.value)}
              disabled={statusChanging}
              className={`flex-1 rounded-lg border-2 py-2 text-sm font-semibold transition-all disabled:opacity-50 ${
                currentStatus === opt.value
                  ? `${opt.color} border-current`
                  : "border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
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
          <InfoRow label={L.contactMethod} value={submission.contactMethod} />
          <InfoRow label={L.availableTime} value={submission.availableTime} />
        </div>
        <div className="rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-600">1</span>
            공간 기본 정보
          </h3>
          <InfoRow label={L.spaceType} value={submission.spaceType} />
          <InfoRow label={L.region} value={submission.region} />
          <InfoRow label={L.area} value={submission.areaUnknown ? "잘 모르겠음" : submission.area ? `${submission.area}평` : ""} />
          <InfoRow label={L.currentCondition} value={submission.currentCondition} />
          <InfoRow label={L.buildingAge} value={submission.buildingAge} />
        </div>
        <div className="rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-600">2</span>
            공사 희망 정보
          </h3>
          <InfoRow label={L.constructionScope} value={submission.constructionScope} />
          <InfoRow label={L.desiredTiming} value={submission.desiredTiming} />
          <InfoRow label={L.budget} value={submission.budget} />
          <InfoRow label={L.constructionPurpose} value={submission.constructionPurpose} />
          <InfoRow label={L.scheduleFlexibility} value={submission.scheduleFlexibility} />
          <InfoRow label={L.occupancyDuringWork} value={submission.occupancyDuringWork} />
        </div>
        <div className="rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-600">3</span>
            취향 및 우선순위
          </h3>
          <InfoRow label={L.priorities} value={submission.priorities} />
          <InfoRow label={L.preferredStyles} value={submission.preferredStyles} />
          <InfoRow label={L.preferredAtmosphere} value={submission.preferredAtmosphere} />
          <InfoRow label={L.currentProblems} value={submission.currentProblems} />
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
