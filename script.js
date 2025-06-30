let currentPokemonId = 1; 

async function buscarPokemon() {
  const input = document.getElementById('pokemonInput').value.toLowerCase();
  const container = document.getElementById('pokemonContainer');
  container.innerHTML = 'Buscando...';

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${input}`);
    if (!res.ok) throw new Error("No encontrado");
    const data = await res.json();

    currentPokemonId = data.id; 

    mostrarPokemon(data);
  } catch (error) {
    container.innerHTML = `<p>Pokémon no encontrado. Intenta con otro nombre o número.</p>`;
  }
}

function mostrarPokemon(data) {
  const container = document.getElementById('pokemonContainer');

  const stats = data.stats.map(stat => {
    const nombre = traducirStat(stat.stat.name);
    const valor = stat.base_stat;
    const maxStat = 200;
    const porcentaje = Math.min((valor / maxStat) * 100, 100);

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

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${newId}`);
    if (!res.ok) throw new Error("Error");
    const data = await res.json();
    currentPokemonId = data.id;
    mostrarPokemon(data);
  } catch (error) {
    console.error("Error al cargar Pokémon:", error);
  }
}


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





function pokemonAleatorio(){
  const randomId = Math.floor(Math.random() * 1025) + 1; 
  fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
    .then(response => {
      if (!response.ok) throw new Error("Error al obtener Pokémon aleatorio");
      return response.json();
    })
    .then(data => {
      currentPokemonId = data.id; 
      mostrarPokemon(data);
    })
    .catch(error => {
      const container = document.getElementById('pokemonContainer');
      container.innerHTML = '<p>Error al cargar el Pokémon aleatorio</p>';
    });
}


























