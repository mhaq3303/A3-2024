const apiKey = "91574a6ba1164bd5a7cb766c4251213b";
const url = `https://api.rawg.io/api/games?key=${apiKey}&dates=2010-01-01,2019-12-31&platforms=18,1,7`;
// Function to call the API
async function callAPI() {
    fetch(url).then((response)=>{
        if (!response.ok) throw new Error("Network response was not ok " + response.statusText);
        return response.json();
    }).then((data)=>{
        displayGames(data.results);
    }).catch((error)=>{
        console.error("There has been a problem with your fetch operation:", error);
    });
}
// Function to display games
function displayGames(games) {
    const gamesContainer = document.getElementById("games");
    games.forEach((game)=>{
        const gameElement = document.createElement("div");
        gameElement.className = "game";
        const gameImage = document.createElement("img");
        gameImage.src = game.background_image;
        gameImage.alt = `${game.name} cover image`;
        const gameDetails = document.createElement("div");
        gameDetails.className = "game-details";
        const gameTitle = document.createElement("div");
        gameTitle.className = "game-title";
        gameTitle.textContent = game.name;
        const gameReleaseDate = document.createElement("div");
        gameReleaseDate.className = "game-release-date";
        gameReleaseDate.textContent = `Released: ${game.released}`;
        gameDetails.appendChild(gameTitle);
        gameDetails.appendChild(gameReleaseDate);
        gameElement.appendChild(gameImage);
        gameElement.appendChild(gameDetails);
        gamesContainer.appendChild(gameElement);
    });
}
// Call the function
callAPI();

//# sourceMappingURL=index.44983732.js.map
