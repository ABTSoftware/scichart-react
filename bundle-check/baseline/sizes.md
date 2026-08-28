# scichart-react bundle sizes

- scichart-react version: `2.0.0-beta.0`
- scichart version: `6.0.0-alpha.162`
- generated: 2026-08-27T13:30:09.606Z

Gzip KB (raw KB) of the JS payload per scenario. Only within-bundler, build-to-build deltas are
authoritative; cross-bundler numbers are indicative (different minifiers/runtimes).

| Scenario | webpack | rollup | esbuild | vite |
|---|---:|---:|---:|---:|
| typesOnly | 0.1 (0.1) | 0.1 (0.0) | 0.1 (0.0) | 0.1 (0.0) |
| reactBaseline | 44.0 (136.6) | 44.2 (138.4) | 44.5 (138.4) | 44.3 (138.4) |
| groupOnly | 44.3 (137.5) | 399.5 (1683.7) | 181.0 (619.4) | 44.6 (139.3) |
| groupOnlyDeepImport | 44.3 (137.5) | 47.1 (146.9) | 44.9 (139.4) | 44.6 (139.3) |
| initChartOnly | 209.8 (773.0) | 752.9 (3225.4) | 217.7 (773.2) | 212.3 (764.8) |
| nestedOverview | 238.5 (906.4) | 754.1 (3229.7) | 245.7 (903.8) | 240.3 (895.1) |
| declarative | 413.9 (1788.1) | 419.2 (1761.6) | 423.5 (1763.5) | 416.3 (1751.3) |
| fullImport | 415.8 (1795.5) | 421.2 (1768.0) | 425.6 (1770.2) | 418.3 (1757.8) |
| cjsRequireBaseline | 516.1 (2650.2) | — | — | — |
