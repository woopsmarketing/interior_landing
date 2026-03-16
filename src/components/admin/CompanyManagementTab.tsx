"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminCompany } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function CompanyManagementTab() {
  const [companies, setCompanies] = useState<AdminCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const url = filter === "all"
        ? "/api/admin/companies"
        : `/api/admin/companies?status=${filter}`;
      const res = await fetch(url);
      const data = await res.json();
      setCompanies(data.companies || []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleStatusChange = async (id: string, status: string) => {
    setUpdating(id);
    try {
      await fetch(`/api/admin/companies/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchCompanies();
    } catch {
      /* ignore */
    } finally {
      setUpdating(null);
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-600">승인</span>;
      case "rejected":
        return <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-500">거절</span>;
      default:
        return <span className="rounded-full bg-yellow-50 px-2.5 py-0.5 text-xs font-medium text-yellow-600">대기</span>;
    }
  };

  const filters = [
    { value: "all", label: "전체" },
    { value: "pending", label: "대기중" },
    { value: "approved", label: "승인" },
    { value: "rejected", label: "거절" },
  ];

  return (
    <div>
      {/* 필터 */}
      <div className="flex gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              filter === f.value
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-gray-200 border-t-orange-500" style={{ borderWidth: "3px" }} />
        </div>
      ) : companies.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-sm text-gray-400">등록된 업체가 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {companies.map((c) => (
            <div
              key={c.id}
              className="rounded-xl bg-white border border-gray-200 p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50 text-sm font-bold text-orange-500">
                    {c.company_name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">{c.company_name}</span>
                      {statusBadge(c.status)}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-400">
                      <span>{c.email}</span>
                      {c.phone && (
                        <>
                          <span>·</span>
                          <span>{c.phone}</span>
                        </>
                      )}
                      <span>·</span>
                      <span>{formatDate(c.created_at, true)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {c.status !== "approved" && (
                    <button
                      onClick={() => handleStatusChange(c.id, "approved")}
                      disabled={updating === c.id}
                      className="rounded-lg bg-green-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-600 disabled:opacity-40 transition-colors"
                    >
                      승인
                    </button>
                  )}
                  {c.status !== "rejected" && (
                    <button
                      onClick={() => handleStatusChange(c.id, "rejected")}
                      disabled={updating === c.id}
                      className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600 disabled:opacity-40 transition-colors"
                    >
                      거절
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
