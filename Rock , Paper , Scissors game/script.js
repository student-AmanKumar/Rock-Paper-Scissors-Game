let userScore = 0;
let computerScore = 0;

const choices = document.querySelectorAll('.choice');
const msg =document.querySelector('#msg');
const userScorepara = document.querySelector('#user-score');
const computerScorepara = document.querySelector('#computer-score');

// Function to create balloon animation
const createBalloons = () => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
    
    for (let i = 0; i < 90; i++) {
        const balloon = document.createElement('div');
        balloon.classList.add('balloon');
        balloon.style.left = Math.random() * 100 + 'vw';
        balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        balloon.style.animationDelay = Math.random() * 0.5 + 's';
        document.body.appendChild(balloon);
        
        setTimeout(() => balloon.remove(), 3500);
    }
};

const genComputerChoice = () => {
    const options = ['rock','paper','scissor'];
    // ROCK , PAPER , SCISSOR
    const randomNum = Math.floor(Math.random() * 3);
    return options[randomNum];
};

const drawGame = () =>{
    msg.innerText = "Game was draw Play again! 🤝";
    msg.style.backgroundColor = "gray";
    playResultSound('draw');
};

const showWinner =(userWin,userChoice,computerChoice) =>{
    if(userWin){
        userScore++;
        userScorepara.innerText = userScore;
        msg.innerText = `You Win! 🎉 Your ${userChoice} beats ${computerChoice}`;
        msg.style.backgroundColor = "green";
        msg.classList.add('congrats-animation');
        playResultSound('win');
        
        // Create balloon animation
        createBalloons();
        
        // Remove animation class after animation ends
        setTimeout(() => {
            msg.classList.remove('congrats-animation');
        }, 500);
    }
    else{
        computerScore++;
        computerScorepara.innerText = computerScore;
        msg.innerText = `You Lose! 😞 ${computerChoice} beats your ${userChoice}`;
        msg.style.backgroundColor = "red";
        playResultSound('lose');
    }
};

const playGame = (userChoice) => {
// generate computer choice
    const computerChoice = genComputerChoice();
        
         if(userChoice === computerChoice){
            drawGame();

         }
         else{
            let userWin = true;
            if(userChoice === "rock"){

                userWin = computerChoice === "paper"  ? false : true;
            }
            else if(userChoice === "paper"){
                // rock,scissor
             userWin =   computerChoice === "scissor" ? false : true;

                
            }
            else{
                // rock, paper
               userWin = computerChoice === "rock" ? false : true; 

            }

showWinner(userWin, userChoice, computerChoice);
            
         }

};

choices.forEach((choice) => {

    choice.addEventListener('click', () => {
        const userChoice = choice.getAttribute('id')
        playClickSound();
        playGame(userChoice);
    })
});

// Audio configuration: available styles: 'click', 'pop', 'boop'
window._gameSoundStyle = window._gameSoundStyle || 'pop';

// Play a short sound using Web Audio API. style overrides global if passed.
function playClickSound(style){
    const s = style || window._gameSoundStyle || 'click';
    try{
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if(!AudioCtx) return;
        if(!window._gameAudioCtx) window._gameAudioCtx = new AudioCtx();
        const ctx = window._gameAudioCtx;
        if(ctx.state === 'suspended') ctx.resume();

        const now = ctx.currentTime;

        if(s === 'pop'){
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.type = 'triangle';
            o.frequency.setValueAtTime(1200, now);
            g.gain.setValueAtTime(0.001, now);
            g.gain.exponentialRampToValueAtTime(0.25, now + 0.005);
            o.connect(g);
            g.connect(ctx.destination);
            o.start(now);
            g.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
            o.frequency.exponentialRampToValueAtTime(600, now + 0.12);
            o.stop(now + 0.14);
            return;
        }

        if(s === 'boop'){
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.type = 'square';
            o.frequency.setValueAtTime(420, now);
            g.gain.setValueAtTime(0.0001, now);
            g.gain.linearRampToValueAtTime(0.18, now + 0.02);
            o.connect(g);
            g.connect(ctx.destination);
            o.start(now);
            g.gain.linearRampToValueAtTime(0.0001, now + 0.28);
            o.stop(now + 0.3);
            return;
        }

        // default 'click'
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(800, now);
        g.gain.setValueAtTime(0.0001, now);
        g.gain.exponentialRampToValueAtTime(0.18, now + 0.01);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(now);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
        o.stop(now + 0.16);
    }catch(e){
        console.warn('Audio play failed', e);
    }
}

// Play result sound mapping: 'win' -> pop, 'lose' -> boop, 'draw' -> click
function playResultSound(result){
    if(!result) return;
    if(result === 'win') playWinSound();
    else if(result === 'lose') playClickSound('boop');
    else playClickSound('click');
}

// Win chime: short ascending melody
function playWinSound(){
    try{
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if(!AudioCtx) return;
        if(!window._gameAudioCtx) window._gameAudioCtx = new AudioCtx();
        const ctx = window._gameAudioCtx;
        if(ctx.state === 'suspended') ctx.resume();

        const now = ctx.currentTime;
        const freqs = [880, 1100, 1400];
        freqs.forEach((f, i) => {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.type = 'sine';
            o.frequency.setValueAtTime(f, now + i * 0.09);
            g.gain.setValueAtTime(0.0001, now + i * 0.09);
            g.gain.exponentialRampToValueAtTime(0.28, now + i * 0.09 + 0.02);
            o.connect(g);
            g.connect(ctx.destination);
            o.start(now + i * 0.09);
            g.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.09 + 0.18);
            o.stop(now + i * 0.09 + 0.2);
        });
    }catch(e){
        console.warn('Win audio failed', e);
    }
}