"use client";

import { useState } from "react";
import { X, Lightbulb, Send, ImagePlus, Trash2 } from "lucide-react";

interface FeedbackModalProps {
  type: "feedback" | "inquiry";
  onClose: () => void;
}

const FEEDBACK_CATEGORIES = [
  "새로운 기능 제안",
  "견적 양식 개선",
  "대시보드 UI/UX",
  "포트폴리오 기능",
  "고객 매칭 방식",
  "기타",
] as const;

export default function FeedbackModal({ type, onClose }: FeedbackModalProps) {
  const isFeedback = type === "feedback";

  const [category, setCategory] = useState<string>("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageAdd = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.onchange = () => {
      if (input.files) {
        setImages((prev) => [...prev, ...Array.from(input.files!)].slice(0, 5));
      }
    };
    input.click();
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setSending(true);
    setError(null);

    try {
      const fd = new FormData();
      fd.append("type", type);
      fd.append("content", content);
      if (category) fd.append("category", category);
      for (const img of images) {
        fd.append("images", img);
      }

      const res = await fetch("/api/companies/feedback", {
        method: "POST",
        body: fd,
      });

      if (res.ok) {
        setSent(true);
      } else {
        const data = await res.json();
        setError(data.error || "전송에 실패했습니다.");
      }
    } catch {
      setError("서버 연결에 실패했습니다.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${isFeedback ? "bg-orange-50" : "bg-blue-50"}`}>
              {isFeedback
                ? <Lightbulb className="h-5 w-5 text-orange-500" />
                : <Send className="h-5 w-5 text-blue-500" />
              }
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                {isFeedback ? "피드백 보내기" : "문의하기"}
              </h2>
              <p className="text-xs text-gray-400">
                {isFeedback ? "플랫폼 개선에 큰 도움이 됩니다" : "관리자에게 직접 전달됩니다"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
            <X className="h-4 w-4 text-gray-400" />
          </button>
        </div>

        {/* 전송 완료 */}
        {sent ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 mb-5">
              <span className="text-3xl">✅</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {isFeedback ? "피드백이 전송되었습니다!" : "문의가 전송되었습니다!"}
            </h3>
            <p className="text-sm text-gray-500 mb-8">
              {isFeedback
                ? "소중한 의견 감사합니다. 검토 후 반영하겠습니다."
                : "확인 후 빠르게 답변드리겠습니다."
              }
            </p>
            <button
              onClick={onClose}
              className="rounded-xl bg-orange-500 px-8 py-3 text-sm font-bold text-white hover:bg-orange-600 transition-colors"
            >
              닫기
            </button>
          </div>
        ) : (
          <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* 카테고리 (피드백만) */}
            {isFeedback && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2">카테고리</label>
                <div className="flex flex-wrap gap-2">
                  {FEEDBACK_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(category === cat ? "" : cat)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                        category === cat
                          ? "bg-orange-500 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 내용 */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                {isFeedback ? "어떤 의견을 보내시겠어요?" : "문의 내용"}
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  isFeedback
                    ? "이런 기능이 있었으면 좋겠어요, 이 부분이 불편해요, 견적 양식에 이런 항목이 추가되면 좋겠어요 등 자유롭게 작성해주세요."
                    : "문의할 내용을 자유롭게 작성해주세요."
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-300 h-36 resize-none"
              />
            </div>

            {/* 이미지 첨부 (문의하기만) */}
            {!isFeedback && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  이미지 첨부 <span className="text-gray-300 font-normal">(선택, 최대 5장)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {images.map((img, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={URL.createObjectURL(img)}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  ))}
                  {images.length < 5 && (
                    <button
                      type="button"
                      onClick={handleImageAdd}
                      className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 hover:border-orange-300 hover:bg-orange-50/50 transition-colors"
                    >
                      <ImagePlus className="h-5 w-5 text-gray-300" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {error && <p className="text-xs text-red-500 text-center">{error}</p>}

            {/* 전송 버튼 */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSubmit}
                disabled={sending || !content.trim()}
                className="flex-1 rounded-xl bg-orange-500 py-3 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {sending ? "전송 중..." : isFeedback ? "피드백 보내기" : "문의 전송"}
              </button>
              <button
                onClick={onClose}
                className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
