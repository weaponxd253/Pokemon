document.addEventListener('DOMContentLoaded', () => {
    const setSelect = document.getElementById('set-select');
    const fetchSetCardsBtn = document.getElementById('fetch-set-cards-btn');
    const startBattleBtn = document.getElementById('start-battle-btn');
    const availableCardsContainer = document.querySelector('#available-cards .cards');
    const selectedCardsContainer = document.querySelector('#selected-cards .cards');
    const userCardsContainer = document.querySelector('#user-cards .cards');
    const cpuCardsContainer = document.querySelector('#cpu-cards .cards');
    const resultContainer = document.getElementById('result');
    let availableCards = [];
    let selectedCards = [];

    // Fetch available sets
    fetch('https://api.pokemontcg.io/v2/sets', {
        headers: {
            'X-Api-Key': 'c8190b2d-665c-4284-8772-f20a7ca88b2d' // Replace with your actual API key
        }
    })
    .then(response => response.json())
    .then(data => {
        data.data.forEach(set => {
            const option = document.createElement('option');
            option.value = set.id;
            option.textContent = set.name;
            setSelect.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Error fetching sets:', error);
    });

    fetchSetCardsBtn.addEventListener('click', () => {
        const selectedSet = setSelect.value;
        if (selectedSet) {
            fetch(`https://api.pokemontcg.io/v2/cards?q=set.id:${selectedSet}`, {
                headers: {
                    'X-Api-Key': 'your_api_key_here' // Replace with your actual API key
                }
            })
            .then(response => response.json())
            .then(data => {
                availableCards = data.data;
                displayAvailableCards(availableCards);
            })
            .catch(error => {
                console.error('Error fetching cards:', error);
            });
        }
    });

    startBattleBtn.addEventListener('click', () => {
        console.log('Start Battle button clicked');
        if (selectedCards.length === 6) {
            console.log('Selected cards for battle:', selectedCards);
            const cpuCards = getRandomCards(availableCards, 6);
            console.log('CPU cards for battle:', cpuCards);
            displayBattleCards(selectedCards, userCardsContainer);
            displayBattleCards(cpuCards, cpuCardsContainer);
            const result = determineBattleResult(selectedCards, cpuCards);
            console.log('Battle result:', result);
            displayBattleResult(result);
        } else {
            console.log('Selected cards count:', selectedCards.length);
        }
    });

    function getRandomCards(cards, count) {
        const shuffled = [...cards].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    function displayAvailableCards(cards) {
        availableCardsContainer.innerHTML = '';
        cards.forEach((card) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.innerHTML = `
                <img src="${card.images.small}" alt="${card.name}">
                <h3>${card.name}</h3>
                <p>Set: ${card.set.name}</p>
                <p>HP: ${card.hp || 'N/A'}</p>
                <p>Rarity: ${card.rarity || 'N/A'}</p>
                <p>Retreat Cost: ${card.convertedRetreatCost || 'N/A'}</p>
                <p>Attack Damage: ${getAttackDamage(card)}</p>
                <p>Number of Attacks: ${card.attacks ? card.attacks.length : 0}</p>
                <p>Abilities: ${card.abilities ? card.abilities.map(ability => ability.name).join(', ') : 'None'}</p>
            `;
            cardElement.addEventListener('click', () => {
                if (selectedCards.length < 6 && !selectedCards.includes(card)) {
                    selectedCards.push(card);
                    cardElement.classList.add('selected');
                    displaySelectedCards(selectedCards);
                    if (selectedCards.length === 6) {
                        startBattleBtn.disabled = false;
                        console.log('Start Battle button enabled');
                    }
                } else if (cardElement.classList.contains('selected')) {
                    selectedCards = selectedCards.filter(c => c.id !== card.id);
                    cardElement.classList.remove('selected');
                    displaySelectedCards(selectedCards);
                    startBattleBtn.disabled = true;
                    console.log('Start Battle button disabled');
                }
            });
            availableCardsContainer.appendChild(cardElement);
        });
    }

    function displaySelectedCards(cards) {
        selectedCardsContainer.innerHTML = '';
        cards.forEach((card) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card', 'selected');
            cardElement.innerHTML = `
                <img src="${card.images.small}" alt="${card.name}">
                <h3>${card.name}</h3>
                <p>Set: ${card.set.name}</p>
                <p>HP: ${card.hp || 'N/A'}</p>
                <p>Rarity: ${card.rarity || 'N/A'}</p>
                <p>Retreat Cost: ${card.convertedRetreatCost || 'N/A'}</p>
                <p>Attack Damage: ${getAttackDamage(card)}</p>
                <p>Number of Attacks: ${card.attacks ? card.attacks.length : 0}</p>
                <p>Abilities: ${card.abilities ? card.abilities.map(ability => ability.name).join(', ') : 'None'}</p>
                <button class="remove-card-btn">Remove</button>
            `;
            cardElement.querySelector('.remove-card-btn').addEventListener('click', () => {
                selectedCards = selectedCards.filter(c => c.id !== card.id);
                displaySelectedCards(selectedCards);
                displayAvailableCards(availableCards);
                startBattleBtn.disabled = true;
                console.log('Start Battle button disabled');
            });
            selectedCardsContainer.appendChild(cardElement);
        });
    }

    function displayBattleCards(cards, container) {
        container.innerHTML = '';
        cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.innerHTML = `
                <img src="${card.images.small}" alt="${card.name}">
                <h3>${card.name}</h3>
                <p>Set: ${card.set.name}</p>
                <p>HP: ${card.hp || 'N/A'}</p>
                <p>Rarity: ${card.rarity || 'N/A'}</p>
                <p>Retreat Cost: ${card.convertedRetreatCost || 'N/A'}</p>
                <p>Attack Damage: ${getAttackDamage(card)}</p>
                <p>Number of Attacks: ${card.attacks ? card.attacks.length : 0}</p>
                <p>Abilities: ${card.abilities ? card.abilities.map(ability => ability.name).join(', ') : 'None'}</p>
            `;
            container.appendChild(cardElement);

            // Apply GSAP animation
            gsap.from(cardElement, {
                duration: 1,
                opacity: 0,
                y: 20,
                delay: index * 0.1
            });
        });
    }

    function getAttackDamage(card) {
        if (!card.attacks) return 'N/A';
        return card.attacks.reduce((total, attack) => total + (attack.damage ? parseInt(attack.damage) : 0), 0);
    }

    function determineBattleResult(userCards, cpuCards) {
        let userWins = 0;
        let cpuWins = 0;

        for (let i = 0; i < userCards.length; i++) {
            const userCard = userCards[i];
            const cpuCard = cpuCards[i];

            const userScore = getCardScore(userCard);
            const cpuScore = getCardScore(cpuCard);

            if (userScore > cpuScore) {
                userWins++;
            } else if (cpuScore > userScore) {
                cpuWins++;
            }
        }

        return {
            userWins,
            cpuWins
        };
    }

    function getCardScore(card) {
        const hp = parseInt(card.hp) || 0;
        const attackDamage = getAttackDamage(card) || 0;
        const retreatCost = card.convertedRetreatCost || 0;
        const rarityScore = getRarityScore(card.rarity) || 0;
        const numberOfAttacks = card.attacks ? card.attacks.length : 0;
        const abilityScore = card.abilities ? card.abilities.length * 2 : 0; // Giving a higher score for abilities
        
        return hp + attackDamage - retreatCost + rarityScore + numberOfAttacks + abilityScore;
    }

    function getRarityScore(rarity) {
        const rarityScores = {
            "Common": 1,
            "Uncommon": 2,
            "Rare": 3,
            "Ultra Rare": 4,
            "Secret Rare": 5
        };
        return rarityScores[rarity] || 0;
    }

    function displayBattleResult(result) {
        resultContainer.innerHTML = `
            <p>User Wins: ${result.userWins}</p>
            <p>CPU Wins: ${result.cpuWins}</p>
        `;
        
        if (result.userWins > result.cpuWins) {
            resultContainer.innerHTML += `<p>Result: User Wins the Battle!</p>`;
        } else if (result.cpuWins > result.userWins) {
            resultContainer.innerHTML += `<p>Result: CPU Wins the Battle!</p>`;
        } else {
            resultContainer.innerHTML += `<p>Result: It's a Tie!</p>`;
        }
    }
});
