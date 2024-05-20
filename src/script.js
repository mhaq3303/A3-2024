const apiKey = '91574a6ba1164bd5a7cb766c4251213b';
let baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&dates=2010-01-01,2019-12-31&platforms=18,1,7`;
let currentPage = 1;
let totalPages = 1;

// Function to call the API
async function callAPI(page) {
    fetch(`${baseUrl}&page=${page}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log(data.results); // Log the array of games
            totalPages = Math.ceil(data.count / data.results.length);
            displayGames(data.results);
            currentPage = page; // Update currentPage after successful fetch
            updatePaginationButtons();
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

// Function to display games
function displayGames(games) {
    const gamesContainer = document.getElementById('games');
    gamesContainer.innerHTML = ''; // Clear previous results
    games.forEach(game => {
        const gameElement = document.createElement('div');
        gameElement.className = 'game';

        const gameImage = document.createElement('img');
        gameImage.src = game.background_image;
        gameImage.alt = `${game.name} cover image`;

        const gameDetails = document.createElement('div');
        gameDetails.className = 'game-details';

        const gameTitle = document.createElement('div');
        gameTitle.className = 'game-title';
        gameTitle.textContent = game.name;

        const gameReleaseDate = document.createElement('div');
        gameReleaseDate.className = 'game-release-date';
        gameReleaseDate.textContent = `Released: ${game.released}`;

        const gamePlatforms = document.createElement('div');
        gamePlatforms.className = 'game-platforms';
        gamePlatforms.textContent = `Available Platforms: ${game.platforms.map(p => p.platform.name).join(', ')}`;

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
    document.getElementById('prevPage').disabled = currentPage <= 1;
    document.getElementById('nextPage').disabled = currentPage >= totalPages;
}

// Event listeners for pagination buttons
document.getElementById('prevPage').addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default behavior
    if (currentPage > 1) {
        callAPI(currentPage - 1);
    }
});

document.getElementById('nextPage').addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default behavior
    if (currentPage < totalPages) {
        callAPI(currentPage + 1);
    }
});

// Event listeners for decade buttons
document.getElementById('decade-2000').addEventListener('click', () => {
    baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&dates=2000-01-01,2009-12-31&platforms=18,1,7`;
    currentPage = 1;
    callAPI(currentPage);
});

document.getElementById('decade-2010').addEventListener('click', () => {
    baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&dates=2010-01-01,2019-12-31&platforms=18,1,7`;
    currentPage = 1;
    callAPI(currentPage);
});

document.getElementById('decade-2020').addEventListener('click', () => {
    baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&dates=2020-01-01,2029-12-31&platforms=18,1,7`;
    currentPage = 1;
    callAPI(currentPage);
});

// Initial API call
callAPI(currentPage);
