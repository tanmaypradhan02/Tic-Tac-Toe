const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restartBtn");
const themeBtn = document.getElementById("themeBtn");

let board = ["","","","","","","","",""];
let currentPlayer = "X";
let gameActive = true;
let difficulty = "easy";

// Score
let xScore=0,oScore=0,drawScore=0;

const winCond = [
[0,1,2],[3,4,5],[6,7,8],
[0,3,6],[1,4,7],[2,5,8],
[0,4,8],[2,4,6]
];

// Click
cells.forEach(cell => cell.addEventListener("click", clickCell));

function clickCell() {
  const i = this.dataset.index;
  if(board[i] || !gameActive) return;

  board[i] = currentPlayer;
  this.textContent = currentPlayer;
  this.classList.add("pop");

  if(checkWinner()) return;

  currentPlayer = currentPlayer==="X"?"O":"X";
  statusText.textContent = `Player ${currentPlayer} Turn`;

  if(currentPlayer==="O") setTimeout(aiMove, 400);
}

// AI Difficulty
function setDifficulty(d){difficulty=d; restartGame();}

function aiMove(){
  let empty = board.map((v,i)=>v==""?i:null).filter(v=>v!=null);
  let move = empty[Math.floor(Math.random()*empty.length)];
  board[move]="O";
  cells[move].textContent="O";
  checkWinner();
  currentPlayer="X";
  statusText.textContent="Player X Turn";
}

// WIN CHECK
function checkWinner(){
  for(let c of winCond){
    let [a,b,c2]=c;
    if(board[a] && board[a]==board[b] && board[a]==board[c2]){
      drawLine(a,c2);
      gameActive=false;
      statusText.textContent=`🔥 Player ${board[a]} Wins!`;
      if(board[a]=="X") xScore++; else oScore++;
      updateScore();
      glowWin();
      return true;
    }
  }

  if(!board.includes("")){
    gameActive=false;
    drawScore++;
    updateScore();
    statusText.textContent="🤝 Draw!";
    return true;
  }
  return false;
}

// SCORE UI
function updateScore(){
  document.getElementById("xScore").textContent=xScore;
  document.getElementById("oScore").textContent=oScore;
  document.getElementById("drawScore").textContent=drawScore;
}

// Restart
restartBtn.onclick = restartGame;
function restartGame(){
  board=["","","","","","","","",""];
  cells.forEach(c=>c.textContent="");
  gameActive=true;
  currentPlayer="X";
  statusText.textContent="Player X Turn";
  clearLine();
}

// Neon Mode
themeBtn.onclick = ()=>document.body.classList.toggle("neon");

// WIN LINE
function drawLine(a,c){
  const canvas=document.getElementById("winLine");
  const ctx=canvas.getContext("2d");
  canvas.width=350; canvas.height=350;

  const pos=[
  [50,50],[175,50],[300,50],
  [50,175],[175,175],[300,175],
  [50,300],[175,300],[300,300]
  ];

  ctx.strokeStyle="red";
  ctx.lineWidth=6;
  ctx.beginPath();
  ctx.moveTo(pos[a][0],pos[a][1]);
  ctx.lineTo(pos[c][0],pos[c][1]);
  ctx.stroke();
}

function clearLine(){
  const canvas=document.getElementById("winLine");
  canvas.getContext("2d").clearRect(0,0,canvas.width,canvas.height);
}

// WIN GLOW EFFECT
function glowWin(){
  cells.forEach(c=>c.style.boxShadow="0 0 30px gold");
  setTimeout(()=>cells.forEach(c=>c.style.boxShadow="0 0 15px cyan"),1500);
}

// 🎤 Voice
const rec = new (window.SpeechRecognition||window.webkitSpeechRecognition)();
rec.lang="en-US";
rec.onresult = e=>{
  let cmd=e.results[0][0].transcript.toLowerCase();
  if(cmd.includes("restart")) restartGame();
  if(cmd.includes("neon")) document.body.classList.toggle("neon");
};
document.addEventListener("keydown",e=>{if(e.key==="v") rec.start();});