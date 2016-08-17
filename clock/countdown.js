/**
 * Created by yundongx on 8/4/16.
 */

var WINDOW_WIDTH = 1024;
var WINDOW_HEIGHT = 580;
var Radius = 8;
var MARGIN_TOP = 60;
var MARGIN_LEFT = 30;

var curShowTimeSeconds = 0;
const endTime = new Date(2016, 7, 19, 18,47,52);

var balls = [];
const colors = ["#33B5E5", "#0099CC", "#9933CC", "#99CC00", "#669900", "#FFBB33", "#FF8800", "#FF4444", "#CC00000"];

window.onload = function () {

    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;

    curShowTimeSeconds = getCurrentShowTimeSeconds();
    setInterval(function () {
            render(context);
            update();
        },
        50
    );
};

function update() {
    var nextShowTimeSeconds = getCurrentShowTimeSeconds();

    var nextHours = parseInt(nextShowTimeSeconds / 3600);
    var nextMinutes = parseInt((nextShowTimeSeconds - nextHours * 3600) / 60)
    var nextSeconds = nextShowTimeSeconds % 60;

    var curHours = parseInt(curShowTimeSeconds / 3600);
    var curMinutes = parseInt((curShowTimeSeconds - curHours * 3600) / 60)
    var curSecnods = curShowTimeSeconds % 60;

    if(nextSeconds != curSecnods) {
        if(parseInt(curHours/10) != parseInt(nextHours/10)) {
            addBalls(MARGIN_LEFT + 0, MARGIN_TOP, parseInt(curHours/10));
        }
        if(parseInt(curHours%10) != parseInt(nextHours%10)) {
            addBalls(MARGIN_LEFT + 15 * (Radius + 1), MARGIN_TOP, parseInt(curHours%10));
        }
        if(parseInt(curMinutes/10) != parseInt(nextMinutes/10)) {
            addBalls(MARGIN_LEFT + 39 * (Radius + 1), MARGIN_TOP, parseInt(curMinutes/10));
        }
        if(parseInt(curMinutes%10) != parseInt(nextMinutes%10)) {
            addBalls(MARGIN_LEFT + 54 * (Radius + 1), MARGIN_TOP, parseInt(curMinutes%10));
        }
        if(parseInt(curSecnods/10) != parseInt(nextSeconds/10)) {
            addBalls(MARGIN_LEFT + 78 * (Radius + 1), MARGIN_TOP, parseInt(curSecnods/10));
        }
        if(parseInt(curSecnods%10) != parseInt(nextSeconds%10)) {
            addBalls(MARGIN_LEFT + 93 * (Radius + 1), MARGIN_TOP, parseInt(curSecnods%10));
        }
        curShowTimeSeconds = nextShowTimeSeconds;
    }
    
    update_balls();
    console.log(balls.length);
}

function  addBalls(x, y, num) {
    for(var i = 0; i < digit[num].length; i++) {
        for (var j = 0; j < digit[num][i].length; j++) {
            if(digit[num][i][j] == 1) {
                var Ball = {
                    x: x + j * 2 * (Radius + 1) + (Radius + 1),
                    y: y + i * 2 * (Radius + 1) + (Radius + 1),
                    g: 1.5 + Math.random(),
                    vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 4,
                    vy: -5,
                    color: colors[Math.floor(Math.random()*colors.length)]
                };
                balls.push(Ball);
            }
        }
    }
}

function update_balls() {
    for(var i = 0; i < balls.length; i++) {
        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        balls[i].vy += balls[i].g;

        if(balls[i].y >= WINDOW_HEIGHT - Radius) {
            balls[i].y = WINDOW_HEIGHT - Radius;
            balls[i].vy = -balls[i].vy * 0.75;
        }
    }

    var count = 0;
    for(var i = 0; i < balls.length; i++) {
        if(balls[i].x + Radius > 0 && balls[i].x - Radius < WINDOW_WIDTH) {
            balls[count++] = balls[i];
        }
    }
    
    while(balls.length > count) {
        balls.pop();
    }
}

function getCurrentShowTimeSeconds() {
    var curTime = new Date();
    var ret = endTime.getTime() - curTime.getTime();
    ret = Math.round(ret / 1000);

    return ret >= 0 ? ret : 0;
}


function render(context) {

    context.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);

    var hours = parseInt(curShowTimeSeconds / 3600);
    var minutes = parseInt((curShowTimeSeconds - hours * 3600)/60);
    var seconde = curShowTimeSeconds % 60;

    // 数字占7个格子+1个半径，冒号占4个格子+1个半径
    renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hours/10), context);
    renderDigit(MARGIN_LEFT + 15 * (Radius + 1), MARGIN_TOP, parseInt(hours%10), context);
    renderDigit(MARGIN_LEFT + 30 * (Radius + 1), MARGIN_TOP, parseInt(10), context);
    renderDigit(MARGIN_LEFT + 39 * (Radius + 1), MARGIN_TOP, parseInt(minutes/10), context);
    renderDigit(MARGIN_LEFT + 54 * (Radius + 1), MARGIN_TOP, parseInt(minutes%10), context);
    renderDigit(MARGIN_LEFT + 69 * (Radius + 1), MARGIN_TOP, parseInt(10), context);
    renderDigit(MARGIN_LEFT + 78 * (Radius + 1), MARGIN_TOP, parseInt(seconde/10), context);
    renderDigit(MARGIN_LEFT + 93 * (Radius + 1), MARGIN_TOP, parseInt(seconde%10), context);

    for(var i = 0; i < balls.length; i++) {
        context.fillStyle = balls[i].color;

        context.beginPath();
        context.arc(balls[i].x, balls[i].y, Radius, 0, 2*Math.PI, true);
        context.closePath();

        context.fill()
    }
}

function renderDigit(x, y, num, context) {

    context.fillStyle = "rgb(0, 102, 153)";

    for(var i = 0; i < digit[num].length; i++) {
        for(var j = 0; j < digit[num][i].length; j++) {
            if(digit[num][i][j] == 1) {
                context.beginPath();
                CenterX = x + j * 2 * (Radius + 1) + (Radius + 1);
                CenterY = y + i * 2 * (Radius + 1) + (Radius + 1);
                context.arc(CenterX, CenterY, Radius, 0, 2*Math.PI);
                context.closePath();
                context.fill();
            }
        }
    }
}
