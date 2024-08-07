function factorial(number) {
    let value = 1;
    for (let i = number; i > 1; i--) {
        value *= i;
    }
    return value;
}

function combination(n, d) {
    if (n == d) return 1;
    return factorial(n) / (factorial(d) * factorial(n - d));
}

function calculateResults(mines, diamonds) {
    const totalCells = 25;
    const safeCells = totalCells - mines;
    const first = combination(totalCells, diamonds);
    const second = combination(safeCells, diamonds);
    const result = 0.99 * (first / second);
    const minIncreaseOnLoss = (100 / (result - 1));
    const winningChance = (99 / result);

    return {
        multiplier: result,
        minIncreaseOnLoss: minIncreaseOnLoss,
        winningChance: winningChance
    };
}

function generateMinesBoard() {
    const mines = parseInt(document.getElementById('mines').value);
    const diamonds = parseInt(document.getElementById('diamonds').value);
    const betSize = parseFloat(document.getElementById('betSize').value);

    if (!mines || !diamonds) {
        const results = `
CHOOSE AMOUNT OF MINES AND DIAMONDS IDIOT
`;
        document.getElementById('minesResults').innerHTML = results;
        return;
    }

    const totalCells = 25;
    const cells = Array(totalCells).fill('');

    if (mines + diamonds > totalCells) {
        alert('Too many mines and diamonds!');
        return;
    }

    // Create an array of indices representing the cell positions
    let indices = Array.from({ length: totalCells }, (v, i) => i);

    // Shuffle the indices array to randomize positions
    indices = indices.sort(() => Math.random() - 0.5);

    // Place mines in the first 'mines' number of indices
    for (let i = 0; i < mines; i++) {
        cells[indices[i]] = 'mine';
    }

    // Place diamonds in the next 'diamonds' number of indices
    for (let i = mines; i < mines + diamonds; i++) {
        cells[indices[i]] = 'diamond';
    }

    // Fill remaining blank cells with default diamonds
    for (let i = 0; i < totalCells; i++) {
        if (cells[i] === '') {
            cells[i] = 'defaultDiamond';
        }
    }

    const board = document.getElementById('minesBoard');
    board.innerHTML = '';
    board.style.display = 'grid'; // Show the board
    cells.forEach(cell => {
        const cellDiv = document.createElement('div');
        cellDiv.className = 'cell ' + cell;
        board.appendChild(cellDiv);
    });

    const { multiplier, minIncreaseOnLoss, winningChance } = calculateResults(mines, diamonds);
    const winAmount = betSize * multiplier;
    const results = `
<strong>${multiplier.toFixed(1)}x<br>
<strong>Win Amount is:</strong> $${winAmount.toFixed(2)}<br>
<strong>Winning Chance:</strong> ${winningChance.toFixed(3)}%<br>
<strong>Minimal increase on loss:</strong> x${minIncreaseOnLoss.toFixed(3)}
`;
    document.getElementById('minesResults').innerHTML = results;
}

function doubleBet() {
    const betInput = document.getElementById('betSize');
    let currentBet = parseFloat(betInput.value);
    currentBet = currentBet * 2;
    betInput.value = currentBet < 1 ? currentBet.toFixed(4) : currentBet.toFixed(2);
}

function halveBet() {
    const betInput = document.getElementById('betSize');
    let currentBet = parseFloat(betInput.value);
    currentBet = currentBet / 2;
    betInput.value = currentBet < 1 ? currentBet.toFixed(4) : currentBet.toFixed(2);
}

function randomizeMinesAndDiamonds() {
    const minMines = parseInt(document.getElementById('minMines').value);
    const maxMines = parseInt(document.getElementById('maxMines').value);
    const minDiamonds = parseInt(document.getElementById('minDiamonds').value);
    const maxDiamonds = parseInt(document.getElementById('maxDiamonds').value);

    if (minMines > maxMines || minDiamonds > maxDiamonds) {
        alert('Invalid range values!');
        return;
    }

    const mines = Math.floor(Math.random() * (maxMines - minMines + 1)) + minMines;
    const diamonds = Math.floor(Math.random() * (maxDiamonds - minDiamonds + 1)) + minDiamonds;

    document.getElementById('mines').value = mines;
    document.getElementById('diamonds').value = diamonds;

    generateMinesBoard();
}

// Add this function to your existing JavaScript file (script.js)

document.getElementById('betSize').addEventListener('input', function (e) {
    let value = parseFloat(e.target.value);
    if (!isNaN(value)) {
        e.target.value = value.toFixed(2);
    }
});

function toggleRandomizationFields() {
    const randomizationFields = document.getElementById('randomizationFields');
    const randomizeButton = document.getElementById('randomizeButton');
    const isChecked = document.getElementById('toggleRandomization').checked;
    if (isChecked) {
        randomizationFields.style.display = 'flex';
        randomizeButton.disabled = false;
    } else {
        randomizationFields.style.display = 'none';
        randomizeButton.disabled = true;
    }
}

// Ensure randomization fields are hidden and button is disabled by default
document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('randomizationFields').style.display = 'none';
    document.getElementById('randomizeButton').disabled = true;
});

function calculateWinningChance() {
    // Example calculation, you need to replace with actual logic
    const numberOfMines = parseInt(document.getElementById('mines').value);
    const numberOfDiamonds = parseInt(document.getElementById('diamonds').value);
    const totalFields = 25;
    const winningChance = (numberOfDiamonds / totalFields) * 100;
    return winningChance.toFixed(4);
}

function calculateMinimalIncreaseOnLoss() {
    // Example calculation, you need to replace with actual logic
    const betSize = parseFloat(document.getElementById('betSize').value);
    const minimalIncrease = betSize * 0.001; // Example multiplier
    return minimalIncrease.toFixed(4);
}

function updateResults() {
    const winningChanceElement = document.getElementById('winningChance');
    const minIncreaseLossElement = document.getElementById('minIncreaseLoss');

    const winningChance = calculateWinningChance();
    const minIncreaseLoss = calculateMinimalIncreaseOnLoss();

    winningChanceElement.textContent = `${winningChance}%`;
    minIncreaseLossElement.textContent = `x${minIncreaseLoss}`;
}

// Call updateResults() whenever the inputs change
document.getElementById('mines').addEventListener('input', updateResults);
document.getElementById('diamonds').addEventListener('input', updateResults);
document.getElementById('betSize').addEventListener('input', updateResults);

// Initial call to display results
updateResults();
