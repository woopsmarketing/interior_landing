"use client";

import { useState, useEffect, useCallback } from "react";
import { CompanySubmission } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function SubmissionsTab() {
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
