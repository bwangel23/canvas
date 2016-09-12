/**
 * Created by yundongx on 9/2/16.
 */

function $(s) {
    return document.querySelectorAll(s);
}

var list = $("#list li");

for(var i = 0; i < list.length; i++) {
    list[i].onclick = function () {
        for(var j = 0; j < list.length; j++) {
            list[j].className = "";
        }
        this.className = "selected";
        load("/media/" + this.title);
    }
}

var xhr = new XMLHttpRequest();
var ac = new (window.AudioContext||window.webkitAudioContext)();
var gainNode = ac[ac.createGain?"createGain":"createGainNode"]();
gainNode.connect(ac.destination);

var analyser = ac.createAnalyser();
var size = 128;
analyser.fftSize  = size * 2;
analyser.connect(gainNode);

var source = null;

var counter = 0;

var box = $("#box")[0];
var height, width;
var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");
box.appendChild(canvas);
var Dots = [];
function random(m, n) {
    return Math.round(Math.random() * (n - m) + m);
}

function getDots() {
    Dots = []
    for(var i = 0;i < size;i++) {
        var x = random(0, width);
        var y = random(0, height);
        var color = "rgb(" + random(0, 255) + "," + random(0,255) + "," 
            + random(0, 255) + ")";
        Dots.push({
            x: x,
            y: y,
            color: color
        })
    }
}

function resize() {
    height = box.clientHeight;
    width = box.clientWidth;
    canvas.height = height;
    canvas.width = width;
    getDots();
}
resize();
window.onresize = resize;

function load(url) {
    var n = ++counter;
    source && source[source.stop ? "stop" : "noteOff"]();
    xhr.abort();
    xhr.open("GET", url);
    xhr.responseType = "arraybuffer";
    xhr.onload = function () {
        if (n != counter)return;
        ac.decodeAudioData(xhr.response, function (buffer) {
            if (n != counter)return;
            var bufferSource = ac.createBufferSource();
            bufferSource.buffer = buffer;
            bufferSource.connect(analyser);
            bufferSource[bufferSource.start?"start":"noteOn"](0);
            source = bufferSource;
        }, function (err) {
            console.error(err);
        })
    };
    xhr.send();
}

function draw(arr) {
    context.clearRect(0, 0, width, height);
    var w = width / size;
    for(var i = 0; i < size; i++){
        if(draw.type == "column") {
            var h = arr[i] / 256 * height;
            var line = context.createLinearGradient(0, 0, 0, height);
            line.addColorStop(0, "red");
            line.addColorStop(0.5, "yellow");
            line.addColorStop(1, "green");
            context.fillStyle = line;
            context.fillRect(w * i, height - h, w * 0.6, h);
        } else if(draw.type == "dot") {
            context.beginPath();
            var o = Dots[i];
            var r = arr[i] / 256 * 50;
            context.arc(o.x, o.y, r, 0, Math.PI * 2, true);
            var g = context.createRadialGradient(o.x, o.y, 0, o.x, o.y, r);
            g.addColorStop(0, "#fff");
            g.addColorStop(1, o.color);
            context.fillStyle = g;
            context.fill();
            // context.stroke();
            context.closePath();
        }
    }
}

draw.type = "column";

var types = $("#type li");
for(var i = 0; i < types.length; i++) {
    types[i].onclick = function () {
        for(var j = 0; j < types.length; j++) {
            types[j].className = "";
        }
        this.className = "selected";
        draw.type = this.getAttribute("data-type");
        console.log("draw.type", draw.type);
        console.log(draw.type);
    }
}

function visuallizer() {
    var arr = new Uint8Array(analyser.frequencyBinCount);
    requestAnimationFrame = window.requestAnimationFrame ||
                            window.webkitRequestAnimationFrame ||
                            window.mozRequestAnimationFrame;
    function v() {
        analyser.getByteFrequencyData(arr);
        draw(arr);
        requestAnimationFrame(v);
    }

    requestAnimationFrame(v);
}

visuallizer();

function change_volume(percent) {
    gainNode.gain.value = percent * percent;
}


$("#volume")[0].onchange = function () {
    change_volume(this.value/this.max);
}
$("#volume")[0].onchange();
