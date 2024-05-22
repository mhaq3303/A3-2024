const apiKey = "91574a6ba1164bd5a7cb766c4251213b";
let baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&dates=2010-01-01,2019-12-31&platforms=18,1,7`;
let currentPage = 1;
let totalPages = 1;
// Function to call the API
async function callAPI(page) {
    try {
        const response = await fetch(`${baseUrl}&page=${page}`);
        if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
        const data = await response.json();
        console.log(data.results); // Log the array of games
        totalPages = Math.ceil(data.count / data.results.length);
        displayGames(data.results);
        currentPage = page; // Update currentPage after successful fetch
        updatePaginationButtons();
    } catch (error) {
        handleFetchError(error);
    }
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
        gameImage.addEventListener("click", ()=>loadGameDetails(game.id));
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
        const gameGenres = document.createElement("div");
        gameGenres.className = "game-genres";
        gameGenres.textContent = `Genres: ${game.genres.map((g)=>g.name).join(", ")}`;
        gameDetails.appendChild(gameTitle);
        gameDetails.appendChild(gameReleaseDate);
        gameDetails.appendChild(gamePlatforms);
        gameDetails.appendChild(gameGenres);
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
// Function to load game details
async function loadGameDetails(gameId) {
    try {
        console.log(`Loading details for game ID: ${gameId}`); // Debugging
        const response = await fetch(`https://api.rawg.io/api/games/${gameId}?key=${apiKey}`);
        if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
        const data = await response.json();
        displayGameDetails(data);
        history.pushState({
            gameId
        }, "", `?game=${gameId}`);
    } catch (error) {
        handleFetchError(error);
    }
}
// Function to handle fetch errors
function handleFetchError(error) {
    if (error.message.includes("67ee4b4236c76bdd")) console.warn("Ignoring content key error:", error.message);
    else console.error("There has been a problem with your fetch operation:", error);
}
function displayGameDetails(game) {
    const gamesContainer = document.getElementById("games");
    const gameDetailsContainer = document.getElementById("game-details");
    gamesContainer.style.display = "none";
    gameDetailsContainer.style.display = "block";
    const developers = game.developers.map((dev)=>dev.name).join(", ");
    const publishers = game.publishers.map((pub)=>pub.name).join(", ");
    const metascore = game.metacritic;
    gameDetailsContainer.innerHTML = `
        <div class="game-details-page">
            <h2>${game.name}</h2>
            <img src="${game.background_image}" alt="${game.name} cover image" />
            <p><strong>Released:</strong> ${game.released}</p>
            <p><strong>Available Platforms:</strong> ${game.platforms.map((p)=>p.platform.name).join(", ")}</p>
            <p><strong>Genres:</strong> ${game.genres.map((g)=>g.name).join(", ")}</p>
            <p><strong>Developers:</strong> ${developers}</p>
            <p><strong>Publishers:</strong> ${publishers}</p>
            <p><strong>Metascore:</strong> ${metascore}</p>
            <p>${game.description_raw}</p>
            <button class="btn btn-secondary" onclick="goBack()">Go Back</button>
        </div>
    `;
}
// Function to go back to the main page
function goBack() {
    const gamesContainer = document.getElementById("games");
    const gameDetailsContainer = document.getElementById("game-details");
    gamesContainer.style.display = "block";
    gameDetailsContainer.style.display = "none";
    history.pushState({}, "", "./");
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
    // Handle browser back/forward buttons
    window.addEventListener("popstate", (event)=>{
        if (event.state && event.state.gameId) loadGameDetails(event.state.gameId);
        else goBack();
    });
    // Check if URL has game query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get("game");
    if (gameId) loadGameDetails(gameId);
    else // Initial API call
    callAPI(currentPage);
});

//# sourceMappingURL=index.44983732.js.map
