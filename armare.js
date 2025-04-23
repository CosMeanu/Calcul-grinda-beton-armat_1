function calculeazaArmare() {
  const getValue = id => parseFloat(document.getElementById(id).value);

  // Geometrie (cm, mm)
  const hb = getValue("hb");
  const bb = getValue("bb");
  const a1b = getValue("a1b");
  const a2b = getValue("a2b");
  const fi = getValue("fi");       // pentru d, ds
  const fi1 = getValue("fi1");     // Φ1 pentru armare
  const fi2 = getValue("fi2");
  const n1 = getValue("n1");
  const n2 = getValue("n2");
  const MEd = getValue("mEdPlus"); // kNm

  // Materiale
  const beton = betonDB[document.getElementById("clasaBeton").value];
  const otel = otelDB[document.getElementById("marcaOtel").value];

  const fck = beton.fck;
  const fctm = beton.fctm;
  const fcd = fck / 1.5;
  const fyk = otel.fyk;
  const Es = otel.Es;
  const fyd = fyk / U.gamma_s;
  const εcu3 = 0.0035;

  // 1. Calculul d și ds
  const d = hb - a1b - fi / 2 / 10;
  const ds = hb - (a1b + fi / 2 / 10) - (a2b + fi / 2 / 10);

  // 2. Factori
  const λ = 0.8;
  const η = 1.0;

  // 3. Calcul xlim și xmin în mm
  const xlim_mm = (εcu3 / (εcu3 + fyd / Es)) * d * 10;
  const xmin_mm = (εcu3 / (εcu3 - fyd / Es)) * a2b * 10;

  // 4. Coeficient μ și limite
  const μ = MEd * 1e6 / (bb * 10 * Math.pow(d * 10, 2) * fcd);
  const ξlim = εcu3 / (εcu3 + fyd / Es);
  const μlim = λ * ξlim * (1 - 0.4 * ξlim);

  // 5. z și As,nec
  let z, AsNec_mm2, mesajArmare = "", mesajZ = "";

  if (μ > μlim) {
    mesajArmare = "⚠ μ ≥ μ<sub>lim</sub> → armare dublă necesară!";
  } else {
    mesajArmare = "✔ μ ≤ μ<sub>lim</sub> → armare simplă.";
    z = 0.5 * d * 10 * (1 + Math.sqrt(1 - 2 * μ));
    z = z > 0.95 * d * 10 ? 0.95 * d * 10 : z;
    mesajZ = z === 0.95 * d * 10
      ? "z ≥ 0.95·d → z = 0.95·d·10"
      : "z = 0.5·d·10·[1 + √(1 - 2μ)]";
    AsNec_mm2 = MEd * 1e6 / (z * fyd);
  }

  // 6. As,min și As,eff
  const AsMin_mm2 = 0.5 * fctm * bb * 10 * d * 10 / fyk;
  const AsEff_mm2 = n1 * Math.PI * Math.pow(fi1, 2) / 4 + n2 * Math.PI * Math.pow(fi2, 2) / 4;

  const mesajAsMin = AsEff_mm2 >= AsMin_mm2
    ? "✔ A<sub>s,eff</sub> ≥ A<sub>s,min</sub>"
    : "⚠ A<sub>s,eff</sub> &lt; A<sub>s,min</sub> → mărește armarea!";

  const mesajAsNec = AsEff_mm2 >= AsNec_mm2
    ? "✔ A<sub>s,eff</sub> ≥ A<sub>s,nec</sub>"
    : "⚠ A<sub>s,eff</sub> &lt; A<sub>s,nec</sub> → insuficientă pentru M<sub>Ed</sub>!";

  // 7. MRd
  const MRd_kNm = AsEff_mm2 * fyd * z / 1e6;

  // Afișare detaliată
  document.getElementById("rezultateArmare").innerHTML = `
    <p><strong>d</strong> = ${d.toFixed(2)} cm, d = h<sub>b</sub> - a<sub>1b</sub> - Φ / 2 / 10</p>
    <p><strong>d<sub>s</sub></strong> = ${ds.toFixed(2)} cm, d<sub>s</sub> = h<sub>b</sub> - (a<sub>1b</sub> + Φ / 2 / 10) - (a<sub>2b</sub> + Φ / 2 / 10)</p>

    <p><strong>λ</strong> = ${λ}, <strong>η</strong> = ${η}</p>

    <p><strong>x<sub>lim</sub></strong> = ${xlim_mm.toFixed(2)} mm, ε<sub>cu3</sub> / (ε<sub>cu3</sub> + f<sub>yd</sub>/E<sub>s</sub>) · d · 10</p>
    <p><strong>x<sub>min</sub></strong> = ${xmin_mm.toFixed(2)} mm, ε<sub>cu3</sub> / (ε<sub>cu3</sub> - f<sub>yd</sub>/E<sub>s</sub>) · a<sub>2b</sub> · 10</p>

    <p><strong>μ</strong> = ${μ.toFixed(4)}, μ = M<sub>Ed</sub> · 10<sup>6</sup> / (b · 10 · (d · 10)² · f<sub>cd</sub>)</p>
    <p><strong>μ<sub>lim</sub></strong> = ${μlim.toFixed(4)}, μ<sub>lim</sub> = 0.8 · ξ<sub>lim</sub> · (1 - 0.4 · ξ<sub>lim</sub>)</p>
    <p>${mesajArmare}</p>

    ${z ? `<p><strong>z</strong> = ${z.toFixed(2)} mm, ${mesajZ}</p>` : ""}
    ${AsNec_mm2 ? `<p><strong>A<sub>s,nec</sub></strong> = ${AsNec_mm2.toFixed(2)} mm², A = M<sub>Ed</sub> · 10<sup>6</sup> / (z · f<sub>yd</sub>)</p>` : ""}

    <p><strong>A<sub>s,min</sub></strong> = ${AsMin_mm2.toFixed(2)} mm², 0.5 · f<sub>ctm</sub> · b · 10 · d · 10 / f<sub>yk</sub></p>
    <p><strong>A<sub>s,eff</sub></strong> = ${AsEff_mm2.toFixed(2)} mm², n<sub>1</sub> · π · Φ<sub>1</sub>² / 4 + n<sub>2</sub> · π · Φ<sub>2</sub>² / 4</p>

    <p>${mesajAsMin}</p>
    <p>${mesajAsNec}</p>

    <p><strong>M<sub>Rd</sub></strong> = ${MRd_kNm.toFixed(2)} kNm, M = A<sub>s,eff</sub> · f<sub>yd</sub> · z / 10<sup>6</sup></p>
  `;
}
