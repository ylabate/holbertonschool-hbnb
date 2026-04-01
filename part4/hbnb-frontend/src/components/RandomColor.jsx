function xmur3(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

function sfc32(a, b, c, d) {
  return () => {
    a >>>= 0;
    b >>>= 0;
    c >>>= 0;
    d >>>= 0;
    const t = (a + b + d) >>> 0;
    d = (d + 1) >>> 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) >>> 0;
    c = ((c << 21) | (c >>> 11)) >>> 0;
    c = (c + t) >>> 0;
    return t / 4294967296;
  };
}

function hueWrap(value) {
  const hue = value % 360;
  return hue < 0 ? hue + 360 : hue;
}

export default function colorFromUuid(uuid) {
  const seed = xmur3(`place:${String(uuid)}:gradient:v2`);
  const rand = sfc32(seed(), seed(), seed(), seed());

  const baseHue = Math.floor(rand() * 360);
  const complementaryHue = hueWrap(baseHue + 180);
  const warmSpread = 12 + rand() * 20;
  const coolSpread = 14 + rand() * 22;

  const hueA = hueWrap(baseHue + warmSpread);
  const hueB = hueWrap(baseHue - warmSpread * 0.9);
  const hueC = hueWrap(complementaryHue + coolSpread);
  const hueD = hueWrap(complementaryHue - coolSpread * 0.85);
  const hueE = hueWrap(baseHue + 35 + rand() * 20);
  const hueF = hueWrap(complementaryHue - 32 - rand() * 18);

  const diagonalIndex = Math.floor(rand() * 4);
  const diagonals = [
    { fromX: 18, fromY: 18, toX: 82, toY: 82, angle: 145 },
    { fromX: 82, fromY: 18, toX: 18, toY: 82, angle: 35 },
    { fromX: 18, fromY: 82, toX: 82, toY: 18, angle: 215 },
    { fromX: 82, fromY: 82, toX: 18, toY: 18, angle: 325 },
  ];
  const selectedDiagonal = diagonals[diagonalIndex];
  const duration = 36 + Math.floor(rand() * 28);
  const phaseOffset = -(rand() * duration);

  return {
    backgroundImage: `
      radial-gradient(circle at 12% 20%, hsl(${hueA} 98% 61% / 0.9), transparent 42%),
      radial-gradient(circle at 85% 18%, hsl(${hueB} 96% 58% / 0.86), transparent 46%),
      radial-gradient(circle at 76% 86%, hsl(${hueC} 94% 56% / 0.84), transparent 48%),
      radial-gradient(circle at 24% 84%, hsl(${hueD} 96% 54% / 0.82), transparent 46%),
      radial-gradient(circle at 52% 52%, hsl(${hueE} 100% 67% / 0.5), transparent 58%),
      linear-gradient(${selectedDiagonal.angle}deg, hsl(${baseHue} 95% 50%), hsl(${hueF} 94% 48%))
    `,
    "--gradient-from-x": `${selectedDiagonal.fromX}%`,
    "--gradient-from-y": `${selectedDiagonal.fromY}%`,
    "--gradient-to-x": `${selectedDiagonal.toX}%`,
    "--gradient-to-y": `${selectedDiagonal.toY}%`,
    "--gradient-drift-duration": `${duration}s`,
    "--gradient-phase-offset": `${phaseOffset}s`,
  };
}
