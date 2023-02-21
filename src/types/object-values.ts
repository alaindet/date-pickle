// Thanks to Matt Pocock's video "Enums considered harmful"
// https://www.youtube.com/watch?v=jjMbPt_H3RQ
export type ObjectValues<T> = T[keyof T];
