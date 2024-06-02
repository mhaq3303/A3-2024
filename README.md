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
In comparison to when I first began the assignment, there were a few changes made that were made from my first wireframes as well as during the process of creating the final prototype.

- **Grid system for displaying games**: While I initially wanted to have two columns displaying the games at the same time, I found it very difficult and costly to try and integrate the API within a new grid structure, as well as the completed/backlogged buttons, without it breaking something else. I decided it wasn't really necessary and the current interface served its purpose well.
- **Star-based rating system**: The star-based rating system was what I initially went with, however, I felt that stars didn't express ratings as well as a numerical scale would. It also felt too similar to a lot of rating sites. It was also a bit more complicated to implement. Instead, a numerical rating system was implemented for ease-of-code and for variety.
- **Radio menu for filtering**: In my initial designs, I wanted a fixed radio menu on the left that'd show all the selected filters and would remain fixed on the screen. However, I ended up going with two simple buttons rather than the fixed radio button once I got deeper into my project, as it became difficult to work around the current container. Furthermore, having two buttons right at the top at all times made it easier to access since it'd be within the game container itself, rather than a whole different tab they'd need to look to.
- **Sorting system**: I wanted to create a system to sort in the website itself (either by alphabetical order, date added etc.) however, I felt the necessity of sorting the main game details page alongside the filters wouldn't be worth doing, especially with the search function in place. 

# Limitations
There are a few notable bugs that I didn't find time to fully fix or integrate it without it breaking. This would include:
- **Selected filters**: Multiple filters may not select at the same time on occasion, even when the "selected filters" text says otherwise. This can lead to potentially misleading information.
- **Pagination loading**: The pagination buttons are spread out, and due to the pagination functions in JS, it'd be hard to refit it to a standard Bootstrap pagination bar. Instead, a spread out pagination system is used. Also, if a user clicks the profile page and clicks back on the home page, it'd still load back to page 1.
- **Data Selection**: Some games are not in the API for whatever reason, meaning some games may not show up for users (eg. TLOZ: Majora's Mask 3D).
- **Mobile Interface**: I ended up completely forgetting to make it mobile responsive too little too late, and while attempting to use React I found it difficult to have it work with my current code fully. In the future, developers can implement React for a more functional mobile prototype.
Developers can expand on the filters and pagination functions by simplifying the code further. Pagination can be fixed to be centered in the middle with appropriate styling & functionality without overly complicated JS functions. Filters can be fixed through a better function that checks for games matching the filter using the API.

# Acknowledgement
Parcel, SASS & Bootstrap were used for this assignment. Parcel was used to setup the internal servers. Bootstrap libraries were used for easier CSS elements such as the Navbar and the Search function. SASS was used for easier CSS compiling.

# Where was ChatGPT used?
ChatGPT was used quite often in this assignment. Areas where ChatGPT were used are noted in the markdowns of script.js & styles.scss. 
Prompts that were used include:
- Clicking back on certain pages would not load the API/load the profile. How could I fix this? (this same prompt was used everytime clicking back would break the site) [467-519]
- How can I create a game details page that pulls from the API within a container [191-244]
- I want the selected filters to show up as plaintext in the navbar [636-656]
- How do I create separate pagination buttons between pages that disappear between pages [109-167]
It was also generally used for error checking and identifying the Git comamnds necessary for stashing changes to prevent botched releases.