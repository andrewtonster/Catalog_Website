document.addEventListener("DOMContentLoaded", function () {
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

  const catalog = document.querySelector(".catalog");
  const input = document.querySelector(".input");
  const numberFilter = document.querySelector("#number");
  const nameFilter = document.querySelector("#name");
  const dropdown = document.querySelector(".dropdown_btn");
  const notFound = document.querySelector(".unavaliable");
  let filterByID = false;
  let pokemonList = [];

  numberFilter.addEventListener("click", () => {
    filterByID = true;
    dropdown.innerText = "ID";
  });
  nameFilter.addEventListener("click", () => {
    filterByID = false;
    dropdown.innerText = "Pokemon";
  });

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

  const upperCaseFirst = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=500`
      );
      const data = await response.json();
      pokemonList = data.results;
      createPokemonCard(pokemonList);
    } catch (error) {
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

  const handleSearch = () => {
    let userSearch = input.value.toLowerCase().trim();
    userSearch = userSearch.replace(/\s+/g, "");

    console.log(userSearch);
    let pokemonFilter;

    if (filterByID) {
      pokemonFilter = pokemonList.filter((pokemon) => {
        const pokemonID = pokemon.url.split("/")[6];
        return pokemonID.startsWith(userSearch);
      });
    } else if (!filterByID) {
      console.log("name filter checkd");
      pokemonFilter = pokemonList.filter((pokemon) => {
        return pokemon.name.toLowerCase().includes(userSearch);
      });
    } else {
      pokemonFilter = pokemonList;
    }

    createPokemonCard(pokemonFilter);

    if (pokemonFilter.length === 0) {
      console.log("in filter");
      notFound.style.display = "flex";
    } else {
      notFound.style.display = "none";
    }
  };

  fetchData();
  input.addEventListener("keyup", handleSearch);
});
