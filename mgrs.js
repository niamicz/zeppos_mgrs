export function toMgrs(lat, lon) {
    const zone = Math.floor((lon + 180) / 6) + 1;
    const latBand = "CDEFGHJKLMNPQRSTUVWX"[(Math.floor(lat / 8) + 10)];

    const λ0 = ((zone - 1) * 6 - 180 + 3) * Math.PI / 180;
    const φ = lat * Math.PI / 180;
    const λ = lon * Math.PI / 180;

    const a = 6378137;
    const f = 1 / 298.257223563;
    const k0 = 0.9996;

    const e = Math.sqrt(f * (2 - f));
    const n = f / (2 - f);
    const ν = a / Math.sqrt(1 - e * e * Math.sin(φ) * Math.sin(φ));
    const ρ = ν * (1 - e * e) / (1 - e * e * Math.sin(φ) * Math.sin(φ));
    const η2 = ν / ρ - 1;

    const l = λ - λ0;
    const t = Math.tan(φ);
    const l3coef = 1 - t * t + η2;
    const l5coef = 5 - 18 * t * t + t ** 4 + 14 * η2 - 58 * t * t * η2;
    const l7coef = 61 - 479 * t ** 2 + 179 * t ** 4 - t ** 6;

    const x = k0 * ν * (l + l ** 3 * l3coef / 6 + l ** 5 * l5coef / 120);
    const y = k0 * (meridianArcLength(φ, a, f) + ν * t * (l ** 2 / 2 + l ** 4 * (5 - t ** 2 + 9 * η2 + 4 * η2 ** 2) / 24 + l ** 6 * l7coef / 720));

    const easting = Math.round(500000 + x);
    const northing = Math.round((lat < 0 ? 10000000 : 0) + y);

    return `${zone}${latBand} ${easting} ${northing}`;
}

function meridianArcLength(φ, a, f) {
    const n = f / (2 - f);
    const α = ((a / (1 + n)) *
    (1 + n * n / 4 + n ** 4 / 64));

    const β = (3 * n / 2 - 27 * n ** 3 / 32);
    const γ = (21 * n ** 2 / 16 - 55 * n ** 4 / 32);
    const δ = (151 * n ** 3 / 96);
    const ε = (1097 * n ** 4 / 512);

    return α * (φ + β * Math.sin(2 * φ) + γ * Math.sin(4 * φ) +
    δ * Math.sin(6 * φ) + ε * Math.sin(8 * φ));
}
