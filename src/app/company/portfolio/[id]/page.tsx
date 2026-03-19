"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, MapPin, Clock, Maximize2, Wallet, Home, Palette } from "lucide-react";
import { Portfolio } from "@/lib/types";
import ImageLightbox from "@/components/common/ImageLightbox";

export default function PortfolioDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{ index: number } | null>(null);

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const res = await fetch(`/api/companies/portfolios/${id}`);
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "포트폴리오를 찾을 수 없습니다");
          return;
        }
        const data = await res.json();
        setPortfolio(data.portfolio);
      } catch {
        setError("데이터를 불러오는 중 오류가 발생했습니다");
      } finally {
        setLoading(false);
      }
    }
    fetchPortfolio();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div
          className="h-10 w-10 animate-spin rounded-full border-gray-200"
          style={{ borderWidth: "3px", borderTopColor: "#f97316" }}
        />
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-sm">{error || "포트폴리오를 찾을 수 없습니다"}</p>
        <button
          onClick={() => router.push("/company/dashboard")}
          className="text-sm text-orange-500 hover:underline"
        >
          대시보드로 돌아가기
        </button>
      </div>
    );
  }

  const metaItems: { icon: React.ReactNode; label: string; value: string }[] = [
    portfolio.space_type ? { icon: <Home className="w-4 h-4" />, label: "공간 유형", value: portfolio.space_type } : null,
    portfolio.style ? { icon: <Palette className="w-4 h-4" />, label: "스타일", value: portfolio.style } : null,
    portfolio.area ? { icon: <Maximize2 className="w-4 h-4" />, label: "면적", value: portfolio.area } : null,
    portfolio.budget ? { icon: <Wallet className="w-4 h-4" />, label: "예산", value: portfolio.budget } : null,
    portfolio.region ? { icon: <MapPin className="w-4 h-4" />, label: "지역", value: portfolio.region } : null,
    portfolio.duration ? { icon: <Clock className="w-4 h-4" />, label: "공사 기간", value: portfolio.duration } : null,
  ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string }[];

  const imageList = (portfolio.image_urls || []).map((url, i) => ({
    src: url,
    alt: `${portfolio.title} 시공 사진 ${i + 1}`,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 헤더 */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
          <button
            onClick={() => router.push("/company/dashboard")}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>시공사례 목록</span>
          </button>
        </div>
      </div>

      {/* 본문 */}
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* 제목 + 날짜 */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 leading-snug">{portfolio.title}</h1>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(portfolio.created_at).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* 시공 정보 카드 */}
        {metaItems.length > 0 && (
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">시공 정보</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {metaItems.map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">{item.label}</p>
                    <p className="text-sm font-semibold text-gray-800">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 시공 설명 */}
        {portfolio.description && (
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">시공 설명</h2>
            <p className="text-base text-gray-700 whitespace-pre-wrap leading-7">
              {portfolio.description}
            </p>
          </div>
        )}

        {/* 이미지 목록 */}
        {imageList.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              시공 사진 ({imageList.length}장)
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {imageList.map((img, i) => (
                <div
                  key={i}
                  className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-sm cursor-pointer group"
                  onClick={() => setLightbox({ index: i })}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 이미지가 없을 때 */}
        {imageList.length === 0 && (
          <div className="rounded-xl bg-white border border-dashed border-gray-200 py-12 flex flex-col items-center gap-2 text-gray-400">
            <span className="text-3xl">🖼️</span>
            <p className="text-sm">등록된 시공 사진이 없습니다</p>
          </div>
        )}
      </div>

      {/* 라이트박스 */}
      {lightbox && (
        <ImageLightbox
          images={imageList}
          initialIndex={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
}
