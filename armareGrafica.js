function deseneazaArmaturaInferioara() {
  const canvas = document.getElementById("canvasArmare");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const getValue = id => parseFloat(document.getElementById(id).value);

  // Date geometrice
  const hb = getValue("hb");
  const bb = getValue("bb");
  const hp = getValue("hp");
  const a1b = getValue("a1b");

  // Armare
  const fi1 = getValue("fi");
  const fi2 = getValue("fi2");
  const n1 = getValue("n1");
  const n2 = getValue("n2");

  // Ordine de distribuție
  const inputOrdine = prompt("Introduceți ordinea distribuirii barelor (ex: 1,2,1,2,1):");
  if (!inputOrdine) return;

  const ordine = inputOrdine.split(",").map(v => parseInt(v.trim()));
  if (ordine.some(x => x !== 1 && x !== 2)) {
    alert("Valori permise: doar 1 (Φ1) și 2 (Φ2)");
    return;
  }

  const totalBare = ordine.length;
  if (totalBare !== n1 + n2) {
    alert(`Numărul de bare introdus nu corespunde cu n1 (${n1}) + n2 (${n2})`);
    return;
  }

  const bare = ordine.map(val => val === 1 ? fi1 : fi2);

  // SCALARE
  const margin = 30;
  const scale = (canvas.height - 2 * margin) / hb;
  const B = bb * scale;
  const x0 = (canvas.width - B) / 2;
  const y0 = margin;

  // Desen secțiune T
  deseneazaSectiuneT(ctx, x0, y0, scale, bb, hb, hp);

  // Desen bare inferioare
  const raza = 4;
  const acoperire = a1b * scale;
  const usableWidth = B - 2 * acoperire;
  const dX = totalBare > 1 ? usableWidth / (totalBare - 1) : 0;
  const y = y0 + hb * scale - acoperire;

  for (let i = 0; i < totalBare; i++) {
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

  // Etichetă jos
  ctx.font = "12px Arial";
  ctx.fillStyle = "#000";
  ctx.fillText("Armare inferioară calculată", x0, y0 + hb * scale + 20);
}
