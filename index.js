import Microphone from './microphone.js';

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const microphone = new Microphone();

// canvas settings
ctx.lineCap = "round";
ctx.shadowOffsetX = 5;
ctx.shadowOffsetY = 5;

// effect settings
let size = canvas.width < canvas.height ? canvas.width * 0.3 : canvas.height * 0.3;
const branches = 2;
const maxLevel = 2;
let scale = 0.5;
// the following settings will be adjusted in realtime according to mic input volume
let sides = 5;
let spread = 0.8;
let color = 'hsl('+ Math.random() * 360 +', 100%, 50%)';
let shadowColor = 'rgba(0, 0, 0, 0.7)';
let shadowBlur = 10;
let lineWidth = Math.floor(Math.random() * 20 + 10);
let globalAlpha = 1;
let canvasRotation = 0;

function animate() {
    if (microphone.initialized) {
        let input = microphone.getVolume() * 3;
        
        color = `hsl(${200 + input * 500}, 100%, 50%)`;
        shadowColor = `hsl(${220 + input * 500}, 80%, 50%)`;
        shadowBlur = input * 50;
        lineWidth = input * 50;
        globalAlpha = input * 1.5;
        sides = Math.floor(2 + input * 10);
        spread = 0.1 + input * 3;
        
        drawFractal();
        drawTranslucentLayer();
    }
    requestAnimationFrame(animate);
}
animate();

function drawFractal() {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.shadowColor = shadowColor;
    ctx.shadowBlur = shadowBlur;
    ctx.lineWidth = lineWidth;
    ctx.globalAlpha = globalAlpha;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(1, 1);
    ctx.rotate(canvasRotation);
    canvasRotation += 0.01;

    for (let i = 0; i < sides; i++) {
        ctx.rotate((Math.PI * 2) / sides);
        drawBranch(0);
    }
    ctx.restore();
}

function drawBranch(level) {
    if (level > maxLevel) return;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(size, 0);
    ctx.stroke();

    for (let i = 0; i < branches; i++) {
        ctx.save();
        ctx.translate(size - (size / branches) * i, 0);
        ctx.scale(scale, scale);

        ctx.save();
        ctx.rotate(spread);          
        drawBranch(level + 1);
        ctx.restore();

        ctx.save();
        ctx.rotate(-spread);          
        drawBranch(level + 1);
        ctx.restore();

        ctx.restore();
    }
}

function drawTranslucentLayer() {
    ctx.save();
    ctx.fillStyle = 'black';
    ctx.globalAlpha = 0.1;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
}

window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    size = canvas.width < canvas.height ? canvas.width * 0.3 : canvas.height * 0.3;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    ctx.shadowBlur = 10;
    drawFractal();
});