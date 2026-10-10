import { css } from '../../lib/css';
import { variant } from '../../lib/variant';
import type { OfficeView, PreviewView } from '../view';

const paperHover = variant({ hover: 'background:#efe3c8' });
const downloadActive = variant({ active: 'transform:translate(2px,2px);box-shadow:1px 1px 0 #24211c' });

type Props = {
  pv: PreviewView;
  projectName: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onDownload: OfficeView['pvDownload'];
};

export function FilePreview({ pv, projectName, onClose, onPrev, onNext, onDownload }: Props) {
  return (
    <div onClick={onClose} style={css`position:absolute;inset:0;background:rgba(36,33,28,.55);display:flex;align-items:center;justify-content:center;z-index:210`}>
      <div onClick={(e) => e.stopPropagation()} style={css`width:800px;background:#fffdf7;border:4px solid #24211c;box-shadow:8px 8px 0 #24211c;animation:fadeUp .25s steps(4)`}>
        <div style={css`display:flex;align-items:center;gap:10px;padding:12px 16px;background:${pv.color};border-bottom:4px solid #24211c`}>
          <div style={css`font-family:Galmuri9,monospace;font-size:10px;padding:3px 6px;background:#24211c;color:#f4f1ea`}>{pv.ext}</div>
          <div style={css`font-family:Galmuri11,monospace;font-size:16px;font-weight:700`}>{pv.name}</div>
          <div style={css`flex:1`} />
          <button type="button" onClick={onClose} aria-label="닫기" style={css`width:26px;height:26px;border:2px solid #24211c;background:#fffdf7;cursor:pointer;font-size:12px;padding:0`}>✕</button>
        </div>

        <div style={css`display:grid;grid-template-columns:400px minmax(0,1fr);gap:20px;padding:20px`}>
          <div style={css`height:420px;background:#e9e4d8;border:2px solid #24211c;padding:16px;display:flex;justify-content:center;overflow:hidden`}>
            {pv.isDoc && (
              <div style={css`width:300px;background:#fffdf7;border:2px solid #24211c;box-shadow:4px 4px 0 #b5ab96;padding:20px 20px;display:flex;flex-direction:column;gap:7px;overflow:hidden`}>
                <div style={css`font-family:Galmuri9,monospace;font-size:8px;color:#6b655a`}>PIXELHANS · {projectName}</div>
                <div style={css`font-family:Galmuri11,monospace;font-size:14px;font-weight:700;padding-bottom:6px;border-bottom:2px solid #24211c`}>{pv.name}</div>
                {pv.lines.map((ln) => (
                  <div key={ln.h} style={css`display:flex;flex-direction:column;gap:3px`}>
                    <div style={css`font-size:10px;font-weight:700;margin-top:4px`}>{ln.h}</div>
                    <div style={css`font-size:9px;line-height:1.5;color:#4a453c`}>{ln.p}</div>
                  </div>
                ))}
              </div>
            )}
            {pv.isImg && (
              <div style={css`width:100%;display:grid;grid-template-columns:repeat(3,1fr);gap:10px;align-content:start`}>
                {pv.shots.map((sh) => (
                  <div key={sh} style={css`display:flex;flex-direction:column;gap:4px`}>
                    <div style={css`height:150px;border:2px solid #24211c;background:#fffdf7 repeating-linear-gradient(135deg,transparent 0 6px,#efe8da 6px 8px);display:flex;align-items:flex-start;justify-content:center;padding-top:8px`}>
                      <div style={css`width:30px;height:4px;background:#24211c`} />
                    </div>
                    <div style={css`font-size:10px;text-align:center`}>{sh}</div>
                  </div>
                ))}
              </div>
            )}
            {pv.isCode && (
              <div style={css`width:100%;background:#24211c;color:#d5cbb4;border:2px solid #24211c;padding:14px;font-family:Galmuri9,monospace;font-size:11px;line-height:1.9;display:flex;flex-direction:column`}>
                {pv.tree.map((tr) => (
                  <div key={tr} style={css`white-space:pre`}>{tr}</div>
                ))}
              </div>
            )}
          </div>

          <div style={css`display:flex;flex-direction:column;gap:14px`}>
            <div style={css`display:grid;grid-template-columns:auto 1fr;gap:6px 14px;font-size:12px`}>
              <div style={css`color:#6b655a`}>작성</div><div style={css`font-weight:600`}>{pv.owner}</div>
              <div style={css`color:#6b655a`}>분량</div><div>{pv.meta}</div>
              <div style={css`color:#6b655a`}>프로젝트</div><div>{projectName}</div>
            </div>
            <div style={css`display:flex;flex-direction:column;gap:6px`}>
              <div style={css`font-family:Galmuri9,monospace;font-size:10px;color:#6b655a`}>구성</div>
              {pv.toc.map((tc) => (
                <div key={tc.n} style={css`display:flex;gap:8px;align-items:baseline;font-size:12px;padding:5px 0;border-bottom:1px dashed #d5cbb4`}>
                  <span style={css`font-family:Galmuri9,monospace;font-size:9px;color:#6b655a;width:18px`}>{tc.n}</span>
                  <span>{tc.t}</span>
                </div>
              ))}
            </div>
            <div style={css`flex:1`} />
            <div style={css`display:flex;gap:8px`}>
              <button type="button" onClick={onPrev} className={paperHover} aria-label="이전 산출물" style={css`font-family:Galmuri9,monospace;font-size:11px;padding:9px 12px;border:2px solid #24211c;background:#fffdf7;cursor:pointer`}>◀</button>
              <button type="button" onClick={onNext} className={paperHover} aria-label="다음 산출물" style={css`font-family:Galmuri9,monospace;font-size:11px;padding:9px 12px;border:2px solid #24211c;background:#fffdf7;cursor:pointer`}>▶</button>
              <div style={css`flex:1`} />
              <button type="button" onClick={onDownload} className={downloadActive} style={css`font-family:Galmuri11,monospace;font-size:13px;font-weight:700;padding:9px 16px;border:3px solid #24211c;background:oklch(0.72 0.14 150);cursor:pointer;box-shadow:3px 3px 0 #24211c`}>다운로드</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
