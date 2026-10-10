import { css } from '../../lib/css';
import { variant } from '../../lib/variant';
import type { OfficeView } from '../view';

const reviseHover = variant({ hover: 'background:#f1ece0' });
const approveHover = variant({ hover: 'background:oklch(0.66 0.14 150)' });

type Props = {
  modal: NonNullable<OfficeView['modal']>;
  memo: string;
  onMemo: (value: string) => void;
  onRevise: () => void;
  onApprove: () => void;
};

export function ApprovalModal({ modal, memo, onMemo, onRevise, onApprove }: Props) {
  return (
    <div style={css`position:absolute;inset:0;background:rgba(36,33,28,.55);display:flex;align-items:center;justify-content:center;z-index:200`}>
      <div style={css`width:620px;background:#fffdf7;border:4px solid #24211c;box-shadow:8px 8px 0 #24211c;animation:fadeUp .3s steps(4)`}>
        <div style={css`display:flex;align-items:center;gap:10px;padding:12px 16px;background:oklch(0.82 0.1 75);border-bottom:4px solid #24211c`}>
          <div style={css`font-family:Galmuri9,monospace;font-size:10px;padding:3px 6px;background:#24211c;color:#f4f1ea`}>결재 요청</div>
          <div style={css`font-family:Galmuri11,monospace;font-size:16px;font-weight:700`}>{modal.title}</div>
          <div style={css`flex:1`} />
          <div style={css`font-size:11px`}>보고 · {modal.from}</div>
        </div>

        <div style={css`padding:18px 20px;display:flex;flex-direction:column;gap:14px`}>
          <div style={css`font-size:14px;line-height:1.6;text-wrap:pretty`}>{modal.summary}</div>
          <div style={css`display:grid;grid-template-columns:1fr 1fr;gap:10px`}>
            {modal.items.map((m) => (
              <div key={m.k} style={css`border:2px solid #24211c;padding:10px 12px;display:flex;flex-direction:column;gap:4px`}>
                <div style={css`font-family:Galmuri9,monospace;font-size:10px;color:#6b655a`}>{m.k}</div>
                <div style={css`font-size:13px;line-height:1.5;text-wrap:pretty`}>{m.v}</div>
              </div>
            ))}
          </div>
          <div style={css`display:flex;flex-direction:column;gap:6px`}>
            <div style={css`font-family:Galmuri9,monospace;font-size:10px;color:#6b655a`}>보완 요청 메모 (선택)</div>
            <input
              value={memo}
              onChange={(e) => onMemo(e.target.value)}
              placeholder="수정 요청 시 기획자에게 전달할 내용"
              style={css`border:2px solid #24211c;padding:9px 10px;font-family:Pretendard,sans-serif;font-size:13px;background:#fbf9f4;outline:none`}
            />
          </div>
        </div>

        <div style={css`display:flex;gap:10px;justify-content:flex-end;padding:14px 20px;border-top:2px solid #d5cbb4`}>
          <button type="button" onClick={onRevise} className={reviseHover} style={css`font-family:Galmuri11,monospace;font-size:13px;padding:10px 18px;border:3px solid #24211c;background:#fffdf7;cursor:pointer;box-shadow:3px 3px 0 #24211c`}>수정 요청</button>
          <button type="button" onClick={onApprove} className={approveHover} style={css`font-family:Galmuri11,monospace;font-size:13px;font-weight:700;padding:10px 18px;border:3px solid #24211c;background:oklch(0.72 0.14 150);cursor:pointer;box-shadow:3px 3px 0 #24211c`}>승인 및 진행</button>
        </div>
      </div>
    </div>
  );
}
