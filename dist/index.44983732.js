const apiKey = "91574a6ba1164bd5a7cb766c4251213b";
let baseUrl = `https://api.rawg.io/api/games?key=${apiKey}`;
let currentPage = 1;
let totalPages = 1;
// Function to call the API
async function callAPI(page, query = "") {
    let url = `${baseUrl}&page=${page}`;
    if (query) url += `&search=${query}`;
    else url += "&dates=2010-01-01,2019-12-31&platforms=18,1,7";
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
        const data = await response.json();
        console.log(data.results); // Log the array of games
        totalPages = Math.ceil(data.count / data.results.length);
        displayGames(data.results);
        currentPage = page; // Update currentPage after successful fetch
        updatePaginationButtons();
    } catch (error) {
        console.error("There has been a problem with your fetch operation:", error);
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
        console.error("There has been a problem with your fetch operation:", error);
    }
}
// Function to display game details
function displayGameDetails(game) {
    const gamesContainer = document.getElementById("games");
    const gameDetailsContainer = document.getElementById("game-details");
    gamesContainer.style.display = "none";
    gameDetailsContainer.style.display = "block";
    const developers = game.developers ? game.developers.map((dev)=>dev.name).join(", ") : "N/A";
    const publishers = game.publishers ? game.publishers.map((pub)=>pub.name).join(", ") : "N/A";
    const metascore = game.metacritic !== null ? game.metacritic : "N/A";
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
            <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" id="statusDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                    Mark as
                </button>
                <ul class="dropdown-menu" aria-labelledby="statusDropdown">
                    <li><a class="dropdown-item" href="#" id="markCompleted">Completed</a></li>
                    <li><a class="dropdown-item" href="#" id="markBacklogged">Backlogged</a></li>
                </ul>
            </div>
            <button class="btn btn-secondary mt-2" onclick="goBack()">Go Back</button>
        </div>
    `;
    document.getElementById("markCompleted").addEventListener("click", ()=>{
        alert("Game marked as completed.");
    // Add any additional functionality here
    });
    document.getElementById("markBacklogged").addEventListener("click", ()=>{
        alert("Game marked as backlogged.");
    // Add any additional functionality here
    });
}
// Function to go back to the main page
function goBack() {
    const gamesContainer = document.getElementById("games");
    const gameDetailsContainer = document.getElementById("game-details");
    gamesContainer.style.display = "block";
    gameDetailsContainer.style.display = "none";
    history.pushState({}, "", "./");
}
// Event listener for the search form
document.getElementById("searchForm").addEventListener("submit", (event)=>{
    event.preventDefault(); // Prevent default form submission
    const query = document.getElementById("searchInput").value;
    callAPI(1, query); // Reset to page 1 when performing a new search
});
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
