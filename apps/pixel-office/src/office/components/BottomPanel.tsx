import { css } from '../../lib/css';
import { variant } from '../../lib/variant';
import type { OfficeView } from '../view';

const paperHover = variant({ hover: 'background:#efe3c8' });
const promptFocus = variant({ focus: 'box-shadow:3px 3px 0 oklch(0.68 0.12 250)' });
const submitActive = variant({ active: 'transform:translate(2px,2px);box-shadow:1px 1px 0 #24211c' });

export function BottomPanel({ vm }: { vm: OfficeView }) {
  return (
    <div style={css`height:250px;flex:none;display:grid;grid-template-columns:340px minmax(0,1fr) 420px;border-top:4px solid #24211c;background:#fbf9f4`}>
      {/* 산출물 서류함 */}
      <div style={css`border-right:3px solid #24211c;display:flex;flex-direction:column;min-height:0;background:${vm.cabinetFlash};transition:background .3s`}>
        <div style={css`display:flex;align-items:center;gap:8px;padding:10px 14px;border-bottom:2px solid #d5cbb4`}>
          <div style={css`font-family:Galmuri11,monospace;font-size:13px;font-weight:700`}>산출물 서류함</div>
          <div style={css`font-family:Galmuri9,monospace;font-size:10px;color:#6b655a`}>{vm.readyCount}/{vm.files.length}</div>
          <div style={css`flex:1`} />
          <button
            type="button"
            onClick={vm.downloadAll}
            disabled={vm.notAllReady}
            style={css`font-family:Galmuri9,monospace;font-size:10px;padding:5px 8px;border:2px solid #24211c;background:${vm.allBtnBg};color:${vm.allBtnFg};cursor:pointer;box-shadow:2px 2px 0 #24211c`}
          >
            전체 ZIP
          </button>
        </div>
        <div style={css`flex:1;overflow:auto;padding:6px 8px;display:flex;flex-direction:column;gap:2px`}>
          {vm.files.map((f) => (
            <div key={f.name} style={css`display:flex;align-items:center;gap:10px;padding:6px 6px;opacity:${f.opacity};transition:opacity .4s`}>
              <div style={css`width:26px;height:30px;flex:none;border:2px solid #24211c;background:${f.color};font-family:Galmuri9,monospace;font-size:8px;display:flex;align-items:flex-end;justify-content:center;padding-bottom:2px`}>{f.ext}</div>
              <div style={css`flex:1;min-width:0;display:flex;flex-direction:column;gap:1px`}>
                <div style={css`font-size:12px;font-weight:600`}>{f.name}</div>
                <div style={css`font-size:10px;color:#6b655a`}>{f.metaText}</div>
              </div>
              <button
                type="button"
                onClick={f.onClick}
                disabled={f.locked}
                className={paperHover}
                style={css`font-family:Galmuri9,monospace;font-size:9px;padding:4px 7px;border:2px solid #24211c;background:#fffdf7;cursor:pointer`}
              >
                {f.action}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CEO 지시서 */}
      <div style={css`display:flex;flex-direction:column;gap:10px;padding:14px 18px;min-width:0`}>
        <div style={css`display:flex;align-items:center;gap:8px`}>
          <div style={css`font-family:Galmuri11,monospace;font-size:13px;font-weight:700`}>CEO 지시서</div>
          <div style={css`font-size:11px;color:#6b655a`}>아이디어나 요구사항 파일을 기획자에게 전달하세요</div>
        </div>
        <textarea
          value={vm.prompt}
          onChange={(e) => vm.onPrompt(e.target.value)}
          disabled={vm.promptLocked}
          placeholder="예: 혼자 사는 직장인을 위한 반려견 산책 메이트 매칭 앱을 만들고 싶어요."
          className={promptFocus}
          style={css`flex:1;resize:none;border:3px solid #24211c;background:#fffdf7;padding:10px 12px;font-family:Pretendard,sans-serif;font-size:14px;line-height:1.5;outline:none;color:#24211c`}
        />
        <div style={css`display:flex;align-items:center;gap:8px;flex-wrap:wrap`}>
          <button
            type="button"
            onClick={vm.attach}
            className={paperHover}
            style={css`font-size:12px;padding:7px 10px;border:2px dashed #24211c;background:transparent;cursor:pointer;display:flex;align-items:center;gap:6px`}
          >
            ＋ 파일 첨부 <span style={css`font-size:10px;color:#6b655a`}>PDF · TXT · 이미지</span>
          </button>
          {vm.attachments.map((t, i) => (
            <div key={`${t.name}-${i}`} style={css`display:flex;align-items:center;gap:6px;font-size:11px;padding:5px 8px;border:2px solid #24211c;background:#efe3c8`}>
              <span style={css`font-family:Galmuri9,monospace;font-size:9px`}>{t.ext}</span>
              {t.name}
              <button type="button" onClick={t.remove} aria-label={`${t.name} 제거`} style={css`border:none;background:none;cursor:pointer;font-size:10px;padding:0`}>✕</button>
            </div>
          ))}
          <div style={css`flex:1`} />
          <button
            type="button"
            onClick={vm.submit}
            className={submitActive}
            style={css`font-family:Galmuri11,monospace;font-size:13px;font-weight:700;padding:9px 18px;border:3px solid #24211c;background:${vm.submitBg};color:#24211c;cursor:pointer;box-shadow:3px 3px 0 #24211c`}
          >
            {vm.submitLabel}
          </button>
        </div>
      </div>

      {/* 에이전트 대화로그 */}
      <div style={css`border-left:3px solid #24211c;display:flex;flex-direction:column;min-height:0`}>
        <div style={css`display:flex;align-items:center;gap:8px;padding:10px 14px;border-bottom:2px solid #d5cbb4`}>
          <div style={css`font-family:Galmuri11,monospace;font-size:13px;font-weight:700`}>에이전트 대화로그</div>
          <div style={css`width:8px;height:8px;background:oklch(0.68 0.14 150);animation:blink 1.2s steps(2) infinite`} />
          <div style={css`font-family:Galmuri9,monospace;font-size:9px;color:#6b655a`}>LIVE</div>
        </div>
        <div style={css`flex:1;overflow:auto;padding:8px 14px;display:flex;flex-direction:column;gap:8px`}>
          {vm.log.map((l, i) => (
            <div key={`${l.time}-${i}`} style={css`display:flex;gap:8px;align-items:flex-start;animation:${l.anim}`}>
              <div style={css`flex:none;font-family:Galmuri9,monospace;font-size:9px;padding:2px 5px;border:1px solid #24211c;background:${l.color};min-width:52px;text-align:center`}>{l.who}</div>
              <div style={css`flex:1;font-size:12px;line-height:1.5;text-wrap:pretty`}>{l.text}</div>
              <div style={css`flex:none;font-family:Galmuri9,monospace;font-size:9px;color:#a9a397`}>{l.time}</div>
            </div>
          ))}
          {vm.logEmpty && (
            <div style={css`font-size:12px;color:#a9a397`}>아직 대화가 없습니다. 지시서를 전달하면 팀이 움직이기 시작합니다.</div>
          )}
        </div>
      </div>
    </div>
  );
}
