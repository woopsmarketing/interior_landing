"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Portfolio } from "@/lib/types";

export default function PortfolioTab() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [spaceType, setSpaceType] = useState("");
  const [style, setStyle] = useState("");
  const [area, setArea] = useState("");
  const [budget, setBudget] = useState("");
  const [region, setRegion] = useState("");
  const [duration, setDuration] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchPortfolios = useCallback(async () => {
    try {
      const res = await fetch("/api/companies/portfolios");
      const data = await res.json();
      setPortfolios(data.portfolios || []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolios();
  }, [fetchPortfolios]);

  const resetForm = () => {
    setTitle(""); setDescription(""); setSpaceType(""); setStyle("");
    setArea(""); setBudget(""); setRegion(""); setDuration("");
    setImageUrls([]); setEditId(null); setShowForm(false);
  };

  const openEdit = (p: Portfolio) => {
    setEditId(p.id); setTitle(p.title); setDescription(p.description || "");
    setSpaceType(p.space_type || ""); setStyle(p.style || "");
    setArea(p.area || ""); setBudget(p.budget || "");
    setRegion(p.region || ""); setDuration(p.duration || "");
    setImageUrls(p.image_urls || []); setShowForm(true);
  };

  const handleUploadImages = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.onchange = async () => {
      const files = input.files;
      if (!files) return;
      setUploading(true);
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const fd = new FormData();
        fd.append("file", files[i]);
        try {
          const res = await fetch("/api/companies/upload", { method: "POST", body: fd });
          const data = await res.json();
          if (data.url) urls.push(data.url);
        } catch {
          /* skip */
        }
      }
      setImageUrls((prev) => [...prev, ...urls]);
      setUploading(false);
    };
    input.click();
  };

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      const body = {
        title, description, space_type: spaceType, style,
        area, budget, region, duration, image_urls: imageUrls,
      };

      if (editId) {
        await fetch(`/api/companies/portfolios/${editId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        await fetch("/api/companies/portfolios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      resetForm();
      fetchPortfolios();
    } catch {
      /* ignore */
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await fetch(`/api/companies/portfolios/${id}`, { method: "DELETE" });
    fetchPortfolios();
  };

  const inputCls =
    "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-300";

  if (loading) {
    return <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-gray-200 border-t-orange-500" style={{ borderWidth: "3px" }} /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-700">포트폴리오 ({portfolios.length}건)</h3>
        {!showForm && (
          <button onClick={() => { resetForm(); setShowForm(true); }} className="rounded-lg bg-orange-500 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-600 transition-colors">
            + 포트폴리오 추가
          </button>
        )}
      </div>

      {showForm && (
        <div className="rounded-xl border-2 border-orange-200 bg-white p-6 space-y-4">
          <h4 className="text-sm font-bold text-gray-700">{editId ? "포트폴리오 수정" : "새 포트폴리오"}</h4>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">제목 *</label>
            <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="시공 제목" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">설명</label>
            <textarea className={inputCls + " h-20 resize-none"} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">공간유형</label>
              <input className={inputCls} value={spaceType} onChange={(e) => setSpaceType(e.target.value)} placeholder="아파트" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">스타일</label>
              <input className={inputCls} value={style} onChange={(e) => setStyle(e.target.value)} placeholder="모던" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">면적</label>
              <input className={inputCls} value={area} onChange={(e) => setArea(e.target.value)} placeholder="32평" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">예산</label>
              <input className={inputCls} value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="3000만원" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">지역</label>
              <input className={inputCls} value={region} onChange={(e) => setRegion(e.target.value)} placeholder="서울 강남" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">공사기간</label>
              <input className={inputCls} value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="4주" />
            </div>
          </div>

          {/* 이미지 */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">시공 이미지</label>
            <div className="flex flex-wrap gap-3 mb-2">
              {imageUrls.map((url, i) => (
                <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 group">
                  <Image src={url} alt="" fill className="object-cover" />
                  <button
                    onClick={() => setImageUrls((prev) => prev.filter((_, j) => j !== i))}
                    className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={handleUploadImages} disabled={uploading} className="text-xs text-orange-500 hover:underline">
              {uploading ? "업로드 중..." : "+ 이미지 추가"}
            </button>
          </div>

          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving || !title.trim()} className="rounded-lg bg-orange-500 px-6 py-2 text-xs font-semibold text-white hover:bg-orange-600 disabled:opacity-40 transition-colors">
              {saving ? "저장 중..." : editId ? "수정 완료" : "추가"}
            </button>
            <button onClick={resetForm} className="rounded-lg border border-gray-200 px-6 py-2 text-xs font-medium text-gray-500 hover:bg-gray-50 transition-colors">
              취소
            </button>
          </div>
        </div>
      )}

      {/* 목록 */}
      {portfolios.length === 0 && !showForm ? (
        <div className="text-center py-12 text-sm text-gray-400">아직 포트폴리오가 없습니다.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {portfolios.map((p) => (
            <div key={p.id} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
              {p.image_urls && p.image_urls.length > 0 && (
                <div className="relative aspect-video bg-gray-100">
                  <Image src={p.image_urls[0]} alt={p.title} fill className="object-cover" />
                  {p.image_urls.length > 1 && (
                    <span className="absolute bottom-2 right-2 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white">
                      +{p.image_urls.length - 1}
                    </span>
                  )}
                </div>
              )}
              <div className="p-4">
                <h4 className="text-sm font-bold text-gray-800">{p.title}</h4>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {p.space_type && <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">{p.space_type}</span>}
                  {p.style && <span className="rounded-full bg-purple-50 px-2 py-0.5 text-xs text-purple-600">{p.style}</span>}
                  {p.area && <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">{p.area}</span>}
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => openEdit(p)} className="text-xs text-orange-500 hover:underline">수정</button>
                  <button onClick={() => handleDelete(p.id)} className="text-xs text-red-400 hover:underline">삭제</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
