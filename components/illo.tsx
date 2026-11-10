import { ILLO, type IlloKind } from '@/lib/brand/illustrations';

/** An illustration from the brand pack, drawn in currentColor. */
export function Illo({ kind, className = '', label }: { kind: IlloKind; className?: string; label?: string }) {
  return (
    <svg className={`illo ${className}`} viewBox="0 0 114 114" fill="none" stroke="currentColor" strokeWidth="1" strokeMiterlimit="10"
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })} data-r dangerouslySetInnerHTML={{ __html: ILLO[kind]() }} />
  );
}
