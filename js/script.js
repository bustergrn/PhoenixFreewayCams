document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    fetch('cameras.json')
        .then(response => {
            console.log('Response status:', response.status);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Parsed JSON data:', data);
            createIndexPage(data.cameras);
        })
        .catch(error => console.error('There has been a problem with your fetch operation:', error));

    // Dark mode toggle functionality
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;

    // Check local storage for theme preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        body.className = currentTheme;
        darkModeToggle.textContent = currentTheme === 'dark-mode' ? 'Light Mode' : 'Dark Mode';
    }

    darkModeToggle.addEventListener('click', () => {
        if (body.className === 'light-mode') {
            body.className = 'dark-mode';
            darkModeToggle.textContent = 'Light Mode';
            localStorage.setItem('theme', 'dark-mode');
        } else {
            body.className = 'light-mode';
            darkModeToggle.textContent = 'Dark Mode';
            localStorage.setItem('theme', 'light-mode');
        }
    });

    function createIndexPage(cameras) {
        const menu = document.getElementById('menu');
        const groupedByLogoID = groupBy(cameras, 'LogoID');

        Object.keys(groupedByLogoID).forEach(logoID => {
            const highwayGroup = document.createElement('div');
            highwayGroup.className = 'col-md-4 highway-group';

            const logo = document.createElement('img');
            logo.src = `logos/${logoID}.png`; // Assuming logos are named after logoID
            logo.alt = `${logoID} Logo`;
            logo.className = 'highway-logo';

            highwayGroup.appendChild(logo);

            const buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'buttons-container';

            // Ensure buttons for each GridPage are unique and grouped correctly
            const gridPages = new Set(groupedByLogoID[logoID].map(camera => camera.GridPage));
            gridPages.forEach(gridPage => {
                const location = groupedByLogoID[logoID].find(camera => camera.GridPage === gridPage).Location;
                const button = document.createElement('button');
                button.textContent = location;  // Use Location as button text
                button.addEventListener('click', () => loadGrid(groupedByLogoID[logoID].filter(camera => camera.GridPage === gridPage), gridPage));
                button.className = 'highway-button';
                buttonsContainer.appendChild(button);
            });

            highwayGroup.appendChild(buttonsContainer);
            menu.appendChild(highwayGroup);
        });
    }

    function loadGrid(cameras, gridPage) {
        console.log('Loading grid for:', gridPage, cameras);

        const gridContainer = document.createElement('div');
        gridContainer.className = 'grid-container';
        document.body.innerHTML = ''; // Clear the menu
        document.body.appendChild(gridContainer);

        cameras.sort((a, b) => a.CameraPos - b.CameraPos);

        cameras.forEach(camera => {
            const gridItem = document.createElement('div');
            gridItem.className = 'grid-item';
            const img = document.createElement('img');
            img.src = `${camera.CameraURL}`;
            img.alt = `Camera ${camera.CameraPos}`;
            img.addEventListener('click', () => toggleFullScreen(img));
            gridItem.appendChild(img);
            gridContainer.appendChild(gridItem);

            setInterval(() => {
                img.src = `${camera.CameraURL}?${new Date().getTime()}`;
            }, 3000);
        });

        createBackButton();
    }

    function groupBy(array, key) {
        return array.reduce((result, currentValue) => {
            (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
            return result;
        }, {});
    }

    function createBackButton() {
        const backButton = document.createElement('button');
        backButton.textContent = 'Back to Menu';
        backButton.className = 'back-button';
        backButton.addEventListener('click', () => location.reload());
        document.body.appendChild(backButton);
    }

    function toggleFullScreen(img) {
        const fullscreenDiv = document.createElement('div');
        fullscreenDiv.className = 'fullscreen';
        const fullscreenImg = document.createElement('img');
        fullscreenImg.src = img.src;
        fullscreenImg.addEventListener('click', () => {
            document.body.removeChild(fullscreenDiv);
        });
        fullscreenDiv.appendChild(fullscreenImg);

        document.body.appendChild(fullscreenDiv);
    }
});
