// DARK MODE FUNCTIONANILTY
var icon = document.getElementById("dark_mode");

icon.onclick = () => {
  document.body.classList.toggle("dark_theme");
  if (document.body.classList.contains("dark_theme")) {
    icon.src = "images/sun.png";
  } else {
    icon.src = "images/moon.png";
  }
};

///
const catalog = document.querySelector(".catalog");
const input = document.querySelector(".input");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const notFound = document.querySelector("#not_found");

let pokemonList = [];

// Fetching the pokemon data

const fetchSinglePokemon = async (id) => {
  try {
    const response = await `https://pokeapi.co/api/v2/pokemon/${id}`;
  } catch (error) {
    console.log(error);
  }
};
const fetchData = async () => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=200`);
    const data = await response.json();
    console.log(data);
    console.log(data.results);
    pokemonList = data.results;
    createPokemonCard(pokemonList);
  } catch (error) {
    console.log("failed to fetch data");
    console.log(error);
  }
};

const fetchType = async (id) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json(); // Parsing response as JSON
    const types = data.types; // Accessing types array from the response data
    const typeList = types.map((type) => {
      return type.type.name; // Accessing type name from each type object
    });
    return typeList;
  } catch (error) {
    console.log(error);
  }
};

const getTypeImages = (types) => {
  types.forEach((type) => {});
};

const createPokemonCard = async (pokemon) => {
  catalog.innerHTML = "";
  pokemon.forEach((pokemon) => {
    const pokemonID = pokemon.url.split("/")[6];
    const pokemonCard = document.createElement("div");
    // const types = await fetchType(pokemonID);
    // const typeImages = getTypeImages(types);

    pokemonCard.className = "pokemon_card";
    pokemonCard.innerHTML = `
    <div class="pokemon_id_container">
        <p class="pokemon_id_text">#${pokemonID}</p>
    </div>
    <div class="pokemon_img_container">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonID}.png" alt="${pokemon.name}" />
    </div>
    <div class="pokemon_name_container">
        <p class="pokemon_name_text">#${pokemon.name}</p>
    </div>

    `;

    pokemonCard.addEventListener("click", async () => {
      const result = await fetchSinglePokemon();

      if (result) {
        window.location.href = `./detail.html?id=${pokemonID}`;
      }
    });

    catalog.appendChild(pokemonCard);
  });
};
fetchData();

const handleSearch = () => {
  const userSearch = input.value.toLowerCase();
  console.log(userSearch);
  let pokemonFilter;

  if (numberFilter.checked) {
    pokemonFilter = pokemonList.filter((pokemon) => {
      const pokemonID = pokemon.url.split("/")[6];
      return pokemonID.startsWith(userSearch);
    });
  } else if (nameFilter.checked) {
    console.log("name filter checkd");
    pokemonFilter = pokemonList.filter((pokemon) => {
      return pokemon.name.toLowerCase().startsWith(userSearch);
    });
  } else {
    pokemonFilter = pokemonList;
  }

  createPokemonCard(pokemonFilter);

  if (pokemonFilter.length === 0) {
    notFound.style.display = "block";
  } else {
    notFound.style.display = "none";
  }
};

input.addEventListener("keyup", handleSearch);
