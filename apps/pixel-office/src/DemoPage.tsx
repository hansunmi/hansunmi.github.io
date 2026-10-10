import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { css } from './lib/css';
import { variant } from './lib/variant';
import { OfficeApp } from './office/OfficeApp';

const backHover = variant({ hover: 'background:#3a362f' });

/** 케이스 스터디 iframe 안에서는 레퍼런스와 동일하게 데모만 보여준다. */
function useEmbedded(): boolean {
  const [embedded, setEmbedded] = useState(true);
  useEffect(() => {
    try {
      setEmbedded(window.self !== window.top);
    } catch {
      setEmbedded(true);
    }
  }, []);
  return embedded;
}

export function DemoPage() {
  const embedded = useEmbedded();

  return (
    <div className="demo-page" style={css`background:#e9e4d8`}>
      <OfficeApp />
      {!embedded && (
        <div style={css`width:1440px;margin:0 auto;padding:14px 0 40px;display:flex;justify-content:center`}>
          <Link
            to="/"
            className={backHover}
            style={css`font-family:Galmuri9,monospace;font-size:11px;padding:8px 14px;border:2px solid #24211c;background:#24211c;color:#f4f1ea;text-decoration:none`}
          >
            ↩ 케이스 스터디로 돌아가기
          </Link>
        </div>
      )}
    </div>
  );
}
