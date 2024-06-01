const apiKey = '91574a6ba1164bd5a7cb766c4251213b';
let baseUrl = `https://api.rawg.io/api/games?key=${apiKey}`;
let currentPage = 1;
let totalPages = 1;
let completedCurrentPage = 1;
let completedTotalPages = 1;
let backloggedCurrentPage = 1;
let backloggedTotalPages = 1;
const itemsPerPage = 5; // Number of items per page
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
        const paginationContainer = document.getElementById('pagination');
        paginationContainer.style.display = 'flex'; // Ensure pagination is displayed
        paginationContainer.style.justifyContent = 'center'; // Center the pagination buttons
        paginationContainer.style.flexDirection = 'row'; // Ensure buttons are horizontal
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

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container'; // Add this line

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

        buttonContainer.appendChild(markAsCompletedButton); // Add this line
        buttonContainer.appendChild(markAsBackloggedButton); // Add this line

        gameDetails.appendChild(gameTitle);
        gameDetails.appendChild(gameReleaseDate);
        gameDetails.appendChild(gamePlatforms);
        gameDetails.appendChild(gameGenres);
        gameDetails.appendChild(buttonContainer); // Add this line
        gameElement.appendChild(gameImage);
        gameElement.appendChild(gameDetails);
        gamesContainer.appendChild(gameElement);
    });
}

// Function to update pagination buttons
function updatePaginationButtons() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = ''; // Clear previous buttons

    // Number of buttons to show at a time
    const maxButtons = 10;
    const halfMaxButtons = Math.floor(maxButtons / 2);

    // Calculate the start and end of the button range
    let startPage = currentPage - halfMaxButtons;
    let endPage = currentPage + halfMaxButtons;

    if (startPage < 1) {
        startPage = 1;
        endPage = Math.min(maxButtons, totalPages);
    } else if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, totalPages - maxButtons + 1);
    }

    // Create "Previous" button
    if (currentPage > 1) {
        const prevButton = document.createElement('li');
        prevButton.className = 'page-item';
        prevButton.innerHTML = `<button class="page-link">Previous</button>`;
        prevButton.addEventListener('click', (event) => {
            event.preventDefault();
            callAPI(currentPage - 1);
        });
        pagination.appendChild(prevButton);
    }

    // Create page number buttons
    for (let i = startPage; i <= endPage; i++) {
        const button = document.createElement('li');
        button.className = 'page-item';
        if (i === currentPage) {
            button.classList.add('active');
        }
        button.innerHTML = `<button class="page-link">${i}</button>`;
        button.addEventListener('click', (event) => {
            event.preventDefault();
            callAPI(i);
        });
        pagination.appendChild(button);
    }

    // Create "Next" button
    if (currentPage < totalPages) {
        const nextButton = document.createElement('li');
        nextButton.className = 'page-item';
        nextButton.innerHTML = `<button class="page-link">Next</button>`;
        nextButton.addEventListener('click', (event) => {
            event.preventDefault();
            callAPI(currentPage + 1);
        });
        pagination.appendChild(nextButton);
    }
}

// Function to load game details
async function loadGameDetails(gameId, fromProfile = false, profileSection = '') {
    const profileParam = fromProfile ? `&fromProfile=true&profileSection=${profileSection}` : '';
    history.pushState({}, '', `?game=${gameId}${profileParam}`);

    const gamesContainer = document.getElementById('games');
    const gameDetailsContainer = document.getElementById('game-details');
    const profilePageContainer = document.getElementById('profile-page');
    const decadeDropdown = document.getElementById('decadeDropdown');
    const filterDropdown = document.getElementById('filterDropdown');
    const clearFiltersButton = document.getElementById('clearFiltersButton');
    const gameListTitle = document.getElementById('gameListTitle');

    gamesContainer.style.display = 'none';
    gameDetailsContainer.style.display = 'block';
    profilePageContainer.style.display = 'none';
    decadeDropdown.style.display = 'none';
    filterDropdown.style.display = 'none';
    clearFiltersButton.style.display = 'none';
    gameListTitle.style.display = 'none';

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
                    <label for="rating-${game.id}">Rating: </label>
                    <select id="rating-${game.id}">
                        ${Array.from({ length: 10 }, (_, i) => `<option value="${i + 1}" ${savedRating == i + 1 ? 'selected' : ''}>${i + 1}</option>`).join('')}
                    </select>/10
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
            const ratingSelect = document.getElementById(`rating-${game.id}`);
            ratingSelect.addEventListener('change', (event) => {
                localStorage.setItem(`rating-${game.id}`, event.target.value);
                alert(`You rated this game ${event.target.value}`);
            });
        }
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}





// Function to mark a game as completed
function markAsCompleted(game) {
    if (!completedGames.some(g => g.id === game.id)) {
        const rating = promptRating();
        if (rating !== null) {
            game.rating = rating; // Add rating to game object
            completedGames.push(game);
            localStorage.setItem('completedGames', JSON.stringify(completedGames));
            localStorage.setItem(`rating-${game.id}`, rating); // Save rating in localStorage
        }
    } else {
        alert('Game is already marked as completed.');
    }
}

// Function to prompt user for rating
function promptRating() {
    let rating = prompt("Please rate this game from 1 to 10:");
    rating = parseInt(rating, 10);
    if (rating >= 1 && rating <= 10) {
        return rating;
    } else {
        alert('Invalid rating. Please enter a number between 1 and 10.');
        return null;
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
    const bottomPagination = document.getElementById('pagination'); // Get the bottom pagination element

    gamesContainer.style.display = 'none';
    gameDetailsContainer.style.display = 'none';
    profilePageContainer.style.display = 'block';
    decadeDropdown.style.display = 'none';
    filterDropdown.style.display = 'none';
    clearFiltersButton.style.display = 'none';
    gameListTitle.style.display = 'none'; // Hide the game list title
    bottomPagination.style.display = 'none'; // Hide the bottom pagination

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
        <nav aria-label="Profile Page navigation">
            <ul class="pagination justify-content-center" id="profile-pagination"></ul>
        </nav>
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
function displayCompletedGames(page = 1) {
    const profileGamesContainer = document.getElementById('profile-games-list');
    profileGamesContainer.innerHTML = ''; // Clear previous results

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const gamesToDisplay = completedGames.slice(startIndex, endIndex);

    gamesToDisplay.forEach(game => {
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
                <span><strong>Rating: ${savedRating}/10</strong></span>
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

    completedTotalPages = Math.ceil(completedGames.length / itemsPerPage);
    updateProfilePaginationButtons('completed', page, completedTotalPages);
}

function displayBackloggedGames(page = 1) {
    const profileGamesContainer = document.getElementById('profile-games-list');
    profileGamesContainer.innerHTML = ''; // Clear previous results

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const gamesToDisplay = backloggedGames.slice(startIndex, endIndex);

    gamesToDisplay.forEach(game => {
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

    backloggedTotalPages = Math.ceil(backloggedGames.length / itemsPerPage);
    updateProfilePaginationButtons('backlogged', page, backloggedTotalPages);
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
    const gameListTitle = document.getElementById('gameListTitle'); 
    const paginationContainer = document.getElementById('pagination');

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
        gameListTitle.style.display = 'none'; 
        paginationContainer.style.display = 'none'; 

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
        gameListTitle.style.display = 'block'; 
        paginationContainer.style.display = 'flex'; // Ensure pagination is displayed correctly
        paginationContainer.style.justifyContent = 'center'; // Center the pagination buttons
        paginationContainer.style.flexDirection = 'row'; // Ensure buttons are horizontal
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

function updateProfilePaginationButtons(type, currentPage, totalPages) {
    const paginationContainer = document.getElementById('profile-pagination');
    paginationContainer.innerHTML = ''; // Clear previous buttons

    for (let i = 1; i <= totalPages; i++) {
        const listItem = document.createElement('li');
        listItem.className = 'page-item';
        if (i === currentPage) {
            listItem.classList.add('active');
        }

        const button = document.createElement('button');
        button.className = 'page-link';
        button.textContent = i;
        button.disabled = (i === currentPage);

        button.addEventListener('click', (event) => {
            event.preventDefault();
            if (type === 'completed') {
                completedCurrentPage = i;
                displayCompletedGames(completedCurrentPage);
            } else if (type === 'backlogged') {
                backloggedCurrentPage = i;
                displayBackloggedGames(backloggedCurrentPage);
            }
        });

        listItem.appendChild(button);
        paginationContainer.appendChild(listItem);
    }
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
    const paginationContainer = document.getElementById('pagination');

    gamesContainer.style.display = 'block';
    gameDetailsContainer.style.display = 'none';
    profilePageContainer.style.display = 'none';
    decadeDropdown.style.display = 'block';
    filterDropdown.style.display = 'block';
    clearFiltersButton.style.display = 'block';
    gameListTitle.style.display = 'block'; // Show the game list title
    paginationContainer.style.display = 'block'; // Ensure pagination is displayed

    // Update URL and call API to load all games
    history.pushState({}, '', './');
    baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&platforms=4,18,1,7`; // Reset baseUrl to default
    callAPI(1); // Load games with default filters
});


document.addEventListener('DOMContentLoaded', () => {
    for (let i = 1; i <= 8; i++) { // Assuming you have 8 buttons
        const button = document.getElementById(`page-${i}`);
        if (button) {
            button.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent default behavior
                callAPI(i);
            });
        }
    }

// Function to update selected filters text
function updateSelectedFilters() {
    const selectedDecade = document.querySelector('#decadeDropdown .dropdown-item.active');
    const selectedPlatform = document.querySelector('#filterDropdown .dropdown-item.active[data-type="platform"]');
    const selectedGenre = document.querySelector('#filterDropdown .dropdown-item.active[data-type="genre"]');

    let selectedFiltersText = 'Selected Filters: ';

    if (selectedDecade) {
        selectedFiltersText += `Decade - ${selectedDecade.textContent}`;
    }

    if (selectedPlatform) {
        if (selectedFiltersText !== 'Selected Filters: ') selectedFiltersText += ', ';
        selectedFiltersText += `Platform - ${selectedPlatform.textContent}`;
    }

    if (selectedGenre) {
        if (selectedFiltersText !== 'Selected Filters: ') selectedFiltersText += ', ';
        selectedFiltersText += `Genre - ${selectedGenre.textContent}`;
    }

    if (!selectedDecade && !selectedPlatform && !selectedGenre) {  
        selectedFiltersText += 'None';
    }

    document.getElementById('selectedFiltersText').textContent = selectedFiltersText;
}

// Add 'data-type' attributes to filter items and add 'active' class on click
document.querySelectorAll('#decadeDropdown .dropdown-item').forEach(item => {
    item.addEventListener('click', (event) => {
        event.preventDefault();
        document.querySelectorAll('#decadeDropdown .dropdown-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        updateSelectedFilters();
    });
});

// Event listeners for platform and genre filter buttons
document.querySelectorAll('#filterDropdown .dropdown-item').forEach(item => {
    item.dataset.type = item.textContent.includes('Platform') ? 'platform' : 'genre';
    item.addEventListener('click', (event) => {
        event.preventDefault();
        const type = item.dataset.type;
        document.querySelectorAll(`#filterDropdown .dropdown-item[data-type="${type}"]`).forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        updateSelectedFilters();
    });
});

// Event listener for Clear Filters button
document.getElementById('clearFiltersButton').addEventListener('click', (event) => {
    event.preventDefault();
    document.querySelectorAll('.dropdown-item').forEach(item => item.classList.remove('active'));
    updateSelectedFilters();
});


    // Event listeners for decade buttons
    const decade1990 = document.getElementById('decade-1990');
    if (decade1990) {
        decade1990.addEventListener('click', (event) => {
            event.preventDefault();
            baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&dates=1990-01-01,1999-12-31&platforms=18,1,7`;
            callAPI(1);
        });
    }

    const decade2000 = document.getElementById('decade-2000');
    if (decade2000) {
        decade2000.addEventListener('click', (event) => {
            event.preventDefault();
            baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&dates=2000-01-01,2009-12-31&platforms=18,1,7`;
            callAPI(1);
        });
    }

    const decade2010 = document.getElementById('decade-2010');
    if (decade2010) {
        decade2010.addEventListener('click', (event) => {
            event.preventDefault();
            baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&dates=2010-01-01,2019-12-31&platforms=18,1,7`;
            callAPI(1);
        });
    }

    const decade2020 = document.getElementById('decade-2020');
    if (decade2020) {
        decade2020.addEventListener('click', (event) => {
            event.preventDefault();
            baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&dates=2020-01-01,2023-12-31&platforms=18,1,7`;
            callAPI(1);
        });
    }

    const allDecades = document.getElementById('all-decades');
    if (allDecades) {
        allDecades.addEventListener('click', (event) => {
            event.preventDefault();
            baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&platforms=4,18,1,7`;
            callAPI(1);
        });
    }

    // Event listeners for filter buttons (platforms)
    const platformPC = document.getElementById('platform-pc');
    if (platformPC) {
        platformPC.addEventListener('click', (event) => {
            event.preventDefault();
            baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&platforms=4`;
            callAPI(1);
        });
    }

    const platformPlaystation = document.getElementById('platform-playstation');
    if (platformPlaystation) {
        platformPlaystation.addEventListener('click', (event) => {
            event.preventDefault();
            baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&platforms=18`;
            callAPI(1);
        });
    }

    const platformXbox = document.getElementById('platform-xbox');
    if (platformXbox) {
        platformXbox.addEventListener('click', (event) => {
            event.preventDefault();
            baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&platforms=1`;
            callAPI(1);
        });
    }

    const platformNintendo = document.getElementById('platform-nintendo');
    if (platformNintendo) {
        platformNintendo.addEventListener('click', (event) => {
            event.preventDefault();
            baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&platforms=7`;
            callAPI(1);
        });
    }

    const platformSega = document.getElementById('platform-sega');
    if (platformSega) {
        platformSega.addEventListener('click', (event) => {
            event.preventDefault();
            baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&platforms=8`;
            callAPI(1);
        });
    }

    const platformAtari = document.getElementById('platform-atari');
    if (platformAtari) {
        platformAtari.addEventListener('click', (event) => {
            event.preventDefault();
            baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&platforms=9`;
            callAPI(1);
        });
    }

    const platformCommodore = document.getElementById('platform-commodore');
    if (platformCommodore) {
        platformCommodore.addEventListener('click', (event) => {
            event.preventDefault();
            baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&platforms=10`;
            callAPI(1);
        });
    }

    const platformAll = document.getElementById('platform-all');
    if (platformAll) {
        platformAll.addEventListener('click', (event) => {
            event.preventDefault();
            baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&platforms=4,18,1,7,8,9,10`;
            callAPI(1);
        });
    }

    // Event listeners for filter buttons (genres)
    const genreAction = document.getElementById('genre-action');
    if (genreAction) {
        genreAction.addEventListener('click', (event) => {
            event.preventDefault();
            baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&genres=4`;
            callAPI(1);
        });
    }

    const genreAdventure = document.getElementById('genre-adventure');
    if (genreAdventure) {
        genreAdventure.addEventListener('click', (event) => {
            event.preventDefault();
            baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&genres=3`;
            callAPI(1);
        });
    }

    const genreRPG = document.getElementById('genre-rpg');
    if (genreRPG) {
        genreRPG.addEventListener('click', (event) => {
            event.preventDefault();
            baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&genres=5`;
            callAPI(1);
        });
    }

    const genreStrategy = document.getElementById('genre-strategy');
    if (genreStrategy) {
        genreStrategy.addEventListener('click', (event) => {
            event.preventDefault();
            baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&genres=10`;
            callAPI(1);
        });
    }

    const genreShooter = document.getElementById('genre-shooter');
    if (genreShooter) {
        genreShooter.addEventListener('click', (event) => {
            event.preventDefault();
            baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&genres=2`;
            callAPI(1);
        });
    }

    const genreSports = document.getElementById('genre-sports');
    if (genreSports) {
        genreSports.addEventListener('click', (event) => {
            event.preventDefault();
            baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&genres=11`;
            callAPI(1);
        });
    }

    const genrePuzzle = document.getElementById('genre-puzzle');
    if (genrePuzzle) {
        genrePuzzle.addEventListener('click', (event) => {
            event.preventDefault();
            baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&genres=12`;
            callAPI(1);
        });
    }

    const genreArcade = document.getElementById('genre-arcade');
    if (genreArcade) {
        genreArcade.addEventListener('click', (event) => {
            event.preventDefault();
            baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&genres=13`;
            callAPI(1);
        });
    }

    const genreSimulation = document.getElementById('genre-simulation');
    if (genreSimulation) {
        genreSimulation.addEventListener('click', (event) => {
            event.preventDefault();
            baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&genres=14`;
            callAPI(1);
        });
    }

    const genreRacing = document.getElementById('genre-racing');
    if (genreRacing) {
        genreRacing.addEventListener('click', (event) => {
            event.preventDefault();
            baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&genres=15`;
            callAPI(1);
        });
    }

    const genreAll = document.getElementById('genre-all');
    if (genreAll) {
        genreAll.addEventListener('click', (event) => {
            event.preventDefault();
            baseUrl = `https://api.rawg.io/api/games?key=${apiKey}&genres=4,3,5,10,2,11,12,13,14,15`;
            callAPI(1);
        });
    }

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