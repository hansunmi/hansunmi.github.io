import { css } from '../../lib/css';
import { variant } from '../../lib/variant';
import type { PopupView } from '../view';

const outputHover = variant({ hover: 'background:#efe3c8' });

type Props = {
  popup: PopupView;
  onClose: () => void;
};

export function CharacterPopup({ popup, onClose }: Props) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={css`position:absolute;left:${popup.left}px;top:${popup.top}px;width:300px;background:#fffdf7;border:3px solid #24211c;box-shadow:5px 5px 0 #24211c;z-index:90;animation:fadeUp .2s steps(3)`}
    >
      <div style={css`display:flex;align-items:center;gap:10px;padding:10px 12px;background:${popup.color};border-bottom:3px solid #24211c`}>
        <div style={css`width:44px;height:44px;background-color:#fffdf7;border:2px solid #24211c;flex:none;background-image:url(${popup.sprite});background-size:80px 60px;background-position:2px 2px;background-repeat:no-repeat;image-rendering:pixelated`} />
        <div style={css`display:flex;flex-direction:column;gap:1px;flex:1;min-width:0`}>
          <div style={css`display:flex;align-items:center;gap:6px`}>
            <div style={css`font-family:Galmuri11,monospace;font-size:14px;font-weight:700;color:#24211c`}>{popup.name}</div>
            {popup.rank && (
              <div style={css`font-family:Galmuri9,monospace;font-size:9px;padding:1px 5px;background:#24211c;color:#f4f1ea`}>{popup.rank}</div>
            )}
          </div>
          <div style={css`font-family:Galmuri9,monospace;font-size:9px;color:#24211c`}>{popup.en} · {popup.trait}</div>
        </div>
        <button type="button" onClick={onClose} aria-label="닫기" style={css`width:22px;height:22px;border:2px solid #24211c;background:#fffdf7;cursor:pointer;font-size:11px;padding:0`}>✕</button>
      </div>

      <div style={css`padding:12px;display:flex;flex-direction:column;gap:11px`}>
        <div style={css`display:flex;flex-direction:column;gap:5px`}>
          <div style={css`display:flex;align-items:center;gap:8px`}>
            <div style={css`font-family:Galmuri9,monospace;font-size:9px;padding:2px 6px;border:1px solid #24211c;background:${popup.statusBg}`}>{popup.status}</div>
            <div style={css`flex:1`} />
            <div style={css`font-family:Galmuri9,monospace;font-size:10px`}>{popup.progress}%</div>
          </div>
          <div style={css`height:10px;border:2px solid #24211c;background:#f1ece0;padding:1px`}>
            <div style={css`height:100%;width:${popup.progress}%;background-image:repeating-linear-gradient(90deg,${popup.color} 0 6px,transparent 6px 8px);transition:width .6s steps(10)`} />
          </div>
        </div>

        <div style={css`display:flex;flex-direction:column;gap:4px`}>
          <div style={css`font-family:Galmuri9,monospace;font-size:10px;color:#6b655a`}>현재 작업</div>
          <div style={css`font-size:13px;line-height:1.5;font-weight:600`}>{popup.task}</div>
        </div>

        <div style={css`display:flex;flex-direction:column;gap:4px;padding:8px 10px;background:#f1ece0;border:2px dashed #b5ab96`}>
          <div style={css`font-family:Galmuri9,monospace;font-size:10px;color:#6b655a`}>생각 요약</div>
          <div style={css`font-size:12px;line-height:1.55;text-wrap:pretty`}>{popup.thought}</div>
        </div>

        <div style={css`display:flex;flex-direction:column;gap:5px`}>
          <div style={css`font-family:Galmuri9,monospace;font-size:10px;color:#6b655a`}>내 산출물</div>
          {popup.outputs.map((o) => (
            <button
              key={o.name}
              type="button"
              onClick={o.open}
              className={outputHover}
              style={css`display:flex;align-items:center;gap:8px;padding:5px 8px;border:2px solid #24211c;background:#fffdf7;cursor:pointer;text-align:left;font-size:12px`}
            >
              <span style={css`font-family:Galmuri9,monospace;font-size:9px;padding:1px 4px;background:${o.color};border:1px solid #24211c`}>{o.ext}</span>
              <span style={css`flex:1`}>{o.name}</span>
              <span style={css`font-size:10px;color:#6b655a`}>열기 ▸</span>
            </button>
          ))}
          {popup.noOutputs && (
            <div style={css`font-size:11px;color:#a9a397`}>아직 완성된 산출물이 없어요</div>
          )}
        </div>
      </div>
    </div>
  );
}
