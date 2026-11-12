// 小念 × 爸爸的问答都要守的规矩，和 bodyverse 的 tests/dialogue-rules.mjs 一样。
//   node tools/dialogue-rules.mjs            检查全部主题
//   node tools/dialogue-rules.mjs bike-highway
import { readdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import geo from '../src/map/geo.json' with { type: 'json' };

const stations = new Set(geo.stations.map((s) => s.name));
const areas = new Set(geo.areas.filter((a) => a.ours).map((a) => a.name));

// 只由这些字组成的两字词说明不了话题
const filler = new Set('的了吗呢吧呀啊哦嘛是我你他她它们这那就也都还又在有和么什怎为个一不没会要说想看能可以得很太好真再');

function topicWords(line) {
  const words = new Set();
  const chars = [...line];
  for (let i = 0; i < chars.length - 1; i += 1) {
    const [a, b] = [chars[i], chars[i + 1]];
    if (!/\p{Script=Han}/u.test(a) || !/\p{Script=Han}/u.test(b)) continue;
    if (filler.has(a) || filler.has(b)) continue;
    words.add(a + b);
  }
  return words;
}

const sharedWords = (question, answer) => [...topicWords(question)].filter((w) => answer.includes(w));

function cites(turn) {
  const s = turn.show;
  const inner = s?.stops ?? s?.marks ?? (s?.kind === 'streets' || s?.kind === 'stations' ? s.items : []);
  return [...(turn.cite ?? []), ...inner.flatMap((x) => x.cite ?? [])];
}

export function articleProblems(topic, article) {
  const problems = [];
  const say = (m) => problems.push(`${topic.id}/${article.id}: ${m}`);
  const turns = article.dialogue;
  if (!turns) return problems;
  if (!/？/.test(article.title)) say('title must be a question with ？');
  if (!article.trigger) say('needs a trigger');
  if (!article.parentTip) say('needs a parentTip');
  if (turns.length < 5 || turns.length > 8) say(`needs 5–8 turns, has ${turns.length}`);
  const known = new Set(topic.sources.map((s) => s.id));
  turns.forEach((turn, i) => {
    const last = i === turns.length - 1;
    if (!turn.nian || !turn.dad) say(`turn ${i + 1} needs both lines`);
    if (!last && !/？/.test(turn.nian)) say(`turn ${i + 1}: 小念 should ask a question with ？`);
    if (last && !/^(我懂了|我明白了)/.test(turn.nian)) say('last turn: 小念 sums up, starting with 我懂了/我明白了');
    if (i > 0 && sharedWords(turn.nian, turns[i - 1].dad).length === 0) say(`turn ${i + 1}: 小念's question must pick up a word from 爸爸's previous answer`);
    if (turn.dad.length < 20 || turn.dad.length > 170) say(`turn ${i + 1}: 爸爸's answer is ${turn.dad.length} chars (20–170)`);
    if (turn.show?.kind === 'steps' && turn.show.frames.length < 2) say(`turn ${i + 1}: steps need 2+ frames`);
    for (const id of cites(turn)) if (!known.has(id)) say(`turn ${i + 1}: unknown source ${id}`);
    const s = turn.show;
    if (s?.kind === 'stations') for (const it of s.items) if (!stations.has(it.name)) say(`turn ${i + 1}: no station ${it.name} on the map`);
    if (s?.kind === 'streets') for (const it of s.items) if (!areas.has(it.name)) say(`turn ${i + 1}: no area ${it.name} on the map`);
    if (s?.kind === 'ruler' && s.marks.some((m, k) => k > 0 && m.at <= s.marks[k - 1].at)) say(`turn ${i + 1}: ruler marks must go up`);
  });
  return problems;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const root = new URL('../src/topics/', import.meta.url);
  const only = process.argv.slice(2);
  const ids = readdirSync(root, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)
    .filter((id) => !only.length || only.includes(id));
  let total = 0;
  let checked = 0;
  for (const id of ids) {
    const { default: topic } = await import(new URL(`${id}/topic.ts`, root).href);
    for (const article of topic.articles) {
      if (article.dialogue) checked += 1;
      for (const p of articleProblems(topic, article)) { total += 1; console.log(p); }
    }
  }
  console.log(total ? `${total} problem(s)` : `all ${checked} dialogues pass`);
  process.exitCode = total ? 1 : 0;
}
