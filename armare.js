function calculeazaArmare() {
  const getValue = id => parseFloat(document.getElementById(id).value);

  // Date geometrice
  const hb = getValue("hb");
  const bb = getValue("bb");
  const a1b = getValue("a1b");
  const a2b = getValue("a2b");
  const fi = getValue("fi"); // mm, se folosește peste tot
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
  const γs = U.gamma_s;
  const fyd = fyk / γs;
  const εcu3 = 0.0035;

  const λ = 0.8;
  const η = 1.0;

  // Calcul d și ds (cm)
  const d = hb - a1b - fi / 2 / 10;
  const ds = hb - (a1b + fi / 2 / 10) - (a2b + fi / 2 / 10);

  // xlim și xmin în mm
  const xlim_mm = (εcu3 / (εcu3 + fyd / Es)) * d * 10;
  const xmin_mm = (εcu3 / (εcu3 - fyd / Es)) * a2b * 10;

  // μ
  const μ = MEd * 1e6 / (bb * 10 * Math.pow(d * 10, 2) * fcd);
  const ξlim = εcu3 / (εcu3 + fyd / Es);
  const μlim = λ * ξlim * (1 - 0.4 * ξlim);

  let z = 0;
  let AsNec_mm2 = 0;
  let mesajArmare = "";
  let mesajZ = "";

  if (μ > μlim) {
    mesajArmare = "⚠ μ ≥ μ<sub>lim</sub> → Mărește secțiunea, clasa betonului sau folosește armare dublă.";
  } else {
    mesajArmare = "✔ μ ≤ μ<sub>lim</sub> → armare simplă.";
    z = 0.5 * d * 10 * (1 + Math.sqrt(1 - 2 * μ));
    if (z > 0.95 * d * 10) {
      z = 0.95 * d * 10;
      mesajZ = "✔ z ≥ 0.95·d → z = 0.95·d·10";
    } else {
      mesajZ = "✔ z ≤ 0.95·d → z = 0.5·d·10·[1 + √(1 - 2μ)]";
    }
    AsNec_mm2 = MEd * 1e6 / (z * fyd);
  }

  const AsMin_mm2 = 0.5 * fctm * bb * 10 * d * 10 / fyk;

  const AsEff_mm2 =
    n1 * Math.PI * Math.pow(fi, 2) / 4 +
    n2 * Math.PI * Math.pow(fi2, 2) / 4;

  let mesajAsMin = "";
  let mesajAsNec = "";
  if (AsEff_mm2 < AsMin_mm2) {
    mesajAsMin = "⚠ A<sub>s,eff</sub> &lt; A<sub>s,min</sub> → Mărește A<sub>s,eff</sub>!";
  } else {
    mesajAsMin = "✔ A<sub>s,eff</sub> ≥ A<sub>s,min</sub>";
  }

  if (AsEff_mm2 < AsNec_mm2) {
    mesajAsNec = "⚠ A<sub>s,eff</sub> &lt; A<sub>s,nec</sub> → Mărește A<sub>s,eff</sub>!";
  } else {
    mesajAsNec = "✔ A<sub>s,eff</sub> ≥ A<sub>s,nec</sub>";
  }

  const MRd_kNm = AsEff_mm2 * fyd * z / 1e6;

  const div = document.getElementById("rezultateArmare");
  div.innerHTML = `
    <p><strong>d</strong> = ${d.toFixed(2)} cm, d = h<sub>b</sub> - a<sub>1b</sub> - Φ / 2 / 10</p>
    <p><strong>d<sub>s</sub></strong> = ${ds.toFixed(2)} cm, d<sub>s</sub> = h<sub>b</sub> - (a<sub>1b</sub> + Φ / 2 / 10) - (a<sub>2b</sub> + Φ / 2 / 10)</p>
    <p><strong>λ</strong> = ${λ}, pentru f<sub>ck</sub> ≤ C50/60</p>
    <p><strong>η</strong> = ${η}, pentru f<sub>ck</sub> ≤ C50/60</p>
    <p><strong>λ·x<sub>lim</sub></strong> = ${xlim_mm.toFixed(2)} mm, ε<sub>cu3</sub> / (ε<sub>cu3</sub> + f<sub>yd</sub> / E<sub>s</sub>) · d · 10</p>
    <p><strong>λ·x<sub>min</sub></strong> = ${xmin_mm.toFixed(2)} mm, ε<sub>cu3</sub> / (ε<sub>cu3</sub> - f<sub>yd</sub> / E<sub>s</sub>) · a<sub>2b</sub> · 10</p>
    <p><strong>μ</strong> = ${μ.toFixed(4)}, μ = M<sub>Ed</sub> · 10<sup>6</sup> / (b · 10 · (d · 10)² · f<sub>cd</sub>)</p>
    <p><strong>μ<sub>lim</sub></strong> = ${μlim.toFixed(4)}, μ<sub>lim</sub> = 0.8 · ξ<sub>lim</sub> · (1 - 0.4 · ξ<sub>lim</sub>)</p>
    <p>${mesajArmare}</p>
    <p><strong>z</strong> = ${z.toFixed(2)} mm, ${mesajZ}</p>
    <p><strong>A<sub>s,nec</sub></strong> = ${AsNec_mm2.toFixed(2)} mm², A<sub>s</sub> = M<sub>Ed</sub> · 10<sup>6</sup> / (z · f<sub>yd</sub>)</p>
    <p><strong>A<sub>s,min</sub></strong> = ${AsMin_mm2.toFixed(2)} mm², 0.5 · f<sub>ctm</sub> · b · 10 · d · 10 / f<sub>yk</sub></p>
    <p><strong>A<sub>s,eff</sub></strong> = ${AsEff_mm2.toFixed(2)} mm², n<sub>1</sub> · π · Φ² / 4 + n<sub>2</sub> · π · Φ<sub>2</sub>² / 4</p>
    <p>${mesajAsMin}</p>
    <p>${mesajAsNec}</p>
    <p><strong>M<sub>Rd</sub><sup>(+)</sup></strong> = ${MRd_kNm.toFixed(2)} kNm, A<sub>s,eff</sub> · f<sub>yd</sub> · z / 10<sup>6</sup></p>
  `;
}
