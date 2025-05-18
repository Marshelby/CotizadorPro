
import { DICCIONARIO_BUSQUEDAS } from './diccionario_busquedas_completo.js'

export function clasificarBusqueda(textoUsuario) {
  const texto = textoUsuario.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
  const categoriasCoincidentes = [];

  for (const [categoria, palabrasClave] of Object.entries(DICCIONARIO_BUSQUEDAS)) {
    let coincidencias = 0;

    for (const palabra of palabrasClave) {
      const palabraNormalizada = palabra.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
      if (texto.includes(palabraNormalizada)) {
        coincidencias++;
      }
    }

    if (coincidencias > 0) {
      categoriasCoincidentes.push({ categoria, coincidencias });
    }
  }

  categoriasCoincidentes.sort((a, b) => b.coincidencias - a.coincidencias);

  return categoriasCoincidentes.map(item => item.categoria);
}
