let currentPokemonId = 1; 

// Función para buscar Pokémon por nombre o número
async function buscarPokemon() {

  // El valor obtenido del input se convierte a minúsculas para evitar problemas de mayúsculas/minúsculas
  const input = document.getElementById('pokemonInput').value.toLowerCase();

  // selecciona el contenedor donde se muestra la informacion 
  const container = document.getElementById('pokemonContainer');
  container.innerHTML = 'Buscando...';

  try {

    // Hace peticion a la api para obtener el Pokémon ya sea por nombre o por número
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${input}`);
    // Si la respuesta no es correcta, lanza un error
    if (!res.ok) throw new Error("No encontrado");
    // Convierte la respuesta a formato JSON
    const data = await res.json();

    // Guarda ID del Pokémon actual
    currentPokemonId = data.id; 

    // Muestra el Pokémon en el contenedor
    mostrarPokemon(data);
  } catch (error) {
    // Si ocurre un error, muestra un mensaje de error en el contenedor
    container.innerHTML = `<p>Pokémon no encontrado. Intenta con otro nombre o número.</p>`;
  }
}

// Función para mostrar el Pokémon en el contenedor
function mostrarPokemon(data) {
  // Selecciona el contenedor donde se mostrará la información del Pokémon
  const container = document.getElementById('pokemonContainer');

  // Busca stats del pokemon para transformarlas en barras visuales
  const stats = data.stats.map(stat => {
    
    // traduce el nombre de la estadística al español
    const nombre = traducirStat(stat.stat.name);
    // Obtiene el valor de la estadística y calcula el porcentaje para la barra
    const valor = stat.base_stat;
    const maxStat = 200;
    const porcentaje = Math.min((valor / maxStat) * 100, 100);


    // esta funcion devuelve el HTML para cada estadística
    return `
      <div class="stat-label"><strong>${nombre}:</strong> ${valor}</div>
      <div class="stat-bar-container">
        <div class="stat-bar" style="width: ${porcentaje}%; background: ${
          stat.stat.name === 'hp' ? '#ff5959' :
          stat.stat.name === 'attack' ? '#f5ac78' :
          stat.stat.name === 'defense' ? '#fae078' :
          stat.stat.name === 'special-attack' ? '#9db7f5' :
          stat.stat.name === 'special-defense' ? '#a7db8d' :
          stat.stat.name === 'speed' ? '#fa92b2' : '#30a7d7'
        }">${valor}</div>
      </div>
    `;
  }).join('');

  // luego, se inserta el HTML en el contenedor
  container.innerHTML = `
    <h2>${data.name.toUpperCase()}</h2>
    <img src="${data.sprites.front_default}" alt="${data.name}">
    <p><strong>Tipo:</strong> ${data.types.map(t => t.type.name).join(', ')}</p>
    <p><strong>Altura:</strong> ${data.height / 10} m</p>
    <p><strong>Peso:</strong> ${data.weight / 10} kg</p>
    <h3>Estadísticas:</h3>
    ${stats}
  `;
}


async function cambiarPokemon(delta) {
  const newId = currentPokemonId + delta;
  if (newId < 1 || newId > 1025) return; 
  // Verifica que el nuevo ID esté dentro del rango válido de Pokémon

  try {

    // Hace una petición a la API para obtener el Pokémon con el nuevo ID
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${newId}`);
    // Si la respuesta no es correcta, lanza un error
    if (!res.ok) throw new Error("Error");
    // Convierte la respuesta a formato JSON
    const data = await res.json();
    currentPokemonId = data.id;
    // Muestra el Pokémon en el contenedor
    mostrarPokemon(data);
  // Si ocurre un error, muestra un mensaje de error en la consola
  } catch (error) {
    console.error("Error al cargar Pokémon:", error);
  }
}

// Función para traducir los nombres de las estadísticas al español
// Esta función toma el nombre de la estadística en inglés y devuelve su traducción al español
function traducirStat(statName) {
  const traducciones = {
    'hp': 'HP',
    'attack': 'Ataque',
    'defense': 'Defensa',
    'special-attack': 'Ataque Esp.',
    'special-defense': 'Defensa Esp.',
    'speed': 'Velocidad'
  };
  return traducciones[statName] || statName;
}




// Genera un numero aleatorio entre 1 y 1025 que es el rango de Pokémon disponibles en la API
function pokemonAleatorio(){
  const randomId = Math.floor(Math.random() * 1025) + 1; 
  fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
    .then(response => {
      if (!response.ok) throw new Error("Error al obtener Pokémon aleatorio");
      // Si la respuesta es correcta, convierte la respuesta a formato JSON
      // y devuelve los datos del Pokémon
      return response.json();
    })
    .then(data => {
      currentPokemonId = data.id; 
      mostrarPokemon(data);
      // Muestra el Pokémon en el contenedor
    })
    .catch(error => {
      const container = document.getElementById('pokemonContainer');
      container.innerHTML = '<p>Error al cargar el Pokémon aleatorio</p>';
    });
}

