export const clamp = (v: number) => Math.max(0, Math.min(1, v));
export const out = (v: number) => 1 - (1 - clamp(v)) ** 3;
export const mix = (a: number, b: number, p: number) => a + (b-a)*p;
export const arc = (p: number, a: [number, number], b: [number, number], peak: number): [number, number] => [mix(a[0], b[0], p), mix(a[1], b[1], p) - Math.sin(p*Math.PI)*peak];
export const arrivals = [.10, .18, .29, .52, .95, 1.55];
export const flightDuration = (i: number) => .30 + i*.12;
export const cardPosition = (i: number): [number,number] => [416 + (i%3)*162, 852 + Math.floor(i/3)*155];
