document.addEventListener('DOMContentLoaded', () => {
    const randomCardsBtn = document.getElementById('random-cards-btn');
    const userCardsContainer = document.querySelector('#user-cards .cards');
    const cpuCardsContainer = document.querySelector('#cpu-cards .cards');
    const resultContainer = document.getElementById('result');
    let allCards = [];

    // Fetch a larger set of cards once
    fetch('https://api.pokemontcg.io/v2/cards?pageSize=100', {
        headers: {
            'X-Api-Key': 'c8190b2d-665c-4284-8772-f20a7ca88b2d' // Replace with your actual API key
        }
    })
    .then(response => response.json())
    .then(data => {
        allCards = data.data;
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

    randomCardsBtn.addEventListener('click', () => {
        if (allCards.length > 0) {
            const userCards = getRandomCards(allCards, 6);
            const cpuCards = getRandomCards(allCards, 6);
            displayBattleCards(userCards, userCardsContainer);
            displayBattleCards(cpuCards, cpuCardsContainer);
            const result = determineBattleResult(userCards, cpuCards);
            displayBattleResult(result);
        } else {
            console.error('No cards available for battle.');
        }
    });

    function getRandomCards(cards, count) {
        const shuffled = [...cards].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
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

    function determineBattleResult(userCards, cpuCards) {
        let userWins = 0;
        let cpuWins = 0;

        for (let i = 0; i < userCards.length; i++) {
            const userCardHP = parseInt(userCards[i].hp) || 0;
            const cpuCardHP = parseInt(cpuCards[i].hp) || 0;

            if (userCardHP > cpuCardHP) {
                userWins++;
            } else if (cpuCardHP > userCardHP) {
                cpuWins++;
            }
        }

        return {
            userWins,
            cpuWins
        };
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
