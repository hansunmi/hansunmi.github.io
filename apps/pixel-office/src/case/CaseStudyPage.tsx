import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { css } from '../lib/css';
import { variant } from '../lib/variant';
import {
  DECISIONS,
  FLOW,
  HERO_META,
  PROBLEMS,
  RETRO,
  SHOTS,
  SOLUTIONS,
  TABLES,
  TEAM,
} from './data';
import { ImageSlot } from './ImageSlot';

const DEMO_WIDTH = 1440;
const DEMO_HEIGHT = 900;

const sectionHead = css`display:flex;flex-direction:column;gap:14px;max-width:720px`;
const kicker = css`font-family:Galmuri9,monospace;font-size:12px;color:#6b655a;letter-spacing:1px`;
const heading = css`margin:0;font-family:Galmuri11,monospace;font-size:clamp(24px,3vw,34px);line-height:1.35;font-weight:700;text-wrap:balance`;
const lead = css`margin:0;font-size:16px;line-height:1.8;color:#3a362f;text-wrap:pretty`;

const linkReset = variant({ hover: 'color:#24211c' });

export function CaseStudyPage() {
  const wrap = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1120);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const scale = width / DEMO_WIDTH;
  const frameH = Math.round(DEMO_HEIGHT * scale);
  const demoUrl = `${import.meta.env.BASE_URL}#/demo`;

  return (
    <div className="cs-body" style={css`display:flex;flex-direction:column`}>
      {/* NAV (사이트 공통) */}
      <nav className="site-nav">
        <a href="../index.html" className="nav-logo">Hansunmi</a>
        <a href="../index.html#personal" className="back-btn">← Personal</a>
      </nav>

      {/* HERO — 고정 상단 바 높이만큼 위 여백을 더한다 */}
      <header style={css`background-color:#24211c;background-image:linear-gradient(#2e2a24 2px,transparent 2px),linear-gradient(90deg,#2e2a24 2px,transparent 2px);background-size:40px 40px;color:#f4f1ea;padding:140px 24px 0`}>
        <div style={css`max-width:1120px;margin:0 auto;display:flex;flex-direction:column;gap:28px`}>
          <div style={css`display:flex;align-items:center;gap:10px`}>
            <div style={css`width:18px;height:18px;background:oklch(0.72 0.13 75);box-shadow:inset -4px -4px 0 oklch(0.55 0.13 75)`} />
            <div style={css`font-family:Galmuri9,monospace;font-size:12px;letter-spacing:2px;color:#a9a397`}>CASE STUDY · AI AGENT UX</div>
          </div>
          <h1 style={css`margin:0;font-family:Galmuri11,monospace;font-size:clamp(34px,5.4vw,64px);line-height:1.2;font-weight:700;text-wrap:balance`}>
            보이지 않는 AI 작업을,<br />눈에 보이는 사무실로.
          </h1>
          <p style={css`margin:0;max-width:640px;font-size:18px;line-height:1.7;color:#d5cbb4;text-wrap:pretty`}>
            픽셀한스 AI 오피스는 4명의 AI 에이전트가 기획부터 QA까지 협업하는 과정을 픽셀 가상 오피스로 보여주는 서비스 컨셉입니다. 사용자는 CEO가 되어 지시하고, 결재하고, 결과물을 받습니다.
          </p>
          <div style={css`display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:2px;background:#4a453c;border:2px solid #4a453c;margin-top:12px`}>
            {HERO_META.map((m) => (
              <div key={m.k} style={css`background:#24211c;padding:16px 18px;display:flex;flex-direction:column;gap:6px`}>
                <div style={css`font-family:Galmuri9,monospace;font-size:11px;color:#a9a397`}>{m.k}</div>
                <div style={css`font-size:15px`}>{m.v}</div>
              </div>
            ))}
          </div>

          {/* 라이브 데모 임베드 */}
          <div
            ref={wrap}
            style={css`position:relative;width:100%;height:${frameH}px;margin-top:20px;border:4px solid #f4f1ea;border-bottom:none;box-shadow:8px 0 0 oklch(0.72 0.13 75);overflow:hidden;background:#d9d1c0`}
          >
            <iframe
              src={demoUrl}
              title="픽셀한스 AI 오피스 라이브 데모"
              style={css`position:absolute;left:0;top:0;width:${DEMO_WIDTH}px;height:${DEMO_HEIGHT}px;border:0;transform:scale(${scale});transform-origin:0 0`}
            />
          </div>
        </div>
      </header>

      <div style={css`background:#e9e4d8;border-top:4px solid #24211c`}>
        <div style={css`max-width:1120px;margin:0 auto;padding:14px 24px;display:flex;flex-wrap:wrap;align-items:center;gap:12px;justify-content:space-between`}>
          <div style={css`font-size:13px;color:#4a453c`}>위 화면은 실제로 동작하는 데모입니다. "출근하기"를 눌러 직접 체험해 보세요.</div>
          <Link
            to="/demo"
            className={linkReset}
            style={css`font-family:Galmuri11,monospace;font-size:13px;font-weight:700;padding:9px 16px;border:3px solid #24211c;background:oklch(0.82 0.1 75);box-shadow:3px 3px 0 #24211c;text-decoration:none;color:#24211c`}
          >
            전체 화면으로 열기 ↗
          </Link>
        </div>
      </div>

      <main style={css`max-width:1120px;width:100%;margin:0 auto;padding:0 24px;display:flex;flex-direction:column`}>
        {/* 01 PROBLEM */}
        <section style={css`padding:96px 0 0;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:40px 64px`}>
          <div style={css`display:flex;flex-direction:column;gap:14px`}>
            <div style={kicker}>01 · PROBLEM</div>
            <h2 style={heading}>AI 에이전트는 일을 하는데, 사용자는 기다릴 뿐이다</h2>
          </div>
          <div style={css`display:flex;flex-direction:column;gap:18px;font-size:16px;line-height:1.8;color:#3a362f`}>
            <p style={css`margin:0;text-wrap:pretty`}>
              멀티 에이전트 시스템은 여러 AI가 역할을 나눠 긴 작업을 처리합니다. 하지만 대부분의 인터페이스는 로딩 스피너와 텍스트 로그뿐이라, 지금 누가 무엇을 하는지, 언제 개입해야 하는지 알기 어렵습니다.
            </p>
            <div style={css`display:flex;flex-direction:column;gap:2px;background:#24211c;border:2px solid #24211c`}>
              {PROBLEMS.map((p) => (
                <div key={p.k} style={css`background:#fffdf7;padding:14px 16px;display:flex;gap:14px`}>
                  <span style={css`font-family:Galmuri9,monospace;font-size:11px;color:#6b655a;padding-top:4px`}>{p.k}</span>
                  <span>{p.v}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 02 SOLUTION */}
        <section style={css`padding:96px 0 0;display:flex;flex-direction:column;gap:36px`}>
          <div style={sectionHead}>
            <div style={kicker}>02 · SOLUTION</div>
            <h2 style={heading}>누구나 아는 '회사'라는 은유를 빌렸다</h2>
            <p style={lead}>사무실에서 직원이 자리를 옮기고, 회의하고, 보고하는 모습은 설명 없이도 읽힙니다. AI의 상태 전이를 이 익숙한 장면에 하나씩 대응시켰습니다.</p>
          </div>
          <div style={css`display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:20px`}>
            {SOLUTIONS.map((s) => (
              <div key={s.title} style={css`border:3px solid #24211c;background:#fffdf7;box-shadow:5px 5px 0 ${s.shadow};display:flex;flex-direction:column`}>
                <div style={css`padding:14px 18px;border-bottom:3px solid #24211c;background:${s.head};font-family:Galmuri11,monospace;font-size:15px;font-weight:700`}>{s.title}</div>
                <div style={css`padding:16px 18px;font-size:14px;line-height:1.7;color:#3a362f;text-wrap:pretty`}>{s.body}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 03 CHARACTERS */}
        <section style={css`padding:96px 0 0;display:flex;flex-direction:column;gap:32px`}>
          <div style={sectionHead}>
            <div style={kicker}>03 · CHARACTERS</div>
            <h2 style={heading}>역할마다 성격과 색을 부여했다</h2>
            <p style={lead}>각 에이전트에 고유 색을 정해 캐릭터, 이름표, 로그, 산출물 아이콘까지 같은 색으로 묶었습니다. 로그만 훑어도 누가 말했는지 바로 구분됩니다.</p>
          </div>
          <div style={css`display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:2px;background:#24211c;border:3px solid #24211c`}>
            {TEAM.map((t) => (
              <div key={t.en} style={css`background:#fffdf7;padding:20px;display:flex;flex-direction:column;gap:10px`}>
                <div style={css`width:28px;height:28px;background:${t.color};border:2px solid #24211c`} />
                <div style={css`display:flex;align-items:center;gap:8px`}>
                  <div style={css`font-family:Galmuri11,monospace;font-size:17px;font-weight:700`}>{t.name}</div>
                  <div style={css`font-family:Galmuri9,monospace;font-size:10px;color:#6b655a`}>{t.en}</div>
                </div>
                <div style={css`font-size:14px;line-height:1.6;color:#3a362f;text-wrap:pretty`}>{t.role}</div>
                <div style={css`font-family:Galmuri9,monospace;font-size:10px;padding:3px 7px;border:1px solid #24211c;align-self:flex-start`}>{t.trait}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 04 FLOW */}
        <section style={css`padding:96px 0 0;display:flex;flex-direction:column;gap:32px`}>
          <div style={sectionHead}>
            <div style={kicker}>04 · FLOW</div>
            <h2 style={heading}>8단계, 그리고 두 번의 결재</h2>
          </div>
          <div style={css`display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:12px`}>
            {FLOW.map((f) => (
              <div key={f.n} style={css`border:3px solid #24211c;background:${f.bg};padding:16px 18px;display:flex;flex-direction:column;gap:8px`}>
                <div style={css`display:flex;align-items:center;gap:8px`}>
                  <div style={css`font-family:Galmuri11,monospace;font-size:20px;font-weight:700`}>{f.n}</div>
                  <div style={css`flex:1`} />
                  <div style={css`font-family:Galmuri9,monospace;font-size:10px;padding:2px 6px;background:#24211c;color:#f4f1ea`}>{f.tag}</div>
                </div>
                <div style={css`font-family:Galmuri11,monospace;font-size:14px;font-weight:700`}>{f.t}</div>
                <div style={css`font-size:13px;line-height:1.6;color:#3a362f;text-wrap:pretty`}>{f.d}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 05 KEY SCREENS */}
        <section style={css`padding:96px 0 0;display:flex;flex-direction:column;gap:32px`}>
          <div style={sectionHead}>
            <div style={kicker}>05 · KEY SCREENS</div>
            <h2 style={heading}>주요 화면</h2>
          </div>
          <div style={css`display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,460px),1fr));gap:36px 28px`}>
            {SHOTS.map((s) => (
              <figure key={s.file} style={css`margin:0;display:flex;flex-direction:column;gap:12px`}>
                <div style={css`aspect-ratio:16/10;border:3px solid #24211c;box-shadow:5px 5px 0 #b5ab96;background:#fffdf7;overflow:hidden`}>
                  <ImageSlot file={s.file} placeholder={s.ph} />
                </div>
                <figcaption style={css`display:flex;flex-direction:column;gap:4px`}>
                  <div style={css`font-family:Galmuri11,monospace;font-size:15px;font-weight:700`}>{s.t}</div>
                  <div style={css`font-size:14px;line-height:1.65;color:#4a453c;text-wrap:pretty`}>{s.d}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* 06 DESIGN DECISIONS */}
        <section style={css`padding:96px 0 0;display:flex;flex-direction:column;gap:32px`}>
          <div style={sectionHead}>
            <div style={kicker}>06 · DESIGN DECISIONS</div>
            <h2 style={heading}>고민했던 지점들</h2>
          </div>
          <div style={css`display:flex;flex-direction:column;border-top:3px solid #24211c`}>
            {DECISIONS.map((d) => (
              <div key={d.n} style={css`display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:12px 48px;padding:28px 0;border-bottom:2px solid #d5cbb4`}>
                <div style={css`display:flex;gap:14px;align-items:baseline`}>
                  <div style={css`font-family:Galmuri9,monospace;font-size:12px;color:#6b655a`}>{d.n}</div>
                  <div style={css`font-family:Galmuri11,monospace;font-size:17px;font-weight:700;line-height:1.45;text-wrap:balance`}>{d.q}</div>
                </div>
                <div style={css`font-size:15px;line-height:1.75;color:#3a362f;text-wrap:pretty`}>{d.a}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 07 BEYOND THE DEMO */}
        <section style={css`padding:96px 0 0;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr));gap:40px 64px;align-items:start`}>
          <div style={css`display:flex;flex-direction:column;gap:14px`}>
            <div style={kicker}>07 · BEYOND THE DEMO</div>
            <h2 style={heading}>실제 서비스가 된다면</h2>
            <p style={lead}>데모는 미리 짠 시나리오로 동작하지만, 화면은 실제 연동을 전제로 설계했습니다. 단계는 에이전트 워크플로의 상태 이름(IDEATION → SPEC_DRAFT → DEV_FEASIBILITY → QA)과 1:1로 맞췄고, 서버가 상태를 보내면 캐릭터 이동과 결재 모달이 따라오는 구조입니다.</p>
          </div>
          <div style={css`display:flex;flex-direction:column;gap:12px`}>
            <div style={css`font-family:Galmuri9,monospace;font-size:11px;color:#6b655a`}>DATA MODEL</div>
            <div style={css`display:grid;grid-template-columns:1fr 1fr;gap:12px`}>
              {TABLES.map((tb) => (
                <div key={tb.name} style={css`border:3px solid #24211c;background:#fffdf7`}>
                  <div style={css`padding:8px 12px;background:#24211c;color:#f4f1ea;font-family:Galmuri11,monospace;font-size:13px;font-weight:700`}>{tb.name}</div>
                  <div style={css`padding:10px 12px;display:flex;flex-direction:column;gap:4px`}>
                    {tb.cols.map((c) => (
                      <div key={c} style={css`font-family:Galmuri9,monospace;font-size:11px;color:#3a362f`}>{c}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div style={css`font-size:13px;line-height:1.6;color:#6b655a`}>프로젝트 1개에 로그 · 결재 · 산출물이 N개씩 연결됩니다.</div>
          </div>
        </section>

        {/* 08 RETROSPECTIVE */}
        <section style={css`padding:96px 0 120px;display:flex;flex-direction:column;gap:28px`}>
          <div style={sectionHead}>
            <div style={kicker}>08 · RETROSPECTIVE</div>
            <h2 style={heading}>배운 것</h2>
          </div>
          <div style={css`display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:20px`}>
            {RETRO.map((r) => (
              <div key={r.t} style={css`border-top:4px solid #24211c;padding-top:16px;display:flex;flex-direction:column;gap:8px`}>
                <div style={css`font-family:Galmuri11,monospace;font-size:15px;font-weight:700`}>{r.t}</div>
                <div style={css`font-size:14px;line-height:1.7;color:#3a362f;text-wrap:pretty`}>{r.d}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer style={css`background:#24211c;color:#a9a397;padding:28px 24px`}>
        <div style={css`max-width:1120px;margin:0 auto;display:flex;flex-wrap:wrap;gap:12px;justify-content:space-between;align-items:center`}>
          <div style={css`font-family:Galmuri11,monospace;font-size:13px;color:#f4f1ea`}>픽셀한스 AI 오피스</div>
          <Link to="/demo" style={css`font-family:Galmuri9,monospace;font-size:12px;color:#f4f1ea`}>데모 열기 ↗</Link>
        </div>
      </footer>
    </div>
  );
}
