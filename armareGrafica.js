function deseneazaArmaturaInferioara() {
  const canvas = document.getElementById("canvasArmare");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const getValue = id => parseFloat(document.getElementById(id).value);

  const hb = getValue("hb");
  const bb = getValue("bb");
  const hp = getValue("hp");
  const a1b = getValue("a1b");

  const fi1 = parseFloat(document.getElementById("fi1").value);
  const fi2 = parseFloat(document.getElementById("fi2").value);
  const n1 = getValue("n1");
  const n2 = getValue("n2");

  const ordine = prompt("Introduceți ordinea distribuirii (ex: 1,2,1,2)").split(",").map(v => parseInt(v.trim()));
  if (ordine.length !== n1 + n2 || ordine.some(x => x !== 1 && x !== 2)) {
    alert("Eroare: ordinea introdusă nu corespunde n1 + n2 sau conține valori invalide.");
    return;
  }

  const bare = ordine.map(x => x === 1 ? fi1 : fi2);

  const margin = 30;
  const scale = (canvas.height - 2 * margin) / hb;
  const B = bb * scale;
  const x0 = (canvas.width - B) / 2;
  const y0 = margin;

  deseneazaSectiuneT(ctx, x0, y0, scale, bb, hb, hp);

  const raza = 4;
  const acoperire = a1b * scale;
  const usableWidth = B - 2 * acoperire;
  const dX = bare.length > 1 ? usableWidth / (bare.length - 1) : 0;
  const y = y0 + hb * scale - acoperire;

  for (let i = 0; i < bare.length; i++) {
    const fi = bare[i];
    const x = x0 + acoperire + i * dX;

    ctx.beginPath();
    ctx.arc(x, y, raza, 0, 2 * Math.PI);
    ctx.fillStyle = fi === fi1 ? "#004080" : "#008000";
    ctx.fill();

    ctx.font = "10px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText(`⌀${fi}`, x - 6, y - 8);
  }

  ctx.font = "12px Arial";
  ctx.fillText("Armare inferioară calculată", x0, y + 20);
}
