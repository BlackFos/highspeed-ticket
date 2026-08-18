import type { CSSProperties } from "react";
import { transactionRows } from "./site-config";

export function StatusTicker() {
  return (
    <>
      <div className="status-body" aria-label="최근 상담 진행 예시">
        <div className="status-track is-moving" data-motion="css">
          {[0, 1].map((groupIndex) => (
            <div
              className="status-group"
              key={groupIndex}
              aria-hidden={groupIndex === 1 ? true : undefined}
              role={groupIndex === 0 ? "list" : undefined}
            >
              {transactionRows.map((row, rowIndex) => (
                <div
                  className="status-row"
                  key={`${groupIndex}-${rowIndex}`}
                  role={groupIndex === 0 ? "listitem" : undefined}
                  style={{ "--status-order": Math.min(rowIndex, 9) } as CSSProperties}
                >
                  <span className="item-name">
                    <strong>
                      {row.name} [{row.product}]
                    </strong>
                    <small className="mobile-applied">신청 {row.applied.slice(5)}</small>
                  </span>
                  <span className="amount">{row.amount}</span>
                  <span className="applied">{row.applied}</span>
                  <span className="duration">{row.duration}</span>
                  <span className="status">
                    <b className="status-pill">입금완료</b>
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <p className="status-notice">
        표시된 내용은 상담 흐름을 설명하기 위한 마스킹 예시입니다.
      </p>
    </>
  );
}
