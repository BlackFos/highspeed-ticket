import Script from "next/script";
import tracking from "../content/tracking.json";
import { createTrackingScript } from "./tracking-script";

export function GoogleAds() {
  return <>
    <Script id="google-ads-contact-init" strategy="afterInteractive">{createTrackingScript(tracking)}</Script>
    <Script id="google-ads-loader" src={`https://www.googletagmanager.com/gtag/js?id=${tracking.googleAdsId}`} strategy="afterInteractive" />
  </>;
}
