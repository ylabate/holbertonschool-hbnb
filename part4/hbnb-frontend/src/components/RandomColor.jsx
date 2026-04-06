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
	const seed = xmur3(`place:${String(uuid)}:gradient:v3`);
	const rand = sfc32(seed(), seed(), seed(), seed());

	const baseHue = Math.floor(rand() * 360);

	// 3 colors within a 60-degree radius (-30 to +30 from baseHue)
	const hueA = hueWrap(baseHue + (rand() * 60 - 30));
	const hueB = hueWrap(baseHue + (rand() * 60 - 30));
	const hueC = hueWrap(baseHue + (rand() * 60 - 30));

	// Random positions for the 3 points
	const xA = Math.floor(rand() * 100);
	const yA = Math.floor(rand() * 100);
	const xB = Math.floor(rand() * 100);
	const yB = Math.floor(rand() * 100);
	const xC = Math.floor(rand() * 100);
	const yC = Math.floor(rand() * 100);

	return {
		backgroundColor: `hsl(${baseHue} 95% 85%)`,
		backgroundImage: `
      radial-gradient(circle at ${xA}% ${yA}%, hsl(${hueA} 90% 65% / 0.8), transparent 60%),
      radial-gradient(circle at ${xB}% ${yB}%, hsl(${hueB} 90% 60% / 0.8), transparent 60%),
      radial-gradient(circle at ${xC}% ${yC}%, hsl(${hueC} 90% 70% / 0.8), transparent 60%)
    `,
		backgroundSize: "cover",
		backgroundPosition: "center",
		animation: "none",
	};
}
