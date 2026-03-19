"use client";

import { useState, useEffect, useCallback } from "react";
import { formatDate } from "@/lib/utils";

interface Feedback {
  id: string;
  company_id: string;
  company_name: string;
  company_email: string;
  type: "feedback" | "inquiry";
  category: string;
  content: string;
  image_urls: string[];
  status: "pending" | "read" | "resolved";
  admin_note: string;
  created_at: string;
}

const STATUS_MAP = {
  pending: { label: "신규", cls: "bg-orange-50 text-orange-600" },
  read: { label: "확인", cls: "bg-blue-50 text-blue-600" },
  resolved: { label: "완료", cls: "bg-green-50 text-green-600" },
} as const;

export default function FeedbackManagementTab() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "feedback" | "inquiry">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchFeedbacks = useCallback(async () => {
    setLoading(true);
    try {
      const url = filter === "all"
        ? "/api/admin/feedbacks"
        : `/api/admin/feedbacks?type=${filter}`;
      const res = await fetch(url);
      const data = await res.json();
      setFeedbacks(data.feedbacks || []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const selected = feedbacks.find((f) => f.id === selectedId) ?? null;

  const handleStatusChange = async (id: string, status: string) => {
    await fetch("/api/admin/feedbacks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setFeedbacks((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: status as Feedback["status"] } : f))
    );
  };

  const handleSaveNote = async () => {
    if (!selected) return;
    setSaving(true);
    await fetch("/api/admin/feedbacks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selected.id, admin_note: adminNote }),
    });
    setFeedbacks((prev) =>
      prev.map((f) => (f.id === selected.id ? { ...f, admin_note: adminNote } : f))
    );
    setSaving(false);
  };

  // 상세 뷰
  if (selected) {
    const st = STATUS_MAP[selected.status];
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedId(null)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          ← 목록으로
        </button>

        <div className="rounded-xl bg-white border border-gray-200 p-6 space-y-5">
          {/* 헤더 */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${selected.type === "feedback" ? "bg-orange-50 text-orange-600" : "bg-blue-50 text-blue-600"}`}>
                  {selected.type === "feedback" ? "피드백" : "문의"}
                </span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${st.cls}`}>
                  {st.label}
                </span>
                {selected.category && (
                  <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-500">
                    {selected.category}
                  </span>
                )}
              </div>
              <p className="text-lg font-bold text-gray-900">{selected.company_name}</p>
              <p className="text-xs text-gray-400">{selected.company_email} · {formatDate(selected.created_at, true)}</p>
            </div>

            {/* 상태 변경 */}
            <div className="flex gap-1.5">
              {(["pending", "read", "resolved"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(selected.id, s)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    selected.status === s
                      ? STATUS_MAP[s].cls + " ring-2 ring-offset-1 ring-gray-200"
                      : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                  }`}
                >
                  {STATUS_MAP[s].label}
                </button>
              ))}
            </div>
          </div>

          {/* 내용 */}
          <div className="rounded-xl bg-gray-50 p-5">
            <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{selected.content}</p>
          </div>

          {/* 이미지 */}
          {selected.image_urls && selected.image_urls.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2">첨부 이미지 ({selected.image_urls.length})</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {selected.image_urls.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`첨부 ${i + 1}`} className="w-full rounded-lg border border-gray-100 object-cover aspect-video hover:opacity-80 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* 관리자 메모 */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">관리자 메모</label>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              onFocus={() => setAdminNote(selected.admin_note || "")}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-300 h-24 resize-none"
              placeholder="내부 메모를 남겨두세요..."
            />
            <button
              onClick={handleSaveNote}
              disabled={saving}
              className="mt-2 rounded-lg bg-gray-800 px-4 py-2 text-xs font-semibold text-white hover:bg-gray-900 disabled:opacity-40 transition-colors"
            >
              {saving ? "저장 중..." : "메모 저장"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 목록 뷰
  return (
    <div className="space-y-4">
      {/* 필터 */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {([["all", "전체"], ["feedback", "피드백"], ["inquiry", "문의"]] as const).map(([val, label]) => (
            <button
              key={val}
              onClick={() => { setFilter(val); setSelectedId(null); }}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                filter === val
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="text-xs text-gray-400">총 {feedbacks.length}건</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-gray-200 border-t-orange-500" style={{ borderWidth: "3px" }} />
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="text-center py-16 text-sm text-gray-400">
          {filter === "all" ? "피드백/문의가 없습니다." : filter === "feedback" ? "피드백이 없습니다." : "문의가 없습니다."}
        </div>
      ) : (
        <div className="space-y-2">
          {feedbacks.map((f) => {
            const st = STATUS_MAP[f.status];
            return (
              <button
                key={f.id}
                onClick={() => { setSelectedId(f.id); setAdminNote(f.admin_note || ""); }}
                className="w-full text-left rounded-xl bg-white border border-gray-200 p-4 hover:border-orange-200 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${f.type === "feedback" ? "bg-orange-50 text-orange-500" : "bg-blue-50 text-blue-500"}`}>
                      {f.type === "feedback" ? "💡" : "📩"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">{f.company_name}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${st.cls}`}>{st.label}</span>
                        {f.category && (
                          <span className="text-xs text-gray-400">{f.category}</span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-gray-500 line-clamp-1">{f.content}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-300">{formatDate(f.created_at)}</span>
                    {f.image_urls && f.image_urls.length > 0 && (
                      <span className="rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-medium text-purple-500">
                        📷 {f.image_urls.length}
                      </span>
                    )}
                    <svg className="h-4 w-4 text-gray-300" viewBox="0 0 16 16" fill="none">
                      <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
