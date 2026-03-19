"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Lightbulb, MessageCircle } from "lucide-react";
import { CompanyProfile } from "@/lib/types";
import ProfileTab from "@/components/company/ProfileTab";
import PortfolioTab from "@/components/company/PortfolioTab";
import SubmissionsTab from "@/components/company/SubmissionsTab";
import ResponsesTab from "@/components/company/ResponsesTab";
import FeedbackModal from "@/components/company/FeedbackModal";

const TABS = ["내 프로필", "포트폴리오", "견적 요청", "내 응답"] as const;
type TabType = (typeof TABS)[number];

export default function CompanyDashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("내 프로필");
  const [modalType, setModalType] = useState<"feedback" | "inquiry" | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/companies/me");
      if (res.status === 401) {
        router.push("/company/login");
        return;
      }
      const data = await res.json();
      if (data.error) {
        router.push("/company/login");
        return;
      }
      setProfile(data);
    } catch {
      router.push("/company/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleLogout = async () => {
    await fetch("/api/companies/login", { method: "DELETE" });
    router.push("/company/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-gray-200 border-t-orange-500" style={{ borderWidth: "3px" }} />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white text-sm font-bold">
              B
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900">{profile.company_name}</h1>
              <p className="text-xs text-gray-400">업체 대시보드</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setModalType("feedback")}
              className="flex items-center gap-1.5 rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600 hover:bg-orange-100 transition-colors"
            >
              <Lightbulb className="h-3.5 w-3.5" />
              피드백
            </button>
            <button
              onClick={() => setModalType("inquiry")}
              className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              문의
            </button>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-50 transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      {/* 탭 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <nav className="flex gap-6 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* 콘텐츠 */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {activeTab === "내 프로필" && <ProfileTab profile={profile} onSave={fetchProfile} />}
        {activeTab === "포트폴리오" && <PortfolioTab />}
        {activeTab === "견적 요청" && <SubmissionsTab />}
        {activeTab === "내 응답" && <ResponsesTab />}
      </main>
      {modalType && (
        <FeedbackModal type={modalType} onClose={() => setModalType(null)} />
      )}
    </div>
  );
}
