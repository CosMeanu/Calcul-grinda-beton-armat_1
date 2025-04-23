function calculeazaArmare() {
  const getValue = id => parseFloat(document.getElementById(id).value);

  const hb = getValue("hb");
  const bb = getValue("bb");
  const a1b = getValue("a1b");
  const a2b = getValue("a2b");

  const fi = getValue("fi");       // doar pentru calcul geometrie
  const fi1 = getValue("fi1");     // armare Φ1
  const fi2 = getValue("fi2");     // armare Φ2
  const n1 = getValue("n1");
  const n2 = getValue("n2");
  const MEd = getValue("mEdPlus");

  const beton = betonDB[document.getElementById("clasaBeton").value];
  const otel = otelDB[document.getElementById("marcaOtel").value];

  const fck = beton.fck;
  const fctm = beton.fctm;
  const fcd = fck / 1.5;
  const fyk = otel.fyk;
  const Es = otel.Es;
  const fyd = fyk / U.gamma_s;
  const εcu3 = 0.0035;

  const d = hb - a1b - fi / 2 / 10;
  const ds = hb - (a1b + fi / 2 / 10) - (a2b + fi / 2 / 10);

  const λ = 0.8;
  const η = 1.0;

  const xlim_mm = (εcu3 / (εcu3 + fyd / Es)) * d * 10;
  const xmin_mm = (εcu3 / (εcu3 - fyd / Es)) * a2b * 10;

  const μ = MEd * 1e6 / (bb * 10 * Math.pow(d * 10, 2) * fcd);
  const ξlim = εcu3 / (εcu3 + fyd / Es);
  const μlim = λ * ξlim * (1 - 0.4 * ξlim);

  let z, AsNec_mm2, mesajArmare = "", mesajZ = "";

  if (μ > μlim) {
    mesajArmare = "⚠ μ ≥ μ<sub>lim</sub> → armare dublă necesară!";
  } else {
    mesajArmare = "✔ μ ≤ μ<sub>lim</sub> → armare simplă.";
    z = 0.5 * d * 10 * (1 + Math.sqrt(1 - 2 * μ));
    z = z > 0.95 * d * 10 ? 0.95 * d * 10 : z;
    mesajZ = `z = ${z.toFixed(2)} mm`;
    AsNec_mm2 = MEd * 1e6 / (z * fyd);
  }

  const AsMin_mm2 = 0.5 * fctm * bb * 10 * d * 10 / fyk;
  const AsEff_mm2 = n1 * Math.PI * Math.pow(fi1, 2) / 4 + n2 * Math.PI * Math.pow(fi2, 2) / 4;

  const mesajAsMin = AsEff_mm2 >= AsMin_mm2 ? "✔ As,eff ≥ As,min" : "⚠ Mărește As,eff ≥ As,min!";
  const mesajAsNec = AsEff_mm2 >= AsNec_mm2 ? "✔ As,eff ≥ As,nec" : "⚠ Mărește As,eff ≥ As,nec!";

  const MRd_kNm = AsEff_mm2 * fyd * z / 1e6;

  document.getElementById("rezultateArmare").innerHTML = `
    <p><strong>d</strong> = ${d.toFixed(2)} cm</p>
    <p><strong>d<sub>s</sub></strong> = ${ds.toFixed(2)} cm</p>
    <p><strong>λ</strong> = ${λ}, <strong>η</strong> = ${η}</p>
    <p>x<sub>lim</sub> = ${xlim_mm.toFixed(2)} mm</p>
    <p>x<sub>min</sub> = ${xmin_mm.toFixed(2)} mm</p>
    <p>μ = ${μ.toFixed(4)} | μ<sub>lim</sub> = ${μlim.toFixed(4)}</p>
    <p>${mesajArmare}</p>
    <p>${mesajZ}</p>
    <p>As<sub>nec</sub> = ${AsNec_mm2?.toFixed(2) || "-"} mm²</p>
    <p>As<sub>min</sub> = ${AsMin_mm2.toFixed(2)} mm²</p>
    <p>As<sub>eff</sub> = ${AsEff_mm2.toFixed(2)} mm²</p>
    <p>${mesajAsMin}</p>
    <p>${mesajAsNec}</p>
    <p>MR<sub>d</sub> = ${MRd_kNm.toFixed(2)} kNm</p>
  `;
}
