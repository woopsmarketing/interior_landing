"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { CompanySubmission } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import ImageLightbox from "@/components/common/ImageLightbox";

export default function SubmissionsTab() {
  const [submissions, setSubmissions] = useState<CompanySubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [respondingId, setRespondingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [estimatedPrice, setEstimatedPrice] = useState("");
  const [sending, setSending] = useState(false);
  const [lightbox, setLightbox] = useState<{ images: { src: string; alt?: string }[]; index: number } | null>(null);

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

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div
          className="h-8 w-8 animate-spin rounded-full border-gray-200 border-t-orange-500"
          style={{ borderWidth: "3px" }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-gray-700">
        견적 요청 목록 ({submissions.length}건)
      </h3>

      {submissions.length === 0 ? (
        <div className="text-center py-12 text-sm text-gray-400">
          아직 견적 요청이 없습니다.
        </div>
      ) : (
        submissions.map((s) => {
          const isExpanded = expandedId === s.id;
          const isResponding = respondingId === s.id;

          return (
            <div
              key={s.id}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              {/* 카드 헤더 */}
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs text-gray-400">
                      {formatDate(s.created_at)}
                    </span>
                    {s.hasResponded && (
                      <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-600">
                        응답 완료
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {s.space_type && (
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-600">
                        {s.space_type}
                      </span>
                    )}
                    {s.region && (
                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-600">
                        {s.region}
                      </span>
                    )}
                    {s.area_unknown ? (
                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-400">
                        면적 모름
                      </span>
                    ) : s.area ? (
                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-600">
                        {s.area}평
                      </span>
                    ) : null}
                    {s.budget && (
                      <span className="rounded-full bg-orange-50 px-2.5 py-1 text-orange-600">
                        {s.budget}
                      </span>
                    )}
                    {s.construction_scope && (
                      <span className="rounded-full bg-purple-50 px-2.5 py-1 text-purple-600">
                        {s.construction_scope}
                      </span>
                    )}
                    {s.desired_timing && (
                      <span className="rounded-full bg-green-50 px-2.5 py-1 text-green-600">
                        {s.desired_timing}
                      </span>
                    )}
                  </div>
                  {!isExpanded && s.additional_request && (
                    <p className="mt-2 text-xs text-gray-500 line-clamp-2">
                      {s.additional_request}
                    </p>
                  )}
                </div>

                {/* 액션 버튼 영역 */}
                <div className="flex items-center gap-2 ml-3 shrink-0">
                  <button
                    onClick={() => toggleExpand(s.id)}
                    className="flex items-center gap-0.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {isExpanded ? (
                      <>
                        접기
                        <ChevronUp className="h-3.5 w-3.5" />
                      </>
                    ) : (
                      <>
                        상세보기
                        <ChevronDown className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>

                  {s.hasResponded ? (
                    <button
                      disabled
                      className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-400 cursor-not-allowed"
                    >
                      응답완료
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setRespondingId(isResponding ? null : s.id);
                        setMessage("");
                        setEstimatedPrice("");
                      }}
                      className="rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-600 transition-colors"
                    >
                      응답하기
                    </button>
                  )}
                </div>
              </div>

              {/* 상세 정보 (아코디언) */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-5">
                  {/* 기본 정보 */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-2">
                      기본 정보
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
                      <DetailField label="공간 유형" value={s.space_type} />
                      <DetailField label="지역" value={s.region} />
                      <DetailField
                        label="면적"
                        value={
                          s.area_unknown
                            ? "모름"
                            : s.area
                            ? `${s.area}평`
                            : undefined
                        }
                      />
                      <DetailField
                        label="현재 상태"
                        value={s.current_condition}
                      />
                      <DetailField label="건물 연식" value={s.building_age} />
                    </div>
                  </div>

                  {/* 공사 정보 */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-2">
                      공사 정보
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
                      <DetailField
                        label="시공 범위"
                        value={s.construction_scope}
                      />
                      <DetailField
                        label="희망 시기"
                        value={s.desired_timing}
                      />
                      <DetailField label="예산" value={s.budget} />
                      <DetailField
                        label="구조 변경"
                        value={s.structural_change}
                      />
                    </div>
                  </div>

                  {/* 시공 영역 */}
                  {s.renovation_areas && s.renovation_areas.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-2">
                        시공 영역
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {s.renovation_areas.map((area) => (
                          <span
                            key={area}
                            className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs text-indigo-600"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 시공 메모 */}
                  {s.renovation_note && (
                    <div>
                      <p className="text-xs font-medium text-gray-400 mb-1">
                        시공 메모
                      </p>
                      <p className="text-sm text-gray-800 leading-relaxed">
                        {s.renovation_note}
                      </p>
                    </div>
                  )}

                  {/* 추가 요청사항 */}
                  {s.additional_request && (
                    <div>
                      <p className="text-xs font-medium text-gray-400 mb-1">
                        추가 요청사항
                      </p>
                      <p className="text-sm text-gray-800 leading-relaxed">
                        {s.additional_request}
                      </p>
                    </div>
                  )}

                  {/* 고객 업로드 이미지 + AI 생성 이미지 */}
                  {(() => {
                    const imgs: { src: string; alt: string; label: string }[] = [];
                    if (s.has_space_photo && s.space_photo_url) imgs.push({ src: s.space_photo_url, alt: "현재 공간 사진", label: "현재 공간 사진" });
                    if (s.has_reference_image && s.reference_image_url) imgs.push({ src: s.reference_image_url, alt: "참고 이미지", label: "참고 이미지" });
                    if (s.has_generated_image && s.generated_image_url) imgs.push({ src: s.generated_image_url, alt: "AI 생성 이미지", label: "AI 생성 인테리어" });
                    if (imgs.length === 0) return null;
                    return (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-2">첨부 이미지</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {imgs.map((img, i) => (
                            <div key={img.label}>
                              <p className="text-xs font-medium text-gray-400 mb-1">{img.label}</p>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={img.src}
                                alt={img.alt}
                                className="w-full max-h-64 object-cover rounded-lg border border-gray-100 cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => setLightbox({ images: imgs.map((x) => ({ src: x.src, alt: x.alt })), index: i })}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* 응답 폼 */}
              {isResponding && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      예상 견적금액
                    </label>
                    <input
                      value={estimatedPrice}
                      onChange={(e) => setEstimatedPrice(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-300"
                      placeholder="예: 3,000만원"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      메시지
                    </label>
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
          );
        })
      )}
      {lightbox && (
        <ImageLightbox
          images={lightbox.images}
          initialIndex={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
}

// ── 공통 필드 컴포넌트 ──────────────────────────────────
function DetailField({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs font-medium text-gray-400">{label}</p>
      <p className="text-sm text-gray-800">{value}</p>
    </div>
  );
}
