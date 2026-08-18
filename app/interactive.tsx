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

export function KakaoButton({
  className,
  ariaLabel,
  children,
}: {
  className?: string;
  ariaLabel?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  if (siteConfig.kakaoUrl) {
    return (
      <a className={className} href={siteConfig.kakaoUrl} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }

  return (
    <>
      <button
        aria-label={ariaLabel}
        className={className}
        type="button"
        onClick={() => setOpen(true)}
      >
        {children}
      </button>
      {open ? (
        <div className="modal-backdrop">
          <section
            aria-labelledby="kakao-modal-title"
            aria-modal="true"
            className="kakao-modal"
            role="dialog"
          >
            <button className="modal-close" type="button" onClick={() => setOpen(false)} aria-label="닫기">
              ×
            </button>
            <Image
              src="/assets/brand/highspeed-ticket-mark.svg"
              width={72}
              height={72}
              alt=""
            />
            <h2 id="kakao-modal-title">고속티켓 카카오톡 상담</h2>
            <p>상담 링크 등록을 준비하고 있습니다.</p>
            <p className="modal-note">현재는 전화 상담을 이용해 주세요.</p>
            <a className="modal-phone" href={siteConfig.phoneHref}>
              전화상담 바로 연결
            </a>
          </section>
        </div>
      ) : null}
    </>
  );
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
      <a className="floating-card" href={siteConfig.phoneHref}>
        <span className="floating-icon main">
          <Image src="/assets/icons/call-white.png" width={20} height={20} alt="" />
        </span>
        <span className="floating-copy">
          <small>클릭 시 전화상담 연결</small>
          <b>전화 문의하기</b>
        </span>
      </a>
      <KakaoButton className="floating-card">
        <span className="floating-icon kakao">
          <Image src="/assets/icons/kakao-dark.png" width={20} height={20} alt="" />
        </span>
        <span className="floating-copy">
          <small>클릭 시 카톡상담 안내</small>
          <b>고속티켓 상담</b>
        </span>
      </KakaoButton>
    </aside>
  );
}
