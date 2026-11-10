'use client';
// Contact form. Delivery is configured at build time, nothing is hard-coded:
//   NEXT_PUBLIC_CONTACT_ENDPOINT  POST JSON to a form service (Formspree, Basin, own API)
//   NEXT_PUBLIC_CONTACT_EMAIL     otherwise, open the visitor's mail app addressed here
import { useEffect, useState } from 'react';
import { ABOUT } from '@/lib/copy';
import { Arrow } from './ui';

const ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT || '';
const EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || '';

export function ContactForm() {
  const [topic, setTopic] = useState(ABOUT.contact.topics[0]);
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  useEffect(() => {
    const t = new URLSearchParams(location.search).get('topic');
    const m = ABOUT.contact.topics.find((x) => x.toLowerCase().startsWith((t || '').toLowerCase()));
    if (t && m) setTopic(m);
  }, []);
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    if (ENDPOINT) {
      setState('sending');
      try { const r = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(d) }); setState(r.ok ? 'sent' : 'error'); }
      catch { setState('error'); }
    } else if (EMAIL) {
      const body = `${d.message}\n\n${d.name}\n${d.organisation}\n${d.email}`;
      location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(d.topic + ' · ' + d.organisation)}&body=${encodeURIComponent(body)}`;
      setState('sent');
    } else setState('error');
  };
  if (state === 'sent') return <div className="form-done" role="status"><span className="tag">Sent</span><p className="h-3">Thank you. Mustard Bio will be in touch.</p></div>;
  return (
    <form className="form" onSubmit={submit}>
      <fieldset className="topics">
        <legend className="k">Topic</legend>
        {ABOUT.contact.topics.map((t) => (
          <label key={t} className={topic === t ? 'on' : undefined}><input type="radio" name="topic" value={t} checked={topic === t} onChange={() => setTopic(t)} />{t}</label>
        ))}
      </fieldset>
      <div className="f2">
        <label><span className="k">Name</span><input name="name" required autoComplete="name" /></label>
        <label><span className="k">Organisation</span><input name="organisation" required autoComplete="organization" /></label>
      </div>
      <label><span className="k">Email</span><input name="email" type="email" required autoComplete="email" /></label>
      <label><span className="k">Message</span><textarea name="message" rows={5} required /></label>
      <button className="btn btn-dark" type="submit" disabled={state === 'sending'}><span className="btn-l">{state === 'sending' ? 'Sending…' : 'Send'}</span><span className="btn-a"><Arrow /></span></button>
      {state === 'error' && <p className="form-err" role="alert">{ENDPOINT || EMAIL ? 'Something went wrong. Please try again.' : 'The contact form is not connected yet.'}</p>}
    </form>
  );
}
