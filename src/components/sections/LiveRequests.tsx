"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Clock, MapPin, Home } from "lucide-react";

interface PublicRequest {
  id: string;
  maskedName: string;
  region: string;
  spaceType: string;
  budget: string;
  createdAt: string;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "방금 전";
  if (mins < 60) return `${mins}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  return `${days}일 전`;
}

// 공간 유형 라벨 정규화
function spaceLabel(type: string): string {
  const map: Record<string, string> = {
    아파트: "아파트",
    오피스텔: "오피스텔",
    빌라: "빌라/연립",
    단독주택: "단독주택",
    상업공간: "상업공간",
    사무실: "사무실",
  };
  return map[type] || type || "주거공간";
}

export default function LiveRequests() {
  const [requests, setRequests] = useState<PublicRequest[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch("/api/submissions/public", { cache: "no-store" });
        if (!res.ok) { setLoaded(true); return; }
        const data = await res.json();
        setRequests(data.requests ?? []);
        setLoaded(true);
      } catch {
        setLoaded(true);
      }
    };

    fetchRequests();
    const interval = setInterval(fetchRequests, 30000);
    return () => clearInterval(interval);
  }, []);

  // 데이터 없으면 섹션 숨김
  if (loaded && requests.length === 0) return null;
  if (!loaded) return null;

  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-3xl mx-auto px-4">
        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-8">
          <div className="relative flex items-center justify-center w-3 h-3">
            <span className="absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">실시간 견적 요청 현황</h2>
          <span className="ml-auto text-sm text-gray-400 tabular-nums">{requests.length}건</span>
        </div>

        {/* 리스트 */}
        <ul className="space-y-2">
          <AnimatePresence initial={false}>
            {requests.map((req, i) => (
              <motion.li
                key={req.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 text-sm"
              >
                {/* 이름 */}
                <span className="font-semibold text-gray-800 w-10 shrink-0">{req.maskedName}</span>

                {/* 지역 */}
                <span className="flex items-center gap-1 text-gray-600">
                  <MapPin className="w-3.5 h-3.5 text-orange-400" />
                  {req.region || "지역 미기재"}
                </span>

                {/* 공간 유형 */}
                <span className="flex items-center gap-1 text-gray-600">
                  <Home className="w-3.5 h-3.5 text-orange-400" />
                  {spaceLabel(req.spaceType)}
                </span>

                {/* 예산 */}
                {req.budget && (
                  <span className="hidden sm:inline text-orange-600 font-medium text-xs bg-orange-50 rounded-full px-2 py-0.5">
                    {req.budget}
                  </span>
                )}

                {/* 시간 */}
                <span className="ml-auto flex items-center gap-1 text-gray-400 text-xs shrink-0">
                  <Clock className="w-3 h-3" />
                  {timeAgo(req.createdAt)}
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        <p className="mt-4 text-xs text-gray-400 text-center">
          개인정보 보호를 위해 이름 일부와 공개 가능한 정보만 표시됩니다.
        </p>
      </div>
    </section>
  );
}
