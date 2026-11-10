import { ILLO, flowWide, type IlloKind } from '@/lib/brand/illustrations';

/** An illustration from the brand pack, drawn in currentColor. */
export function Illo({ kind, className = '', label }: { kind: IlloKind; className?: string; label?: string }) {
  return (
    <svg className={`illo ${className}`} viewBox="0 0 114 114" fill="none" stroke="currentColor" strokeWidth="1" strokeMiterlimit="10"
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })} data-r dangerouslySetInnerHTML={{ __html: ILLO[kind]() }} />
  );
}

/** The flow illustration as a full-width band. */
export function FlowBand({ className = '' }: { className?: string }) {
  return <svg className={`illo ${className}`} viewBox="0 0 1140 114" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true" data-r dangerouslySetInnerHTML={{ __html: flowWide(1140) }} />;
}
