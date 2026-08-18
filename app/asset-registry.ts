export type AssetEntry = {
  id: string;
  src: string;
  alt: string;
  role: string;
  source: "ticket-bora-reference" | "highspeed-ticket-original";
  replaceable: boolean;
};

export const assets = {
  brand: {
    mark: {
      id: "brand-mark",
      src: "/assets/brand/highspeed-ticket-mark.svg",
      alt: "고속티켓",
      role: "header, hero, footer brand mark",
      source: "highspeed-ticket-original",
      replaceable: true,
    },
    search: {
      id: "naver-search",
      src: "/assets/brand/highspeed-ticket-search.svg",
      alt: "네이버에서 고속티켓을 검색하세요",
      role: "header search banner",
      source: "highspeed-ticket-original",
      replaceable: true,
    },
    kakaoQr: {
      id: "kakao-qr",
      src: "/assets/brand/highspeed-ticket-kakao-qr.png",
      alt: "고속티켓 카카오톡 상담 QR",
      role: "kakao consultation QR",
      source: "highspeed-ticket-original",
      replaceable: true,
    },
  },
  common: {
    hero: {
      id: "hero-phone",
      src: "/assets/common/highspeed-hero-v1.png",
      alt: "",
      role: "hero illustration",
      source: "highspeed-ticket-original",
      replaceable: true,
    },
    process: {
      id: "process-steps",
      src: "/assets/common/process-steps-highspeed.png",
      alt: "전화 또는 카카오 상담, 상품권 매입 및 결제 진행, 확인 후 입금 순서",
      role: "process guide",
      source: "ticket-bora-reference",
      replaceable: true,
    },
  },
  why: [
    ["why-speed", "/assets/icons/why-speed-highspeed.png", "빠른 안내"],
    ["why-service", "/assets/icons/why-service-highspeed.png", "친절한 상담"],
    ["why-registered", "/assets/icons/why-registered-highspeed.png", "정식 등록"],
    ["why-safe", "/assets/icons/why-safe-highspeed.png", "안전한 절차"],
  ].map(([id, src, alt]) => ({
    id,
    src,
    alt,
    role: "why icon",
    source: "ticket-bora-reference" as const,
    replaceable: true,
  })),
  products: [
    ["cultureland", "/assets/products/cultureland.jpg", "컬쳐랜드 상품권"],
    ["happy-money", "/assets/products/happy-money.jpg", "온라인 문화상품권"],
    ["tmoney", "/assets/products/tmoney.jpg", "티머니"],
    ["lotte", "/assets/products/lotte.jpg", "롯데백화점 상품권"],
    ["shinsegae", "/assets/products/shinsegae.jpg", "신세계 상품권"],
    ["homeplus", "/assets/products/homeplus.png", "홈플러스 상품권"],
  ].map(([id, src, alt]) => ({
    id,
    src,
    alt,
    role: "product card image",
    source: "ticket-bora-reference" as const,
    replaceable: true,
  })),
} satisfies Record<string, AssetEntry | AssetEntry[] | Record<string, AssetEntry>>;
