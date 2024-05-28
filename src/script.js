const apiKey = '91574a6ba1164bd5a7cb766c4251213b';
let baseUrl = `https://api.rawg.io/api/games?key=${apiKey}`;
let currentPage = 1;
let totalPages = 1;
let completedGames = JSON.parse(localStorage.getItem('completedGames')) || [];
let backloggedGames = JSON.parse(localStorage.getItem('backloggedGames')) || [];

// Function to call the API
async function callAPI(page, query = '') {
    let url = `${baseUrl}&page=${page}`;
    if (query) {
        url += `&search=${query}`;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data.results); // Log the array of games
        totalPages = Math.ceil(data.count / data.results.length);
        displayGames(data.results);
        currentPage = page; // Update currentPage after successful fetch
        updatePaginationButtons();
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
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
        gameImage.addEventListener('click', () => loadGameDetails(game.id)); // Add event listener to load game details

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

        const gameGenres = document.createElement('div');
        gameGenres.className = 'game-genres';
        gameGenres.textContent = `Genres: ${game.genres.map(g => g.name).join(', ')}`;

        const markAsCompletedButton = document.createElement('button');
        markAsCompletedButton.className = 'btn-completed';
        markAsCompletedButton.textContent = 'Mark as Completed';
        markAsCompletedButton.addEventListener('click', (event) => {
            event.stopPropagation();
            markAsCompleted(game);
            alert('Game marked as completed.');
        });

        const markAsBackloggedButton = document.createElement('button');
        markAsBackloggedButton.className = 'btn-backlogged';
        markAsBackloggedButton.textContent = 'Mark as Backlogged';
        markAsBackloggedButton.addEventListener('click', (event) => {
            event.stopPropagation();
            markAsBacklogged(game);
            alert('Game marked as backlogged.');
        });

        gameDetails.appendChild(gameTitle);
        gameDetails.appendChild(gameReleaseDate);
        gameDetails.appendChild(gamePlatforms);
        gameDetails.appendChild(gameGenres);
        gameDetails.appendChild(markAsCompletedButton);
        gameDetails.appendChild(markAsBackloggedButton);
        gameElement.appendChild(gameImage);
        gameElement.appendChild(gameDetails);
        gamesContainer.appendChild(gameElement);
    });
}

// Function to update pagination buttons
function updatePaginationButtons() {
    for (let i = 1; i <= 8; i++) { // Assuming you have 8 buttons
        const button = document.getElementById(`page-${i}`);
        if (button) {
            button.disabled = (i === currentPage);
            button.style.display = i <= totalPages ? 'inline-block' : 'none'; // Show only the necessary buttons
        }
    }
}

// Function to load game details
async function loadGameDetails(gameId, fromProfile = false, profileSection = '') {
    const profileParam = fromProfile ? `&fromProfile=true&profileSection=${profileSection}` : '';
    history.pushState({}, '', `?game=${gameId}${profileParam}`); // Use history.pushState to update the URL without reloading

    const gamesContainer = document.getElementById('games');
    const gameDetailsContainer = document.getElementById('game-details');
    const profilePageContainer = document.getElementById('profile-page');
    const decadeDropdown = document.getElementById('decadeDropdown');
    const filterDropdown = document.getElementById('filterDropdown');
    const clearFiltersButton = document.getElementById('clearFiltersButton');
    const gameListTitle = document.getElementById('gameListTitle'); // Get the game list title element

    gamesContainer.style.display = 'none';
    gameDetailsContainer.style.display = 'block';
    profilePageContainer.style.display = 'none';
    decadeDropdown.style.display = 'none';
    filterDropdown.style.display = 'none';
    clearFiltersButton.style.display = 'none';
    gameListTitle.style.display = 'none'; // Hide the game list title

    try {
        const response = await fetch(`https://api.rawg.io/api/games/${gameId}?key=${apiKey}`);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const game = await response.json();

        const developers = game.developers ? game.developers.map(dev => dev.name).join(', ') : 'N/A';
        const publishers = game.publishers ? game.publishers.map(pub => pub.name).join(', ') : 'N/A';
        const metascore = game.metacritic !== null ? game.metacritic : 'N/A';

        // Check if the game is completed
        const isCompleted = completedGames.some(g => g.id === game.id);
        let ratingHtml = '';

        if (isCompleted) {
            const savedRating = localStorage.getItem(`rating-${game.id}`) || 0;
            ratingHtml = `
                <div class="rating">
                    <span>Rate this game: </span>
                    ${[1, 2, 3, 4, 5].map(rating => `
                        <input type="radio" id="star${rating}" name="rating" value="${rating}" ${rating == savedRating ? 'checked' : ''} />
                        <label for="star${rating}" class="rating-star">&#9733;</label>
                    `).join('')}
                </div>
            `;
        }

        gameDetailsContainer.innerHTML = `
            <div class="game-details-page">
                <h2>${game.name}</h2>
                <img src="${game.background_image}" alt="${game.name} cover image" />
                <p><strong>Released:</strong> ${game.released}</p>
                <p><strong>Available Platforms:</strong> ${game.platforms.map(p => p.platform.name).join(', ')}</p>
                <p><strong>Genres:</strong> ${game.genres.map(g => g.name).join(', ')}</p>
                <p><strong>Developers:</strong> ${developers}</p>
                <p><strong>Publishers:</strong> ${publishers}</p>
                <p><strong>Metascore:</strong> ${metascore}</p>
                <p>${game.description_raw}</p>
                ${ratingHtml}
                <button class="btn btn-secondary mt-2" onclick="goBack()">Go Back</button>
            </div>
        `;

        if (isCompleted) {
            const ratingInputs = document.querySelectorAll('input[name="rating"]');
            ratingInputs.forEach(input => {
                input.addEventListener('change', (event) => {
                    localStorage.setItem(`rating-${game.id}`, event.target.value);
                    alert(`You rated this game ${event.target.value} star${event.target.value > 1 ? 's' : ''}`);
                });
            });
        }
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}



// Function to mark a game as completed
function markAsCompleted(game) {
    if (!completedGames.some(g => g.id === game.id)) {
        completedGames.push(game);
        localStorage.setItem('completedGames', JSON.stringify(completedGames));
    } else {
        alert('Game is already marked as completed.');
    }
}

// Function to mark a game as backlogged
function markAsBacklogged(game) {
    if (!backloggedGames.some(g => g.id === game.id)) {
        backloggedGames.push(game);
        localStorage.setItem('backloggedGames', JSON.stringify(backloggedGames));
    } else {
        alert('Game is already marked as backlogged.');
    }
}

// Function to display the profile page
function displayProfilePage() {
    const gamesContainer = document.getElementById('games');
    const gameDetailsContainer = document.getElementById('game-details');
    const profilePageContainer = document.getElementById('profile-page');
    const profileGamesContainer = document.getElementById('profile-games');
    const decadeDropdown = document.getElementById('decadeDropdown');
    const filterDropdown = document.getElementById('filterDropdown');
    const clearFiltersButton = document.getElementById('clearFiltersButton');
    const gameListTitle = document.getElementById('gameListTitle'); // Get the game list title element

    gamesContainer.style.display = 'none';
    gameDetailsContainer.style.display = 'none';
    profilePageContainer.style.display = 'block';
    decadeDropdown.style.display = 'none';
    filterDropdown.style.display = 'none';
    clearFiltersButton.style.display = 'none';
    gameListTitle.style.display = 'none'; // Hide the game list title

    profileGamesContainer.innerHTML = `
        <div class="dropdown" id="profileDropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="profileMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                Select Category
            </button>
            <ul class="dropdown-menu" aria-labelledby="profileMenuButton">
                <li><a class="dropdown-item" id="completedGames" href="#">Completed Games</a></li>
                <li><a class="dropdown-item" id="backloggedGames" href="#">Backlogged Games</a></li>
            </ul>
        </div>
        <div id="profile-games-list"></div>
    `;

    document.getElementById('completedGames').addEventListener('click', () => {
        displayCompletedGames();
        history.pushState({}, '', '?fromProfile=true&profileSection=completed');
    });

    document.getElementById('backloggedGames').addEventListener('click', () => {
        displayBackloggedGames();
        history.pushState({}, '', '?fromProfile=true&profileSection=backlogged');
    });
}

// Function to display completed games
function displayCompletedGames() {
    const profileGamesContainer = document.getElementById('profile-games-list');
    profileGamesContainer.innerHTML = ''; // Clear previous results
    completedGames.forEach(game => {
        const gameElement = document.createElement('div');
        gameElement.className = 'game';

        const gameImage = document.createElement('img');
        gameImage.src = game.background_image;
        gameImage.alt = `${game.name} cover image`;
        gameImage.addEventListener('click', () => loadGameDetails(game.id, true, 'completed')); // Add event listener to load game details

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

        const gameGenres = document.createElement('div');
        gameGenres.className = 'game-genres';
        gameGenres.textContent = `Genres: ${game.genres.map(g => g.name).join(', ')}`;

        // Add remove button
        const removeButton = document.createElement('button');
        removeButton.className = 'btn-remove';
        removeButton.textContent = 'Remove from Completed';
        removeButton.addEventListener('click', (event) => {
            event.stopPropagation();
            removeGameFromCompleted(game.id);
        });

        // Add rating display
        const savedRating = localStorage.getItem(`rating-${game.id}`) || 0;
        const ratingDisplay = `
            <div class="rating-display">
                ${[1, 2, 3, 4, 5].map(rating => `
                    <span class="rating-star ${rating <= savedRating ? 'rated' : ''}">&#9733;</span>
                `).join('')}
            </div>
        `;

        gameDetails.appendChild(gameTitle);
        gameDetails.appendChild(gameReleaseDate);
        gameDetails.appendChild(gamePlatforms);
        gameDetails.appendChild(gameGenres);
        gameDetails.appendChild(removeButton);
        gameDetails.insertAdjacentHTML('beforeend', ratingDisplay);
        gameElement.appendChild(gameImage);
        gameElement.appendChild(gameDetails);
        profileGamesContainer.appendChild(gameElement);
    });
}

// Function to display backlogged games
function displayBackloggedGames() {
    const profileGamesContainer = document.getElementById('profile-games-list');
    profileGamesContainer.innerHTML = ''; // Clear previous results
    backloggedGames.forEach(game => {
        const gameElement = document.createElement('div');
        gameElement.className = 'game';

        const gameImage = document.createElement('img');
        gameImage.src = game.background_image;
        gameImage.alt = `${game.name} cover image`;
        gameImage.addEventListener('click', () => loadGameDetails(game.id, true, 'backlogged')); // Add event listener to load game details

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

        const gameGenres = document.createElement('div');
        gameGenres.className = 'game-genres';
        gameGenres.textContent = `Genres: ${game.genres.map(g => g.name).join(', ')}`;

        // Add remove button
        const removeButton = document.createElement('button');
        removeButton.className = 'btn-remove';
        removeButton.textContent = 'Remove from Backlogged';
        removeButton.addEventListener('click', (event) => {
            event.stopPropagation();
            removeGameFromBacklogged(game.id);
        });

        gameDetails.appendChild(gameTitle);
        gameDetails.appendChild(gameReleaseDate);
        gameDetails.appendChild(gamePlatforms);
        gameDetails.appendChild(gameGenres);
        gameDetails.appendChild(removeButton);
        gameElement.appendChild(gameImage);
        gameElement.appendChild(gameDetails);
        profileGamesContainer.appendChild(gameElement);
    });
}


// Function to go back to the main page
function goBack() {
    const gamesContainer = document.getElementById('games');
    const gameDetailsContainer = document.getElementById('game-details');
    const profilePageContainer = document.getElementById('profile-page');
    const profileGamesContainer = document.getElementById('profile-games');
    const decadeDropdown = document.getElementById('decadeDropdown');
    const filterDropdown = document.getElementById('filterDropdown');
    const clearFiltersButton = document.getElementById('clearFiltersButton');
    const gameListTitle = document.getElementById('gameListTitle'); // Get the game list title element

    // Check if the user was on the profile page
    const urlParams = new URLSearchParams(window.location.search);
    const fromProfile = urlParams.get('fromProfile');
    const profileSection = urlParams.get('profileSection');

    if (fromProfile) {
        // If the user came from the profile page
        gamesContainer.style.display = 'none';
        profilePageContainer.style.display = 'block';
        profileDropdown.style.display = 'block';
        decadeDropdown.style.display = 'none';
        filterDropdown.style.display = 'none';
        clearFiltersButton.style.display = 'none';
        gameDetailsContainer.style.display = 'none';
        gameListTitle.style.display = 'none'; // Hide the game list title

        if (profileSection === 'completed') {
            displayCompletedGames();
            history.pushState({}, '', '?fromProfile=true&profileSection=completed');
        } else if (profileSection === 'backlogged') {
            displayBackloggedGames();
            history.pushState({}, '', '?fromProfile=true&profileSection=backlogged');
        }
    } else {
        // Default behavior: go back to the main page and default to "all decades"
        baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&platforms=4,18,1,7`;
        callAPI(1); // Load games with "all decades" option

        gamesContainer.style.display = 'block';
        profilePageContainer.style.display = 'none';
        gameDetailsContainer.style.display = 'none';
        decadeDropdown.style.display = 'block';
        filterDropdown.style.display = 'block';
        clearFiltersButton.style.display = 'block';
        gameListTitle.style.display = 'block'; // Show the game list title
        history.pushState({}, '', './');
    }
}

// Function to remove game from completed list
function removeGameFromCompleted(gameId) {
    completedGames = completedGames.filter(game => game.id !== gameId);
    localStorage.setItem('completedGames', JSON.stringify(completedGames));
    displayCompletedGames(); // Refresh the list
}

// Function to remove game from backlogged list
function removeGameFromBacklogged(gameId) {
    backloggedGames = backloggedGames.filter(game => game.id !== gameId);
    localStorage.setItem('backloggedGames', JSON.stringify(backloggedGames));
    displayBackloggedGames(); // Refresh the list
}


// Event listener for the search form
document.getElementById('searchForm').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission
    const query = document.getElementById('searchInput').value;
    callAPI(1, query); // Reset to page 1 when performing a new search
});

document.getElementById('profileButton').addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default behavior
    displayProfilePage();
});

document.getElementById('clearFiltersButton').addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default behavior
    baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&platforms=4,18,1,7`; // Reset to all platforms
    callAPI(1); // Reset to page 1 and load all games without filters
});

document.getElementById('homeLink').addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default behavior
    
    // Display main page elements
    const gamesContainer = document.getElementById('games');
    const gameDetailsContainer = document.getElementById('game-details');
    const profilePageContainer = document.getElementById('profile-page');
    const decadeDropdown = document.getElementById('decadeDropdown');
    const filterDropdown = document.getElementById('filterDropdown');
    const clearFiltersButton = document.getElementById('clearFiltersButton');
    const gameListTitle = document.getElementById('gameListTitle'); // Get the game list title element

    gamesContainer.style.display = 'block';
    gameDetailsContainer.style.display = 'none';
    profilePageContainer.style.display = 'none';
    decadeDropdown.style.display = 'block';
    filterDropdown.style.display = 'block';
    clearFiltersButton.style.display = 'block';
    gameListTitle.style.display = 'block'; // Show the game list title

    // Update URL and call API to load all games
    history.pushState({}, '', './');
    baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&platforms=4,18,1,7`; // Reset baseUrl to default
    callAPI(1); // Load games with default filters
});


document.addEventListener('DOMContentLoaded', () => {
    // Event listeners for pagination buttons
    for (let i = 1; i <= 8; i++) { // Assuming you have 8 buttons
        const button = document.getElementById(`page-${i}`);
        if (button) {
            button.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent default behavior
                callAPI(i);
            });
        }
    }

    // Event listeners for decade buttons
    document.getElementById('decade-2000').addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default behavior
        baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&dates=2000-01-01,2009-12-31&platforms=18,1,7`;
        callAPI(1); // Reset to page 1 when changing decades
    });

    document.getElementById('decade-2010').addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default behavior
        baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&dates=2010-01-01,2019-12-31&platforms=18,1,7`;
        callAPI(1); // Reset to page 1 when changing decades
    });

    document.getElementById('decade-2020').addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default behavior
        baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&dates=2020-01-01,2023-12-31&platforms=18,1,7`;
        callAPI(1); // Reset to page 1 when changing decades
    });

    document.getElementById('all-decades').addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default behavior
        baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&platforms=4,18,1,7`; // All platforms
        callAPI(1); // Reset to page 1 when selecting all decades
    });

    // Event listeners for filter buttons (platforms)
    document.getElementById('platform-pc').addEventListener('click', (event) => {
        event.preventDefault();
        baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&platforms=4`; // PC platform ID
        callAPI(1);
    });

    document.getElementById('platform-playstation').addEventListener('click', (event) => {
        event.preventDefault();
        baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&platforms=18`; // PlayStation platform ID
        callAPI(1);
    });

    document.getElementById('platform-xbox').addEventListener('click', (event) => {
        event.preventDefault();
        baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&platforms=1`; // Xbox platform ID
        callAPI(1);
    });

    document.getElementById('platform-nintendo').addEventListener('click', (event) => {
        event.preventDefault();
        baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&platforms=7`; // Nintendo platform ID
        callAPI(1);
    });

    document.getElementById('platform-all').addEventListener('click', (event) => {
        event.preventDefault();
        baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&platforms=4,18,1,7`; // All platforms
        callAPI(1);
    });

    // Event listeners for filter buttons (genres)
    document.getElementById('genre-action').addEventListener('click', (event) => {
        event.preventDefault();
        baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&genres=4`; // Action genre ID
        callAPI(1);
    });

    document.getElementById('genre-adventure').addEventListener('click', (event) => {
        event.preventDefault();
        baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&genres=3`; // Adventure genre ID
        callAPI(1);
    });

    document.getElementById('genre-rpg').addEventListener('click', (event) => {
        event.preventDefault();
        baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&genres=5`; // RPG genre ID
        callAPI(1);
    });

    document.getElementById('genre-strategy').addEventListener('click', (event) => {
        event.preventDefault();
        baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&genres=10`; // Strategy genre ID
        callAPI(1);
    });

    document.getElementById('genre-all').addEventListener('click', (event) => {
        event.preventDefault();
        baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&genres=4,3,5,10`; // All genres
        callAPI(1);
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', (event) => {
        const urlParams = new URLSearchParams(window.location.search);
        const gameId = urlParams.get('game');
        if (gameId) {
            loadGameDetails(gameId);
        } else {
            goBack();
        }
    });

    // Check if URL has game query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('game');
    const fromProfile = urlParams.get('fromProfile');
    const profileSection = urlParams.get('profileSection');

    if (gameId) {
        loadGameDetails(gameId);
    } else if (fromProfile) {
        goBack();
    } else {
        // Initial API call
        callAPI(1); // Ensure it starts with page 1
    }
});
