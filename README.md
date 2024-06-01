# GameTraka: Log your games!
GameTraka is a website for gamers both new and old, allowing users to track the games they've completed and the games they want to play. With a huge database of both old and modern games, gamers across all platforms & demographics can find the games they've played. Using `localStorage`, gamers will be able to keep their games across sessions in the future.

# Version Control
GitHub was used to track changes between each build as well as for testing more extensive features. On occasion there were mishaps with reverting to previous builds or uploading to the right branch. However, everything should be under the main branch.

Link to the GitHub repository: https://github.com/mhaq3303/A3-2024

# Features
- **Huge Database of Games**: Using RAWG API, users can access up to 300,000 games, from the most niche indie projects to the biggest AAA titles and add them to their lists, or to simply read up on them.
- **Game Tracking**: Users can track the games they've completed, as well as the games they want to play. With sessions being saved, users can always check back on what they want to play in the future.
- **Rate Your Favorites!**: Inspired from websites such as *Letterboxd* and *RateYourMusic*, users can also rate games they've completed to rank them amongst their favourites.

# Setup Instructions
1. Clone the repo on GitHub
2. Install Parcel.
3. Install Bootstrap. 
4. Run using "npm start"

# Usage
When accessing the website, you can:
1. Use the search button on the top, the filters or the main page to find a game you have played or want to play.
2. Click the game image to view details about the game (including publisher, metascore, release date etc.).
3. Mark a game as completed, or add it to your backlogged. If marked as completed, you can also rate the game.
4. Check your profile for your completed or backlogged games.
5. Want to get rid of a game in your lists? Just click the "Remove" button on any completed or backlogged game.

# The design process
In comparison to when I first began the assignment, there were a few changes made that could be improved upon in future iterations. These include:
- **Grid system for displaying games**: While I initially wanted to have two columns displaying the games at the same time, I found it very difficult and costly to try and integrate the API within a new grid structure, as well as the completed/backlogged buttons, without it breaking something else. I decided it wasn't really necessary and the current interface served its purpose well.

# Where was ChatGPT used?
ChatGPT was used quite often in this assignment. Areas where ChatGPT were used are noted in the markdown of script.js. 
Prompts that were used include:
- How can I implement a search function to look for titles within the API
- How can I create a game details page that pulls from the API within a container
- I want the selected filters to show up as plaintext in the navbar
- How do I create separate pagination buttons between pages that disappear between pages