let game_W = 20;
let game_H = 20;
let XXX = 0, YYY = 0, Xh = 0, Yh = 0;
let MaxLeng = 0;
let speedReturn = 0;
let R = 0, r = 0;
let drag = false;
let d = false;
let ok = false;
let angle = 90;
let ChAngle = -1;
index = -1;
level = -1;
time = 20; // 游戏初始时间
tager = 1000;
timeH = 0;
vlH = 0;

var bg = new Image();
bg.src = "images/bg2.jpg";
var hook = new Image();
hook.src = "images/hook.png";
var targetIM = new Image();
targetIM.src = "images/target.png";
var dolarIM = new Image();
dolarIM.src = "images/dolar.png";
var levelIM = new Image();
levelIM.src = "images/level.png";
var clockIM = new Image();
clockIM.src = "images/clock.png";

let N = -10;

class Game {
    constructor() {
        this.canvas = null;
        this.context = null;
        this.score = 0;  // 当前得分
        this.gg = []; // 存储游戏对象的数组
        this.level = 1; // 初始关卡
        this.tager = 1000; // 初始目标分数
        this.time = 20; // 游戏时间
        this.gameOverFlag = false; // 是否游戏结束
        this.highLevel = parseInt(localStorage.getItem('highLevel'), 10) || 1; // 确保读取为数字类型
    }


    init() {
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        document.body.appendChild(this.canvas);

        this.render();
        this.newGold();
        this.initGold();
        this.loop();
        this.listenKeyboard();
        this.listenMouse();
    }

    startGame() {
        this.init();
        this.level = 1; // 初始化关卡为 1
        this.score = 0; // 初始化分数为 0
        this.tager = 1000;
    }
    

    newGold() {
        ok = false;
        index = -1;
        Xh = XXX;
        Yh = YYY;
        r = R;
        drag = false;
        timeH = -1;
        vlH = 0;
        time = 20;  // 重置时间
        level++
    
        // this.level++; // 移除此行
    
        // 更新历史最高关卡
        if (this.level > this.highLevel) {
            this.highLevel = this.level;
            localStorage.setItem('highLevel', this.highLevel.toString()); // 存储到 localStorage
        }
    
        this.gg = [];
        this.initGold(); // 初始化新物品
    }
    
    
      
    listenKeyboard() {
        document.addEventListener("keydown", key => {
            this.solve();
        });
    }

    listenMouse() {
        document.addEventListener("mousedown", evt => {
            this.solve();
        });
    }

    solve() {
        if (!drag) {
            drag = true;
            d = true;
            speedReturn = this.getWidth() / 2;
            index = -1;
        }
    }

    loop() {
        this.update();
        this.draw();
    
        // 如果时间还没结束并且分数没有达到目标，继续游戏
        if (this.time > 0) {
            setTimeout(() => this.loop(), 10);
        } else {
            // 如果时间结束，判断得分是否达到目标
            if (this.score >= this.tager) {
                this.newGold();  // 进入下一关
            } else {
                this.gameOver();  // 显示游戏失败
            }
        }
    }
    
    

    update() {
        this.render();
        if (this.gameOverFlag) return;  // 如果游戏已经结束，直接返回，停止更新
    
        time -= 0.01; // 每次更新时减少时间
    
        if (time <= 0) {
            time = 0; // 防止时间变成负数
            this.gameOver(); // 调用游戏结束方法
        }
    
        Xh = XXX + r * Math.cos(this.toRadian(angle));
        Yh = YYY + r * Math.sin(this.toRadian(angle));
        if (!drag) {
            angle += ChAngle;
            if (angle >= 165 || angle <= 15)
                ChAngle = -ChAngle;
        } else {
            if (r < MaxLeng && d && !ok)
                r += this.getWidth() / 5;
            else {
                d = false;
                r -= speedReturn / 2.5;
            }
            if (r < R) {
                r = R;
                drag = false;
                ok = false;
                index = -1;
                for (let i = 0; i < N; i++) {
                    if (this.gg[i].alive && this.range(Xh, Yh, this.gg[i].x, this.gg[i].y) <= 2 * this.getWidth()) {
                        this.gg[i].alive = false;
                        this.score += this.gg[i].score;
                        timeH = time - 0.7;
                        vlH = this.gg[i].score;
                    }
                }
            }
        }
    
        if (drag && index == -1) {
            for (let i = 0; i < N; i++) {
                if (this.gg[i].alive && this.range(Xh, Yh, this.gg[i].x, this.gg[i].y) <= this.gg[i].size()) {
                    ok = true;
                    index = i;
                    break;
                }
            }
        }
        if (index != -1) {
            this.gg[index].x = Xh;
            this.gg[index].y = Yh + this.gg[index].height / 3;
            speedReturn = this.gg[index].speed;
        }
    }

    render() {
        if (game_W != document.documentElement.clientWidth || game_H != document.documentElement.clientHeight) {
            this.canvas.width = document.documentElement.clientWidth;
            this.canvas.height = document.documentElement.clientHeight;
            game_W = this.canvas.width;
            game_H = this.canvas.height;
            XXX = game_W / 2;
            YYY = game_H * 0.18;
            R = this.getWidth() * 2;
            if (!drag)
                r = R;
            MaxLeng = this.range(XXX, YYY, game_W - 2 * this.getWidth(), game_H - 2 * this.getWidth());
            if (N < 0)
                N = game_W * game_H / (20 * this.getWidth() * this.getWidth());
        }
    }

    draw() {
        this.clearScreen();
        for (let i = 0; i < N; i++)
            if (this.gg[i].alive) {
                this.gg[i].update();
                this.gg[i].draw();
            }

        this.context.beginPath();
        this.context.strokeStyle = "black";
        this.context.lineWidth = Math.floor(this.getWidth() / 10);
        this.context.moveTo(XXX + 40, YYY + 40);
        this.context.lineTo(Xh, Yh);

        this.context.stroke();
        this.context.beginPath();
        this.context.arc(XXX + 40, YYY + 40, 3, 0, 2 * Math.PI);
        this.context.stroke();

        this.context.save();
        this.context.translate(Xh, Yh);
        this.context.rotate(this.toRadian(angle - 90));
        this.context.drawImage(hook, -this.getWidth() / 4, -this.getWidth() / 8, this.getWidth() / 2, this.getWidth() / 2);
        this.context.restore();

        this.drawText();
    }

    drawText() {
        this.context.drawImage(dolarIM, this.getWidth() / 2, this.getWidth() / 2, this.getWidth(), this.getWidth());
        this.context.fillStyle = "White";
        if (this.score > tager)
            this.context.fillStyle = "White";
        this.context.font = this.getWidth() + 'px Stencil';
        this.context.fillText(this.score, this.getWidth() * 1.5, this.getWidth() * 1.35);
    
        this.context.drawImage(targetIM, this.getWidth() / 2, this.getWidth() / 2 + this.getWidth(), this.getWidth(), this.getWidth());
        this.context.fillStyle = "White";
        this.context.font = this.getWidth() + 'px Stencil';
        this.context.fillText(tager, this.getWidth() * 1.5, this.getWidth() * 2.35);
    
        this.context.drawImage(levelIM, game_W - 3 * this.getWidth(), this.getWidth() / 2, this.getWidth(), this.getWidth());
        this.context.fillStyle = "White";
        this.context.font = this.getWidth() + 'px Stencil';
        this.context.fillText(this.level, game_W - 2 * this.getWidth(), this.getWidth() * 1.35); // 更新此行：使用 this.level
    
        this.context.drawImage(clockIM, game_W - 3 * this.getWidth(), this.getWidth() / 2 + this.getWidth(), this.getWidth(), this.getWidth());
        this.context.fillStyle = "White";
        this.context.font = this.getWidth() + 'px Stencil';
        this.context.fillText(Math.floor(time), game_W - 2 * this.getWidth(), this.getWidth() * 2.35);
    }
    
    

    clearScreen() {
        this.context.clearRect(0, 0, game_W, game_H);
        this.context.drawImage(bg, (bg.width - game_W * (bg.height / game_H)) / 2, 0, game_W * (bg.height / game_H), bg.height, 0, 0, game_W, game_H);
    }

    checkWin() {
        let check = true;
        for (let i = 0; i < N; i++)
            if (this.gg[i].alive == true)
                check = false;
        return check;
    }

    gameOver() {
        // 停止钩子的操作
        drag = false;  // 禁止继续拖动钩子
    
        // 游戏结束后，显示游戏结束提示框
        const endScreen = document.getElementById("end-screen");
        const endScreenTitle = document.getElementById("end-screen-title");
        const endScreenScore = document.getElementById("end-screen-score");
        const endScreenButton = document.getElementById("end-screen-button");
        const backToHomeButton = document.getElementById("back-to-home"); // 获取返回首页按钮
    
        // 设置结束屏幕内容
        if (this.score >= this.tager) {
            endScreenTitle.textContent = "你赢了！";
            endScreenScore.textContent = `你的得分：${this.score}`;
            endScreenButton.textContent = "进入下一关";
        } else {
            endScreenTitle.textContent = "游戏失败！";
            endScreenScore.textContent = `你的得分：${this.score}`;
            endScreenButton.textContent = "重新开始游戏";
        }
    
        // 显示结束屏幕
        endScreen.style.display = "flex";
    
        // 设置重新开始按钮的点击事件
        endScreenButton.onclick = () => {
            if (this.score >= this.tager) {
                // 如果游戏胜利，进入下一关
                this.level++;  // 增加关卡
            } else {
                // 如果游戏失败，关卡重置为 1
                this.level = 1; // 重置关卡为 1
            }
    
            this.score = 0; // 重置分数为 0
            this.tager = 1000; // 设置目标分数为 1000
    
            // 开始新的一关
            this.newGold(); // 重新开始新的一关
            endScreen.style.display = "none"; // 隐藏结束界面
        };
    
        // 设置返回首页按钮的点击事件
        backToHomeButton.onclick = () => {
            window.location.href = "index.html"; // 返回首页，假设首页为 index.html
        };
    }
     

    
    onGameEnd() {
        // 更新历史最高关卡等级
        if (this.level > this.highLevel) {
            this.highLevel = this.level;
            localStorage.setItem('highLevel', this.highLevel); // 存储新的历史最高关卡到 localStorage
        }
    
        // 更新结束界面内容
        const endScreenTitle = document.getElementById("end-screen-title");
        const endScreenScore = document.getElementById("end-screen-score");
        endScreenTitle.textContent = "游戏结束";
        endScreenScore.textContent = `当前关卡: ${this.level}`;
    
        // 更新动态历史最高关卡显示
        const highLevelDisplay = document.getElementById("high-level-display");
        if (highLevelDisplay) {
            highLevelDisplay.textContent = "历史最高关卡等级: " + this.highLevel;
        }
    
        // 显示结束界面
        document.getElementById("end-screen").style.display = "block";
    }
    
    
    initGold() {
        this.gg = [];
        for (let i = 0; i < N; i++)
            this.gg[i] = new gold(this);
        while (true) {
            let check = true;
            for (let i = 0; i < N - 1; i++)
                for (let j = i + 1; j < N; j++)
                    while (this.range(this.gg[i].x, this.gg[i].y, this.gg[j].x, this.gg[j].y) < 2 * this.getWidth()) {
                        check = false;
                        this.gg[j].randomXY();
                    }
            if (check)
                    break;
        }
    }

    getWidth() {
        var area = document.documentElement.clientWidth * document.documentElement.clientHeight;
        return Math.sqrt(area / 300);
    }

    toRadian(angle) {
        return (angle / 180) * Math.PI;
    }

    range(x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    }
}

// 在文档加载完成后，隐藏游戏画布，并显示开始屏幕
document.addEventListener("DOMContentLoaded", function() {
    const startButton = document.getElementById("start-button");
    const gameCanvas = document.getElementById("game-canvas");
    const startScreen = document.getElementById("start-screen");

    startButton.addEventListener("click", function() {
        startScreen.style.display = "none"; // 隐藏开始屏幕
        gameCanvas.style.display = "block"; // 显示游戏画布
        const game = new Game(); // 创建游戏实例
        game.startGame(); // 开始游戏
    });
});

document.getElementById('back-to-home').addEventListener('click', () => {
    document.getElementById('start-screen').style.display = 'block';
    document.getElementById('game-canvas').style.display = 'none';
    document.getElementById('end-screen').style.display = 'none';

    // 确保最高关卡显示在首页
    const highLevelDisplay = document.getElementById('high-level-display');
    if (highLevelDisplay) {
        highLevelDisplay.innerText = "历史最高关卡等级: " + highLevel;
    }
});



