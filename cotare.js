function deseneazaCote(ctx, x0, y0, flangeWidth, flangeHeight, webWidth, webHeight, scale, hb, bb, hp) {
  ctx.strokeStyle = "#000";
  ctx.fillStyle = "#000";
  ctx.lineWidth = 1;
  ctx.setLineDash([]);
  ctx.font = "9px Arial";

  // Cota h (rotită)
  ctx.beginPath();
  ctx.moveTo(x0 - 20, y0);
  ctx.lineTo(x0 - 20, y0 + flangeHeight + webHeight);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x0 - 24, y0);
  ctx.lineTo(x0 - 16, y0);
  ctx.moveTo(x0 - 24, y0 + flangeHeight + webHeight);
  ctx.lineTo(x0 - 16, y0 + flangeHeight + webHeight);
  ctx.stroke();
  ctx.save();
  ctx.translate(x0 - 25, y0 + (flangeHeight + webHeight) / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`h = ${hb} cm`, 0, 0);
  ctx.restore();

  // Cota hp (rotită, corect poziționată)
ctx.beginPath();
ctx.moveTo(x0 + flangeWidth + 20, y0);
ctx.lineTo(x0 + flangeWidth + 20, y0 + flangeHeight);
ctx.stroke();
ctx.beginPath();
ctx.moveTo(x0 + flangeWidth + 16, y0);
ctx.lineTo(x0 + flangeWidth + 24, y0);
ctx.moveTo(x0 + flangeWidth + 16, y0 + flangeHeight);
ctx.lineTo(x0 + flangeWidth + 24, y0 + flangeHeight);
ctx.stroke();

// 🔧 ROTIRE ȘI CORECTARE POZIȚIE hp
ctx.save();
ctx.translate(x0 + flangeWidth + 35, y0 + flangeHeight / 2);
ctx.rotate(-Math.PI / 2);
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.fillText(`hp = ${hp} cm`, 0, 0);
ctx.restore();

  // Cota b (orizontală)
  const bStart = x0 + (flangeWidth - webWidth) / 2;
  const bEnd = x0 + (flangeWidth + webWidth) / 2;
  ctx.beginPath();
  ctx.moveTo(bStart, y0 + flangeHeight + webHeight + 16);
  ctx.lineTo(bEnd, y0 + flangeHeight + webHeight + 16);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(bStart, y0 + flangeHeight + webHeight + 12);
  ctx.lineTo(bStart, y0 + flangeHeight + webHeight + 20);
  ctx.moveTo(bEnd, y0 + flangeHeight + webHeight + 12);
  ctx.lineTo(bEnd, y0 + flangeHeight + webHeight + 20);
  ctx.stroke();
  ctx.fillText(`b = ${bb} cm`, (bStart + bEnd) / 2 - 15, y0 + flangeHeight + webHeight + 30);
}
