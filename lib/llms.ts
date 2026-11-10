// llms.txt (llmstxt.org): a plain-text map of the site for AI assistants and answer engines.
// Built only from the verbatim website copy; llms-full.txt carries every page's full text.
import { HOME, MANUFACTURING as M, TECHNOLOGY as T, ABOUT as A, TAGLINE } from './copy';
import { PAGES, url, NAME } from './seo';

export function llmsIndex() {
  const pages = Object.values(PAGES).map((p) => `- [${p.label}](${url(p.path)}): ${p.description}`).join('\n');
  return `# ${NAME}

> ${TAGLINE} ${HOME.hero.sub}

${HOME.hero.body.join('\n\n')}

## Pages

${pages}

## Full text

- [All page copy](${url('/llms-full.txt')}): the complete text of every page in one file
`;
}

const sec = (h: string, ...paras: (string | string[])[]) => `### ${h}\n\n${paras.flat().join('\n\n')}`;

export function llmsFull() {
  const b = HOME.businesses;
  return [
    `# ${NAME}\n\n> ${TAGLINE}`,
    `## Home (${url('/')})`,
    sec(HOME.hero.title.join(' '), HOME.hero.sub, HOME.hero.body),
    sec(HOME.approach.title, HOME.approach.body),
    sec(b.title, `**${b.manufacturing.title}.** ${b.manufacturing.body.join(' ')}`, `**${b.intelligence.title}.** ${b.intelligence.body.join(' ')}`, b.together),
    sec(HOME.start.title, HOME.start.body),
    sec(HOME.build.title, HOME.build.body),
    `## Manufacturing (${url('/manufacturing')})`,
    sec(M.hero.title.join(' '), M.hero.body),
    ...M.blocks.map((x) => sec(x.eyebrow ? `${x.eyebrow}: ${x.title}` : x.title, x.body)),
    sec(M.evolve.title, M.evolve.body),
    `## Technology (${url('/technology')})`,
    sec(T.hero.title.join(' '), T.hero.sub, T.hero.body),
    sec(T.today.title, T.today.body, T.today.note),
    sec(T.next.title, T.next.body),
    sec(T.going.title, T.going.body),
    `## About (${url('/about')})`,
    sec(A.hero.title.join(' '), A.hero.body),
    sec('Vision: ' + A.vision.title.join(' '), A.vision.body, A.vision.destination),
    sec('Contact', A.contact.body),
  ].join('\n\n') + '\n';
}
