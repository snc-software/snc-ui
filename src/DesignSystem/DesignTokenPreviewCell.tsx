import type { DesignTokenEntry } from './designTokens.data';

function ColorSwatch({ label, color }: { label: string; color: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span
        style={{
          display: 'inline-block',
          width: 20,
          height: 20,
          borderRadius: 4,
          border: '1px solid rgba(0,0,0,0.15)',
          backgroundColor: color,
        }}
      />
      <span style={{ fontSize: 12 }}>
        {label} {color}
      </span>
    </span>
  );
}

export default function DesignTokenPreviewCell({ entry }: { entry: DesignTokenEntry }) {
  if (entry.kind === 'font') {
    return <span style={{ fontFamily: entry.value }}>Hello World</span>;
  }

  return (
    <span style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '4px 16px' }}>
      <ColorSwatch label={entry.dark ? 'Light' : ''} color={entry.light} />
      {entry.dark && <ColorSwatch label="Dark" color={entry.dark} />}
    </span>
  );
}
