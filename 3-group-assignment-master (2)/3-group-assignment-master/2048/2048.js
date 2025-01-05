const emotions = ["伤心", "焦虑", "疲惫", "轻松", "希望", "快乐", "幸福", "极乐", "激励", "热爱", "至福"];
const emotionsValues = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048];
let gridSize = 4; // 默认网格大小（经典模式）
let grid = [];
let currentScore = 0;
let bestScore = 0;

// 游戏模式选择
function startGame(difficulty) {
    document.getElementById("difficulty-menu").style.display = "none"; // 隐藏菜单
    document.querySelector(".main-container").style.display = "flex"; // 显示游戏界面

    if (difficulty === "classic") {
        gridSize = 4; // 经典模式
    } else if (difficulty === "easy") {
        gridSize = 5; // 简单模式
    } else if (difficulty === "hard") {
        gridSize = 3; // 困难模式
    }

    // 初始化游戏
    initializeGame(difficulty);
}

// 初始化游戏
function initializeGame(difficulty = "classic") {
    currentScore = 0;
    document.getElementById("current-score").textContent = currentScore;
    document.getElementById("gameover").style.display = "none"; // 隐藏结束弹窗

    // 创建空的游戏网格
    grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));

    // 设置每种模式的初始词语数目或初始词语等级
    if (difficulty === "easy") {
        addRandomTile();
        addRandomTile();
        addRandomTile();
    } else if (difficulty === "hard") {
        const highLevel = Math.min(emotions.length - 1, 3);
        const randomRow = Math.floor(Math.random() * gridSize);
        const randomCol = Math.floor(Math.random() * gridSize);
        grid[randomRow][randomCol] = emotions[highLevel];
    } else {
        addRandomTile();
        addRandomTile();
    }

    // 动态计算并设置游戏容器大小
    const gameContainer = document.getElementById("game-board");
    gameContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    gameContainer.style.width = `${gridSize * 110}px`; // 每个单元格100px，额外加10px的间隙
    gameContainer.style.height = `${gridSize * 110}px`; // 每个单元格100px，额外加10px的间隙

    renderGrid(); // 渲染游戏网格
}

// 添加随机词语
function addRandomTile() {
    const emptyCells = [];
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (!grid[row][col]) emptyCells.push({ row, col });
        }
    }
    if (emptyCells.length > 0) {
        const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid[row][col] = emotions[0]; // 默认添加“伤心”
    }
}

// 渲染游戏网格
function renderGrid() {
    const gameBoard = document.getElementById("game-board");
    gameBoard.innerHTML = ""; // 清空内容
    grid.forEach(row => {
        row.forEach(cell => {
            const tile = document.createElement("div");
            tile.className = "tile";
            const level = cell ? emotions.indexOf(cell) : -1;
            tile.setAttribute("data-level", level);
            tile.style.backgroundColor = getColorByLevel(level);
            tile.textContent = cell || ""; // 显示词语或空
            gameBoard.appendChild(tile);
        });
    });
}

// 根据等级获取背景颜色
function getColorByLevel(level) {
    const colors = [
        "#fff7e6", "#ffe5cc", "#ffd1a3", "#ffbf80", "#ffaa66", "#ff944d",
        "#ff8533", "#ff751a", "#ff6600", "#e65c00", "#cc5200", "#b34700", "#993d00"
    ];
    return level >= 0 ? colors[level] : "#cdc1b4"; // 默认灰色
}

// 处理滑动逻辑
function handleSlide(direction) {
    let moved = false;

    if (direction === "left" || direction === "right") {
        grid = grid.map(row => {
            const originalRow = [...row];
            const newRow = slideAndMerge(direction === "left" ? row : row.reverse());
            moved = moved || JSON.stringify(originalRow) !== JSON.stringify(newRow);
            return direction === "left" ? newRow : newRow.reverse();
        });
    } else {
        for (let col = 0; col < gridSize; col++) {
            const column = grid.map(row => row[col]);
            const originalColumn = [...column];
            const newColumn = slideAndMerge(direction === "up" ? column : column.reverse());
            moved = moved || JSON.stringify(originalColumn) !== JSON.stringify(newColumn);
            for (let row = 0; row < gridSize; row++) {
                grid[row][col] = direction === "up" ? newColumn[row] : newColumn[gridSize - 1 - row];
            }
        }
    }

    if (moved) {
        addRandomTile();
        renderGrid();
        updateScore();
        checkGameOver();
    }
}

// 滑动和合并逻辑
function slideAndMerge(row) {
    const filteredRow = row.filter(cell => cell); // 移除空单元格

    // 合并相邻相同的单元格
    for (let i = 0; i < filteredRow.length - 1; i++) {
        if (filteredRow[i] === filteredRow[i + 1]) {
            const index = emotions.indexOf(filteredRow[i]); // 获取当前等级
            currentScore += emotionsValues[index]; // 根据分值增加分数
            filteredRow[i] = combineWords(filteredRow[i]); // 升级心情
            filteredRow[i + 1] = null; // 清空已合并的单元格
        }
    }

    const mergedRow = filteredRow.filter(cell => cell); // 再次移除空单元格

    while (mergedRow.length < gridSize) {
        mergedRow.push(null); // 填充剩余空格
    }

    return mergedRow;
}

// 合并词语逻辑
function combineWords(word) {
    const index = emotions.indexOf(word);
    const newWord = index < emotions.length - 1 ? emotions[index + 1] : word;

    const currentHighestIndex = emotions.indexOf(document.getElementById("current-highest").textContent);
    if (index + 1 > currentHighestIndex) {
        document.getElementById("current-highest").textContent = newWord;
    }

    return newWord;
}

function updateScore() {
    document.getElementById("current-score").textContent = currentScore;

    const highestLevel = Math.max(
        ...grid.flat().map(cell => (cell ? emotions.indexOf(cell) : -1))
    );
    if (highestLevel >= 0) {
        document.getElementById("current-highest").textContent = emotions[highestLevel];
    }

    if (currentScore > bestScore) {
        bestScore = currentScore;
        document.getElementById("best-score").textContent = bestScore;
    }
}

// 检查游戏结束
function checkGameOver() {
    const emptyCells = grid.flat().filter(cell => cell === null);

    if (emptyCells.length > 0) return;

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const current = grid[row][col];
            if (
                (row > 0 && grid[row - 1][col] === current) ||
                (row < gridSize - 1 && grid[row + 1][col] === current) ||
                (col > 0 && grid[row][col - 1] === current) ||
                (col < gridSize - 1 && grid[row][col + 1] === current)
            ) {
                return;
            }
        }
    }

    const gameOverModal = document.getElementById("gameover");
    document.getElementById("final-score").textContent = currentScore;
    document.getElementById("final-highest").textContent = document.getElementById("current-highest").textContent;
    gameOverModal.style.display = "flex"; // 显示游戏结束弹窗
}

// 键盘控制
document.addEventListener("keydown", event => {
    switch (event.key) {
        case "ArrowLeft":
            handleSlide("left");
            break;
        case "ArrowRight":
            handleSlide("right");
            break;
        case "ArrowUp":
            handleSlide("up");
            break;
        case "ArrowDown":
            handleSlide("down");
            break;
    }
});

// 重新开始按钮
document.getElementById("restart-btn").addEventListener("click", () => {
    document.getElementById("difficulty-menu").style.display = "block";
    document.querySelector(".main-container").style.display = "none"; // 隐藏游戏界面
});
