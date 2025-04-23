// 🧭 1. Mapare unități pentru toate proprietățile
const unitati = {
  // 🔹 Beton
  fck: "MPa",
  fck_cub: "MPa",
  fctm: "MPa",
  fctk_0_05: "MPa",
  fctk_0_95: "MPa",
  Ecm: "MPa",
  fcd: "MPa",
  fctd: "MPa",
  γc: "-",
  ν: "-",
  αcc: "-",
  εc2: "-",
  εcu2: "-",
  εc3: "-",

  // 🔹 Oțel
  marca: "-",
  diametru: "mm",
  fyk: "MPa",
  ft: "MPa",
  denumire: "-",
  Es: "MPa",
  fyd: "MPa",
  eyd: "-"
};

window.onload = () => {
  const betonSelect = document.getElementById("clasaBeton");
  const otelSelect = document.getElementById("marcaOtel");

  // Populare dropdown beton
  Object.keys(betonDB).forEach(clasa => {
    const opt = document.createElement("option");
    opt.value = clasa;
    opt.textContent = clasa;
    betonSelect.appendChild(opt);
  });

  // Populare dropdown otel
  Object.keys(otelDB).forEach(marca => {
    const opt = document.createElement("option");
    opt.value = marca;
    opt.textContent = marca;
    otelSelect.appendChild(opt);
  });

  betonSelect.selectedIndex = 0;
  otelSelect.selectedIndex = 0;

  afiseazaBeton();
  afiseazaOtel();
  actualizeazaSectiunea();
};

function afiseazaBeton() {
  const clasa = document.getElementById("clasaBeton").value;
  const valori = betonDB[clasa];
  const container = document.getElementById("valoriBeton");
  container.innerHTML = "";

  for (const [cheie, valoare] of Object.entries(valori)) {
    const unitate = unitati[cheie] || "";
    const div = document.createElement("div");
    div.innerHTML = `
      <div style="font-size:10px;">
        ${cheie}
        <span style="font-size:9px;">(${unitate})</span>
      </div>
      <div style="border:1px solid #ccc; padding:2px;">${valoare}</div>
    `;
    container.appendChild(div);
  }
}

function afiseazaOtel() {
  const marca = document.getElementById("marcaOtel").value;
  const valori = otelDB[marca];
  const container = document.getElementById("valoriOtel");
  container.innerHTML = "";

  for (const [cheie, valoare] of Object.entries(valori)) {
    const unitate = unitati[cheie] || "";
    const div = document.createElement("div");
    div.innerHTML = `
      <div style="font-size:10px;">
        ${cheie}
        <span style="font-size:9px;">(${unitate})</span>
      </div>
      <div style="border:1px solid #ccc; padding:2px;">${valoare}</div>
    `;
    container.appendChild(div);
  }
}
