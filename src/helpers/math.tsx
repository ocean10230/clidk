export const Mathmin = (...args: bigint[]) => args.reduce((min, e) => (e < min ? e : min));

export const Mathmax = (...args: bigint[]) => args.reduce((m, e) => e > m ? e : m);