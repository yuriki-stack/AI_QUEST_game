/* AI QUEST v0.5 - Stable rebuild
   Base: v0.3 playable architecture
   Goal: eliminate broken screen/button overrides and provide reliable L1-L3 progression.
*/
const SAVE_KEY = "aiQuestSave";

const QUESTS = [
  {id:"Q001", level:1, area:"village", title:"AIとの出会い", desc:"AIとは何かを知ろう。", type:"choice",
   question:"AIについての説明として最も近いものは？",
   options:["人間の知的な作業の一部をコンピュータで行えるようにする技術","必ず正解を出す魔法の道具","インターネットそのもの"],
   answer:0, exp:120, coins:30,
   explain:"AIは、人間が行ってきた知的な作業の一部をコンピュータで扱えるようにする技術です。"},
  {id:"Q002", level:1, area:"village", title:"AIは何ができる？", desc:"検索・生成AI・人間の判断の違いを知ろう。", type:"choice",
   question:"生成AIの特徴として適切なのは？",
   options:["文章・画像などのコンテンツを生成できる","必ず最新情報を知っている","人間の判断が不要になる"],
   answer:0, exp:140, coins:35,
   explain:"生成AIは文章や画像などを生成できます。ただし、最新情報や事実性は別途確認が必要です。"},
  {id:"Q003", level:1, area:"village", title:"AIの得意・苦手", desc:"AIの回答をそのまま信じない習慣を身につけよう。", type:"choice",
   question:"AIの回答を仕事で使うとき、特に重要なのは？",
   options:["重要な情報は根拠や一次情報を確認する","AIが答えたら必ず正しいと考える","確認せずそのまま公開する"],
   answer:0, exp:160, coins:35,
   explain:"AIはもっともらしい誤情報を生成することがあります。重要な内容ほど検証しましょう。"},
  {id:"Q004", level:2, area:"village", title:"最初のお願い", desc:"あいまいな依頼を具体的なプロンプトに変えよう。", type:"choice",
   question:"「旅行を考えて」より伝わりやすい依頼はどれ？",
   options:["東京から日帰りで行ける旅行先を3つ、予算1万円以内で表形式にしてください。","旅行について何か考えて。","いい旅行を考えて。"],
   answer:0, exp:170, coins:40,
   explain:"目的・条件・出力形式を具体化すると、AIが意図を理解しやすくなります。"},
  {id:"Q005", level:2, area:"village", title:"伝わる依頼文", desc:"メール作成に必要な条件を整理しよう。", type:"choice",
   question:"AIに仕事メールを書いてもらうとき、役立つ情報は？",
   options:["相手・目的・要件・トーン・出力形式など","何も条件を伝えない","AIに全部任せるだけ"],
   answer:0, exp:160, coins:35,
   explain:"誰に、何のために、何を伝えるかを明確にすると、使いやすい文章になります。"},
  {id:"Q006", level:2, area:"village", title:"村の掲示板を整理せよ", desc:"情報を表形式に整理する練習。", type:"choice",
   question:"「項目・担当・期限」の情報を整理するなら、どの形式が適切？",
   options:["表形式","意味のない長文","条件を削除した一文"],
   answer:0, exp:170, coins:40,
   explain:"複数項目を比較・管理する場合は表形式が扱いやすいです。"},
  {id:"Q007", level:3, area:"forest", title:"森への入口", desc:"良いプロンプトを作る基本要素を見つけよう。", type:"choice",
   question:"AIへの指示を強くするために、特に役立つ組み合わせは？",
   options:["目的・対象・条件・出力形式を具体的にする","とにかく長い文章にする","「いい感じに」だけ伝える"],
   answer:0, exp:180, coins:45,
   explain:"長さそのものではなく、目的・対象・条件・出力形式などの具体性が重要です。"},
  {id:"Q008", level:3, area:"forest", title:"良い指示を探せ", desc:"具体的な指示とあいまいな指示を見分けよう。", type:"choice",
   question:"より伝わりやすいプロンプトはどちら？",
   options:["高校生向けに、300字以内、箇条書き3点で説明してください。","分かりやすく説明して。"],
   answer:0, exp:200, coins:50,
   explain:"対象・文字数・形式が明確なので、AIが出力を調整しやすくなります。"},
  {id:"Q009", level:3, area:"forest", title:"プロンプト職人への道", desc:"自分でプロンプトを書いて、伝わりやすさを高めよう。", type:"prompt",
   exp:260, coins:70,
   explain:"良いプロンプトは、目的・対象・条件・出力形式などが具体的です。"}
];

const AREAS=[
 {id:"village",name:"はじまりの村",icon:"🏡",level:1,implemented:true},
 {id:"forest",name:"プロンプトの森",icon:"🌲",level:3,implemented:true},
 {id:"text",name:"文章生成の街",icon:"🏙️",level:5,implemented:false},
 {id:"image",name:"画像生成の街",icon:"🎨",level:6,implemented:false},
 {id:"guild",name:"AI仕事ギルド",icon:"💼",level:7,implemented:false},
 {id:"safety",name:"安全・検証エリア",icon:"🛡️",level:8,implemented:false},
 {id:"lab",name:"AI研究所",icon:"🧪",level:9,implemented:false},
 {id:"master",name:"AIマスター試験",icon:"👑",level:9,implemented:false}
];

const LEVEL_THRESHOLDS=[0,300,700,1200,1800,2500,3300,4200,5200,6300,7500,8800,10200,11700,13300,15000,16800,18700,20700,22800];

let state={
 name:"",
 exp:0,
 coins:0,
 level:1,
 completed:[],
 currentQuest:null,
 skills:{basic:0,prompt:0}
};
let currentQuest=null;

function $(id){return document.getElementById(id);}

function normalizeState(raw){
 const s={...state,...(raw||{})};
 s.completed=Array.isArray(s.completed)?s.completed:[];
 s.skills=s.skills&&typeof s.skills==="object"?s.skills:{basic:0,prompt:0};
 s.exp=Number(s.exp)||0;
 s.coins=Number(s.coins)||0;
 s.level=1;
 for(let i=1;i<LEVEL_THRESHOLDS.length;i++) if(s.exp>=LEVEL_THRESHOLDS[i]) s.level=i+1;
 return s;
}

function save(){localStorage.setItem(SAVE_KEY,JSON.stringify(state));}

function load(){
 try{
  const raw=localStorage.getItem(SAVE_KEY);
  state=normalizeState(raw?JSON.parse(raw):null);
 }catch(e){
  state=normalizeState(null);
 }
 currentQuest=QUESTS.find(q=>q.id===state.currentQuest)||null;
 save();
}

function updateStats(){
 const levelEl=$("levelValue")||$("level");
 const expEl=$("expValue")||$("exp");
 const coinEl=$("coinValue")||$("coins");
 const nameEl=$("playerName");
 if(levelEl) levelEl.textContent="Lv."+state.level;
 if(expEl) expEl.textContent=String(state.exp);
 if(coinEl) coinEl.textContent=String(state.coins);
 if(nameEl) nameEl.textContent=state.name||"冒険者";
}

function showScreen(id){
 document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
 const target=$(id);
 if(!target) return;
 target.classList.add("active");
 updateStats();
 if(id==="map") renderWorldMap();
 if(id==="village") renderVillage();
 if(id==="promptForest") renderForest();
}

function toast(message){
 let t=$("toast");
 if(!t){
  t=document.createElement("div");
  t.id="toast";
  t.style.cssText="position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:99999;padding:12px 18px;border-radius:14px;background:#172033;color:#fff;box-shadow:0 10px 30px rgba(0,0,0,.35);font-weight:700;";
  document.body.appendChild(t);
 }
 t.textContent=message;t.style.display="block";
 clearTimeout(window.__aiQuestToast);
 window.__aiQuestToast=setTimeout(()=>t.style.display="none",2400);
}

function startAdventure(){
 const input=$("profileName")||$("nameInput")||$("playerNameInput");
 if(input && input.value.trim()) state.name=input.value.trim();
 if(!state.name) state.name="冒険者";
 save();
 showScreen("opening");
}

function continueGame(){
 load();
 // A save always exists after load. Continue from the current progression.
 showScreen("map");
}

function startNewGame(){
 state=normalizeState({name:"",exp:0,coins:0,level:1,completed:[],currentQuest:null,skills:{basic:0,prompt:0}});
 currentQuest=null;
 save();
 showScreen("profile");
}

function confirmProfile(){
 const input=$("profileName")||$("nameInput")||$("playerNameInput");
 state.name=(input?.value||"冒険者").trim()||"冒険者";
 save();
 showScreen("opening");
}

function levelCheck(){
 const old=state.level;
 state.level=1;
 for(let i=1;i<LEVEL_THRESHOLDS.length;i++) if(state.exp>=LEVEL_THRESHOLDS[i]) state.level=i+1;
 save();
 if(state.level>old) toast(`🎉 LEVEL UP! Lv.${state.level}`);
}

function renderWorldMap(){
 const grid=$("worldGrid");
 if(!grid)return;
 grid.innerHTML="";
 AREAS.forEach(a=>{
  const unlocked=state.level>=a.level;
  const card=document.createElement("button");
  card.type="button";
  card.className="world-card "+(unlocked?"unlocked":"locked");
  card.innerHTML=`<div class="icon">${unlocked?a.icon:"🔒"}</div>
   <h3>${a.name}</h3>
   <div class="status">${unlocked?(a.implemented?"▶ 選択できます":"🔓 解放済み・準備中"):`Lv.${a.level}で解放`}</div>`;
  if(unlocked){
   if(a.id==="village") card.onclick=()=>openVillage();
   else if(a.id==="forest") card.onclick=()=>openForest();
   else card.onclick=()=>toast(`${a.name}は解放済みです。次のアップデートでクエストを追加します。`);
  }else{
   card.onclick=()=>toast(`${a.name}はLv.${a.level}で解放されます。`);
  }
  grid.appendChild(card);
 });
 const next=AREAS.find(a=>a.level>state.level);
 const msg=$("mapMessage");
 if(msg)msg.textContent=next?`現在 Lv.${state.level}｜次は Lv.${next.level}で「${next.name}」が解放されます。`:"すべてのエリアが解放されています。";
}

function openVillage(){showScreen("village");}

function openForest(){showScreen("promptForest");}

function renderQuestCards(container, area){
 if(!container)return;
 container.innerHTML="";
 QUESTS.filter(q=>q.area===area).forEach(q=>{
  const done=state.completed.includes(q.id);
  const previous=q.id==="Q001"?true:state.completed.includes(QUESTS[QUESTS.findIndex(x=>x.id===q.id)-1]?.id);
  const available=state.level>=q.level && previous;
  const card=document.createElement("div");
  card.className="quest-card-v5";
  card.innerHTML=`<div class="meta"><h3>${done?"✅ ":""}${q.id} ${q.title}</h3><p>${q.desc}</p><p class="status">報酬：EXP ${q.exp} / 🪙 ${q.coins}</p></div>`;
  const btn=document.createElement("button");
  btn.className=available?"primary":"secondary";
  btn.textContent=done?"もう一度":"開始";
  btn.disabled=!available;
  btn.onclick=()=>startQuest(q.id);
  card.appendChild(btn);
  container.appendChild(card);
 });
}

function renderVillage(){
 const el=$("villageQuestList")||$("questList");
 if(el)renderQuestCards(el,"village");
}

function renderForest(){
 renderQuestCards($("forestQuestList"),"forest");
}

function startQuest(id){
 const q=QUESTS.find(x=>x.id===id);
 if(!q)return;
 if(state.level<q.level){toast(`Lv.${q.level}で解放されます。`);return;}
 const index=QUESTS.findIndex(x=>x.id===id);
 if(index>0 && !state.completed.includes(QUESTS[index-1].id)){toast("前のクエストをクリアすると挑戦できます。");return;}
 currentQuest=q;
 state.currentQuest=id;
 save();
 showScreen("quest");
 renderQuest();
}

function renderQuest(){
 if(!currentQuest)return;
 const title=$("questTitle");
 const body=$("questBody")||$("questContent");
 if(title)title.textContent=`${currentQuest.id} ${currentQuest.title}`;
 if(!body)return;
 if(currentQuest.type==="choice"){
  body.innerHTML=`<p>${currentQuest.desc}</p><h3>${currentQuest.question}</h3>
   <div class="choices">${currentQuest.options.map((o,i)=>`<button class="option" onclick="answerChoice(${i})">${o}</button>`).join("")}</div>
   <p class="save-note">間違えてもゲームオーバーにはなりません。理由を確認して再挑戦できます。</p>`;
 }else{
  body.innerHTML=`<p>${currentQuest.desc}</p>
   <h3>テーマ：高校生にも分かるように「生成AIとは何か」を説明してください。</h3>
   <div class="score-grid-v5">
    <div class="score-item-v5">🎯 目的</div><div class="score-item-v5">👤 対象</div>
    <div class="score-item-v5">📏 条件</div><div class="score-item-v5">📋 出力形式</div>
   </div>
   <textarea id="promptInput" class="prompt-input-v5" placeholder="例：高校生向けに、生成AIとは何かを200字以内で、具体例を1つ入れて、箇条書き3点で説明してください。"></textarea>
   <button class="primary" onclick="scorePrompt()">プロンプトを評価する</button>
   <div id="promptFeedback"></div>`;
 }
}

function answerChoice(index){
 const q=currentQuest;
 const correct=index===q.answer;
 const body=$("questBody")||$("questContent");
 if(correct){
  if(body)body.innerHTML=`<div class="feedback"><h3>正解！</h3><p>${q.explain}</p><button class="primary" onclick="completeCurrentQuest()">クリアして進む</button></div>`;
 }else{
  if(body)body.insertAdjacentHTML("beforeend",`<div class="feedback"><h3>もう一度考えてみよう</h3><p>${q.explain}</p></div>`);
 }
}

function scorePrompt(){
 const input=($("promptInput")?.value||"").trim();
 if(input.length<10){toast("もう少し具体的に書いてみましょう。");return;}
 const checks=[
  ["目的",20,/(説明|解説|教え|まとめ|生成|作成|理解)/.test(input)],
  ["対象",20,/(高校生|初心者|子ども|社会人|読者|向け|対象)/.test(input)],
  ["条件",25,/(文字|字|以内|以上|具体|例|個|点|条件)/.test(input)],
  ["出力形式",20,/(箇条書き|表|形式|見出し|ステップ|リスト|文章)/.test(input)],
  ["具体性",15,input.length>=35]
 ];
 const score=checks.reduce((sum,x)=>sum+(x[2]?x[1]:0),0);
 const detail=checks.map(x=>`${x[2]?"✓":"△"} ${x[0]}：${x[2]?x[1]+"点":"改善できます"}`).join("<br>");
 const fb=$("promptFeedback");
 fb.innerHTML=`<div class="feedback"><h3>プロンプト評価：${score}点</h3><p>${detail}</p>
 <p>${score>=70?"十分に具体的です。":"足りない要素を追加すると、もっと伝わりやすくなります。"}</p>
 ${score>=70?'<button class="primary" onclick="completeCurrentQuest()">クリアして進む</button>':''}</div>`;
}

function completeCurrentQuest(){
 const q=currentQuest;
 if(!q)return;
 const firstClear=!state.completed.includes(q.id);
 if(firstClear){
  state.completed.push(q.id);
  state.exp+=q.exp;
  state.coins+=q.coins;
  if(q.area==="village" && ["Q001","Q002","Q003"].includes(q.id))state.skills.basic+=10;
  if(q.area==="village" && ["Q004","Q005","Q006"].includes(q.id))state.skills.prompt+=10;
  if(q.area==="forest")state.skills.prompt+=10;
  const old=state.level;
  levelCheck();
  save();
  const leveled=state.level>old;
  showResult(q,leveled);
 }else{
  showResult(q,false,true);
 }
}

function showResult(q,leveled,replay=false){
 const title=$("resultTitle");
 const msg=$("resultMessage")||$("resultBody");
 const reward=$("reward");
 if(title)title.textContent="クエストクリア！";
 if(msg)msg.innerHTML=`<p>${q.title}をクリアしました。</p>${q.explain?`<p>${q.explain}</p>`:""}${leveled?`<p>🎉 <b>Lv.${state.level}に上がりました！新しいエリアが解放されました。</b></p>`:""}${replay?"<p>再挑戦のため報酬は追加されません。</p>":""}`;
 if(reward)reward.innerHTML=replay?"":`<span>✨ EXP +${q.exp}</span><span>🪙 コイン +${q.coins}</span>`;
 showScreen("result");
}

function continueAfterResult(){
 if(currentQuest?.area==="forest")openForest();
 else openVillage();
}

function safeStartBindings(){
 // Existing v0.3 buttons
 const start=$("startBtn");
 const continueBtn=$("continueBtn");
 const newGame=$("newGameBtn");
 if(start)start.onclick=startNewGame;
 if(continueBtn)continueBtn.onclick=continueGame;
 if(newGame)newGame.onclick=startNewGame;

 // Generic fallbacks by button text, only when no inline handler is present.
 document.querySelectorAll("button").forEach(btn=>{
  if(btn.getAttribute("onclick"))return;
  const t=(btn.textContent||"").trim();
  if(t==="冒険をはじめる")btn.onclick=startNewGame;
  else if(t==="続きから")btn.onclick=continueGame;
  else if(t==="タイトルへ")btn.onclick=()=>showScreen("title");
 });
}

document.addEventListener("DOMContentLoaded",()=>{
 load();
 updateStats();
 safeStartBindings();
});
