//You can edit ALL of the code here

import { getAllEpisodes } from "./episodes.js";

const allEpisodes = getAllEpisodes();
const state={
  allEpisodes: allEpisodes,
  searchTerm:""
}
function setup() {
  render(allEpisodes);
  allEpisodesDropdown(allEpisodes);
}

function render(episodeList) {
  
  // const rootElem = document.getElementById("root");
   // rootElem.textContent = `Got ${episodeList.length} episode(s)`;
   displayEpisodes(episodeList);
 }
 
 function createEpisodeNumber(num) {
   return num.toString().padStart(2, "0");
 }

 function displayEpisodes(episodes) {
  // console.log("AM here testing");
  const container = document.getElementById("root");
  container.innerHTML = ""; // Clear any previous content

  //Episode count displayer
  const episodeCount = document.createElement("h2");
  episodeCount.textContent = howManyEpisodes(episodes);
   //This line displays the number of the episodes was found in the search
  container.appendChild(episodeCount);

  episodes.forEach(episode => {
     
      const episodeCard = document.createElement("div");
      episodeCard.classList.add("episode-card");

      const title = document.createElement("h3");
      title.textContent = `${episode.name}(S${createEpisodeNumber(episode.season)} E${createEpisodeNumber(episode.number)})`

      const image = document.createElement("img");
      image.src = episode.image?.medium
      image.alt = episode.name;

      const summary = document.createElement("p");
      summary.innerHTML = episode.summary

      const link = document.createElement("a");
      link.href = link.url;
      link.target = "_blank";
      link.textContent = "view on TVMaze";

      episodeCard.append(title,image,summary,link);
      container.appendChild(episodeCard);
      document.body.append(container);
})
    document.addEventListener("DOMContentLoaded", () => {
      if (typeof getAllEpisodes === "function"){
         const episodes = getAllEpisodes();
         displayEpisodes(episodes);
       }  else {
         console.error("getAllEpisodes function is not defined!");
      }      
});
 }
 
 
 //Search function 
 const search = (event) => {
  const searchTerm = searchInput.value.toLowerCase().trim();
  state.searchTerm = searchTerm;

  let filteredEpisodes = state.allEpisodes.filter((episode) => {
    return (
      episode.name.toLowerCase().includes(state.searchTerm) ||
      episode.summary.toLowerCase().includes(state.searchTerm) ||
      episode.season.toString().includes(state.searchTerm) ||
      episode.number.toString().includes(state.searchTerm) ||
      // MILLENA : I added this line to filter by episode ID, If you find it confusing or useless, you can remove it.
      episode.id.toString().includes(state.searchTerm)
    );
  });

  
  // Update the display with the filtered results
  displayEpisodes(filteredEpisodes);
};

//This function is used to display the number of episodes found in the search
function howManyEpisodes(episodes) {
 return episodes.length===0? `No episode was found` : episodes.length === 1
   ? `${episodes.length} episode was found`
   : `${episodes.length} episodes found`;
}
//Search event listener 
 const searchInput = document.getElementById("seachInput");
  searchInput.addEventListener("keyup", search
  );

  //dropdown event listener
  const select = document.getElementById("episodes-dropdown");
  function allEpisodesDropdown(allEpisodes) {
    
    const option = document.createElement("option");
    option.value = "all";
      option.textContent = `All Episodes`;
      select.appendChild(option);
    allEpisodes.forEach(episode => {
      const option = document.createElement("option");
      option.value = episode.id;
      option.textContent = `S${createEpisodeNumber(episode.season)}E${createEpisodeNumber(episode.number)} - ${episode.name}`;
      select.appendChild(option);
      
    }
    );
  }
  
  select.addEventListener("change", (event) => {
    const selectedValue = event.target.value;

    if(selectedValue === "all") {
      render(allEpisodes);
      return;
    }
    const selectedId = parseInt(event.target.value);
    const filteredEpisodes = allEpisodes.filter(episode => episode.id === selectedId);
    console.log(selectedId);
    selectedId === "all" ? render(state.allEpisodes) : render(filteredEpisodes);
    
  });

window.onload = setup;
