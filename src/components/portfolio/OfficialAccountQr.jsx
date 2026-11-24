'use client';
import { useId } from 'react';

// Render the original code as a luminance mask: no generated or redrawn modules.
export default function OfficialAccountQr({ src }) {
  const id = useId().replaceAll(':', '');
  return <a href={src} target="_blank" rel="noreferrer" className="official-account-qr-link" aria-label="打开公众号原始二维码大图" title="点击查看原始二维码大图">
    <svg viewBox="0 0 258 258" role="img" aria-label="微信公众号二维码，亮橙色透明背景" width="108" height="108">
      <defs>
        <filter id={`qr-invert-${id}`} colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="-.2126 -.7152 -.0722 0 1  -.2126 -.7152 -.0722 0 1  -.2126 -.7152 -.0722 0 1  0 0 0 1 0" />
        </filter>
        <mask id={`qr-mask-${id}`} maskUnits="userSpaceOnUse" x="0" y="0" width="258" height="258" style={{ maskType: 'luminance' }}>
          <image href={src} width="258" height="258" filter={`url(#qr-invert-${id})`} />
        </mask>
      </defs>
      <rect width="258" height="258" fill="#ffb16c" mask={`url(#qr-mask-${id})`} />
    </svg>
  </a>;
}
