// Cálculos financieros puros (fáciles de probar).
export const PRODUCTOS = {
  personal: { nombre: 'Personal', tasa: 15.5, min: 500, max: 20000, plazoMax: 48, icono: '◎', desc: 'Para tus planes, estudios o imprevistos.' },
  vehicular: { nombre: 'Vehicular', tasa: 11.2, min: 5000, max: 60000, plazoMax: 60, icono: '◈', desc: 'Nuevo o seminuevo, con entrada desde 20%.' },
  negocio: { nombre: 'Negocio', tasa: 13.8, min: 1000, max: 50000, plazoMax: 36, icono: '◆', desc: 'Capital de trabajo, inventario o maquinaria.' },
  consolidacion: { nombre: 'Consolidación', tasa: 12.4, min: 2000, max: 40000, plazoMax: 60, icono: '◉', desc: 'Une tus deudas en una sola cuota más baja.' },
};

/** Cuota fija (sistema francés). tasaAnual en %. */
export function cuotaFrancesa(monto, tasaAnual, meses) {
  const i = tasaAnual / 100 / 12;
  if (i === 0) return monto / meses;
  return (monto * i) / (1 - Math.pow(1 + i, -meses));
}

/** Tabla de amortización completa. */
export function amortizacion(monto, tasaAnual, meses) {
  const i = tasaAnual / 100 / 12;
  const cuota = cuotaFrancesa(monto, tasaAnual, meses);
  let saldo = monto;
  const filas = [];
  for (let n = 1; n <= meses; n++) {
    const interes = saldo * i;
    const capital = cuota - interes;
    saldo = Math.max(0, saldo - capital);
    filas.push({ n, cuota, interes, capital, saldo });
  }
  return filas;
}

export const money = (n, d = 0) =>
  n.toLocaleString('es-EC', { style: 'currency', currency: 'USD', minimumFractionDigits: d, maximumFractionDigits: d });
