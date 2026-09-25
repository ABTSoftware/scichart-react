// The initChartOnly code, built with the bundler forced onto the 'require' export condition
// (lib/cjs of both scichart-react and scichart). Reproduces what a "module": "commonjs"
// consumer got before scichart-react 2.0 — the non-tree-shakable control.
import "./initChartOnly";
