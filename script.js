//You can edit ALL of the code here
import { getAllEpisodes } from "./episodes.js";
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
  displayEpisodes(allEpisodes); 


function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;
}
function createEpisodeNumber(num) {
  return num.toString().padStart(2, "0");
}

function displayEpisodes(episodes) {
 // console.log("AM here testing");
 const container = document.getElementById("root");
 container.innerHTML = ""; // Clear any previous content
 //container.appendChild(episodeCount);

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
      link.href = episode.url;
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
}

window.onload = setup;
