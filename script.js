//You can edit ALL of the code here
const state = {
  allEpisodes: [],
  searchTerm: "",
  allTvShows:[]
};


//fetch series dropdown
const allTvShowEndpoint = "https://api.tvmaze.com/shows"
const fetchTvShows = async () => {
  try {
    const response = await fetch(allTvShowEndpoint);
    if (!response.ok) {
      throw new Error("Error: " + response.status + " - " + response.statusText);
    }
    const data = await response.json();
    state.allTvShows = data;
    populateTvShowsDropdown(state.allTvShows);
    renderTvShow(state.allTvShows); // Render all TV shows initially
  } catch (error) {
    console.error("Error fetching TV shows:", error);
  }
}



let tvShowId = 0; // Initialize tvShowId variable
// Fetch episodes from API
async function fetchEpisodes(id) {
  try {
    const response = await fetch(`https://api.tvmaze.com/shows/${id}/episodes`);
    if (!response.ok) {
      throw new Error("Error: " + response.status + " - " + response.statusText);
    }
    const data = await response.json();
    state.allEpisodes = data;
    renderEpisodes(state.allEpisodes);
    allEpisodesDropdown(state.allEpisodes);
  } catch (error) {
    console.error("Error fetching episodes:", error);
  }
}


// Setup function to call fetch and renderEpisodes episodes
const searchInput = document.getElementById("searchInput");
const tvShowSelect = document.querySelector('#tv-show-dropdown');
const select = document.getElementById("episodes-dropdown");
const tvShowDropDownContent = document.querySelector('#episodes-dropdown-content');


 function setup() {
  fetchTvShows(); // async but doesn't need to be awaited here
  
  select.addEventListener("change", episodeDropdownChange);
  searchInput.addEventListener("keyup", search);
  tvShowSelect.addEventListener("change", tvShowDropDownChange);
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

// RenderEpisodes episodes on the page
function renderEpisodes(episodes) {
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

// Create a 2-digit episode number
function createEpisodeNumber(num) {
  return num.toString().padStart(2, "0");
}

// Display episodes in the DOM


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
  renderEpisodes(filteredEpisodes); // Render all TV shows again
};

// Dropdown function to filter episodes by selection
function episodeDropdownChange(event) {
  const selectedValue = event.target.value;
  if (selectedValue === "all") {
    renderEpisodes(state.allEpisodes);
  } else {
    const selectedId = parseInt(selectedValue);
    const filteredEpisodes = state.allEpisodes.filter(episode => episode.id === selectedId);
    renderEpisodes(filteredEpisodes);
  }
}



// Run the setup function when the page is loaded
// Function to create a dropdown for all TV Shows

  function tvShowDropDownChange(event) {
    const selectedValue = event.target.value;
    if (selectedValue === "all") {
      tvShowDropDownContent.style.display = "none"; // Hide the dropdown content
      renderTvShow(state.allTvShows);
    } else {
      tvShowDropDownContent.style.display = "block"; // Show the dropdown content
      const selectedId = parseInt(selectedValue);
      const filteredTvShows = state.allTvShows.filter(show => show.id === selectedId);
      renderTvShow(filteredTvShows); 
     
      tvShowId = selectedValue;
      fetchEpisodes(tvShowId); // Fetch episodes for the selected TV show
      
    }
  }

function populateTvShowsDropdown(tvShows) {
  tvShowSelect.innerHTML = ""; // Clear existing options
  const option = document.createElement("option");
  option.value = "all";
  option.textContent = "All TV Shows";
  tvShowSelect.appendChild(option);
  
  tvShows.forEach(show => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    tvShowSelect.appendChild(option);
  });
}

//TV Show Render function
function renderTvShow(shows) {
  const container = document.getElementById("root");
  container.innerHTML = ""; // Clear any previous content
  const heading = document.createElement("h2");
  heading.textContent = `${shows.length} TV shows found`;
  container.appendChild(heading);

  shows.forEach(show => {
    const showCard = document.createElement("div");
    showCard.classList.add("episode-card");

    const title = document.createElement("h3");
    title.textContent = show.name;

    const image = document.createElement("img");
    image.src = show.image?.medium || "";
    image.alt = show.name;

    const summary = document.createElement("p");
    summary.innerHTML = show.summary;

    const link = document.createElement("a");
    link.href = show.url;
    link.target = "_blank";
    link.textContent = "View on TVMaze";

    showCard.append(title, image, summary, link); 
    container.appendChild(showCard);
  });
}

window.onload = setup;

