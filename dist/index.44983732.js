const apiKey = "91574a6ba1164bd5a7cb766c4251213b";
let baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&dates=2010-01-01,2019-12-31&platforms=18,1,7`;
let currentPage = 1;
let totalPages = 1;
// Function to call the API
async function callAPI(page) {
    fetch(`${baseUrl}&page=${page}`).then((response)=>{
        if (!response.ok) throw new Error("Network response was not ok " + response.statusText);
        return response.json();
    }).then((data)=>{
        console.log(data.results); // Log the array of games
        totalPages = Math.ceil(data.count / data.results.length);
        displayGames(data.results);
        currentPage = page; // Update currentPage after successful fetch
        updatePaginationButtons();
    }).catch((error)=>{
        console.error("There has been a problem with your fetch operation:", error);
    });
}
// Function to display games
function displayGames(games) {
    const gamesContainer = document.getElementById("games");
    gamesContainer.innerHTML = ""; // Clear previous results
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
        const gamePlatforms = document.createElement("div");
        gamePlatforms.className = "game-platforms";
        gamePlatforms.textContent = `Available Platforms: ${game.platforms.map((p)=>p.platform.name).join(", ")}`;
        gameDetails.appendChild(gameTitle);
        gameDetails.appendChild(gameReleaseDate);
        gameDetails.appendChild(gamePlatforms);
        gameElement.appendChild(gameImage);
        gameElement.appendChild(gameDetails);
        gamesContainer.appendChild(gameElement);
    });
}
// Function to update pagination buttons
function updatePaginationButtons() {
    for(let i = 1; i <= 8; i++){
        const button = document.getElementById(`page-${i}`);
        if (button) {
            button.disabled = i === currentPage;
            button.style.display = i <= totalPages ? "inline-block" : "none"; // Show only the necessary buttons
        }
    }
}
document.addEventListener("DOMContentLoaded", ()=>{
    // Event listeners for pagination buttons
    for(let i = 1; i <= 8; i++){
        const button = document.getElementById(`page-${i}`);
        if (button) button.addEventListener("click", (event)=>{
            event.preventDefault(); // Prevent default behavior
            callAPI(i);
        });
    }
    // Event listeners for decade buttons
    document.getElementById("decade-2000").addEventListener("click", (event)=>{
        event.preventDefault(); // Prevent default behavior
        baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&dates=2000-01-01,2009-12-31&platforms=18,1,7`;
        callAPI(1); // Reset to page 1 when changing decades
    });
    document.getElementById("decade-2010").addEventListener("click", (event)=>{
        event.preventDefault(); // Prevent default behavior
        baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&dates=2010-01-01,2019-12-31&platforms=18,1,7`;
        callAPI(1); // Reset to page 1 when changing decades
    });
    document.getElementById("decade-2020").addEventListener("click", (event)=>{
        event.preventDefault(); // Prevent default behavior
        baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&dates=2020-01-01,2023-12-31&platforms=18,1,7`;
        callAPI(1); // Reset to page 1 when changing decades
    });
    // Initial API call
    callAPI(currentPage);
});

//# sourceMappingURL=index.44983732.js.map
