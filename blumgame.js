let GAME_SETTINGS = {
    clickPercentage: {
        bomb: 0,
        ice: 0,
        flower: Math.floor(Math.random() * (90 - 80 + 1)) + 55,
        dogs: Math.floor(Math.random() * (90 - 80 + 1)) + 90,
    },
    autoClickPlay: true,
};

let isGamePaused = true;
let isSettingsOpen = false;

try {
    let gameStats = {
        isGameOver: false,
    };

    const originalPush = Array.prototype.push;
    Array.prototype.push = function (...items) {
        if (!isGamePaused) {
            items.forEach(item => handleGameElement(item));
        }
        return originalPush.apply(this, items);
    };

    async function handleGameElement(element) {
        if (!element || !element.asset) return;

        const { assetType } = element.asset;
        const randomValue = Math.random() * 100;

        switch (assetType) {
            case "CLOVER":
                if (randomValue < GAME_SETTINGS.clickPercentage.flower) {
                    await clickElementWithDelay(element);
                }
                break;
            case "BOMB":
                if (randomValue < GAME_SETTINGS.clickPercentage.bomb) {
                    await clickElementWithDelay(element);
                }
                break;
            case "FREEZE":
                if (randomValue < GAME_SETTINGS.clickPercentage.ice) {
                    await clickElementWithDelay(element);
                }
                break;
            case "DOGS":
                if (randomValue < GAME_SETTINGS.clickPercentage.dogs) {
                    await clickElementWithDelay(element);
                }
                break;
            default:
                console.log(`Unknown element type: ${assetType}`);
        }
    }

    function clickElementWithDelay(element) {
        const clickDelay = Math.floor(Math.random() * (1500 - 200 + 1)) + 200;
        setTimeout(() => {
            element.onClick(element);
            element.isExplosion = true;
            element.addedAt = performance.now();
        }, clickDelay);
    }

    function checkGameCompletion() {
        const rewardElement = document.querySelector('#app > div > div > div.content > div.reward');
        if (rewardElement && !gameStats.isGameOver) {
            gameStats.isGameOver = true;
        }
    }

    function getNewGameDelay() {
        return Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000;
    }

    function checkAndClickPlayButton() {
        const playButtons = document.querySelectorAll('button.kit-button.is-large.is-primary, a.play-btn[href="/game"], button.kit-button.is-large.is-primary');

        playButtons.forEach(button => {
            if (!isGamePaused && GAME_SETTINGS.autoClickPlay && (/Play/.test(button.textContent) || /Continue/.test(button.textContent))) {
                setTimeout(() => {
                    button.click();
                    gameStats.isGameOver = false;
                }, getNewGameDelay());
            }
        });
    }

    function continuousPlayButtonCheck() {
        checkAndClickPlayButton();
        setTimeout(continuousPlayButtonCheck, 1000);
    }

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                checkGameCompletion();
            }
        }
    });

    const appElement = document.querySelector('#app');
    if (appElement) {
        observer.observe(appElement, { childList: true, subtree: true });
    }

    const controlsContainer = document.createElement('div');
    controlsContainer.style.position = 'fixed';
    controlsContainer.style.top = '0';
    controlsContainer.style.left = '50%';
    controlsContainer.style.transform = 'translateX(-50%)';
    controlsContainer.style.zIndex = '9999';
    controlsContainer.style.backgroundColor = 'black';
    controlsContainer.style.padding = '10px 10px';
    controlsContainer.style.borderRadius = '10px';
    document.body.appendChild(controlsContainer);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.display = 'flex';
    buttonsContainer.style.justifyContent = 'center';
    controlsContainer.appendChild(buttonsContainer);

    const pauseButton = document.createElement('button');
    pauseButton.textContent = '▶';
    pauseButton.style.padding = '4px 8px';
    pauseButton.style.backgroundColor = '#5d2a8f';
    pauseButton.style.color = 'white';
    pauseButton.style.border = 'none';
    pauseButton.style.borderRadius = '10px';
    pauseButton.style.cursor = 'pointer';
    pauseButton.style.marginRight = '5px';
    pauseButton.onclick = () => {
        toggleGamePause();
    };
    buttonsContainer.appendChild(pauseButton);

    const settingsButton = document.createElement('button');
    settingsButton.textContent = '⛯';
    settingsButton.style.padding = '4px 8px';
    settingsButton.style.backgroundColor = '#5d2a8f';
    settingsButton.style.color = 'white';
    settingsButton.style.border = 'none';
    settingsButton.style.borderRadius = '10px';
    settingsButton.style.cursor = 'pointer';
    settingsButton.onclick = toggleSettings;
    buttonsContainer.appendChild(settingsButton);

    const settingsContainer = document.createElement('div');
    settingsContainer.style.display = 'none';
    settingsContainer.style.marginTop = '10px';
    controlsContainer.appendChild(settingsContainer);

    function toggleSettings() {
        isSettingsOpen = !isSettingsOpen;
        if (isSettingsOpen) {
            settingsContainer.style.display = 'block';
            settingsContainer.innerHTML = '';

            const table = document.createElement('table');
            table.style.color = 'white';

            const items = [
                { label: '💣 Bomb %', settingName: 'bomb' },
                { label: '🧊 Ice %', settingName: 'ice' },
                { label: '🍀 Flower %', settingName: 'flower' },
                { label: '🐶 DOGS %', settingName: 'dogs' }
            ];

            items.forEach(item => {
                const row = table.insertRow();

                const labelCell = row.insertCell();
                labelCell.textContent = item.label;

                const inputCell = row.insertCell();
                const inputElement = document.createElement('input');
                inputElement.type = 'number';
                inputElement.value = GAME_SETTINGS.clickPercentage[item.settingName];
                inputElement.min = 0;
                inputElement.max = 100;
                inputElement.style.width = '50px';
                inputElement.addEventListener('input', () => {
                    GAME_SETTINGS.clickPercentage[item.settingName] = parseInt(inputElement.value, 10);
                });
                inputCell.appendChild(inputElement);
            });

            settingsContainer.appendChild(table);
        } else {
            settingsContainer.style.display = 'none';
        }
    }

    function toggleGamePause() {
        isGamePaused = !isGamePaused;
        if (isGamePaused) {
            pauseButton.textContent = '▶';
            GAME_SETTINGS.autoClickPlay = false;
        } else {
            pauseButton.textContent = '❚❚';
            GAME_SETTINGS.autoClickPlay = true;
            continuousPlayButtonCheck();
        }
    }

} catch (e) {
    console.error("!BlumFarm! error:", e);
}
