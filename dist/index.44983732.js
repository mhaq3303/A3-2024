const apiKey = "91574a6ba1164bd5a7cb766c4251213b";
let baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&dates=2010-01-01,2019-12-31&platforms=18,1,7`; // Set initial baseUrl to default decade
let currentPage = 1;
let totalPages = 1;
let completedGames = JSON.parse(localStorage.getItem("completedGames")) || [];
let backloggedGames = JSON.parse(localStorage.getItem("backloggedGames")) || [];
// Function to call the API
async function callAPI(page, query = "") {
    let url = `${baseUrl}&page=${page}`;
    if (query) url += `&search=${query}`;
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
        gameImage.addEventListener("click", ()=>loadGameDetails(game.id)); // Add event listener to load game details
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
async function loadGameDetails(gameId, fromProfile = false, profileSection = "") {
    const profileParam = fromProfile ? `&fromProfile=true&profileSection=${profileSection}` : "";
    window.location.href = `?game=${gameId}${profileParam}`;
}
// Function to display game details
async function displayGameDetails(gameId) {
    const gamesContainer = document.getElementById("games");
    const gameDetailsContainer = document.getElementById("game-details");
    const profilePageContainer = document.getElementById("profile-page");
    const decadeDropdown = document.getElementById("decadeDropdown");
    const profileDropdown = document.getElementById("profileDropdown");
    const gameListTitle = document.getElementById("gameListTitle"); // Get the game list title element
    gamesContainer.style.display = "none";
    gameDetailsContainer.style.display = "block";
    profilePageContainer.style.display = "none";
    decadeDropdown.style.display = "none";
    profileDropdown.style.display = "none";
    gameListTitle.style.display = "none"; // Hide the game list title
    try {
        const response = await fetch(`https://api.rawg.io/api/games/${gameId}?key=${apiKey}`);
        if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
        const game = await response.json();
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
                <button class="btn btn-secondary mt-2" onclick="goBack()">Go Back</button>
            </div>
        `;
    } catch (error) {
        console.error("There has been a problem with your fetch operation:", error);
    }
}
// Function to mark a game as completed
function markAsCompleted(game) {
    if (!completedGames.some((g)=>g.id === game.id)) {
        completedGames.push(game);
        localStorage.setItem("completedGames", JSON.stringify(completedGames));
        alert("Game marked as completed.");
    } else alert("Game is already marked as completed.");
}
// Function to mark a game as backlogged
function markAsBacklogged(game) {
    if (!backloggedGames.some((g)=>g.id === game.id)) {
        backloggedGames.push(game);
        localStorage.setItem("backloggedGames", JSON.stringify(backloggedGames));
        alert("Game marked as backlogged.");
    } else alert("Game is already marked as backlogged.");
}
// Function to display the profile page
function displayProfilePage() {
    const gamesContainer = document.getElementById("games");
    const gameDetailsContainer = document.getElementById("game-details");
    const profilePageContainer = document.getElementById("profile-page");
    const profileGamesContainer = document.getElementById("profile-games");
    const decadeDropdown = document.getElementById("decadeDropdown");
    const profileDropdown = document.getElementById("profileDropdown");
    gamesContainer.style.display = "none";
    gameDetailsContainer.style.display = "none";
    profilePageContainer.style.display = "block";
    decadeDropdown.style.display = "none";
    profileDropdown.style.display = "block";
    profileGamesContainer.innerHTML = ""; // Clear previous results
    displayCompletedGames(); // Default to completed games
    document.getElementById("view-completed").addEventListener("click", (event)=>{
        event.preventDefault();
        displayCompletedGames();
    });
    document.getElementById("view-backlogged").addEventListener("click", (event)=>{
        event.preventDefault();
        displayBackloggedGames();
    });
}
// Function to display completed games
function displayCompletedGames() {
    const profileGamesContainer = document.getElementById("profile-games");
    profileGamesContainer.innerHTML = ""; // Clear previous results
    completedGames.forEach((game)=>{
        const gameElement = document.createElement("div");
        gameElement.className = "game";
        const gameImage = document.createElement("img");
        gameImage.src = game.background_image;
        gameImage.alt = `${game.name} cover image`;
        gameImage.addEventListener("click", ()=>loadGameDetails(game.id, true, "completed")); // Pass profileSection=completed
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
        profileGamesContainer.appendChild(gameElement);
    });
}
function displayBackloggedGames() {
    const profileGamesContainer = document.getElementById("profile-games");
    profileGamesContainer.innerHTML = ""; // Clear previous results
    backloggedGames.forEach((game)=>{
        const gameElement = document.createElement("div");
        gameElement.className = "game";
        const gameImage = document.createElement("img");
        gameImage.src = game.background_image;
        gameImage.alt = `${game.name} cover image`;
        gameImage.addEventListener("click", ()=>loadGameDetails(game.id, true, "backlogged")); // Pass profileSection=backlogged
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
        profileGamesContainer.appendChild(gameElement);
    });
}
// Function to go back to the main page
function goBack() {
    const gamesContainer = document.getElementById("games");
    const gameDetailsContainer = document.getElementById("game-details");
    const profilePageContainer = document.getElementById("profile-page");
    const profileGamesContainer = document.getElementById("profile-games");
    const decadeDropdown = document.getElementById("decadeDropdown");
    const profileDropdown = document.getElementById("profileDropdown");
    const gameListTitle = document.getElementById("gameListTitle"); // Get the game list title element
    // Check if the user was on the profile page
    const urlParams = new URLSearchParams(window.location.search);
    const fromProfile = urlParams.get("fromProfile");
    const profileSection = urlParams.get("profileSection");
    if (fromProfile) {
        // If the user came from the profile page
        gamesContainer.style.display = "none";
        profilePageContainer.style.display = "block";
        profileDropdown.style.display = "block";
        decadeDropdown.style.display = "none";
        gameDetailsContainer.style.display = "none";
        gameListTitle.style.display = "block"; // Show the game list title
        if (profileSection === "completed") displayCompletedGames();
        else if (profileSection === "backlogged") displayBackloggedGames();
    } else {
        // Default behavior: go back to the main page
        gamesContainer.style.display = "block";
        profilePageContainer.style.display = "none";
        gameDetailsContainer.style.display = "none";
        decadeDropdown.style.display = "block";
        profileDropdown.style.display = "none";
        gameListTitle.style.display = "block"; // Show the game list title
        history.pushState({}, "", "./");
    }
}
// Event listener for the search form
document.getElementById("searchForm").addEventListener("submit", (event)=>{
    event.preventDefault(); // Prevent default form submission
    const query = document.getElementById("searchInput").value;
    callAPI(1, query); // Reset to page 1 when performing a new search
});
document.getElementById("profileButton").addEventListener("click", (event)=>{
    event.preventDefault(); // Prevent default behavior
    displayProfilePage();
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
    document.getElementById("all-decades").addEventListener("click", (event)=>{
        event.preventDefault(); // Prevent default behavior
        baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&platforms=18,1,7`;
        callAPI(1); // Reset to page 1 when selecting all decades
    });
    // Handle browser back/forward buttons
    window.addEventListener("popstate", (event)=>{
        if (event.state && event.state.gameId) displayGameDetails(event.state.gameId);
        else goBack();
    });
    // Check if URL has game query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get("game");
    const fromProfile = urlParams.get("fromProfile");
    const profileSection = urlParams.get("profileSection");
    if (gameId) displayGameDetails(gameId);
    else if (fromProfile) goBack();
    else // Initial API call
    callAPI(currentPage);
});

//# sourceMappingURL=index.44983732.js.map
