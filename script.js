//You can edit ALL of the code here
const state = {
  allEpisodes: [],
  searchTerm: ""
};

// Fetch episodes from API
async function fetchEpisodes() {
  const response = await fetch("https://api.tvmaze.com/shows/82/episodes");
  if (!response.ok) {
    throw new Error("Error: " + response.status + " - " + response.statusText);
  }
  return await response.json();
}

// Setup function to call fetch and render episodes
async function setup() {
  try {
    const episodes = await fetchEpisodes();
    state.allEpisodes = episodes;
    const searchInput = document.getElementById("searchInput");
    const select = document.getElementById("episodes-dropdown");
    
    // Add event listeners after episodes are loaded
    searchInput.addEventListener("keyup", search);
    select.addEventListener("change", dropdownChange);
  
    // Initial render and dropdown population
    render(state.allEpisodes);
    allEpisodesDropdown(state.allEpisodes);
  } catch (error) {
    console.error("Error fetching episodes:", error);
  }
}

// Render episodes on the page
function render(episodeList) {
  displayEpisodes(episodeList);
}

// Create a 2-digit episode number
function createEpisodeNumber(num) {
  return num.toString().padStart(2, "0");
}

// Display episodes in the DOM
function displayEpisodes(episodes) {
  const container = document.getElementById("root");
  container.innerHTML = ""; // Clear any previous content

  // Episode count display
  const episodeCount = document.createElement("h2");
  episodeCount.textContent = howManyEpisodes(episodes);
  container.appendChild(episodeCount);

  episodes.forEach(episode => {
    const episodeCard = document.createElement("div");
    episodeCard.classList.add("episode-card");

    const title = document.createElement("h3");
    title.textContent = `${episode.name} (S${createEpisodeNumber(episode.season)} E${createEpisodeNumber(episode.number)})`;

    const image = document.createElement("img");
    image.src = episode.image?.medium;
    image.alt = episode.name;

    const summary = document.createElement("p");
    summary.innerHTML = episode.summary;

    const link = document.createElement("a");
    link.href = episode.url;
    link.target = "_blank";
    link.textContent = "View on TVMaze";

    episodeCard.append(title, image, summary, link);
    container.appendChild(episodeCard);
  });
}

// Return a message based on the number of episodes found
function howManyEpisodes(episodes) {
  return episodes.length === 0 ? "No episodes found" :
         episodes.length === 1 ? `${episodes.length} episode found` :
         `${episodes.length} episodes found`;
}

// Search function to filter episodes
const search = (event) => {
  const searchTerm = event.target.value.toLowerCase().trim();
  state.searchTerm = searchTerm;

  const filteredEpisodes = state.allEpisodes.filter((episode) => {
    return (
      episode.name.toLowerCase().includes(state.searchTerm) ||
      episode.summary.toLowerCase().includes(state.searchTerm) ||
      episode.season.toString().includes(state.searchTerm) ||
      episode.number.toString().includes(state.searchTerm)
    );
  });

  // Update the display with the filtered results
  displayEpisodes(filteredEpisodes);
};

// Dropdown function to filter episodes by selection
function dropdownChange(event) {
  const selectedValue = event.target.value;
  if (selectedValue === "all") {
    render(state.allEpisodes);
  } else {
    const selectedId = parseInt(selectedValue);
    const filteredEpisodes = state.allEpisodes.filter(episode => episode.id === selectedId);
    render(filteredEpisodes);
  }
}

// Populate the dropdown with all episodes
function allEpisodesDropdown(allEpisodes) {
  const select = document.getElementById("episodes-dropdown");
  select.innerHTML = ""; // Clear the existing dropdown options

  const option = document.createElement("option");
  option.value = "all";
  option.textContent = "All Episodes";
  select.appendChild(option);

  allEpisodes.forEach(episode => {
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `S${createEpisodeNumber(episode.season)}E${createEpisodeNumber(episode.number)} - ${episode.name}`;
    select.appendChild(option);
  });
}

// Run the setup function when the page is loaded
window.onload = setup;

