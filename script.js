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
const episodeCache = {};

async function handleShowClick(showID) {
  backToShowButton.style.display = "inline-block";
  searchInput.style.display = "block";
  showSearchInput.style.display = "none";
  select.style.display = "block"
  episodeDropDownContent.style.display = "block";
  document.getElementById("tv-show-dropdown-content").style.display = "none";


  if (!episodeCache[showID]) {
    await fetchEpisodes(showID);
    episodeCache[showID] = [...state.allEpisodes];
  } else {
    state.allEpisodes = episodeCache[showID];
    renderEpisodes(state.allEpisodes);
    allEpisodesDropdown(state.allEpisodes);
  }
  }
  
// Setup function to call fetch and renderEpisodes episod
const searchInput = document.getElementById("searchInput");
const tvShowSelect = document.querySelector('#tv-show-dropdown');
const select = document.getElementById("episodes-dropdown");
const episodeDropDownContent = document.querySelector('#episodes-dropdown-content');
const backToShowButton = document.getElementById("back-to-shows");
const showSearchInput = document.getElementById("show-search");

searchInput.style.display = "none";
episodeDropDownContent.style.display = "none";

 function setup() {
  fetchTvShows(); 
  backToShowButton.classList.add("hidden"); // async but doesn't need to be awaited here
  
  select.addEventListener("change", episodeDropdownChange);
  searchInput.addEventListener("keyup", search);
  tvShowSelect.addEventListener("change", tvShowDropDownChange);

 

   backToShowButton.addEventListener("click", () => {
     backToShowButton.classList.add("hidden");
     searchInput.style.display = "none";
     showSearchInput.style.display = "block"
    //  tvShowSelect.style.display = "block";
     select.style.display = "none";
     renderTvShow(state.allTvShows);
 });

 const showSearchInput = document.getElementById("show-search");
 searchInput.addEventListener("input", () => {
  const term = showSearchInput.value.toLowerCase().trim();
  const filtered = state.allTvShows.filter(show => {
    return (
      show.name.toLowerCase().includes(term) ||
      show.genre.join(", ").toLowerCase().includes(term) ||
      show.summary.toLowerCase().includes(term)
    );
  })
      renderTvShow(filtered)
 });
 
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

// Showing the show count in the nav bar
const showCount = document.getElementById("show-count");
// RenderEpisodes episodes on the page
function renderEpisodes(episodes) {
  const container = document.getElementById("root");
  container.innerHTML = ""; // Clear any previous content

  // Episode count display
  // const episodeCount = document.createElement("h2");
  // episodeCount.textContent = howManyEpisodes(episodes);
  // container.appendChild(episodeCount);
  showCount.textContent = howManyEpisodes(episodes); // Update the show count in the nav bar

  episodes.forEach(episode => {
    const episodeCard = document.createElement("div");
    episodeCard.classList.add("episode-card");
    
    const title = document.createElement("h3");
    title.textContent = `${episode.name} (S${createEpisodeNumber(episode.season)} E${createEpisodeNumber(episode.number)})`;
    
    const image = document.createElement("img");
    image.src = episode.image?.original || episode.image?.medium;
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
      episodeDropDownContent.style.display = "none";
      backToShowButton.classList.add("hidden"); // Hide the dropdown content
      renderTvShow(state.allTvShows);
    } else {
      episodeDropDownContent.style.display = "block"; // Show the dropdown content
      const selectedId = parseInt(selectedValue);
      const filteredTvShows = state.allTvShows.filter(show => show.id === selectedId);
      renderTvShow(filteredTvShows); 
     
      tvShowId = selectedValue;
      handleShowClick(tvShowId); // Fetch episodes for the selected TV show
      
    }
  }

function populateTvShowsDropdown(tvShows) {
  tvShowSelect.innerHTML = ""; // Clear existing options
  tvShows.sort((a, b) => a.name.localeCompare(b.name)); // Sort TV shows by name
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
  backToShowButton.style.display = "none";
  const container = document.getElementById("root");
  container.classList.add("column-layout");
  container.innerHTML = "";
  // Clear any previous content
  // const heading = document.createElement("h2");
  // heading.textContent = `${shows.length} TV shows found`;
  // container.appendChild(heading);
  //This line was causing the problem, you don't want the number of TV show found to append to your container, because you set a fixed width for the container, and when you add the heading, it will break the layout.
  //In your html nav bar I created a div with ID "show-count" to show the number of TV shows found.

  showCount.textContent = `${shows.length} TV shows found`;
  shows.forEach(show => {
    const showCard = document.createElement("div");
    showCard.classList.add("episode-card");

    const title = document.createElement("h3");
    title.textContent = show.name;
    title.style.cursor = "pointer";
    title.classList.add("show-title"); 
    title.addEventListener("click", () => handleShowClick(show.id));

    const image = document.createElement("img");
    image.src = show.image?.medium || "";
    image.alt = show.name;
    image.classList.add("show-image");
    image.addEventListener("click", () => handleShowClick(show.id));
    //added event listener to the image ,so when ever the user clicks on the image it wil directly take him 
    // to the epiisode of that show page.

    const summary = document.createElement("p");
    summary.innerHTML = show.summary;
    summary.classList.add("show-summary"); 

    const details = document.createElement("p");
    details.classList.add("show-details");
    details.innerHTML =`
      <strong>Genres:</strong> ${show.genres.join(", ")}<br>
      <strong>Status:</strong> ${show.status}<br>
      <strong>Rating:</strong> ${show.rating.average || "N/A"}<br>
      <strong>Runtime:</strong> ${show.runtime} min
      `;

    // const link = document.createElement("a");
    // link.href = show.url;
    // link.target = "_blank";
    // link.textContent = "View on TVMaze";
    const showContent = document.createElement("div");
    showContent.classList.add("show-content");
    showContent.append(image, summary, details);
    showCard.append(title, showContent); 
    container.appendChild(showCard);
  });
}

window.onload = setup;

