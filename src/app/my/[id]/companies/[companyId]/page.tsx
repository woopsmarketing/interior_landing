"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// ──────────── Types ────────────

interface CompanyDetail {
  id: string;
  company_name: string;
  representative_name: string | null;
  business_number: string | null;
  founded_year: number | null;
  employee_count: string | null;
  phone: string | null;
  website_url: string | null;
  instagram_url: string | null;
  blog_url: string | null;
  service_regions: string[];
  specialties: string[];
  preferred_styles: string[];
  min_budget: number | null;
  max_budget: number | null;
  min_area: number | null;
  max_area: number | null;
  total_projects: number;
  years_in_business: number | null;
  certifications: string[];
  warranty_period: string | null;
  warranty_description: string | null;
  introduction: string | null;
  strengths: string[];
  logo_url: string | null;
  main_image_url: string | null;
  intro_video_url: string | null;
}

interface Portfolio {
  id: string;
  title: string;
  description: string | null;
  space_type: string | null;
  style: string | null;
  area: string | null;
  budget: string | null;
  region: string | null;
  duration: string | null;
  image_urls: string[];
}

interface CompanyResponseData {
  message: string | null;
  estimated_price: string | null;
  created_at: string;
}

type TabType = "overview" | "portfolio" | "info";

// ──────────── Helpers ────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ──────────── Sub-components ────────────

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 py-3 px-2">
      <div className="text-orange-500">{icon}</div>
      <span className="text-base font-bold text-gray-900">{value}</span>
      <span className="text-[11px] text-gray-400">{label}</span>
    </div>
  );
}

function ServiceBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-50 min-w-[72px]">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm text-gray-600">
        {icon}
      </div>
      <span className="text-[11px] text-gray-600 font-medium text-center leading-tight">{label}</span>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex py-3.5 border-b border-gray-50 last:border-b-0">
      <span className="text-sm text-gray-400 w-24 shrink-0">{label}</span>
      <span className="text-sm text-gray-800 flex-1">{value}</span>
    </div>
  );
}

function PortfolioGridCard({ portfolio, onClick }: { portfolio: Portfolio; onClick: () => void }) {
  const firstImage = portfolio.image_urls?.[0];
  return (
    <button onClick={onClick} className="text-left group">
      <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 mb-2">
        {firstImage ? (
          <Image
            src={firstImage}
            alt={portfolio.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-300">
            <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
            </svg>
          </div>
        )}
        {portfolio.image_urls?.length > 1 && (
          <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-[10px] text-white">
            <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor"><path d="M2 3h12v8H2V3zm1 1v6h10V4H3zm-1 9h12v1H2v-1z" /></svg>
            {portfolio.image_urls.length}
          </div>
        )}
      </div>
      <h4 className="text-sm font-medium text-gray-800 line-clamp-1 group-hover:text-orange-600 transition-colors">
        {portfolio.title}
      </h4>
      <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-400">
        {portfolio.area && <span>{portfolio.area}</span>}
        {portfolio.area && portfolio.budget && <span>·</span>}
        {portfolio.budget && <span>{portfolio.budget}</span>}
      </div>
    </button>
  );
}

function PortfolioDetail({ portfolio, onClose }: { portfolio: Portfolio; onClose: () => void }) {
  const [currentImage, setCurrentImage] = useState(0);
  const images = portfolio.image_urls || [];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div
        className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image carousel */}
        {images.length > 0 && (
          <div className="relative aspect-video bg-gray-100">
            <Image src={images[currentImage]} alt={portfolio.title} fill className="object-cover" />
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImage((p) => (p > 0 ? p - 1 : images.length - 1))}
                  className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50"
                >
                  <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <button
                  onClick={() => setCurrentImage((p) => (p < images.length - 1 ? p + 1 : 0))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50"
                >
                  <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={`h-1.5 rounded-full transition-all ${i === currentImage ? "w-4 bg-white" : "w-1.5 bg-white/50"}`}
                    />
                  ))}
                </div>
              </>
            )}
            <div className="absolute top-2 right-2 text-xs text-white bg-black/40 rounded-full px-2 py-0.5">
              {currentImage + 1} / {images.length}
            </div>
          </div>
        )}

        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">{portfolio.title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </button>
          </div>

          {portfolio.description && (
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{portfolio.description}</p>
          )}

          <div className="flex flex-wrap gap-2 pt-1">
            {portfolio.space_type && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs text-blue-600">
                <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor"><path d="M3 2v12h10V5.5L9.5 2H3zm1 1h5v3h3v7H4V3z" /></svg>
                {portfolio.space_type}
              </span>
            )}
            {portfolio.style && (
              <span className="rounded-full bg-purple-50 px-2.5 py-1 text-xs text-purple-600">{portfolio.style}</span>
            )}
            {portfolio.area && (
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">{portfolio.area}</span>
            )}
            {portfolio.budget && (
              <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs text-orange-600">{portfolio.budget}</span>
            )}
            {portfolio.region && (
              <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs text-green-600">{portfolio.region}</span>
            )}
            {portfolio.duration && (
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-500">공사기간 {portfolio.duration}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ──────────── Icons ────────────

const icons = {
  building: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
  ),
  calendar: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
    </svg>
  ),
  shield: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </svg>
  ),
  users: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    </svg>
  ),
  star: (
    <svg className="h-4 w-4 fill-amber-400 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
    </svg>
  ),
  // Service icons
  blueprint: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
    </svg>
  ),
  cube3d: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
    </svg>
  ),
  creditCard: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
    </svg>
  ),
  camera: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
    </svg>
  ),
  wrench: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437" />
    </svg>
  ),
  check: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
    </svg>
  ),
  mapPin: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
  ),
  globe: (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
    </svg>
  ),
  instagram: (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path d="M6.5 2A4.5 4.5 0 002 6.5v7A4.5 4.5 0 006.5 18h7a4.5 4.5 0 004.5-4.5v-7A4.5 4.5 0 0013.5 2h-7zM10 6a4 4 0 110 8 4 4 0 010-8zm0 1.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM14.5 5a.75.75 0 110 1.5.75.75 0 010-1.5z" />
    </svg>
  ),
  blog: (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
      <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
    </svg>
  ),
  play: (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm6.39-2.908a.75.75 0 01.766.027l3.5 2.25a.75.75 0 010 1.262l-3.5 2.25A.75.75 0 018 12.25v-4.5a.75.75 0 01.39-.658z" clipRule="evenodd" />
    </svg>
  ),
  sparkle: (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744l.311 1.242 1.243.311a1 1 0 010 1.934l-1.243.311-.311 1.242a1 1 0 01-1.934 0l-.311-1.242-1.243-.311a1 1 0 010-1.934l1.243-.311.311-1.242A1 1 0 0112 2z" clipRule="evenodd" />
    </svg>
  ),
};

// ──────────── Derived service features ────────────

function getServiceFeatures(company: CompanyDetail) {
  const features: { icon: React.ReactNode; label: string }[] = [];

  if (company.specialties?.length > 0) {
    features.push({ icon: icons.wrench, label: company.specialties.length > 2 ? `${company.specialties.slice(0, 2).join("/")} 외` : company.specialties.join("/") });
  }
  if (company.preferred_styles?.length > 0) {
    features.push({ icon: icons.camera, label: "스타일 제안" });
  }
  if (company.certifications?.length > 0) {
    features.push({ icon: icons.check, label: "자격 인증" });
  }
  if (company.warranty_period) {
    features.push({ icon: icons.shield, label: `AS ${company.warranty_period}` });
  }
  if (company.intro_video_url) {
    features.push({ icon: icons.play, label: "소개 영상" });
  }
  if ((company.min_budget || company.max_budget)) {
    features.push({ icon: icons.creditCard, label: "예산 상담" });
  }

  return features;
}

// ──────────── Main Page ────────────

export default function CompanyDetailPage() {
  const params = useParams();
  const submissionId = params.id as string;
  const companyId = params.companyId as string;

  const [company, setCompany] = useState<CompanyDetail | null>(null);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [response, setResponse] = useState<CompanyResponseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [showAllPortfolios, setShowAllPortfolios] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/submissions/${submissionId}/companies/${companyId}`);
        if (res.status === 403) { setError("접근 권한이 없습니다."); return; }
        if (!res.ok) { setError("데이터를 불러올 수 없습니다."); return; }
        const data = await res.json();
        setCompany(data.company);
        setPortfolios(data.portfolios || []);
        setResponse(data.response);
      } catch {
        setError("서버 연결 실패");
      } finally {
        setLoading(false);
      }
    })();
  }, [submissionId, companyId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-orange-200 border-t-orange-500" style={{ borderWidth: "3px" }} />
          <p className="text-sm text-gray-400">업체 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <svg className="h-8 w-8 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-gray-500">{error || "업체 정보를 불러올 수 없습니다."}</p>
          <Link href={`/my/${submissionId}`} className="mt-4 inline-block text-sm text-orange-500 hover:underline">
            돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const serviceFeatures = getServiceFeatures(company);
  const previewPortfolios = portfolios.slice(0, 6);
  const remainingCount = portfolios.length - 6;

  const tabs: { key: TabType; label: string; count?: number }[] = [
    { key: "overview", label: "모두보기" },
    { key: "portfolio", label: "시공사례", count: portfolios.length },
    { key: "info", label: "기본정보" },
  ];

  return (
    <div className="min-h-screen bg-[#FFF9F5]">
      {/* ─── Header ─── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href={`/my/${submissionId}`} className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors shrink-0">
            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold text-gray-900 truncate">{company.company_name}</h1>
            <p className="text-[11px] text-gray-400">업체 상세 정보</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto">
        {/* ─── Company Hero Card ─── */}
        <div className="bg-white px-5 pt-6 pb-5">
          <div className="flex items-start gap-4">
            {/* Logo */}
            {company.logo_url ? (
              <div className="relative w-[72px] h-[72px] shrink-0 rounded-2xl overflow-hidden bg-gray-100 ring-1 ring-gray-100">
                <Image src={company.logo_url} alt="로고" fill className="object-cover" />
              </div>
            ) : (
              <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 text-2xl font-bold text-orange-500 ring-1 ring-orange-100">
                {company.company_name.charAt(0)}
              </div>
            )}

            {/* Name & meta */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-gray-900">{company.company_name}</h2>
                {company.certifications?.length > 0 && (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600">
                    <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor"><path fillRule="evenodd" d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM7.247 7.04a.75.75 0 011.06-.04l1.5 1.393a.75.75 0 01-1.02 1.1L7.5 8.29l-.487.452a.75.75 0 01-1.02-1.1l1.254-1.164v-.438z" clipRule="evenodd" /></svg>
                    인증업체
                  </span>
                )}
              </div>

              {company.representative_name && (
                <p className="text-sm text-gray-500 mt-0.5">대표 {company.representative_name}</p>
              )}

              {/* Quick meta */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-gray-400">
                {company.service_regions?.length > 0 && (
                  <span className="flex items-center gap-1">
                    {icons.mapPin}
                    {company.service_regions.length > 3
                      ? `${company.service_regions.slice(0, 3).join(", ")} 외 ${company.service_regions.length - 3}곳`
                      : company.service_regions.join(", ")}
                  </span>
                )}
                {company.specialties?.length > 0 && (
                  <span>{company.specialties.join(" · ")}</span>
                )}
              </div>
            </div>
          </div>

          {/* ─── Stat Badges ─── */}
          <div className="mt-5 grid grid-cols-4 divide-x divide-gray-100 rounded-2xl bg-gray-50/80 border border-gray-100">
            <StatCard
              icon={icons.building}
              value={company.total_projects > 0 ? `${company.total_projects}건` : "-"}
              label="시공실적"
            />
            <StatCard
              icon={icons.calendar}
              value={company.years_in_business ? `${company.years_in_business}년` : "-"}
              label="업력"
            />
            <StatCard
              icon={icons.users}
              value={company.employee_count || "-"}
              label="직원수"
            />
            <StatCard
              icon={icons.shield}
              value={company.warranty_period || "-"}
              label="AS보증"
            />
          </div>

          {/* ─── Introduction (brief) ─── */}
          {company.introduction && (
            <p className="mt-4 text-sm text-gray-600 leading-relaxed line-clamp-3">
              {company.introduction}
            </p>
          )}
        </div>

        {/* ─── Service Features ─── */}
        {serviceFeatures.length > 0 && (
          <div className="bg-white border-t border-gray-50 px-5 py-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">제공 서비스</h3>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {serviceFeatures.map((f, i) => (
                <ServiceBadge key={i} icon={f.icon} label={f.label} />
              ))}
            </div>
          </div>
        )}

        {/* ─── Tab Navigation ─── */}
        <div className="bg-white border-t border-b border-gray-100 sticky top-[53px] z-30">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-3.5 text-center text-sm font-medium transition-colors relative ${
                  activeTab === tab.key
                    ? "text-orange-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`ml-1 text-xs ${activeTab === tab.key ? "text-orange-400" : "text-gray-300"}`}>
                    {tab.count}
                  </span>
                )}
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-orange-500 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ─── Tab Content ─── */}
        <div className="px-4 py-5 space-y-5">

          {/* ═══════ Overview Tab ═══════ */}
          {activeTab === "overview" && (
            <>
              {/* 견적 응답 */}
              {response && (
                <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-200/60 p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-orange-200/20 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-white">
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
                      </span>
                      <h3 className="text-sm font-bold text-orange-800">이 업체가 보낸 견적</h3>
                    </div>
                    {response.estimated_price && (
                      <p className="text-2xl font-bold text-orange-700 mb-1">{response.estimated_price}</p>
                    )}
                    {response.message && (
                      <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed mt-2">{response.message}</p>
                    )}
                    <p className="text-xs text-orange-400 mt-3">{formatDate(response.created_at)} 응답</p>
                  </div>
                </div>
              )}

              {/* 대표 이미지 */}
              {company.main_image_url && (
                <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                  <div className="relative w-full aspect-[16/9]">
                    <Image src={company.main_image_url} alt="대표 이미지" fill className="object-cover" />
                  </div>
                </div>
              )}

              {/* 소개글 (full) */}
              {company.introduction && (
                <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
                  <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                      {icons.sparkle}
                    </span>
                    업체 소개
                  </h3>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{company.introduction}</p>
                </div>
              )}

              {/* 강점 */}
              {company.strengths?.length > 0 && (
                <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
                  <h3 className="text-sm font-bold text-gray-800 mb-3">이 업체의 강점</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {company.strengths.map((s, i) => (
                      <div key={s} className="flex items-center gap-2 rounded-xl bg-orange-50/60 px-3 py-2.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-white text-[10px] font-bold shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-sm text-gray-700">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 선호 스타일 */}
              {company.preferred_styles?.length > 0 && (
                <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
                  <h3 className="text-sm font-bold text-gray-800 mb-3">전문 스타일</h3>
                  <div className="flex flex-wrap gap-2">
                    {company.preferred_styles.map((s) => (
                      <span key={s} className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100/60 px-3.5 py-1.5 text-sm text-purple-700 font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 시공사례 미리보기 */}
              {portfolios.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-gray-800">시공사례</h3>
                    {portfolios.length > 6 && (
                      <button
                        onClick={() => setActiveTab("portfolio")}
                        className="text-xs text-orange-500 hover:text-orange-600 font-medium"
                      >
                        전체보기 ({portfolios.length})
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {previewPortfolios.map((p) => (
                      <PortfolioGridCard key={p.id} portfolio={p} onClick={() => setSelectedPortfolio(p)} />
                    ))}
                  </div>
                  {remainingCount > 0 && (
                    <button
                      onClick={() => setActiveTab("portfolio")}
                      className="mt-4 w-full py-3 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors font-medium"
                    >
                      시공사례 <span className="text-orange-500 font-bold">{remainingCount}건</span> 더 보기
                    </button>
                  )}
                </div>
              )}

              {/* SNS / 링크 */}
              {(company.website_url || company.instagram_url || company.blog_url || company.intro_video_url) && (
                <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
                  <h3 className="text-sm font-bold text-gray-800 mb-3">관련 링크</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {company.website_url && (
                      <a href={company.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 rounded-xl border border-gray-100 px-3.5 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-200 transition-colors">
                        <span className="text-orange-500">{icons.globe}</span>
                        웹사이트
                        <svg className="h-3 w-3 ml-auto text-gray-300" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 3h8v8M13 3L3 13" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </a>
                    )}
                    {company.instagram_url && (
                      <a href={company.instagram_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 rounded-xl border border-gray-100 px-3.5 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-200 transition-colors">
                        <span className="text-pink-500">{icons.instagram}</span>
                        인스타그램
                        <svg className="h-3 w-3 ml-auto text-gray-300" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 3h8v8M13 3L3 13" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </a>
                    )}
                    {company.blog_url && (
                      <a href={company.blog_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 rounded-xl border border-gray-100 px-3.5 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-200 transition-colors">
                        <span className="text-green-500">{icons.blog}</span>
                        블로그
                        <svg className="h-3 w-3 ml-auto text-gray-300" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 3h8v8M13 3L3 13" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </a>
                    )}
                    {company.intro_video_url && (
                      <a href={company.intro_video_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 rounded-xl border border-gray-100 px-3.5 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-200 transition-colors">
                        <span className="text-red-500">{icons.play}</span>
                        소개 영상
                        <svg className="h-3 w-3 ml-auto text-gray-300" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 3h8v8M13 3L3 13" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* 경력/신뢰 요약 */}
              {(company.certifications?.length > 0 || company.warranty_period) && (
                <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
                  <h3 className="text-sm font-bold text-gray-800 mb-3">신뢰 정보</h3>
                  {company.certifications?.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-400 mb-2">자격증 / 인증</p>
                      <div className="flex flex-wrap gap-1.5">
                        {company.certifications.map((c) => (
                          <span key={c} className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-100 px-2.5 py-1 text-xs text-emerald-700">
                            <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor"><path fillRule="evenodd" d="M12.416 3.376a.75.75 0 01.208 1.04l-5 7.5a.75.75 0 01-1.154.114l-3-3a.75.75 0 011.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 011.04-.207z" clipRule="evenodd" /></svg>
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {company.warranty_period && (
                    <div className="flex items-start gap-3 rounded-xl bg-blue-50/60 p-3.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 shrink-0">
                        {icons.shield}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">AS 보증 {company.warranty_period}</p>
                        {company.warranty_description && (
                          <p className="text-xs text-gray-500 mt-0.5">{company.warranty_description}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* ═══════ Portfolio Tab ═══════ */}
          {activeTab === "portfolio" && (
            <>
              {portfolios.length === 0 ? (
                <div className="text-center py-16">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                    <svg className="h-6 w-6 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-400">아직 등록된 시공사례가 없습니다</p>
                </div>
              ) : (
                <>
                  {/* Portfolio count & info */}
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-500">
                      총 <span className="font-bold text-gray-800">{portfolios.length}건</span>의 시공사례
                    </p>
                  </div>

                  {/* Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    {(showAllPortfolios ? portfolios : portfolios.slice(0, 9)).map((p) => (
                      <PortfolioGridCard key={p.id} portfolio={p} onClick={() => setSelectedPortfolio(p)} />
                    ))}
                  </div>

                  {/* Show more */}
                  {!showAllPortfolios && portfolios.length > 9 && (
                    <button
                      onClick={() => setShowAllPortfolios(true)}
                      className="mt-5 w-full py-3 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors font-medium"
                    >
                      시공사례 <span className="text-orange-500 font-bold">{portfolios.length - 9}건</span> 더 보기
                    </button>
                  )}
                </>
              )}
            </>
          )}

          {/* ═══════ Info Tab ═══════ */}
          {activeTab === "info" && (
            <>
              {/* 기본 정보 테이블 */}
              <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
                <h3 className="text-sm font-bold text-gray-800 mb-1">기본 정보</h3>
                <div className="divide-y divide-gray-50">
                  {company.representative_name && <InfoRow label="대표" value={company.representative_name} />}
                  {company.business_number && <InfoRow label="사업자번호" value={company.business_number} />}
                  {company.phone && <InfoRow label="연락처" value={company.phone} />}
                  {company.founded_year && <InfoRow label="설립" value={`${company.founded_year}년`} />}
                  {company.employee_count && <InfoRow label="직원수" value={company.employee_count} />}
                  {company.years_in_business && <InfoRow label="업력" value={`${company.years_in_business}년`} />}
                  <InfoRow label="총 시공" value={`${company.total_projects}건`} />
                </div>
              </div>

              {/* 서비스 범위 */}
              <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5 space-y-4">
                <h3 className="text-sm font-bold text-gray-800">서비스 범위</h3>

                {company.service_regions?.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-400 mb-2">시공 가능 지역</p>
                    <div className="flex flex-wrap gap-1.5">
                      {company.service_regions.map((r) => (
                        <span key={r} className="rounded-full bg-blue-50 border border-blue-100/60 px-2.5 py-1 text-xs text-blue-700">{r}</span>
                      ))}
                    </div>
                  </div>
                )}

                {company.specialties?.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-400 mb-2">전문 분야</p>
                    <div className="flex flex-wrap gap-1.5">
                      {company.specialties.map((s) => (
                        <span key={s} className="rounded-full bg-purple-50 border border-purple-100/60 px-2.5 py-1 text-xs text-purple-700">{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {company.preferred_styles?.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-400 mb-2">선호 스타일</p>
                    <div className="flex flex-wrap gap-1.5">
                      {company.preferred_styles.map((s) => (
                        <span key={s} className="rounded-full bg-orange-50 border border-orange-100/60 px-2.5 py-1 text-xs text-orange-700">{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {(company.min_budget || company.max_budget) && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1">예산 범위</p>
                    <p className="text-sm font-medium text-gray-800">
                      {company.min_budget ? `${company.min_budget.toLocaleString()}만원` : ""}
                      {company.min_budget && company.max_budget ? " ~ " : ""}
                      {company.max_budget ? `${company.max_budget.toLocaleString()}만원` : ""}
                    </p>
                  </div>
                )}

                {(company.min_area || company.max_area) && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1">시공 가능 면적</p>
                    <p className="text-sm font-medium text-gray-800">
                      {company.min_area ? `${company.min_area}평` : ""}
                      {company.min_area && company.max_area ? " ~ " : ""}
                      {company.max_area ? `${company.max_area}평` : ""}
                    </p>
                  </div>
                )}
              </div>

              {/* 자격/인증 */}
              {company.certifications?.length > 0 && (
                <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
                  <h3 className="text-sm font-bold text-gray-800 mb-3">자격증 / 인증</h3>
                  <div className="space-y-2">
                    {company.certifications.map((c) => (
                      <div key={c} className="flex items-center gap-2.5 py-1">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 shrink-0">
                          <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor"><path fillRule="evenodd" d="M12.416 3.376a.75.75 0 01.208 1.04l-5 7.5a.75.75 0 01-1.154.114l-3-3a.75.75 0 011.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 011.04-.207z" clipRule="evenodd" /></svg>
                        </span>
                        <span className="text-sm text-gray-700">{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AS 보증 */}
              {company.warranty_period && (
                <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
                  <h3 className="text-sm font-bold text-gray-800 mb-3">AS 보증</h3>
                  <div className="flex items-start gap-3 rounded-xl bg-blue-50/60 p-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 shrink-0">
                      {icons.shield}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{company.warranty_period}</p>
                      {company.warranty_description && (
                        <p className="text-sm text-gray-500 mt-1 leading-relaxed">{company.warranty_description}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 강점 */}
              {company.strengths?.length > 0 && (
                <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
                  <h3 className="text-sm font-bold text-gray-800 mb-3">업체 강점</h3>
                  <div className="space-y-2">
                    {company.strengths.map((s, i) => (
                      <div key={s} className="flex items-center gap-3 py-1.5">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-orange-600 text-xs font-bold shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-sm text-gray-700">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SNS / 외부 링크 */}
              {(company.website_url || company.instagram_url || company.blog_url || company.intro_video_url) && (
                <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
                  <h3 className="text-sm font-bold text-gray-800 mb-3">외부 링크</h3>
                  <div className="space-y-2">
                    {company.website_url && (
                      <a href={company.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 py-2 text-sm text-gray-600 hover:text-orange-600 transition-colors">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-orange-500">{icons.globe}</span>
                        <span className="flex-1">웹사이트</span>
                        <svg className="h-4 w-4 text-gray-300" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 3h8v8M13 3L3 13" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </a>
                    )}
                    {company.instagram_url && (
                      <a href={company.instagram_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 py-2 text-sm text-gray-600 hover:text-orange-600 transition-colors">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-pink-500">{icons.instagram}</span>
                        <span className="flex-1">인스타그램</span>
                        <svg className="h-4 w-4 text-gray-300" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 3h8v8M13 3L3 13" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </a>
                    )}
                    {company.blog_url && (
                      <a href={company.blog_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 py-2 text-sm text-gray-600 hover:text-orange-600 transition-colors">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-green-500">{icons.blog}</span>
                        <span className="flex-1">블로그</span>
                        <svg className="h-4 w-4 text-gray-300" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 3h8v8M13 3L3 13" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </a>
                    )}
                    {company.intro_video_url && (
                      <a href={company.intro_video_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 py-2 text-sm text-gray-600 hover:text-orange-600 transition-colors">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-red-500">{icons.play}</span>
                        <span className="flex-1">소개 영상</span>
                        <svg className="h-4 w-4 text-gray-300" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 3h8v8M13 3L3 13" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* ─── Footer ─── */}
        <div className="text-center py-6 border-t border-gray-100 bg-white mt-2">
          <Link href={`/my/${submissionId}`} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            내 견적 요청으로 돌아가기
          </Link>
        </div>
      </main>

      {/* ─── Portfolio Detail Modal ─── */}
      {selectedPortfolio && (
        <PortfolioDetail portfolio={selectedPortfolio} onClose={() => setSelectedPortfolio(null)} />
      )}
    </div>
  );
}
