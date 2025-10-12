// =======================
// GitHub API Integration
// =======================

// GitHub Avatar
function loadGitHubAvatar() {
  const githubAvatar = document.getElementById('githubAvatar');
  if (!githubAvatar) return;

  fetch('https://api.github.com/users/alk222')
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      return res.json();
    })
    .then(data => { 
      githubAvatar.src = data.avatar_url; 
      githubAvatar.alt = `${data.name || 'GitHub'} Avatar`;
    })
    .catch(err => { 
      console.error('GitHub avatar load failed, using fallback:', err);
      // Fallback avatar
      githubAvatar.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMjIyIi8+CjxwYXRoIGQ9Ik0xMDAgNTBDNzcuOTUgNTAgNjAgNjcuOTUgNjAgOTBDNjAgMTA5LjU0IDcxLjA1IDEyNi4zIDg3LjUgMTMxVjE0MkgxMTIuNVYxMzFDMTI4Ljk1IDEyNi4zIDE0MCAxMDkuNTQgMTQwIDkwQzE0MCA2Ny45NSAxMjIuMDUgNTAgMTAwIDUwWiIgZmlsbD0iI0UwMjg3RCIvPgo8L3N2Zz4K';
    });
}

// Repository functions
async function fetchSpecificRepos() {
  try {
    const repos = [];
    const repoList = [
      "alk222/Ingenieria-Informatica-UCM", 
      "alk222/cv", 
      "alk222/Configs-macros-dotfiles", 
      "FratosVR/tfg"
    ];
    
    console.log('GitHub API: Fetching repositories...');
    
    for (const repoName of repoList) {
      try {
        const response = await fetch(`https://api.github.com/repos/${repoName}`);
        
        if (response.ok) {
          const repoData = await response.json();
          repos.push(repoData);
          console.log(`✅ Fetched: ${repoName}`);
        } else {
          console.warn(`Failed to fetch ${repoName}: ${response.status}`);
        }
      } catch (fetchError) {
        console.error(`Error fetching ${repoName}:`, fetchError);
      }
    }
    
    return repos;
  } catch (error) {
    console.error('Error in fetchSpecificRepos:', error);
    throw error;
  }
}

function createRepoCard(repo) {
  const cardWrapper = document.createElement('a');
  cardWrapper.href = repo.html_url;
  cardWrapper.target = '_blank';
  cardWrapper.rel = 'noopener noreferrer';
  cardWrapper.className = 'repo-card-wrapper';
  
  const card = document.createElement('div');
  card.className = 'card repo-card';

  const languageColor = repo.language ? 
    `<span class="language-color" style="background-color: ${getLanguageColor(repo.language)}"></span>` : 
    '';

  card.innerHTML = `
    <div class="repo-name">
      ${repo.name}
    </div>
    <div class="repo-description">
      ${repo.description || 'No description available'}
    </div>
    <div class="repo-stats">
      ${repo.language ? `
        <div class="repo-language">
          ${languageColor}
          ${repo.language}
        </div>
      ` : ''}
      <div class="repo-stars">
        ⭐ ${repo.stargazers_count || 0}
      </div>
      <div class="repo-forks">
        🍴 ${repo.forks_count || 0}
      </div>
    </div>
    <div class="repo-click-hint">
      Click to view repository →
    </div>
  `;

  cardWrapper.appendChild(card);
  return cardWrapper;
}

function getLanguageColor(language) {
  const colors = {
    'JavaScript': '#f1e05a',
    'TypeScript': '#2b7489',
    'Python': '#3572A5',
    'Java': '#b07219',
    'C++': '#f34b7d',
    'C#': '#178600',
    'PHP': '#4F5D95',
    'Ruby': '#701516',
    'CSS': '#563d7c',
    'HTML': '#e34c26',
    'Vue': '#2c3e50',
    'React': '#61dafb',
    'Go': '#00ADD8',
    'Rust': '#dea584',
    'Shell': '#89e051',
    'Swift': '#ffac45',
    'Kotlin': '#A97BFF',
    'Dart': '#00B4AB'
  };
  return colors[language] || '#ccc';
}

function createRepoRows(repos) {
  // Calculate how many repos per row (2 rows total)
  const reposPerRow = Math.ceil(repos.length / 2);
  
  // Split repos into two arrays
  const firstRowRepos = repos.slice(0, reposPerRow);
  const secondRowRepos = repos.slice(reposPerRow);
  
  // Create container for the rows
  const rowsContainer = document.createElement('div');
  rowsContainer.className = 'repo-rows-container';
  
  // Create first row
  const firstRow = document.createElement('div');
  firstRow.className = 'repo-row';
  firstRowRepos.forEach(repo => {
    const card = createRepoCard(repo);
    firstRow.appendChild(card);
  });
  
  // Create second row (if there are repos for it)
  const secondRow = document.createElement('div');
  secondRow.className = 'repo-row';
  secondRowRepos.forEach(repo => {
    const card = createRepoCard(repo);
    secondRow.appendChild(card);
  });
  
  // Add rows to container
  rowsContainer.appendChild(firstRow);
  if (secondRowRepos.length > 0) {
    rowsContainer.appendChild(secondRow);
  }
  
  return rowsContainer;
}

async function displayPinnedRepos() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  try {
    // Add loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-repos';
    loadingDiv.textContent = 'Loading GitHub projects...';
    grid.appendChild(loadingDiv);

    const repos = await fetchSpecificRepos();
    
    // Remove loading indicator
    loadingDiv.remove();

    if (repos.length === 0) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-repos';
      errorDiv.textContent = 'No repositories found. Please check your GitHub username or try again later.';
      grid.appendChild(errorDiv);
      return;
    }

    // Clear existing repo cards (keep original project cards)
    const existingRepoCards = grid.querySelectorAll('.repo-card-wrapper, .repo-rows-container');
    existingRepoCards.forEach(card => card.remove());

    // Create and add the repo rows
    const repoRows = createRepoRows(repos);
    grid.appendChild(repoRows);
    
    console.log(`✅ Successfully loaded ${repos.length} repositories in 2 rows`);
    
  } catch (error) {
    // Remove loading indicator if it exists
    const loadingDiv = grid.querySelector('.loading-repos');
    if (loadingDiv) loadingDiv.remove();

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-repos';
    errorDiv.textContent = `Error loading GitHub projects: ${error.message}. Please check the console for details.`;
    grid.appendChild(errorDiv);
    
    console.error('Error in displayPinnedRepos:', error);
  }
}

function initGitHub() {
  loadGitHubAvatar();
  displayPinnedRepos();
}

// Make functions globally available
window.createRepoCard = createRepoCard;
window.initGitHub = initGitHub;
window.fetchSpecificRepos = fetchSpecificRepos;