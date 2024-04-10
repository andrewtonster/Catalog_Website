let pokemonId = null;
const MAX_POKEMONS = 1025;

/*
    Retrieves Id from url and calls fetch
*/
document.addEventListener("DOMContentLoaded", () => {
  const idParam = new URLSearchParams(window.location.search).get("id");
  const id = parseInt(idParam, 10);

  if (id < 1 || id > MAX_POKEMONS) {
    return (window.location.href = "./index.html");
  }

  pokemonId = id;
  fetchPokemon(pokemonId);
});

/* 
    Gets data from API and initializes click events for arrows
    Passes Data to create pokemon Card
*/
const fetchPokemon = async (id) => {
  try {
    const responses = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`),
    ]);

    const [pokemonResponse, pokemonSpeciesResponse] = responses;

    if (!pokemonResponse.ok || !pokemonSpeciesResponse.ok) {
      throw new Error("Failed to fetch data");
    }

    const pokemon = await pokemonResponse.json();
    const pokemonSpecies = await pokemonSpeciesResponse.json();

    if (pokemonId === id) {
      createCard(pokemon, pokemonSpecies);
      const pokemonBio = getBio(pokemonSpecies);
      document.querySelector(".pokemon_description").textContent = pokemonBio;

      const leftArrow = document.querySelector("#leftArrow");
      const rightArrow = document.querySelector("#rightArrow");

      leftArrow.removeEventListener("click", nextPokemon);
      rightArrow.removeEventListener("click", nextPokemon);

      if (id !== 1) {
        leftArrow.addEventListener("click", () => {
          nextPokemon(id - 1);
        });
      }
      if (id !== MAX_POKEMONS) {
        rightArrow.addEventListener("click", () => {
          nextPokemon(id + 1);
        });
      }

      window.history.pushState({}, "", `./card.html?id=${id}`);
    }

    return true;
  } catch (error) {
    console.log("An error occured while retrieving pokemon");
    console.log(error);
    return false;
  }
};

/* 
    Function to get data for the next pokemon
*/
const nextPokemon = async (id) => {
  pokemonId = id;
  await fetchPokemon(id);
};

/* 
    Key Value paris of pokemon type to corresponding color
*/
const typeColors = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
};

/*
    Helper function, maps through the list of elements, and applies the styling for each one
*/
const setElementStyles = (elements, cssProperty, value) => {
  elements.forEach((element) => {
    element.style[cssProperty] = value;
  });
};

/*
    Setting theme of card based on pokemon type
*/
const setTheme = (pokemon) => {
  const firstType = pokemon.types[0].type.name;
  const secondaryType = pokemon.types[1]?.type.name;
  const color = typeColors[firstType];
  const secondaryColor = typeColors[secondaryType];

  if (color) {
    const firstButton = document.querySelector(
      ".type_container button:nth-child(1)"
    );
    setElementStyles([firstButton], "backgroundColor", color);
  }
  if (secondaryColor) {
    const secondButton = document.querySelector(
      ".type_container button:nth-child(2)"
    );
    setElementStyles([secondButton], "backgroundColor", secondaryColor);
  }

  const main = document.querySelector(".main");
  const circle = document.querySelector(".circle_container");

  setElementStyles([main], "backgroundColor", lightenColor(color, 20));
  setElementStyles([circle], "backgroundColor", color);
  setElementStyles(
    document.querySelectorAll(".type_container > p"),
    "backgroundColor",
    color
  );

  setElementStyles(document.querySelectorAll(".stat_name"), "color", color);
};

/*
    Helper function to capatalize first letter
*/
const upperCaseFirst = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

/*
    Helper function to create and append element
*/
const createAndAppendElement = (parent, tag, options = {}) => {
  const element = document.createElement(tag);
  Object.keys(options).forEach((key) => {
    element[key] = options[key];
  });
  parent.appendChild(element);
  return element;
};

/*
    Helper function to parse data for generation and get number
*/
function getWordAfterHyphen(str) {
  const hyphenIndex = str.indexOf("-");
  if (hyphenIndex === -1) {
    return "";
  }
  return str.substring(hyphenIndex + 1);
}

/*
    Function creates the Pokemon card with all the data
    Destructors data and inserts them into the HTML
*/
const createCard = (pokemon, pokemonSpecies) => {
  const { name, id, types, weight, height, stats } = pokemon;
  let { generation, capture_rate } = pokemonSpecies;

  if (!generation.name) {
    generation = "none";
  } else {
    generation = generation.name;
  }

  if (!capture_rate) {
    capture_rate = "none";
  } else {
    capture_rate = capture_rate * 0.13;
    capture_rate = Number(capture_rate.toFixed(2));
  }
  const capitalizePokemonName = upperCaseFirst(name);

  document.querySelector(".title_container .name").textContent =
    capitalizePokemonName;

  document.querySelector(".id_text").textContent = `#${String(id).padStart(
    3,
    "0"
  )}`;

  const imageElement = document.querySelector(".pokemon_img_container img");
  imageElement.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  imageElement.alt = name;

  const typeWrapper = document.querySelector(".type_container");
  typeWrapper.innerHTML = "";

  types.forEach((type) => {
    createAndAppendElement(typeWrapper, "button", {
      className: `type`,
      textContent: upperCaseFirst(type.type.name),
    });
  });

  document.querySelector(".pokemon_hp").textContent = `${stats[0].base_stat}`;
  document.querySelector(".pokemon_atk").textContent = `${stats[1].base_stat}`;
  document.querySelector(".pokemon_def").textContent = `${stats[2].base_stat}`;
  document.querySelector(
    ".pokemon_sp_atk"
  ).textContent = `${stats[3].base_stat}`;
  document.querySelector(
    ".pokemon_sp_def"
  ).textContent = `${stats[4].base_stat}`;

  document.querySelector(".pokemon_spd").textContent = `${stats[5].base_stat}`;

  document.querySelector(".pokemon_height").textContent = `${height / 10}m`;
  document.querySelector(".pokemon_weight").textContent = `${weight / 10}kg`;

  document.querySelector(".capture_rate").textContent = `${upperCaseFirst(
    `${capture_rate}%`
  )}`;
  document.querySelector(
    ".pokemon_generation"
  ).textContent = `${getWordAfterHyphen(generation).toString()}`;

  setTheme(pokemon);
};

/*
    Function to get the description of the Pokemon Card
*/
const getBio = (pokemonSpecies) => {
  for (let entry of pokemonSpecies.flavor_text_entries) {
    if (entry.language.name === "en") {
      let description = entry.flavor_text.replace(/\f/g, " ");
      return description;
    }
  }
  return "";
};

/*
    Helper function to get a ligther version of Hex
    Used for the background of the card
*/
const lightenColor = (hex, percent) => {
  // Remove the hash symbol if present
  hex = hex.replace("#", "");

  // Convert hex to RGB
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  // Increase each RGB value
  r = Math.round(r * (1 + percent / 100));
  g = Math.round(g * (1 + percent / 100));
  b = Math.round(b * (1 + percent / 100));

  // Clip values to be within 0-255 range
  r = Math.min(r, 255);
  g = Math.min(g, 255);
  b = Math.min(b, 255);

  // Convert back to hex
  let result = ((r << 16) | (g << 8) | b).toString(16);

  // Ensure result has 6 digits
  while (result.length < 6) {
    result = "0" + result;
  }

  return "#" + result;
};
