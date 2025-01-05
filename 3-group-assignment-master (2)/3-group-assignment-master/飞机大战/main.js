    //获得主界面
    var mainDiv=document.getElementById("maindiv");
    //获得开始界面
var startdiv=document.getElementById("startdiv");
    //获得游戏中分数显示界面
var scorediv=document.getElementById("scorediv");
    //获得分数界面
var scorelabel=document.getElementById("label");
    //获得暂停界面
var suspenddiv=document.getElementById("suspenddiv");
    //获得游戏结束界面
var enddiv=document.getElementById("enddiv");
    //获得游戏结束后分数统计界面
var planscore=document.getElementById("planscore");
    //初始化分数
var scores=0;
// 获取音频元素
var gameStartAudio = document.getElementById('gameStartAudio');
var explosionAudio = document.getElementById('explosionAudio');
var failAudio = document.getElementById('failAudio');
var winAudio = document.getElementById('winAudio');
var getAudio = document.getElementById('getAudio');
// 初始生命值为3
var lives = 3;
var invincible = false; // 是否处于无敌状态
var invincibleTime = 0; // 无敌时间计时器
// 获取存储的最高分数
let highestScore = localStorage.getItem("highestScore");
// 如果没有存储的最高分数，初始化为0
if (highestScore === null) {
    highestScore = 0;
} else {
    highestScore = parseInt(highestScore);
}
// 在页面加载时显示分数与初始生命值
document.getElementById("highestScoreLabel").innerText = highestScore;
document.getElementById("livesLabel").innerText = lives;

function goToHomePage() {
    window.location.href = '../汇总.html'; // 指定要跳转的页面
}

// 播放游戏开始音效
function playGameStartAudio() {
    gameStartAudio.play();
}


// 播放爆炸音效
function playExplosionAudio() {
    explosionAudio.play();
}
/*
 创建飞机类
 */
function plan(hp,X,Y,sizeX,sizeY,score,dietime,sudu,boomimage,imagesrc){
    this.planX=X;
    this.planY=Y;
    this.imagenode=null;
    this.planhp=hp;
    this.planscore=score;
    this.plansizeX=sizeX;
    this.plansizeY=sizeY;
    this.planboomimage=boomimage;
    this.planisdie=false;
    this.plandietimes=0;
    this.plandietime=dietime;
    this.plansudu=sudu;
//行为
/*
移动行为
     */
    this.planmove=function(){
        if(scores<=50000){
            this.imagenode.style.top=this.imagenode.offsetTop+this.plansudu+"px";
        }
        else if(scores>50000&&scores<=100000){
            this.imagenode.style.top=this.imagenode.offsetTop+this.plansudu+1+"px";
        }
        else if(scores>100000&&scores<=150000){
            this.imagenode.style.top=this.imagenode.offsetTop+this.plansudu+2+"px";
        }
        else if(scores>150000&&scores<=200000){
            this.imagenode.style.top=this.imagenode.offsetTop+this.plansudu+3+"px";
        }
        else if(scores>200000&&scores<=300000){
            this.imagenode.style.top=this.imagenode.offsetTop+this.plansudu+4+"px";
        }
        else{
            this.imagenode.style.top=this.imagenode.offsetTop+this.plansudu+5+"px";
        }
    }
    this.init=function(){
        this.imagenode=document.createElement("img");
        this.imagenode.style.left=this.planX+"px";
        this.imagenode.style.top=this.planY+"px";
        this.imagenode.src=imagesrc;
        mainDiv.appendChild(this.imagenode);
    }
    this.init();
}



/*
创建子弹类
 */
function bullet(X,Y,sizeX,sizeY,imagesrc){
    this.bulletX=X;
    this.bulletY=Y;
    this.bulletimage=null;
    this.bulletattach=1;
    this.bulletsizeX=sizeX;
    this.bulletsizeY=sizeY;
//行为
/*
 移动行为
 */
    this.bulletmove=function(){
        this.bulletimage.style.top=this.bulletimage.offsetTop-20+"px";
    }
    this.init=function(){
        this.bulletimage=document.createElement("img");
        this.bulletimage.style.left= this.bulletX+"px";
        this.bulletimage.style.top= this.bulletY+"px";
        this.bulletimage.src=imagesrc;
        mainDiv.appendChild(this.bulletimage);
    }
    this.init();
}

/*
 创建单行子弹类
 */
function oddbullet(X,Y){
    bullet.call(this,X,Y,6,14,"image/bullet1.png");
}

/*
创建敌机类
 */
function enemy(hp,a,b,sizeX,sizeY,score,dietime,sudu,boomimage,imagesrc){
    plan.call(this,hp,random(a,b),-100,sizeX,sizeY,score,dietime,sudu,boomimage,imagesrc);
}
//产生min到max之间的随机数
function random(min,max){
    return Math.floor(min+Math.random()*(max-min));
}

/*
创建本方飞机类
 */
function ourplan(X,Y){
    var imagesrc="image/我的飞机.png";
    plan.call(this,1,X,Y,66,80,0,660,0,"image/本方飞机爆炸.gif",imagesrc);
    this.imagenode.setAttribute('id','ourplan');
    this.lives = 3;
}


//创建本方飞机
var selfplan=new ourplan(120,485);
//移动事件
var ourPlan=document.getElementById('ourplan');
var yidong=function(){
    var oevent=window.event||arguments[0];
    var chufa=oevent.srcElement||oevent.target;
    var selfplanX=oevent.clientX-500;
    var selfplanY=oevent.clientY;
    ourPlan.style.left=selfplanX-selfplan.plansizeX/2+"px";
    ourPlan.style.top=selfplanY-selfplan.plansizeY/2+"px";
    }


// 道具类
function PowerUp(X, Y, sizeX, sizeY, imagesrc, speed, clearTime) {
    this.powerUpX = X;  // 起始横坐标
    this.powerUpY = Y;  // 起始纵坐标
    this.sizeX = sizeX; // 宽度
    this.sizeY = sizeY; // 高度
    this.imageSrc = imagesrc; // 图像来源
    this.speed = speed;  // 速度
    this.clearTime = clearTime; // 清除时间
    this.isTouched = false;  // 是否被触碰，初始为未被触碰

    this.init = function() {
        // 创建道具图片节点
        this.imageNode = document.createElement("img");
        this.imageNode.style.left = this.powerUpX + "px";
        this.imageNode.style.top = this.powerUpY + "px";
        this.imageNode.src = this.imageSrc;
        mainDiv.appendChild(this.imageNode);
    };

    // 移动方法，道具从上向下掉落
    this.move = function() {
        this.imageNode.style.top = this.imageNode.offsetTop + this.speed + "px";
    };

    // 检测道具是否超出屏幕
    this.checkOutOfBounds = function() {
        if (this.imageNode.offsetTop + this.imageNode.offsetHeight > 568) {  // 超出屏幕的底部
            mainDiv.removeChild(this.imageNode);
            return true;
        }
        return false;
    };

    // 检测道具与我方飞机的碰撞
    this.checkCollision = function() {
        // 检查是否与我方飞机碰撞
        if (this.isTouched) return true; // 如果已经被触碰过，跳过

        if (this.imageNode.offsetLeft + this.sizeX > selfplan.imagenode.offsetLeft &&
            this.imageNode.offsetLeft < selfplan.imagenode.offsetLeft + selfplan.plansizeX) {
            if (this.imageNode.offsetTop + this.sizeY >= selfplan.imagenode.offsetTop + 40 &&
                this.imageNode.offsetTop <= selfplan.imagenode.offsetTop - 20 + selfplan.plansizeY) {

                // 如果碰撞到我方飞机，触发道具效果，并设置触碰标记
                this.isTouched = true;
                this.handlePowerUp(); // 处理道具效果
                mainDiv.removeChild(this.imageNode); // 道具消失
                return true;
            }
        }
        return false; // 没有发生碰撞
    };

    // 处理道具的效果（由子类实现）
    this.handlePowerUp = function() {
        console.log("基础道具触碰效果");
    };

    this.init();
}

// 加分道具类（继承自 PowerUp）
function ScorePowerUp(X, Y) {
    // 使用超类的构造函数初始化基本属性
    PowerUp.call(this, X, Y, 40, 40, "image/加分.png", 2, 1000);

    // 重写 handlePowerUp 方法，定义加分效果
    this.handlePowerUp = function() {
        // 假设加分为5000分
        scores += 5000;
        scorelabel.innerHTML = scores;
    };
}

// 继承 PowerUp
ScorePowerUp.prototype = Object.create(PowerUp.prototype);
ScorePowerUp.prototype.constructor = ScorePowerUp;

// 恢复生命道具类（继承自 PowerUp）
function LifePowerUp(X, Y) {
    // 使用超类的构造函数初始化基本属性
    PowerUp.call(this, X, Y, 40, 40, "image/恢复生命.png", 2, 1000);

    // 重写 handlePowerUp 方法，定义恢复生命效果
    this.handlePowerUp = function() {
        // 恢复1命
        lives++;
        document.getElementById("livesLabel").innerText = lives;
    };
}

// 继承 PowerUp
LifePowerUp.prototype = Object.create(PowerUp.prototype);
LifePowerUp.prototype.constructor = LifePowerUp;

// 护盾道具类（继承自 PowerUp）
function DefensePowerUp(X, Y) {
    // 使用超类的构造函数初始化基本属性
    PowerUp.call(this, X, Y, 40, 40, "image/护盾.png", 2, 1000);

    // 重写 handlePowerUp 方法，定义加分效果
    this.handlePowerUp = function() {
        // 启动无敌状态
        invincible = true;
        invincibleTime = Date.now();
        selfplan.imagenode.classList.add("golden-glow");

        // 2秒后结束无敌状态
        setTimeout(function() {
            invincible = false;
            selfplan.imagenode.classList.remove("golden-glow");
        }, 2000); // 2秒无敌时间
    };
}

// 继承 PowerUp
DefensePowerUp.prototype = Object.create(PowerUp.prototype);
DefensePowerUp.prototype.constructor = DefensePowerUp;

/*
暂停事件
 */
var number=0;
var zanting=function(){
    if(number==0){
        suspenddiv.style.display="block";
        if(document.removeEventListener){
            mainDiv.removeEventListener("mousemove",yidong,true);
            bodyobj.removeEventListener("mousemove",bianjie,true);
        }
        else if(document.detachEvent){
            mainDiv.detachEvent("onmousemove",yidong);
            bodyobj.detachEvent("onmousemove",bianjie);
        }
        clearInterval(set);
        number=1;
        gameStartAudio.pause();
    }
    else{
        suspenddiv.style.display="none";
        if(document.addEventListener){
            mainDiv.addEventListener("mousemove",yidong,true);
            bodyobj.addEventListener("mousemove",bianjie,true);
        }
        else if(document.attachEvent){
            mainDiv.attachEvent("onmousemove",yidong);
            bodyobj.attachEvent("onmousemove",bianjie);
        }
        set=setInterval(start,20);
        number=0;
        gameStartAudio.play();
    }
}
//判断本方飞机是否移出边界,如果移出边界,则取消mousemove事件,反之加上mousemove事件
var bianjie=function(){
    var oevent=window.event||arguments[0];
    var bodyobjX=oevent.clientX;
    var bodyobjY=oevent.clientY;
    if(bodyobjX<505||bodyobjX>815||bodyobjY<0||bodyobjY>568){
        if(document.removeEventListener){
            mainDiv.removeEventListener("mousemove",yidong,true);
        }
        else if(document.detachEvent){
            mainDiv.detachEvent("onmousemove",yidong);
        }
    }
    else{
        if(document.addEventListener){
            mainDiv.addEventListener("mousemove",yidong,true);
        }
        else if(document.attachEvent){
            mainDiv.attachEvent("nomousemove",yidong);
        }
    }
}
//暂停界面重新开始事件
function chongxinkaishi(){
    location.reload(true);
    startdiv.style.display="none";
    maindiv.style.display="block";
}
var bodyobj=document.getElementsByTagName("body")[0];
if(document.addEventListener){
    //为本方飞机添加移动和暂停
    mainDiv.addEventListener("mousemove",yidong,true);
    //为本方飞机添加暂停事件
    selfplan.imagenode.addEventListener("click",zanting,true);
    //为body添加判断本方飞机移出边界事件
    bodyobj.addEventListener("mousemove",bianjie,true);
    //为暂停界面的继续按钮添加暂停事件
    suspenddiv.getElementsByTagName("button")[0].addEventListener("click",zanting,true);
    //为暂停界面的返回主页按钮添加事件
    suspenddiv.getElementsByTagName("button")[1].addEventListener("click",jixu,true);
}
else if(document.attachEvent){
    //为本方飞机添加移动
    mainDiv.attachEvent("onmousemove",yidong);
    //为本方飞机添加暂停事件
    selfplan.imagenode.attachEvent("onclick",zanting);
    //为body添加判断本方飞机移出边界事件
    bodyobj.attachEvent("onmousemove",bianjie);
    //为暂停界面的继续按钮添加暂停事件
    suspenddiv.getElementsByTagName("button")[0].attachEvent("onclick",zanting);
    //为暂停界面的返回主页按钮添加事件
    suspenddiv.getElementsByTagName("button")[1].attachEvent("click",jixu,true);
}

function updateEndMessage() {
    var messages = [
        "不错哟，你已经成功避开了一些苦瓜星人的攻击，继续保持！",
        "干得漂亮！你击退了不少苦瓜星人，看来你已经掌握了一些技巧。",
        "太棒了！你已经击败了许多敌人，你的实力不容小觑。",
        "哇，你的表现令人印象深刻！你几乎要成为天空的主宰了。",
        "不可思议！你已经击败了海量的苦瓜星人，你简直就是飞行大师。",
        "恭喜你，天空已经没有敌人是你的对手了！你是真正的天空之王，坏心情一扫而空！"
    ];

    var score = scores; // 使用全局变量scores
    var messageContainer = document.getElementById("enddiv");
    var planscore = document.getElementById("planscore");
    planscore.innerHTML = score; // 更新分数显示

    // 清空之前的消息
    messageContainer.innerHTML = "<p class='plantext'>战果</p><p id='planscore'>" + score + "</p>";

    // 根据分数显示不同的消息
    if (score <= 50000) {
        messageContainer.innerHTML += "<p>" + messages[0] + "</p>";
    } else if (score > 50000 && score <= 100000) {
        messageContainer.innerHTML += "<p>" + messages[1] + "</p>";
    } else if (score > 100000 && score <= 150000) {
        messageContainer.innerHTML += "<p>" + messages[2] + "</p>";
    } else if (score > 150000 && score <= 200000) {
        messageContainer.innerHTML += "<p>" + messages[3] + "</p>";
    } else if (score > 200000 && score <= 250000) {
        messageContainer.innerHTML += "<p>" + messages[4] + "</p>";
    } else if (score > 250000) {
        messageContainer.innerHTML += "<p>" + messages[5] + "</p>";
    }
    messageContainer.innerHTML += "<div><button onclick='jixu()'>继续</button></div>";
    // 更新最高分数（如果当前得分更高）
    if (score > highestScore) {
        highestScore = score;
        // 将新最高分数存储到 localStorage
        localStorage.setItem("highestScore", highestScore);
        //更新页面上的历史最高分数显示
        document.getElementById("highestScoreLabel").innerText = highestScore;
    }
}


/*
敌机对象数组
 */
var enemys=[];

/*
子弹对象数组
 */
var bullets=[];
var mark=0;
var mark1=0;
var backgroundPositionY=0;

// 存储道具对象的数组
var powerUps = [];
var mark2 = 0;

//开始函数
function start(){
    mainDiv.style.backgroundPositionY=backgroundPositionY+"px";
    backgroundPositionY+=0.5;
    if(backgroundPositionY==568){
        backgroundPositionY=0;
    }
    mark++;
    // 检查无敌时间
    if (invincible && Date.now() - invincibleTime >= 2000) {
        invincible = false;
        selfplan.imagenode.src = "image/我的飞机.png"; // 恢复飞机图片
    }

    var enemyslen = enemys.length;
    var bulletslen = bullets.length;

    //创建敌方飞机
    if(mark==20){
        mark1++;
        //中飞机
        if(mark1%5==0){
            enemys.push(new enemy(6,25,274,46,60,5000,360,random(1,3),"image/中飞机爆炸.gif","image/enemy3_fly_1.png"));
        }
        //大飞机
        if(mark1==20){
            enemys.push(new enemy(12,57,210,110,164,30000,540,1,"image/大飞机爆炸.gif","image/enemy2_fly_1.png"));
            mark1=0;
        }
        //小飞机
        else{
            enemys.push(new enemy(1,19,286,34,24,1000,360,random(1,4),"image/小飞机爆炸.gif","image/enemy1_fly_1.png"));
        }
        mark=0;
    }

/*
移动敌方飞机
 */
    var enemyslen=enemys.length;
    for(var i=0;i<enemyslen;i++){
        if(enemys[i].planisdie!=true){
            enemys[i].planmove();
        }
/*
 如果敌机超出边界,删除敌机
 */
        if(enemys[i].imagenode.offsetTop + enemys[i].imagenode.offsetHeight>568){
            mainDiv.removeChild(enemys[i].imagenode);
            enemys.splice(i,1);
            enemyslen--;
        }
        //当敌机死亡标记为true时，经过一段时间后清除敌机
        if(enemys[i].planisdie==true){
            enemys[i].plandietimes+=20;
            if(enemys[i].plandietimes==enemys[i].plandietime){
                mainDiv.removeChild(enemys[i].imagenode);
                enemys.splice(i,1);
                enemyslen--;
            }
        }
    }

/*
创建子弹
*/
    if(mark%5==0){
            bullets.push(new oddbullet(parseInt(selfplan.imagenode.style.left)+31,parseInt(selfplan.imagenode.style.top)-10));
    }

/*
移动子弹
*/
    var bulletslen=bullets.length;
    for(var i=0;i<bulletslen;i++){
        bullets[i].bulletmove();
/*
如果子弹超出边界,删除子弹
*/
        if(bullets[i].bulletimage.offsetTop<0){
            mainDiv.removeChild(bullets[i].bulletimage);
            bullets.splice(i,1);
            bulletslen--;
        }
    }

    // 每200帧生成一个道具
    mark2++;
    if (mark2 == 200) {
        mark2 = 0;

        // 随机生成横坐标范围
        var powerUpX = random(0, 300);
        var powerUpY = -50;  // 从屏幕上方生成
        var powerUpType = random(1, 4);  // 随机生成道具类型

        if (powerUpType === 1) {
            // 生成加分道具
            powerUps.push(new ScorePowerUp(powerUpX, powerUpY));
        } else if (powerUpType === 2) {
            // 生成恢复生命道具
            powerUps.push(new LifePowerUp(powerUpX, powerUpY));
        }else if (powerUpType === 3) {
            //生成护盾道具
            powerUps.push(new DefensePowerUp(powerUpX, powerUpY));
        }
    }

    // 移动和检测道具
    for (var i = powerUps.length - 1; i >= 0; i--) {
        // 检查道具是否与我方飞机碰撞
        if (powerUps[i].checkCollision()) {
            powerUps.splice(i, 1);  // 删除道具
            getAudio.play();
            continue;  // 继续检查下一个道具
        }

        powerUps[i].move();

        // 检查道具是否超出屏幕
        if (powerUps[i].checkOutOfBounds()) {
            powerUps.splice(i, 1);  // 删除超出屏幕的道具
        }
    }

    //碰撞判断
    for (var k = 0; k < bulletslen; k++) {
        for (var j = 0; j < enemyslen; j++) {
            // 判断本方飞机与敌机碰撞
            if (enemys[j].planisdie == false && !invincible) { // 只有在无敌状态外才减少生命
                if (enemys[j].imagenode.offsetLeft + enemys[j].plansizeX >= selfplan.imagenode.offsetLeft && 
                    enemys[j].imagenode.offsetLeft <= selfplan.imagenode.offsetLeft + selfplan.plansizeX) {
                    if (enemys[j].imagenode.offsetTop + enemys[j].plansizeY >= selfplan.imagenode.offsetTop + 40 &&
                        enemys[j].imagenode.offsetTop <= selfplan.imagenode.offsetTop - 20 + selfplan.plansizeY) {

                        if (lives > 1) {
                            // 减少生命值
                            lives--;
                            document.getElementById("livesLabel").innerText = lives;

                            // 启动无敌状态
                            invincible = true;
                            invincibleTime = Date.now();
                            selfplan.imagenode.classList.add("golden-glow");

                            // 2秒后结束无敌状态
                            setTimeout(function() {
                                invincible = false;
                                selfplan.imagenode.classList.remove("golden-glow");
                            }, 2000); // 2秒无敌时间
                        } else {
                            // 如果生命值为1，游戏结束
                            lives=0;
                            selfplan.imagenode.src = "image/本方飞机爆炸.gif";
                            enddiv.style.display = "block";
                            planscore.innerHTML = scores;
                            // 更新最高分数和显示
                            updateEndMessage();
                            clearInterval(set);
                            gameStartAudio.pause();
                            playExplosionAudio();
                            if(scores<150000){failAudio.play();}
                            else if(scores>=150000){winAudio.play();}
                            
                        }
                    }
                }
            }
        }
    }

    // 检查其他敌机与子弹的碰撞
    for (var k = 0; k < bulletslen; k++) {
        for (var j = 0; j < enemyslen; j++) {
            if (bullets[k].bulletimage.offsetLeft + bullets[k].bulletsizeX > enemys[j].imagenode.offsetLeft &&
                bullets[k].bulletimage.offsetLeft < enemys[j].imagenode.offsetLeft + enemys[j].plansizeX) {
                if (bullets[k].bulletimage.offsetTop <= enemys[j].imagenode.offsetTop + enemys[j].plansizeY &&
                    bullets[k].bulletimage.offsetTop + bullets[k].bulletsizeY >= enemys[j].imagenode.offsetTop) {
                    // 敌机被击中，血量减少
                    enemys[j].planhp -= bullets[k].bulletattach;

                    if (enemys[j].planhp == 0) {
                        scores += enemys[j].planscore;
                        scorelabel.innerHTML = scores;
                        enemys[j].imagenode.src = enemys[j].planboomimage;
                        enemys[j].planisdie = true;
                        playExplosionAudio();
                    }

                    // 删除子弹
                    mainDiv.removeChild(bullets[k].bulletimage);
                    bullets.splice(k, 1);
                    bulletslen--;
                    break;
                }
            }
        }
    }
}


var set;

function begin(){
    startdiv.style.display="none";
    mainDiv.style.display="block";
    selfplan.imagenode.style.display="block";
    scorediv.style.display="block";
    playGameStartAudio();
    set=setInterval(start,20);
}
//游戏结束后点击继续按钮事件
function jixu() {
    location.reload(true);
}

