"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { siteConfig } from "./site-config";

export function HeaderVisibility() {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>(".site-header");
    if (!header) return;

    const sync = () => {
      header.classList.toggle("is-hidden", window.scrollY > 1);
    };

    sync();
    window.addEventListener("scroll", sync, { passive: true });
    return () => window.removeEventListener("scroll", sync);
  }, []);

  return null;
}

export function SmsButton({ className, ariaLabel, children }: {
  className?: string; ariaLabel?: string; children: React.ReactNode;
}) {
  return <a className={className} aria-label={ariaLabel} href={siteConfig.smsHref}
    title={`문자 문의 ${siteConfig.phoneDisplay}`}
    data-contact-channel="sms" data-contact-placement="sms-button">{children}</a>;
}

export function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const sync = () => setShowTop(window.scrollY > 1);
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    return () => window.removeEventListener("scroll", sync);
  }, []);

  return (
    <aside className="floating-actions" aria-label="빠른 상담">
      <button
        className={`top-button${showTop ? " is-visible" : ""}`}
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="맨 위로 이동"
      >
        <Image src="/assets/icons/top.png" width={20} height={20} alt="" />
      </button>
      <a className="floating-card" href={siteConfig.phoneHref} data-contact-channel="phone" data-contact-placement="floating">
        <span className="floating-icon main">
          <Image src="/assets/icons/call-white.png" width={20} height={20} alt="" />
        </span>
        <span className="floating-copy">
          <small>클릭 시 전화상담 연결</small>
          <b>전화 문의하기</b>
        </span>
      </a>
      <SmsButton className="floating-card">
        <span className="floating-icon sms">
          <Image src="/assets/icons/sms.svg" width={20} height={20} alt="" />
        </span>
        <span className="floating-copy">
          <small>클릭 시 바로 문의하기</small>
          <b>바로 문의하기</b>
        </span>
      </SmsButton>
    </aside>
  );
}
