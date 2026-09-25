# scichart-react bundle sizes

- scichart-react version: `2.0.0`
- scichart version: `6.0.1`
- generated: 2026-09-25T09:29:20.807Z

Gzip KB (raw KB) of the JS payload per scenario. Only within-bundler, build-to-build deltas are
authoritative; cross-bundler numbers are indicative (different minifiers/runtimes).

| Scenario | webpack | rollup | esbuild | vite |
|---|---:|---:|---:|---:|
| typesOnly | 0.1 (0.1) | 0.1 (0.0) | 0.1 (0.0) | 0.1 (0.0) |
| reactBaseline | 44.0 (136.6) | 44.2 (138.4) | 44.5 (138.4) | 44.3 (138.4) |
| groupOnly | 44.3 (137.5) | 404.0 (1701.2) | 181.9 (622.9) | 44.6 (139.3) |
| groupOnlyDeepImport | 44.3 (137.5) | 47.1 (146.9) | 44.9 (139.4) | 44.6 (139.3) |
| initChartOnly | 213.4 (788.5) | 762.0 (3260.6) | 221.4 (788.4) | 215.8 (779.8) |
| nestedOverview | 242.2 (922.2) | 763.3 (3264.9) | 249.6 (919.2) | 244.0 (910.3) |
| declarative | 418.8 (1807.9) | 423.8 (1779.2) | 428.4 (1781.8) | 420.9 (1769.1) |
| fullImport | 420.8 (1815.2) | 425.8 (1785.7) | 430.5 (1788.5) | 422.9 (1775.6) |
| cjsRequireBaseline | 513.1 (2633.2) | — | — | — |
