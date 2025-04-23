function actualizeazaSectiunea() {
  const canvas = document.getElementById("sectiune");
  if (!canvas) {
    console.error("Canvasul 'sectiune' nu a fost găsit!");
    return;
  }

  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const hb = parseFloat(document.getElementById("hb")?.value);
  const bb = parseFloat(document.getElementById("bb")?.value);
  const hp = parseFloat(document.getElementById("hp")?.value);

  if (!hb || !bb || !hp) {
    console.warn("Valori incomplete pentru geometrie");
    return;
  }

  const ext = 1.5 * hp; // extindere stânga-dreapta
  const totalWidth_cm = bb + 2 * ext + 5;
  const totalHeight_cm = hb + 25;

  const padding = 20;
  const scaleX = (canvas.width - 2 * padding) / totalWidth_cm;
  const scaleY = (canvas.height - 2 * padding) / totalHeight_cm;
  const scale = Math.min(scaleX, scaleY) * 0.95;

  const flangeWidth = (bb + 2 * ext) * scale;
  const flangeHeight = hp * scale;
  const webWidth = bb * scale;
  const webHeight = (hb - hp) * scale;
  const x0 = (canvas.width - flangeWidth) / 2;
  // Așezare perfect aliniată cu inputul h_b
const inputTop = document.getElementById("hb").getBoundingClientRect().top;
const canvasTop = canvas.getBoundingClientRect().top;
const offset = inputTop - canvasTop;

const y0 = offset; // desenul începe exact la nivelul inputului h_b


  // Hasura
  const patternCanvas = document.createElement("canvas");
  patternCanvas.width = 8;
  patternCanvas.height = 8;
  const pCtx = patternCanvas.getContext("2d");
  pCtx.strokeStyle = "#ccc";
  pCtx.beginPath();
  pCtx.moveTo(0, 8);
  pCtx.lineTo(8, 0);
  pCtx.stroke();
  const pattern = ctx.createPattern(patternCanvas, "repeat");

  ctx.fillStyle = pattern;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x0 + flangeWidth, y0);
  ctx.lineTo(x0 + flangeWidth, y0 + flangeHeight);
  ctx.lineTo(x0 + (flangeWidth + webWidth) / 2, y0 + flangeHeight);
  ctx.lineTo(x0 + (flangeWidth + webWidth) / 2, y0 + flangeHeight + webHeight);
  ctx.lineTo(x0 + (flangeWidth - webWidth) / 2, y0 + flangeHeight + webHeight);
  ctx.lineTo(x0 + (flangeWidth - webWidth) / 2, y0 + flangeHeight);
  ctx.lineTo(x0, y0 + flangeHeight);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Linii verticale la capetele plăcii, în afara ei
  drawCapLine(ctx, x0, y0, flangeHeight, scale);
  drawCapLine(ctx, x0 + flangeWidth, y0, flangeHeight, scale);

  // Cotare
  if (typeof deseneazaCote === "function") {
    deseneazaCote(ctx, x0, y0, flangeWidth, flangeHeight, webWidth, webHeight, scale, hb, bb, hp);
  } else {
    console.warn("Funcția deseneazaCote nu este definită!");
  }
}

function drawCapLine(ctx, x, y, flangeHeight, scale) {
  const extra = 3 * scale; // 3 cm în sus și jos
  ctx.beginPath();
  ctx.moveTo(x, y - extra);
  ctx.lineTo(x, y + flangeHeight + extra);
  ctx.stroke();
}
function deseneazaSectiuneT(ctx, x0, y0, scale, bb, hb, hp) {
  const B = bb * scale;
  const H = hb * scale;
  const Hp = hp * scale;

  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x0 - 1.5 * Hp, y0);
  ctx.lineTo(x0 - 1.5 * Hp, y0 + Hp);
  ctx.lineTo(x0, y0 + Hp);
  ctx.lineTo(x0, y0 + H);
  ctx.lineTo(x0 + B, y0 + H);
  ctx.lineTo(x0 + B, y0 + Hp);
  ctx.lineTo(x0 + B + 1.5 * Hp, y0 + Hp);
  ctx.lineTo(x0 + B + 1.5 * Hp, y0);
  ctx.closePath();
  ctx.stroke();
}
