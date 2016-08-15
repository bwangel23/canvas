/**
 * Created by yundongx on 8/4/16.
 */

var WINDOW_WIDTH = 1024;
var WINDOW_HEIGHT = 768;
var Radius = 8;
var MARGIN_TOP = 60;
var MARGIN_LEFT = 30;

var curShowTimeSeconds = 0;
const endTime = new Date(2016, 7, 17, 18,47,52);

window.onload = function () {

    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;

    curShowTimeSeconds = getCurrentShowTimeSeconds();
    render(context);
};

function getCurrentShowTimeSeconds() {
    var curTime = new Date();
    var ret = endTime.getTime() - curTime.getTime();
    ret = Math.round(ret / 1000);

    return ret >= 0 ? ret : 0;
}


function render(context) {
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
