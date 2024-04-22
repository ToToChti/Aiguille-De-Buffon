let canvas = document.querySelector('#piZone');
let ctx = canvas.getContext('2d');

document.querySelector('.canvasContainer').style.width = (document.querySelector('.mainContainer').clientWidth - document.querySelector('.rightBox').clientWidth - 50) + 'px';
canvas.width = document.querySelector('.canvasContainer').clientWidth;
canvas.height = canvas.width * 9/16;


let numOfBars;
let spaceBetweenBars;
let barsTab = [];
let barWidth = 2;

let toothpickSize;

let tries = [];

let numPlaced;
let numOnLine;

let piApprox;


function newToothPick() {

  let x = Math.round(Math.random() * canvas.width);
  let y = Math.round(Math.random() * canvas.height);

  let angle = Math.PI * Math.random();

  return {x, y, angle}
}

function checkBars(toothpick) {

  let xOverflow = Math.abs(toothpickSize / 2 * Math.cos(toothpick.angle));
  let found = false;
  
  barsTab.forEach(bar => {

    if(toothpick.x + xOverflow > bar && toothpick.x - xOverflow < bar) {
      found = true;
    }
  
  })

  return found;
}

function drawBars() {

  barsTab.splice(0, barsTab.length);

  ctx.fillStyle = "red";

  for(let i = 0; i < numOfBars; ++i) {
    let xCalc = i * spaceBetweenBars + spaceBetweenBars / 2;
    ctx.fillRect(xCalc - barWidth / 2, 0, barWidth, canvas.height);

    barsTab.push(xCalc);
  }
  
}

function drawToothpick(toothpick, onLine) {

  if(onLine) {
    ctx.strokeStyle = "green  ";
    ctx.lineWidth = 2;
  }

  else {
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;
  }

  let xOverflow = toothpickSize / 2 * Math.cos(toothpick.angle);
  let yOverflow = toothpickSize / 2 * Math.sin(toothpick.angle);


  ctx.beginPath();
  ctx.moveTo(
    toothpick.x - xOverflow,
    toothpick.y - yOverflow
  );
  ctx.lineTo(
    toothpick.x + xOverflow,
    toothpick.y + yOverflow
  );
  ctx.stroke();

}


function addToothpicks() {

  let n = Number(document.querySelector('.actionsBox div input').value);

  numPlaced += n;

  for(let i = 0; i < n; i++) {

    let toothpick = newToothPick();
    let isOnLine = checkBars(toothpick);

    if(isOnLine) numOnLine++;

    drawToothpick(toothpick, isOnLine);
  }

  drawBars();

  let ratio = numOnLine / numPlaced;
  
  piApprox = (2 * toothpickSize) / (spaceBetweenBars * ratio);

  document.querySelector('.placed .value').textContent = numPlaced;
  document.querySelector('.onLine .value').textContent = numOnLine;
  document.querySelector('.ratio .value').textContent  = Math.round(ratio * 100000) / 100000;
  document.querySelector('.approx .value').textContent = Math.round(piApprox * 100000) / 100000;
  
}

function saveTry() {

  if(numPlaced == 0) return alert("You have not palced any toothpick yet!")

  tries.push({
    tpNumber: numPlaced,
    pi: piApprox
  });

  let str  = '';
  let piMoy = 0;
  let tpNum = 0;
  
  tries.forEach((trie, i) => {
    str += `<tr><td>${i + 1}</td><td>${Math.round(trie.tpNumber * 100000) / 100000}</td><td>${Math.round(trie.pi * 100000) / 100000}</td></tr>`;

    tpNum += trie.tpNumber;
    piMoy += trie.pi;
  })

  let str2 = `<tr class="total"><td>AVERAGE</td><td>${Math.round(tpNum / tries.length* 100000) / 100000}</td><td>${Math.round(piMoy / tries.length* 100000) / 100000}</td></tr>`;
  
  document.querySelector('table tbody').innerHTML = str2 + str;

  reset();

}

function reset() {

  piApprox = 0;

  numOfBars = Number(document.querySelector('#barNumber').value);
  spaceBetweenBars = canvas.width / numOfBars;
  toothpickSize = Number(document.querySelector('#toothpickSize').value) * spaceBetweenBars;

  numPlaced = 0;
  numOnLine = 0;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  document.querySelector('.placed .value').textContent = numPlaced;
  document.querySelector('.onLine .value').textContent = numOnLine;
  document.querySelector('.ratio .value').textContent  = 0;
  document.querySelector('.approx .value').textContent = Math.round(piApprox * 100000) / 100000;

  drawBars();
}


reset();