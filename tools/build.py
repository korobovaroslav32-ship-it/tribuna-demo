#!/usr/bin/env python3
"""Сборка «Трибуны»: python3 tools/build.py
Берёт src/head.html, src/body.html, src/script.js и content/baza.json.
Пишет index.html (страница для GitHub Pages), dist/artifact.html (фрагмент для артефакта Claude)
и content/baza.md (читаемая версия базы)."""
import json, re, pathlib
R = pathlib.Path(__file__).resolve().parent.parent
d = json.loads((R/'content/baza.json').read_text(encoding='utf-8'))
# проверки базы
ids, S = set(), d['sources']
for c in d['courses']:
    assert str(c['id']) in d['status'], f"нет статуса у курса {c['id']}"
    for l in c['lessons']:
        assert l['id'] not in ids, f"повтор id урока {l['id']}"; ids.add(l['id'])
        if l.get('q'):
            assert 0 <= l['r'] < len(l['o']), f"неверный ответ в уроке {l['id']}"
            for k in l.get('src', []): assert k in S, f"нет источника {k} (урок {l['id']})"
js = (R/'src/script.js').read_text(encoding='utf-8')
js = re.sub(r"/\*@baza:start\*/.*?/\*@baza:end\*/", lambda m: "/*@baza:start*/const BAZA=" + json.dumps(d, ensure_ascii=False) + ";/*@baza:end*/", js, flags=re.S)
frag = (R/'src/head.html').read_text(encoding='utf-8') + (R/'src/body.html').read_text(encoding='utf-8') + "<script>\n" + js + "\n</script>\n"
(R/'dist').mkdir(exist_ok=True)
(R/'dist/artifact.html').write_text(frag, encoding='utf-8')
(R/'index.html').write_text('<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body style="margin:0">' + frag + '</body></html>', encoding='utf-8')
st = {0: 'черновик', 1: 'на согласовании', 2: 'утверждён'}
out = ["# Обучающая база «Трибуны»", "", f"Версия {d['version']}. Тексты — пересказ своими словами, не перевод. Перед запуском каждый урок проверяет эксперт.", ""]
for c in d['courses']:
    out += [f"## {c['t']}", "", f"{c['about']} Статус: {st[d['status'][str(c['id'])]]}. По материалам: {c['basis']}.", ""]
    for l in c['lessons']:
        out += [f"### {l['t']} ({l['min']} мин)", ""] + [p + "\n" for p in l.get('body', [l.get('text', '')])]
        if l.get('points'): out += ["**Главное:**", ""] + [f"- {x}" for x in l['points']] + [""]
        if l.get('q'): out += [f"**Проверка:** {l['q']}", ""] + [f"{i+1}. {o}{' ✓' if i == l['r'] else ''}" for i, o in enumerate(l['o'])] + [""]
        if l.get('home'): out += ["**Обсудите дома:**", ""] + [f"- {x}" for x in l['home']] + [""]
        if l.get('src'): out += ["Источники: " + "; ".join(f"[{S[k][0]}]({S[k][1]})" for k in l['src']), ""]
(R/'content/baza.md').write_text("\n".join(out), encoding='utf-8')
print(f"Собрано: {len(d['courses'])} курсов, {len(ids)} уроков")
