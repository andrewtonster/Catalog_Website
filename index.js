document.addEventListener("DOMContentLoaded", function () {
  const MAX_POKEMON = 1025;
  // Dark mode functionality
  var icon = document.getElementById("dark_mode");

  icon.onclick = () => {
    document.body.classList.toggle("dark_theme");
    if (document.body.classList.contains("dark_theme")) {
      icon.src = "images/sun.png";
    } else {
      icon.src = "images/moon.png";
    }
  };

  // initializing selectors
  const catalog = document.querySelector(".catalog");
  const input = document.querySelector(".input");
  const numberFilter = document.querySelector("#number");
  const nameFilter = document.querySelector("#name");
  const dropdown = document.querySelector(".dropdown_btn");
  const notFound = document.querySelector(".unavaliable");
  let filterByID = false;
  let pokemonList = [];

  // Changing dropdown text based on click
  numberFilter.addEventListener("click", () => {
    filterByID = true;
    dropdown.innerText = "ID";
  });
  nameFilter.addEventListener("click", () => {
    filterByID = false;
    dropdown.innerText = "Pokemon";
  });

  /*
      Helper function to capatalize first letter
  */
  const upperCaseFirst = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  /*
      Function to make call to API given pokemon id
  */
  const fetchSinglePokemon = async (id) => {
    try {
      const response1 = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const pokemon = await response1.json();
      const response2 = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${id}`
      );
      const pokemonBio = await response2.json();

      return true;
    } catch (error) {
      return false;
    }
  };

  /*
      Function to make call to API and retrieve all pokemon up to limit
  */
  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`
      );
      const data = await response.json();
      pokemonList = data.results;
      createPokemonCard(pokemonList);
    } catch (error) {
      console.log(error);
    }
  };

  /*
      Function to make create each card in the catalog
  */
  const createPokemonCard = async (pokemon) => {
    catalog.innerHTML = "";

    pokemon.forEach((pokemon) => {
      const pokemonID = pokemon.url.split("/")[6];
      const pokemonCard = document.createElement("div");

      pokemonCard.className = "pokemon_card";
      pokemonCard.innerHTML = `
    <div class="pokemon_id_container">
        <p class="pokemon_id_text">#${pokemonID}</p>
    </div>
    <div class="pokemon_img_container">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonID}.png" alt="${
        pokemon.name
      }" />
    </div>
    <div class="pokemon_name_container">
        <p class="pokemon_name_text">${upperCaseFirst(pokemon.name)}</p>
    </div>

    `;

      pokemonCard.addEventListener("click", async () => {
        const result = await fetchSinglePokemon(pokemonID);
        if (result) {
          window.location.href = `./card.html?id=${pokemonID}`;
        }
      });

      catalog.appendChild(pokemonCard);
    });
  };

  /*
      Function to handle search based on filter
  */

  const handleSearch = () => {
    let userSearch = input.value.toLowerCase().trim();
    userSearch = userSearch.replace(/\s+/g, "");

    let pokemonFilter;

    // creating a list of filtered pokemon, and then rendering them
    if (filterByID) {
      pokemonFilter = pokemonList.filter((pokemon) => {
        const pokemonID = pokemon.url.split("/")[6];
        return pokemonID.startsWith(userSearch);
      });
    } else if (!filterByID) {
      pokemonFilter = pokemonList.filter((pokemon) => {
        return pokemon.name.toLowerCase().includes(userSearch);
      });
    } else {
      pokemonFilter = pokemonList;
    }

    createPokemonCard(pokemonFilter);

    // if no results found, show this div
    if (pokemonFilter.length === 0) {
      notFound.style.display = "flex";
    } else {
      notFound.style.display = "none";
    }
  };

  fetchData();
  input.addEventListener("keyup", handleSearch);
});
