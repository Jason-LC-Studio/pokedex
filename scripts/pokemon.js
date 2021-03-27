// Default data needed for the application
const base_url = "https://pokeapi.co/api/v2";

// Helper Functions Here

//capitalize only the first letter of the string.
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Function to fetch data for pokemon list
function fetchPokemonList(url) {
  // Get element to write list to
  let pokemonList = document.getElementById("pokemon-list");
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      // Reset contents of list before starting
      pokemonList.innerHTML = "";
      data.results.forEach((pokemon) => {
        let listItem = createPokemonListItem(pokemon);
        pokemonList.innerHTML += listItem;
      });
      pokemonList.innerHTML += createPokemonListNavigation(
        data.next,
        data.previous
      );
    })
    .catch((err) => console.error(err));
}

function createPokemonListItem(pokemon) {
  return `
    <button class="pokemon-list-item" onclick="getPokemonData('${
      pokemon.url
    }')">${capitalizeFirstLetter(pokemon.name)}</button>
    `;
}

function createPokemonListNavigation(next, prev) {
  const nextLink = next
    ? `<button class="pokemon-list-navigation-button" onclick="fetchPokemonList('${next}')">Next</button>`
    : `<button class="pokemon-list-navigation-button" disabled>Next</button>`;
  const prevLink = prev
    ? `<button class="pokemon-list-navigation-button" onclick="fetchPokemonList('${prev}')">Previous</button>`
    : `<button class="pokemon-list-navigation-button" disabled>Previous</button>`;
  return `
    <div class="pokemon-list-navigation">
        ${prevLink} ${nextLink}
    </div>
  `;
}

function getPokemonData(url) {
  fetch(url)
    .then((res) => res.json())
    .then((pokemon) => {
      console.log(pokemon);
      renderPokemonData(pokemon);
    })
    .catch((err) => console.error(err));
}

function renderPokemonData(pokemon) {
  // extract data from pokemon object
  let { name, id, stats } = pokemon;

  let { type } = pokemon.types[0];

  document.getElementsByTagName(
    "body"
  )[0].style.background = `var(--${type.name})`;

  // Get element to write details to
  let contentBox = document.getElementById("pokemon-details");
  //   HTML generated content
  const content = `
        <img class="pokemon-details-image" src='${
          pokemon.sprites.front_default
        }' alt='${name}'>
        <div class="pokemon-details-container">
            <h2>${id} ${capitalizeFirstLetter(name)}</h2>
            <h4>Type: ${capitalizeFirstLetter(type.name)}</h4>
            <div class="pokemon-details-stats">
                ${createPokemonStats(stats)}
            </div>
        </div>
    `;

  // Overwrite old content with new content
  contentBox.innerHTML = content;
}

function createPokemonStats(stats) {
  let content = "";
  stats.forEach((stat) => {
    content += `
        <div class="pokemon-details-stat">
            <label for='${stat.stat.name}'>${capitalizeFirstLetter(
      stat.stat.name
    )}</label>
            <meter id="${stat.stat.name}" value="${
      stat.base_stat
    }" min="0" max="100">${stat.base_stat} out of 100</meter>
        </div>
    `;
  });
  return content;
}

// Initial call to get list
fetchPokemonList(`${base_url}/pokemon`);
