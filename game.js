const game = document.getElementById("game");
const music = document.getElementById("music");

const scoreText = document.getElementById("score");
const lifeBar = document.getElementById("life");
const judgement = document.getElementById("judgement");
const start = document.getElementById("start");

let beatmap = [];

let score = 0;
let hp = 100;

let currentNote = 0;

const APPROACH = 1000;

start.onclick = async () => {

    start.style.display = "none";

    const response = await fetch("beatmap.json");
    beatmap = await response.json();

    score = 0;
    hp = 100;
    currentNote = 0;

    scoreText.innerHTML = "Score: 0";
    lifeBar.style.width = "100%";

   music.currentTime = 0;

music.play().then(() => {
    requestAnimationFrame(update);
});

function update(){

    const now = music.currentTime * 1000;

    while(
        currentNote < beatmap.length &&
        now >= beatmap[currentNote].time - APPROACH
    ){
        spawn(beatmap[currentNote]);
        currentNote++;
    }

    requestAnimationFrame(update);
}

function spawn(note){

    const noteDiv = document.createElement("div");
    noteDiv.className = "note";

    noteDiv.style.left = note.x + "px";
    noteDiv.style.top = note.y + "px";

    const approach = document.createElement("div");
    approach.className = "approach";
    approach.style.animationDuration = APPROACH+"ms";

    const circle = document.createElement("div");
    circle.className = "circle";

    noteDiv.appendChild(approach);
    noteDiv.appendChild(circle);

    game.appendChild(noteDiv);

    circle.onclick = ()=>{

        hit(note,noteDiv);

    };

    setTimeout(()=>{

        if(noteDiv.parentNode){

            miss();

            noteDiv.remove();

        }

    },APPROACH+150);

}

function hit(note,noteDiv){

    const error = Math.abs(
        music.currentTime*1000-note.time
    );

    if(error<=40){

        addScore(300);

    }
    else if(error<=80){

        addScore(100);

    }
    else if(error<=120){

        addScore(50);

    }
    else{

        miss();

    }

    noteDiv.remove();

}

function addScore(value){

    score+=value;

    hp=Math.min(100,hp+4);

    scoreText.innerHTML="Score: "+score;

    lifeBar.style.width=hp+"%";

    show(value);

}

function miss(){

    hp-=12;

    if(hp<0) hp=0;

    lifeBar.style.width=hp+"%";

    show("MISS");

}

function show(text){

    judgement.innerHTML=text;

    judgement.classList.remove("show");

    void judgement.offsetWidth;

    judgement.classList.add("show");

}