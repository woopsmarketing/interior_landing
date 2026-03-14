// 전환 추적 유틸리티 — GA4 + Meta Pixel + 네이버 전환 스크립트

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    wcs?: { cnv: (type: string, value: string) => void };
    _nasa?: Record<string, string>;
  }
}

const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID || "";
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";
const NAVER_ID = process.env.NEXT_PUBLIC_NAVER_CONVERSION_ID || "";

// ── UTM 파라미터 캡처 ──

export function captureUtmParams(): void {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
  utmKeys.forEach((key) => {
    const value = params.get(key);
    if (value) sessionStorage.setItem(key, value);
  });
}

function getUtmData(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const data: Record<string, string> = {};
  ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach((key) => {
    const value = sessionStorage.getItem(key);
    if (value) data[key] = value;
  });
  return data;
}

// ── GA4 이벤트 ──

function sendGA4(eventName: string, params?: Record<string, unknown>): void {
  if (!GA4_ID || !window.gtag) return;
  window.gtag("event", eventName, { ...params, ...getUtmData() });
}

// ── Meta Pixel 이벤트 ──

function sendMeta(eventName: string, params?: Record<string, unknown>): void {
  if (!META_PIXEL_ID || !window.fbq) return;
  window.fbq("track", eventName, params);
}

// ── 네이버 전환 ──

function sendNaver(type: string, value: string): void {
  if (!NAVER_ID || !window.wcs) return;
  window.wcs.cnv(type, value);
}

// ── 공개 이벤트 함수 ──

export function trackFormStart(): void {
  sendGA4("form_start");
  sendMeta("InitiateCheckout");
}

export function trackStepComplete(step: number): void {
  sendGA4("form_step_complete", { step });
  sendMeta("CustomEvent", { step });
}

export function trackFormSubmit(): void {
  sendGA4("form_submit", { conversion: true });
  sendMeta("Lead");
  sendNaver("1", "0");
}

export function trackAIImageGenerated(): void {
  sendGA4("ai_image_generated");
  sendMeta("ViewContent", { content_name: "ai_interior_image" });
}
