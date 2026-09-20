const state={
 name:"", level:1, exp:0, coins:0, completed:[], currentQuest:null,
 skill:{basic:0,prompt:0,verify:0,work:0,image:0,safety:0}
};
const quests=[
{id:"Q001",name:"AIとの出会い",desc:"AIの世界へ入り、生成AIの基本を知ろう。",reward:100,type:"intro"},
{id:"Q002",name:"AIは何ができる？",desc:"検索・生成AI・人間の役割を見分けよう。",reward:120,type:"q2"},
{id:"Q003",name:"AIの得意・苦手",desc:"AIに任せることと、人が確認することを考えよう。",reward:150,type:"q3"},
{id:"Q004",name:"最初のお願い",desc:"曖昧なお願いを、AIに伝わる依頼へ変えてみよう。",reward:180,type:"q4"},
{id:"Q005",name:"伝わる依頼文",desc:"目的・相手・条件を入れたプロンプトを作ろう。",reward:220,type:"q5"},
{id:"Q006",name:"村の掲示板を整理せよ",desc:"掲示板の情報を整理してみよう。",reward:150,type:"q6"}
];
let openingStep=0;
const opening=[
["🐱","アイニャ","こんにちは！ここはAIの世界だよ。もしかして、AIを使ったことがないの？"],
["🧑‍🌾","村長","ようこそ、冒険者さん。まずはAIが何を得意としているのか、一緒に確かめてみよう。"],
["🐱","アイニャ","大丈夫！ここでは、遊びながらAIへのお願いの仕方を覚えられるよ。失敗しても何度でもやり直せるからね。"]
];
function save(){localStorage.setItem("aiQuestSave",JSON.stringify(state))}
function loadGame(){
 const raw=localStorage.getItem("aiQuestSave");
 if(!raw){toast("セーブデータがありません");return}
 Object.assign(state,JSON.parse(raw)); updateStats(); showScreen("map"); toast("冒険の続きを読み込みました");
}
function startGame(){showScreen("profile")}
function createProfile(){
 state.name=document.getElementById("playerName").value.trim()||"冒険者";
 save(); openingStep=0; renderOpening(); showScreen("opening");
}
function renderOpening(){
 const d=opening[openingStep];
 document.getElementById("dialogue").innerHTML=`<div class="dialogue-box"><div class="speaker">${d[0]}</div><div class="bubble"><b>${d[1]}</b><p>${d[2]}</p></div></div><div class="progress"><i style="width:${((openingStep+1)/opening.length)*100}%"></i></div>`;
}
function nextOpening(){if(openingStep<opening.length-1){openingStep++;renderOpening()}else{showScreen("map");toast(`${state.name}さん、冒険開始！`)}}
function showScreen(id){document.querySelectorAll(".screen").forEach(x=>x.classList.remove("active"));document.getElementById(id).classList.add("active");updateStats()}
function updateStats(){document.getElementById("level").textContent=state.level;document.getElementById("exp").textContent=state.exp;document.getElementById("coins").textContent=state.coins}
function openVillage(){renderQuests();showScreen("village")}
function unlocked(q){const i=quests.findIndex(x=>x.id===q.id);return i===0||state.completed.includes(quests[i-1].id)}
function renderQuests(){
 document.getElementById("questList").innerHTML=quests.map(q=>{
  const done=state.completed.includes(q.id), ok=unlocked(q);
  return `<button class="quest-card" ${ok?'':'disabled'} onclick="${ok?`startQuest('${q.id}')`:''}">
   <div class="qicon">${done?'✅':'📜'}</div><div><span class="tag">${done?'CLEAR':ok?'AVAILABLE':'LOCKED'}</span><h3>${q.name}</h3><p>${q.desc}</p></div><div class="quest-action">${ok?`<b>EXP ${q.reward}</b>`:'🔒'}</div></button>`
 }).join("");
}
function startQuest(id){
 state.currentQuest=id; const q=quests.find(x=>x.id===id);
 document.getElementById("questHeader").innerHTML=`<span class="tag">${q.id}</span><h2>${q.name}</h2><p>${q.desc}</p>`;
 renderQuestContent(q); showScreen("quest");
}
function renderQuestContent(q){
 const box=document.getElementById("questContent");
 if(q.type==="intro") box.innerHTML=`<div class="dialogue-box"><div class="speaker">🐱</div><div class="bubble"><b>アイニャ</b><p>まずは基本から！「生成AI」に近い説明はどれかな？</p></div></div><div class="choices">
 <button class="option" onclick="answerQuest('Q001',true)">指示に応じて文章や画像などのコンテンツを生成するAI</button>
 <button class="option" onclick="answerQuest('Q001',false)">インターネット上の情報を必ず正しく表示する仕組み</button></div>`;
 else if(q.type==="q2") box.innerHTML=`<div class="question-title">次の役割を正しく組み合わせよう。</div><div class="choices">
 <button class="option" onclick="answerQuest('Q002',true)">検索＝情報を探す / 生成AI＝指示に応じて生成 / 人＝重要な判断を確認</button>
 <button class="option" onclick="answerQuest('Q002',false)">検索＝文章生成 / 生成AI＝必ず正しい情報を保証 / 人＝確認不要</button></div>`;
 else if(q.type==="q3") box.innerHTML=`<div class="question-title">「AIの回答は常に正しい」という説明は？</div><div class="choices">
 <button class="option" onclick="answerQuest('Q003',false)">正しい</button><button class="option" onclick="answerQuest('Q003',true)">正しくない。重要な情報は確認が必要</button></div>`;
 else if(q.type==="q4") box.innerHTML=`<div class="question-title">「旅行を考えて」を、より伝わる依頼にするなら？</div><div class="choices">
 <button class="option" onclick="answerQuest('Q004',true)">東京で3日間、予算3万円。初心者向けの旅行プランを、1日ごとの表で作って。</button>
 <button class="option" onclick="answerQuest('Q004',false)">旅行について詳しく。</button></div>`;
 else if(q.type==="q5") box.innerHTML=`<div class="question-title">メール作成の依頼に入れると役立つ要素を3つ以上選ぼう。</div><div class="choices">
 <button class="option" onclick="answerQuest('Q005',true)">相手・目的・伝えたい内容・文体・出力形式</button>
 <button class="option" onclick="answerQuest('Q005',false)">「いい感じにして」だけ</button></div>`;
 else if(q.type==="q6") box.innerHTML=`<div class="question-title">掲示板の情報をAIに整理してもらう依頼として適切なのは？</div><div class="choices">
 <button class="option" onclick="answerQuest('Q006',true)">掲示板の内容を「イベント名・日時・場所・持ち物」の表に整理してください。</button>
 <button class="option" onclick="answerQuest('Q006',false)">掲示板をなんとなくまとめて。</button></div>`;
}
function answerQuest(id,correct){
 const q=quests.find(x=>x.id===id);
 if(correct){completeQuest(q);return}
 document.getElementById("questContent").insertAdjacentHTML("beforeend",`<div class="feedback"><b>もう一度考えてみよう。</b><br>ヒント：AIにお願いするときは「何をしてほしいか」「どんな条件か」「どんな形で出してほしいか」を具体的にすると伝わりやすくなります。<br><button class="secondary" onclick="startQuest('${id}')">もう一度挑戦</button></div>`);
}
function completeQuest(q){
 if(!state.completed.includes(q.id)){state.completed.push(q.id);state.exp+=q.reward;state.coins+=Math.round(q.reward*.5);state.skill.basic+=q.id==="Q001"||q.id==="Q002"||q.id==="Q003"?10:0;state.skill.prompt+=q.id==="Q004"||q.id==="Q005"?10:0;levelCheck();save()}
 document.getElementById("resultTitle").textContent="クエストクリア！";
 document.getElementById("resultMessage").textContent=`${q.name}をクリアしました。理由を理解して次の冒険へ進もう！`;
 document.getElementById("reward").innerHTML=`<span>✨ EXP +${q.reward}</span><span>🪙 コイン +${Math.round(q.reward*.5)}</span>`;
 showScreen("result");
}
function levelCheck(){
 const thresholds=[0,300,700,1200,1800,2500];
 while(state.level<thresholds.length && state.exp>=thresholds[state.level]) state.level++;
}
function continueAfterResult(){openVillage()}
function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
updateStats();
