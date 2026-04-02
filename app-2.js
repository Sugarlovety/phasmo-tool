document.addEventListener("DOMContentLoaded", async () => {

const evidences=["EMF5","DOTS","UV","氷点下","オーブ","書き込み","スピボ"];
const speeds=["遅い","通常","速い","特殊"];

const res = await fetch("data.json");
const data = await res.json();
const ghosts = data.ghosts;

let include=[],exclude=[],speedF=[];

function create(list,target,type){
if(!target) return;

list.forEach(item=>{
const btn=document.createElement("button");
btn.textContent=item;

btn.onclick=()=>{
if(type==="ev"){
if(include.includes(item)){
include=include.filter(e=>e!==item);
exclude.push(item);
btn.className="exclude";
}else if(exclude.includes(item)){
exclude=exclude.filter(e=>e!==item);
btn.className="";
}else{
include.push(item);
btn.className="include";
}
}else{
if(speedF.includes(item)){
speedF=speedF.filter(s=>s!==item);
btn.className="";
}else{
speedF.push(item);
btn.className="include";
}
}
render();
};

target.appendChild(btn);
});
}

create(evidences,document.getElementById("ev"),"ev");
create(speeds,document.getElementById("speed"),"speed");

function getScore(g,sanity,count,interval){
let score=0;

if(sanity<=g.hunt) score+=2;
if(sanity>60 && g.hunt>=65) score+=3;

if(interval<30){
if(g.name==="デーモン") score+=4;
if(g.name==="モーロイ") score+=2;
}

if(count>=3){
if(g.name==="鬼") score+=2;
if(g.name==="デーモン") score+=2;
}

return score;
}

function render(){
const sanity=Number(document.getElementById("sanity").value);
const count=Number(document.getElementById("huntCount").value);
const interval=Number(document.getElementById("huntInterval").value);

const list=document.getElementById("ghostList");
list.innerHTML="";

let filtered = ghosts.filter(g=>{
return include.every(e=>g.ev.includes(e))
&& exclude.every(e=>!g.ev.includes(e))
&& (speedF.length===0||speedF.includes(g.speed))
&& (sanity <= g.hunt || sanity === 100);
});

filtered.sort((a,b)=>getScore(b,sanity,count,interval)-getScore(a,sanity,count,interval));

const total = filtered.reduce((sum,g)=>sum+getScore(g,sanity,count,interval),0);

filtered.forEach(g=>{
const score=getScore(g,sanity,count,interval);
const percent = total?((score/total)*100).toFixed(1):0;

const div=document.createElement("div");
div.className="ghost"+(percent>30?" top":"");

div.innerHTML=`
<b>${g.name}</b><br>
証拠: ${g.ev.join(", ")}<br>
速度: ${g.speed}<br>
ハント: ${g.hunt}%<br>
確率: ${percent}%
`;

list.appendChild(div);
});
}

render();
document.querySelectorAll("input").forEach(i=>i.oninput=render);

});