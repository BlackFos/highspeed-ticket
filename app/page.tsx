import Image from "next/image";
import { assets } from "./asset-registry";
import { siteConfig } from "./site-config";
import { FloatingActions, HeaderVisibility, KakaoButton } from "./interactive";
import { StatusTicker } from "./status-ticker";

const whyItems = [
  { title: "빠른 안내", body: "상담 접수부터 확인까지" },
  { title: "친절한 상담", body: "필요한 내용을 차근차근" },
  { title: "정식 등록", body: "확인 가능한 업체 정보" },
  { title: "안전한 절차", body: "안내된 순서에 따른 상담" },
];

const productDescriptions = [
  "(주)한국문화진흥이 발행하는 상품권",
  "온라인에서 이용 가능한 문화상품권",
  "교통카드 및 편의점 결제 포인트",
  "롯데백화점에서 발행하는 상품권",
  "신세계백화점에서 발행하는 상품권",
  "홈플러스에서 발행하는 상품권",
];

export default function Home() {
  return (
    <>
      <HeaderVisibility />
      <header className="site-header">
        <div className="content-width header-inner">
          <a className="header-brand" href="#top" aria-label={`${siteConfig.name} 홈`}>
            <Image src={assets.brand.mark.src} width={30} height={30} alt="" priority />
            <span>{siteConfig.name}</span>
          </a>
          <Image
            className="naver-search"
            src={assets.brand.search.src}
            width={500}
            height={90}
            alt={assets.brand.search.alt}
            priority
          />
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="content-width hero-inner">
            <div className="hero-brand">
              <span className="hero-mark">
                <Image src={assets.brand.mark.src} width={60} height={60} alt="" priority />
              </span>
              <h1>{siteConfig.name}</h1>
            </div>
            <Image
              className="hero-phone"
              src={assets.common.hero.src}
              width={398}
              height={422}
              alt={assets.common.hero.alt}
              priority
            />
          </div>
        </section>

        <section className="contact-section" aria-label="상담 연결">
          <div className="content-width contact-cards">
            <a className="contact-card phone-card" href={siteConfig.phoneHref}>
              <b>{siteConfig.name} 고객센터</b>
              <strong>전화 문의하기</strong>
              <span>
                <Image src="/assets/icons/call-white.png" width={20} height={20} alt="" />
                클릭 시 전화상담 연결
              </span>
              <small>클릭 시 바로 연결됩니다</small>
            </a>
            <KakaoButton className="contact-card kakao-card">
              <b>🚨 카카오톡 채널 사칭 주의 🚨</b>
              <strong>카카오톡 문의하기</strong>
              <span>
                <Image src="/assets/icons/kakao-dark.png" width={20} height={20} alt="" />
                클릭 시 카톡상담 안내
              </span>
              <small>공식 링크 등록 후 바로 연결됩니다</small>
            </KakaoButton>
          </div>
        </section>

        <section className="section">
          <div className="content-width">
            <h2 className="section-heading">
              <em>{siteConfig.name}</em> 진행 현황
            </h2>
            <div className="status-table">
              <div className="status-head status-row">
                <span>진행품목</span>
                <span className="amount">금액</span>
                <span className="applied">신청시간</span>
                <span className="duration">소요시간</span>
                <span className="status">진행상태</span>
              </div>
              <StatusTicker />
            </div>
          </div>
        </section>

        <section className="section why-section">
          <div className="content-width">
            <p className="eyebrow">WHY?</p>
            <h2 className="section-heading large">
              왜 <em>{siteConfig.name}</em>을 선택해야 할까요?
            </h2>
            <ul className="why-grid">
              {whyItems.map((item, index) => (
                <li key={item.title}>
                  <div>
                    <Image
                      src={assets.why[index].src}
                      width={50}
                      height={50}
                      alt={assets.why[index].alt}
                    />
                    <b>{item.title}</b>
                    <span>{item.body}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section process-section">
          <div className="content-width">
            <p className="eyebrow">HOW?</p>
            <h2 className="section-heading large">
              <em>{siteConfig.name}</em> 이용 절차
            </h2>
            <Image
              className="process-image"
              src={assets.common.process.src}
              width={1368}
              height={1020}
              alt={assets.common.process.alt}
              loading="eager"
            />
            <p className="warning-copy">
              정식등록업체 <em>{siteConfig.name}</em>에서 안내된 절차에 따라 이용하세요!
            </p>
            <p className="warning-note">
              <em>*</em> 허가 여부와 업체 정보를 확인하지 않은 거래는 피해가 발생할 수 있으니 주의해 주세요.
            </p>
          </div>
        </section>

        <section className="section products-section">
          <div className="content-width">
            <h2 className="section-heading large products-title">
              <em>{siteConfig.name}</em> 취급 상품
            </h2>
            <p className="products-subtitle">이 외 상품권과 e-쿠폰은 고객센터에 문의해 주세요!</p>
            <ul className="product-grid">
              {assets.products.map((asset, index) => (
                <li key={asset.id}>
                  <div className="product-image">
                    <Image
                      src={asset.src}
                      width={360}
                      height={180}
                      alt={asset.alt}
                      loading="eager"
                    />
                  </div>
                  <div className="product-copy">
                    <b>{asset.alt}</b>
                    <span>{productDescriptions[index]}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="content-width footer-inner">
          <a className="footer-brand" href="#top">
            <span className="footer-mark">
              <Image src={assets.brand.mark.src} width={50} height={50} alt="" />
            </span>
            {siteConfig.name}
          </a>
          <div className="footer-info">
            <span>
              <b>상호명</b> : {siteConfig.name}
            </span>
            <span>
              <b>상담방법</b> : 전화·카카오톡
            </span>
          </div>
          <div className="footer-support">
            <a href={siteConfig.phoneHref} aria-label={`${siteConfig.name} 전화문의`}>
              <Image src="/assets/icons/call-white.png" width={30} height={28} alt="" />
            </a>
            <KakaoButton ariaLabel={`${siteConfig.name} 카카오톡 문의`}>
              <Image src="/assets/icons/kakao-white.png" width={30} height={28} alt="" />
            </KakaoButton>
          </div>
          <p className="copyright">
            COPYRIGHT . <b>{siteConfig.name}</b> ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>

      <FloatingActions />
      <nav className="mobile-contact" aria-label="모바일 빠른 상담">
        <a href={siteConfig.phoneHref}>
          <Image src="/assets/icons/call-white.png" width={25} height={25} alt="" />
          <span>클릭 시 전화상담 연결</span>
        </a>
        <KakaoButton>
          <Image src="/assets/icons/kakao-dark.png" width={25} height={25} alt="" />
          <span>클릭 시 카톡상담 안내</span>
        </KakaoButton>
      </nav>
    </>
  );
}
