// Multipli și submultipli pentru uz intern în calcule

const U = {
  // Lungime
  mm: 0.1,       // 1 mm = 0.1 cm
  cm: 1,
  m: 100,        // 1 m = 100 cm

  // Forță
  N: 0.001,      // 1 N = 0.001 kN
  kN: 1,
  MN: 1000,

  // Moment
  Nm: 0.001,     // 1 Nm = 0.001 kNm
  kNm: 1,
  MNm: 1000,

  // Suprafață
  mm2: 0.01,     // 1 mm² = 0.01 cm²
  cm2: 1,
  m2: 10000,

  // Tensiune / Modul elastic
  MPa: 1,        // lucrezi în MPa (N/mm²)
  GPa: 1000,

  // Alte coeficienți (dacă vrei)
  gamma_s: 1.15  // pentru oțel
};
