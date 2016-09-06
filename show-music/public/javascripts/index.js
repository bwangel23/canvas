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

function load(url) {
    xhr.open("GET", url);
    xhr.responseType = "arraybuffer";
    xhr.onload = function () {
        ac.decodeAudioData(xhr.response, function (buffer) {
            var bufferSource = ac.createBufferSource();
            bufferSource.buffer = buffer;
            bufferSource.connect(gainNode);
            bufferSource[bufferSource.start?"start":"noteOn"](0);
        }, function (err) {
            console.error(err);
        })
    }
    xhr.send();
}

function change_volume(percent) {
    gainNode.gain.value = percent * percent;
}

$("#volume")[0].onchange = function () {
    change_volume(this.value/this.max);
}
$("#volume")[0].onchange();
