import { css } from '../../lib/css';
import { variant } from '../../lib/variant';
import type { OfficeView } from '../view';

const darkHover = variant({ hover: 'background:#3a362f' });
const rowHover = variant({ hover: 'background:#efe3c8' });
const removeHover = variant({ hover: 'color:oklch(0.55 0.17 25)' });

export function TopBar({ vm }: { vm: OfficeView }) {
  return (
    <div style={css`height:60px;flex:none;position:relative;z-index:150;display:flex;align-items:center;gap:24px;padding:0 20px;background:#24211c;color:#f4f1ea`}>
      <div style={css`display:flex;align-items:center;gap:10px`}>
        <div style={css`width:22px;height:22px;background:oklch(0.72 0.13 75);box-shadow:inset -4px -4px 0 oklch(0.55 0.13 75)`} />
        <div style={css`font-family:Galmuri11,monospace;font-size:16px;font-weight:700;letter-spacing:.5px`}>픽셀한스</div>
        <div style={css`font-family:Galmuri9,monospace;font-size:10px;color:#a9a397`}>PRODUCT AGENCY</div>
      </div>

      <div style={css`width:2px;height:28px;background:#4a453c`} />

      <div style={css`position:relative;z-index:150`}>
        <button
          type="button"
          onClick={vm.toggleMenu}
          className={darkHover}
          style={css`display:flex;align-items:center;gap:10px;background:transparent;border:2px solid #4a453c;color:#f4f1ea;padding:4px 10px;cursor:pointer;text-align:left;width:250px`}
        >
          <div style={css`display:flex;flex-direction:column;gap:2px;min-width:0;flex:1`}>
            <div style={css`font-family:Galmuri9,monospace;font-size:10px;color:#a9a397`}>{vm.projectKicker}</div>
            <div style={css`font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis`}>{vm.projectName}</div>
          </div>
          <div style={css`font-size:10px;color:#a9a397`}>▾</div>
        </button>

        {vm.menuOpen && (
          <div style={css`position:absolute;left:0;top:50px;width:320px;background:#fffdf7;color:#24211c;border:3px solid #24211c;box-shadow:5px 5px 0 #24211c`}>
            <div style={css`padding:8px 12px;font-family:Galmuri9,monospace;font-size:10px;color:#6b655a;border-bottom:2px solid #d5cbb4`}>진행 중</div>
            <button
              type="button"
              onClick={vm.viewCurrent}
              className={rowHover}
              style={css`width:100%;display:flex;align-items:center;gap:10px;padding:10px 12px;border:none;background:${vm.currentRowBg};cursor:pointer;text-align:left`}
            >
              <div style={css`width:10px;height:10px;flex:none;background:oklch(0.72 0.13 75)`} />
              <div style={css`flex:1;min-width:0;display:flex;flex-direction:column;gap:2px`}>
                <div style={css`font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis`}>{vm.currentName}</div>
                <div style={css`font-size:10px;color:#6b655a`}>{vm.currentMeta}</div>
              </div>
            </button>

            <div style={css`padding:8px 12px;font-family:Galmuri9,monospace;font-size:10px;color:#6b655a;border-top:2px solid #d5cbb4;border-bottom:2px solid #d5cbb4`}>
              프로젝트 히스토리 · {vm.historyCount}
            </div>
            <div style={css`max-height:260px;overflow:auto`}>
              {vm.history.map((h) => (
                <div key={h.id} className={rowHover} style={css`display:flex;align-items:center;background:${h.bg}`}>
                  <button
                    type="button"
                    onClick={h.open}
                    style={css`flex:1;min-width:0;display:flex;align-items:center;gap:10px;padding:10px 12px;border:none;background:transparent;cursor:pointer;text-align:left`}
                  >
                    <div style={css`width:10px;height:10px;flex:none;background:oklch(0.72 0.14 150)`} />
                    <div style={css`flex:1;min-width:0;display:flex;flex-direction:column;gap:2px`}>
                      <div style={css`font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis`}>{h.name}</div>
                      <div style={css`font-size:10px;color:#6b655a`}>{h.date} · 산출물 5종</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={h.remove}
                    className={removeHover}
                    aria-label={`${h.name} 삭제`}
                    style={css`width:28px;height:28px;margin-right:8px;border:none;background:transparent;cursor:pointer;font-size:11px;color:#6b655a`}
                  >
                    ✕
                  </button>
                </div>
              ))}
              {vm.historyEmpty && (
                <div style={css`padding:12px;font-size:12px;color:#a9a397`}>완료된 프로젝트가 여기에 자동 보관됩니다.</div>
              )}
            </div>
          </div>
        )}
      </div>

      <div style={css`flex:1;display:flex;align-items:center;justify-content:center;gap:6px`}>
        {vm.graph.map((g) => (
          <div key={g.label} style={css`display:flex;align-items:center;gap:6px`}>
            <div style={css`font-family:Galmuri9,monospace;font-size:10px;padding:5px 8px;border:2px solid ${g.border};background:${g.bg};color:${g.fg};transition:all .4s`}>{g.label}</div>
            {g.arrow && <div style={css`color:#6b655a;font-size:12px`}>▸</div>}
          </div>
        ))}
      </div>

      <div style={css`display:flex;gap:12px`}>
        {vm.agents.map((a) => (
          <div key={a.id} style={css`display:flex;align-items:center;gap:6px`}>
            <div style={css`width:10px;height:10px;background:${a.color};animation:${a.dotAnim}`} />
            <div style={css`display:flex;flex-direction:column`}>
              <div style={css`font-size:11px;font-weight:600`}>{a.name}</div>
              <div style={css`font-family:Galmuri9,monospace;font-size:9px;color:#a9a397`}>{a.status}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={css`width:2px;height:28px;background:#4a453c`} />

      <div style={css`display:flex;align-items:center;gap:6px`}>
        <button type="button" onClick={vm.prev} className={darkHover} aria-label="이전 단계" style={css`width:28px;height:28px;border:2px solid #6b655a;background:transparent;color:#f4f1ea;cursor:pointer;font-size:11px`}>◀</button>
        <div style={css`font-family:Galmuri9,monospace;font-size:10px;width:86px;text-align:center`}>{vm.stepLabel}</div>
        <button type="button" onClick={vm.next} className={darkHover} aria-label="다음 단계" style={css`width:28px;height:28px;border:2px solid #6b655a;background:transparent;color:#f4f1ea;cursor:pointer;font-size:11px`}>▶</button>
      </div>
    </div>
  );
}
