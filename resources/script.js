document.addEventListener('DOMContentLoaded', function() {
    fetch('agencyData.json')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('agencies-container');
        data.forEach(agency => {
            const agencyDiv = document.createElement('div');
            agencyDiv.classList.add('agency-group');

            const logoImg = document.createElement('img');
            logoImg.src = agency.imgSrc;
            logoImg.alt = 'Logo';
            logoImg.style.width = '100px';
            logoImg.style.height = '100px';

            agencyDiv.appendChild(logoImg);

            agency.links.forEach(link => {
                const button = document.createElement('button');
                button.onclick = function() { window.location.href = link.href; };
                button.textContent = link.text;
                agencyDiv.appendChild(button);
            });

            container.appendChild(agencyDiv);
        });
    })
    .catch(error => console.error('Error loading the data:', error));
});
