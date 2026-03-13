"use client";

import Script from "next/script";

const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID || "";
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";
const NAVER_ID = process.env.NEXT_PUBLIC_NAVER_CONVERSION_ID || "";

export default function TrackingScripts() {
  return (
    <>
      {/* ── GA4 ── */}
      {GA4_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA4_ID}');
            `}
          </Script>
        </>
      )}

      {/* ── Meta Pixel ── */}
      {META_PIXEL_ID && (
        <Script id="meta-pixel-init" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      {/* ── 네이버 전환 스크립트 ── */}
      {NAVER_ID && (
        <>
          <Script
            src="//wcs.naver.net/wcslog.js"
            strategy="afterInteractive"
          />
          <Script id="naver-wcs-init" strategy="afterInteractive">
            {`
              if(!wcs_add) var wcs_add = {};
              wcs_add["wa"] = "${NAVER_ID}";
              if(window.wcs) { wcs_do(); }
            `}
          </Script>
        </>
      )}
    </>
  );
}
