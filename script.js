document.addEventListener('DOMContentLoaded', () => {
    const galleryContainer = document.getElementById('gallery');
    const searchInput = document.getElementById('search');
    const sortSelect = document.getElementById('sort');
    const typeFilter = document.getElementById('type-filter');
    const setFilter = document.getElementById('set-filter');
    const modal = document.getElementById('card-modal');
    const modalContent = document.getElementById('modal-card-details');
    const closeModal = document.querySelector('.close');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const pageInfo = document.getElementById('page-info');
    const themeToggle = document.getElementById('theme-toggle');

    let allCards = [];
    let filteredCards = [];
    let allTypes = new Set();
    let allSets = new Set();
    let currentPage = 1;
    const cardsPerPage = 20;

    // Load saved theme preference
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.checked = true;
    }

    // Handle theme toggle
    themeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    });

    fetch('https://api.pokemontcg.io/v2/cards?q=set.id:base1', { 
        headers: {
            'X-Api-Key': 'your_api_key_here' 
        }
    })
    .then(response => response.json())
    .then(data => {
        allCards = data.data;
        allCards.forEach(card => {
            if (card.types) {
                card.types.forEach(type => allTypes.add(type));
            }
            allSets.add(card.set.name);
        });

        populateFilterDropdowns();
        filterAndSortCards();
    })
    .catch(error => {
        console.error('Error fetching cards:', error);
    });

    searchInput.addEventListener('input', filterAndSortCards);
    sortSelect.addEventListener('change', filterAndSortCards);
    typeFilter.addEventListener('change', filterAndSortCards);
    setFilter.addEventListener('change', filterAndSortCards);
    prevPageBtn.addEventListener('click', () => changePage(-1));
    nextPageBtn.addEventListener('click', () => changePage(1));

    closeModal.addEventListener('click', () => {
        gsap.to(modalContent, { scale: 0.9, opacity: 0, duration: 0.3, onComplete: () => {
            modal.style.display = 'none';
            modal.classList.remove('show');
        }});
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            gsap.to(modalContent, { scale: 0.9, opacity: 0, duration: 0.3, onComplete: () => {
                modal.style.display = 'none';
                modal.classList.remove('show');
            }});
        }
    });

    function populateFilterDropdowns() {
        allTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            typeFilter.appendChild(option);
        });

        allSets.forEach(set => {
            const option = document.createElement('option');
            option.value = set;
            option.textContent = set;
            setFilter.appendChild(option);
        });

        gsap.fromTo([typeFilter, setFilter], { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 });
    }

    function filterAndSortCards() {
        const query = searchInput.value.toLowerCase();
        const sortCriteria = sortSelect.value;
        const selectedType = typeFilter.value;
        const selectedSet = setFilter.value;

        filteredCards = allCards.filter(card => {
            return (
                (card.name.toLowerCase().includes(query) ||
                (card.rarity && card.rarity.toLowerCase().includes(query)) ||
                (card.hp && card.hp.toString().includes(query)) ||
                (card.attacks && card.attacks.some(attack => attack.name.toLowerCase().includes(query)))) &&
                (selectedType === "" || (card.types && card.types.includes(selectedType))) &&
                (selectedSet === "" || card.set.name === selectedSet)
            );
        });

        if (sortCriteria === 'name') {
            filteredCards.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortCriteria === 'hp') {
            filteredCards.sort((a, b) => (b.hp || 0) - (a.hp || 0));
        } else if (sortCriteria === 'rarity') {
            const rarityOrder = ['Common', 'Uncommon', 'Rare', 'Ultra Rare', 'Secret Rare'];
            filteredCards.sort((a, b) => {
                const rarityA = rarityOrder.indexOf(a.rarity);
                const rarityB = rarityOrder.indexOf(b.rarity);
                return rarityA - rarityB;
            });
        }

        currentPage = 1;
        updatePagination();
        gsap.fromTo(galleryContainer, { opacity: 0 }, { opacity: 1, duration: 0.5 });
        displayCards(getCurrentPageCards(), galleryContainer);
    }

    function updatePagination() {
        const totalPages = Math.ceil(filteredCards.length / cardsPerPage);
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;
        gsap.fromTo([prevPageBtn, nextPageBtn], { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 });
    }

    function changePage(amount) {
        const totalPages = Math.ceil(filteredCards.length / cardsPerPage);
        currentPage = Math.min(Math.max(currentPage + amount, 1), totalPages);
        displayCards(getCurrentPageCards(), galleryContainer);
        updatePagination();
    }

    function getCurrentPageCards() {
        const startIndex = (currentPage - 1) * cardsPerPage;
        const endIndex = startIndex + cardsPerPage;
        return filteredCards.slice(startIndex, endIndex);
    }

    function displayCards(cards, container) {
        container.innerHTML = '';
        cards.forEach((card) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.innerHTML = `
                <img src="${card.images.small}" alt="${card.name}">
                <h3>${card.name}</h3>
                <p>HP: ${card.hp || 'N/A'}</p>
                <p>Rarity: ${card.rarity || 'N/A'}</p>
                <p>Attack Damage: ${getAttackDamage(card)}</p>
            `;
            cardElement.addEventListener('click', () => showCardDetails(card));
            container.appendChild(cardElement);
            
            tippy(cardElement, {
                content: `
                    <strong>${card.name}</strong><br>
                    <em>HP:</em> ${card.hp || 'N/A'}<br>
                    <em>Rarity:</em> ${card.rarity || 'N/A'}<br>
                    <em>Set:</em> ${card.set.name}
                `,
                allowHTML: true,
            });

            gsap.fromTo(cardElement, { scale: 0.9 }, { scale: 1, duration: 0.3 });
        });

        gsap.fromTo('.card', { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 });
    }

    function showCardDetails(card) {
        modalContent.innerHTML = `
            <img src="${card.images.large}" alt="${card.name}" style="width: 100%;">
            <h2>${card.name}</h2>
            <p><strong>HP:</strong> ${card.hp || 'N/A'}</p>
            <p><strong>Rarity:</strong> ${card.rarity || 'N/A'}</p>
            <p><strong>Attack Damage:</strong> ${getAttackDamage(card)}</p>
            <p><strong>Type:</strong> ${card.types ? card.types.join(', ') : 'N/A'}</p>
            <p><strong>Set:</strong> ${card.set.name}</p>
            <p><strong>Artist:</strong> ${card.artist}</p>
            <p><strong>Flavor Text:</strong> ${card.flavorText || 'N/A'}</p>
            <p><strong>Abilities:</strong> ${card.abilities ? card.abilities.map(a => a.name).join(', ') : 'N/A'}</p>
        `;
        modal.style.display = 'block';
        modal.classList.add('show');
        gsap.fromTo(modalContent, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3 });
    }

    function getAttackDamage(card) {
        if (!card.attacks) return 'N/A';
        return card.attacks.reduce((total, attack) => total + (attack.damage ? parseInt(attack.damage) : 0), 0);
    }

    let achievements = {
        firstSearch: false,
        firstSort: false,
        firstFilter: false,
    };

    searchInput.addEventListener('input', () => {
        if (!achievements.firstSearch) {
            alert('Achievement unlocked: First Search!');
            achievements.firstSearch = true;
        }
        filterAndSortCards();
    });

    sortSelect.addEventListener('change', () => {
        if (!achievements.firstSort) {
            alert('Achievement unlocked: First Sort!');
            achievements.firstSort = true;
        }
        filterAndSortCards();
    });

    typeFilter.addEventListener('change', () => {
        if (!achievements.firstFilter) {
            alert('Achievement unlocked: First Filter!');
            achievements.firstFilter = true;
        }
        filterAndSortCards();
    });
});
