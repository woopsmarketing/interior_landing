"use client";

import { useState, useEffect } from "react";
import { CompanyResponse } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function ResponsesTab() {
  const [responses, setResponses] = useState<CompanyResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/companies/responses");
        const data = await res.json();
        setResponses(data.responses || []);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-gray-200 border-t-orange-500" style={{ borderWidth: "3px" }} /></div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-gray-700">내 응답 ({responses.length}건)</h3>
      {responses.length === 0 ? (
        <div className="text-center py-12 text-sm text-gray-400">아직 응답한 견적이 없습니다.</div>
      ) : (
        responses.map((r) => (
          <div key={r.id} className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-400">{formatDate(r.created_at)}</span>
              {r.estimated_price && (
                <span className="rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-600">{r.estimated_price}</span>
              )}
            </div>
            {r.submissions && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {r.submissions.space_type && <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">{r.submissions.space_type}</span>}
                {r.submissions.region && <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">{r.submissions.region}</span>}
                {r.submissions.budget && <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">{r.submissions.budget}</span>}
              </div>
            )}
            {r.message && (
              <p className="text-sm text-gray-600">{r.message}</p>
            )}
          </div>
        ))
      )}
    </div>
  );
}
