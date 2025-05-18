import { DICCIONARIO_BUSQUEDAS } from './diccionario_busquedas_completo.js'

/**
 * Clasifica el texto del usuario en una o más categorías del diccionario.
 * Devuelve un array con las categorías ordenadas por relevancia (coincidencias).
 * 
 * @param {string} textoUsuario - El texto ingresado por el usuario.
 * @returns {Array} - Categorías ordenadas por cantidad de coincidencias.
 */
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

  // Ordenar por cantidad de coincidencias descendente
  categoriasCoincidentes.sort((a, b) => b.coincidencias - a.coincidencias);

  // Retornar solo los nombres de las categorías
  return categoriasCoincidentes.map(item => item.categoria);
}
