const game = document.getElementById("game");
const music = document.getElementById("music");

const scoreText = document.getElementById("score");
const lifeBar = document.getElementById("life");
const judgement = document.getElementById("judgement");
const startBtn = document.getElementById("start");

let beatmap = [];

let score = 0;
let hp = 100;
let combo = 0;

let currentNote = 0;

const APPROACH_TIME = 1000;

let running = false;

startBtn.onclick = async () => {

    beatmap = await fetch("beatmap.json").then(r => r.json());

    score = 0;
    hp = 100;
    combo = 0;
    currentNote = 0;

    scoreText.innerHTML = "Score: 0";
    lifeBar.style.width = "100%";

    judgement.innerHTML = "";

    music.currentTime = 0;

    await music.play();

    if (!running) {
        running = true;
        requestAnimationFrame(update);
    }
};

function update(){

    if (!running) return;

    const now = music.currentTime * 1000;

    while (
        currentNote < beatmap.length &&
        now >= beatmap[currentNote].time - APPROACH_TIME
    ) {
        spawnNote(beatmap[currentNote]);
        currentNote++;
    }

    requestAnimationFrame(update);
}

function spawnNote(note){

    const wrapper = document.createElement("div");
    wrapper.className = "note";
    wrapper.style.left = note.x + "px";
    wrapper.style.top = note.y + "px";

    const approach = document.createElement("div");
    approach.className = "approach";
    approach.style.animationDuration = APPROACH_TIME + "ms";

    const circle = document.createElement("div");
    circle.className = "circle";

    wrapper.appendChild(approach);
    wrapper.appendChild(circle);
    game.appendChild(wrapper);

    circle.onclick = () => hit(note, wrapper);

    setTimeout(() => {
        if (wrapper.parentNode) {
            miss(wrapper);
        }
    }, APPROACH_TIME + 150);
}

function hit(note, wrapper){

    const diff = Math.abs(music.currentTime * 1000 - note.time);

    let result = "";

    if (diff <= 40) {
        result = "300";
        addScore(300);
    } else if (diff <= 80) {
        result = "100";
        addScore(100);
    } else if (diff <= 120) {
        result = "50";
        addScore(50);
    } else {
        miss(wrapper);
        return;
    }

    combo++;
    showResult(result);
    wrapper.remove();
}

function miss(wrapper){

    hp -= 12;
    combo = 0;

    if (hp < 0) hp = 0;

    lifeBar.style.width = hp + "%";

    showResult("MISS");

    if (wrapper) wrapper.remove();
}

function addScore(value){

    score += value + combo * 2;

    hp = Math.min(100, hp + 3);

    scoreText.innerHTML = "Score: " + score;

    lifeBar.style.width = hp + "%";
}

function showResult(text){

    judgement.innerHTML = text;
    judgement.classList.remove("show");

    void judgement.offsetWidth;

    judgement.classList.add("show");
}