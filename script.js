const SAVE_KEY="AI_QUEST_V1_2_SAVE";
const OLD_SAVE_KEY="AI_QUEST_V1_1_SAVE";

const areas=[
 {id:"village",name:"はじまりの村",icon:"🏡",desc:"AIの基本を学ぶ",unlock:1},
 {id:"prompt",name:"プロンプトの森",icon:"🌲",desc:"AIへの指示を磨く",unlock:2},
 {id:"writing",name:"文章生成の街",icon:"✍️",desc:"文章作成に活かす",unlock:5},
 {id:"image",name:"画像生成の街",icon:"🎨",desc:"画像の指示を学ぶ",unlock:6},
 {id:"guild",name:"AI仕事ギルド",icon:"🏢",desc:"仕事をAIで分解する",unlock:7},
 {id:"safety",name:"安全・検証エリア",icon:"🛡️",desc:"安全にAIを使う",unlock:8},
 {id:"master",name:"AIマスター試験",icon:"🏆",desc:"学んだ力を総合確認",unlock:9}
];

const quests=[
 {id:"Q001",lv:1,area:"village",title:"AIの得意分野を探せ",desc:"生成AIが得意なことを選ぼう。",reward:100,skill:"basic",type:"choice",
  question:"生成AIの代表的な活用として適切なのは？",choices:["文章のたたき台やアイデアを作る","必ず正しい情報だけを返す","人間の判断を完全に置き換える","入力しなくても現実世界を操作する"],answer:0,explain:"生成AIは文章・アイデア・要約などの生成を得意とします。ただし、出力が常に正しいとは限りません。"},
 {id:"Q002",lv:1,area:"village",title:"AIへのお願いを具体化せよ",desc:"目的・条件を入れた指示を選ぼう。",reward:120,skill:"prompt",type:"choice",
  question:"「メールを書いて」より具体的なのは？",choices:["メールを書いて","取引先へのお礼メールを、丁寧な文体で150字程度に作って","すごいメール","いい感じにして"],answer:1,explain:"目的・相手・文体・長さなどの条件を追加すると、期待する出力に近づきます。"},
 {id:"Q003",lv:1,area:"village",title:"AI初心者の一歩",desc:"AIとの会話で大切な姿勢を選ぼう。",reward:140,skill:"basic",type:"choice",
  question:"AIの回答を使うときに大切なのは？",choices:["必ずそのまま使う","重要な情報は確認する","長い回答なら正しい","自信ありげなら正しい"],answer:1,explain:"重要な情報は根拠や一次情報を確認する習慣が重要です。"},
 {id:"Q007",lv:2,area:"prompt",title:"森への入口",desc:"プロンプトの基本要素を選ぼう。",reward:250,skill:"prompt",type:"choice",
  question:"仕事の依頼をAIへ伝えるとき、特に有効な組み合わせは？",choices:["目的・対象・条件・出力形式","気分・絵文字だけ","質問を一言だけ","何も指定しない"],answer:0,explain:"目的、対象、条件、出力形式を具体化するとAIが意図を理解しやすくなります。"},
 {id:"Q008",lv:2,area:"prompt",title:"良い指示を探せ",desc:"2つの指示を比較しよう。",reward:300,skill:"prompt",type:"choice",
  question:"社内説明文を作る指示として、より具体的なのは？",choices:["説明文を作って","初心者向けに、専門用語を避け、3つの箇条書きで説明して"],answer:1,explain:"対象読者・条件・形式を指定すると、使いやすい出力になります。"},
 {id:"Q009",lv:3,area:"prompt",title:"プロンプト職人への道",desc:"実務で使える指示を自分で組み立てよう。",reward:400,skill:"prompt",type:"text",
  prompt:"「新入社員向けに、生成AIの基本を説明する文章」をAIに依頼するプロンプトを作ってください。目的・対象・条件・形式のうち3つ以上を入れましょう。",
  keywords:["新入社員","初心者","生成AI","目的","箇条書き","文字","条件","形式","説明"],explain:"目的・対象・条件・形式を入れるほど、AIが期待する出力を作りやすくなります。"},
 {id:"Q010",lv:4,area:"prompt",title:"AI探偵の事件簿",desc:"AIの回答から確認が必要な情報を探そう。",reward:450,skill:"verify",type:"choice",
  question:"AIが作った文章で、特に確認を優先したいものは？",choices:["日付・数字・固有名詞など事実に関わる情報","文章の改行位置だけ","絵文字の数","文字の色"],answer:0,explain:"日付、数字、固有名詞、引用などは誤りが業務へ影響しやすいため確認が重要です。"},
 {id:"Q011",lv:4,area:"prompt",title:"根拠を追え",desc:"検証の優先順位を考えよう。",reward:500,skill:"verify",type:"choice",
  question:"AI回答を検証するときの考え方として適切なのは？",choices:["全部を同じ深さで確認する","重要度と不確実性を考えて優先順位をつける","AIが自信ありげなら確認不要","長い回答は確認しない"],answer:1,explain:"重要な情報や誤りの影響が大きい情報から優先して確認します。"},
 {id:"Q012",lv:5,area:"writing",title:"文章工房へ",desc:"用途に合ったAI活用を選ぼう。",reward:500,skill:"work",type:"choice",
  question:"社外メールをAIに作ってもらうとき、指定すると有効なのは？",choices:["相手・目的・トーン・要点","AIに全部任せる","「丁寧に」だけ","何も指定しない"],answer:0,explain:"相手、目的、トーン、要点を明示するとビジネス文面を調整しやすくなります。"},
 {id:"Q013",lv:5,area:"writing",title:"3つの文章を作れ",desc:"用途別に指示を考えよう。",reward:600,skill:"work",type:"text",
  prompt:"「会議メモを100字程度で要約し、重要なTODOを3つまで箇条書きにする」ためのプロンプトを作ってください。",
  keywords:["会議メモ","要約","100字","TODO","箇条書き","3","重要"],explain:"入力対象、要約条件、TODO、出力形式を明確にすると実務で使いやすくなります。"},
 {id:"Q014",lv:6,area:"image",title:"イメージを言葉に",desc:"画像プロンプトの要素を選ぼう。",reward:550,skill:"image",type:"choice",
  question:"画像生成の指示に入れると役立つ要素は？",choices:["対象・構図・場所・光・雰囲気","数字だけ","作者名だけ","何も指定しない"],answer:0,explain:"対象、構図、環境、光、雰囲気、スタイルなどを具体化できます。"},
 {id:"Q015",lv:6,area:"image",title:"理想の一枚",desc:"画像生成の指示を自分で作ろう。",reward:700,skill:"image",type:"text",
  prompt:"「雨上がりの公園で眠る猫」の画像を生成するためのプロンプトを作ってください。対象・構図・光・雰囲気などを3つ以上入れましょう。",
  keywords:["猫","雨上がり","公園","構図","光","雰囲気","眠る"],explain:"対象だけでなく、場所・構図・光・雰囲気を追加するとイメージを具体化できます。"},
 {id:"Q016",lv:7,area:"guild",title:"仕事の依頼を整理せよ",desc:"AIに任せる仕事を分解しよう。",reward:700,skill:"work",type:"choice",
  question:"AIとの共同作業に向いているのは？",choices:["会議メモから要点とTODOを整理する","重要な契約判断をAIだけで確定する","個人情報を無条件で入力する","最終責任をAIに任せる"],answer:0,explain:"定型的な整理やたたき台作成はAIと相性がよく、重要判断は人が確認・決定します。"},
 {id:"Q017",lv:7,area:"guild",title:"AIアシスタントを雇う",desc:"曖昧な依頼をAI向けタスクに分解しよう。",reward:800,skill:"work",type:"text",
  prompt:"上司から「先週の会議をまとめておいて」と頼まれました。AIに依頼するため、入力資料・作業内容・出力形式・条件を含む具体的な依頼文を作ってください。",
  keywords:["会議","資料","要約","TODO","出力","箇条書き","条件"],explain:"曖昧な依頼を、入力・作業・出力・条件に分解するとAIが扱いやすくなります。"},
 {id:"Q017A",lv:7,area:"guild",title:"仕事プロンプト工房",desc:"実務プロンプトをテンプレート化しよう。",reward:300,skill:"work",type:"choice",
  question:"再利用できる仕事プロンプトに入れると便利なのは？",choices:["毎回変わる個人情報を固定で書く","目的・入力・出力形式・条件を変数として用意する","「いい感じに」の一言だけ","AIの判断にすべて任せる"],answer:1,explain:"変数部分を差し替えられるテンプレートにすると、同じ型を複数の仕事で再利用できます。"},
 {id:"Q018",lv:8,area:"safety",title:"その情報、入力して大丈夫？",desc:"AIへ入力する情報を3分類しよう。",reward:750,skill:"safety",type:"multi",
  question:"次のうち、AIサービスへ入力する前に特に慎重な確認が必要なものをすべて選んでください。",
  choices:["顧客の氏名・電話番号","公開済みの商品説明","社外秘の未公開企画書","自分で作った架空の文章"],answers:[0,2],explain:"個人情報や機密情報は、サービスの利用条件・社内ルール・契約等を確認し、必要なら匿名化・要約化します。公開情報でも利用条件は確認しましょう。"},
 {id:"Q019",lv:8,area:"safety",title:"安全な依頼に書き換えろ",desc:"危険な入力を、安全な依頼へ改善しよう。",reward:850,skill:"safety",type:"text",
  prompt:"次の依頼を、安全な形に書き換えてください。\n「顧客Aさんの氏名・電話番号・購入履歴を全部AIに入力して、クレーム対応文を作って」\n個人を特定できる情報を避け、必要な情報だけで依頼する形にしましょう。",
  keywords:["匿名","氏名","電話番号","削除","伏せ字","要約","必要","個人情報","購入履歴"],explain:"氏名・電話番号などの直接識別情報を除き、必要な事実だけを抽象化して渡す考え方が重要です。利用するAIサービスや社内規程も確認します。"},
 {id:"Q020",lv:9,area:"master",title:"最後の依頼",desc:"作成→検証→改善→安全判断を総合確認。",reward:2000,skill:"master",type:"master",
  prompt:"あなたは社内イベント担当です。「イベント案内文」をAIに作ってもらう依頼を設計してください。①対象と目的 ②出力形式 ③事実確認する項目 ④入力してはいけない情報 ⑤AI出力を人が確認する手順、の5点を含めてください。",
  keywords:["対象","目的","形式","日付","数字","確認","個人情報","機密","人","チェック"],explain:"総合課題では、良いプロンプトだけでなく、事実確認・安全性・人による最終確認まで含めて設計できることが重要です。"}
];

function auditQuests(){
 const errors=[];
 const ids=new Set();
 quests.forEach(q=>{
  if(ids.has(q.id))errors.push(`${q.id}: ID重複`); ids.add(q.id);
  if(!q.id||!q.area||!q.title||!q.reward||!q.skill||!q.type)errors.push(`${q.id||"UNKNOWN"}: 基本項目不足`);
  if(q.type==="choice" && (!Array.isArray(q.choices)||typeof q.answer!=="number"||q.answer<0||q.answer>=q.choices.length))errors.push(`${q.id}: choice定義不正`);
  if(q.type==="multi" && (!Array.isArray(q.choices)||!Array.isArray(q.answers)||q.answers.length===0||q.answers.some(i=>typeof i!=="number"||i<0||i>=q.choices.length)))errors.push(`${q.id}: multi定義不正`);
  if(["text","master"].includes(q.type) && (!Array.isArray(q.keywords)||q.keywords.length<3))errors.push(`${q.id}: 自由入力キーワード不足`);
 });
 if(errors.length)console.error("AI QUEST quest audit errors",errors);
 return errors;
}
auditQuests();

let save=load()||fresh();
let currentArea=null,currentQuest=null,selected=[],answered=false;

function fresh(){return {name:"AI QUEST冒険者",level:1,exp:0,coins:0,cleared:[],mistakes:[],skills:{basic:0,prompt:0,verify:0,work:0,image:0,safety:0,master:0}}}
function load(){
 try{
  const current=localStorage.getItem(SAVE_KEY);
  if(current){return normalizeSave(JSON.parse(current));}
  const old=localStorage.getItem(OLD_SAVE_KEY);
  if(old){
   const migrated=normalizeSave(JSON.parse(old));
   localStorage.setItem(SAVE_KEY,JSON.stringify(migrated));
   return migrated;
  }
 }catch(e){}
 return null;
}
function normalizeSave(data){
 const base=fresh();
 const out={...base,...data};
 out.cleared=Array.isArray(data?.cleared)?[...new Set(data.cleared.filter(id=>quests.some(q=>q.id===id)))]:[];
 out.mistakes=Array.isArray(data?.mistakes)?[...new Set(data.mistakes)]:[];
 out.skills={...base.skills,...(data?.skills||{})};
 out.exp=Number.isFinite(data?.exp)?Math.max(0,data.exp):0;
 out.coins=Number.isFinite(data?.coins)?Math.max(0,data.coins):0;
 out.level=Number.isFinite(data?.level)?Math.max(1,data.level):1;
 return out;
}
function persist(){localStorage.setItem(SAVE_KEY,JSON.stringify(save));updateTop();document.getElementById("saveHint").textContent="セーブデータがあります。";}

function calcLevel(){
 // EXPは累積値として保持し、レベル判定だけを行う（EXPを減算しない）
 let lv=1, total=save.exp;
 let need=300;
 while(total>=need && lv<30){ total-=need; lv++; need+=250+lv*50; }
 save.level=Math.max(save.level,lv);
}
function updateTop(){document.getElementById("level").textContent=`Lv.${save.level}`;document.getElementById("exp").textContent=`EXP ${save.exp}`;document.getElementById("coins").textContent=`🪙 ${save.coins}`}
function show(id){document.querySelectorAll(".screen").forEach(x=>x.classList.remove("active"));document.getElementById(id).classList.add("active");updateTop();window.scrollTo({top:0,behavior:"smooth"})}

function isAreaUnlocked(a){return save.level>=a.unlock || a.id==="village"}
function areaCleared(a){return quests.filter(q=>q.area===a.id&&!q.id.endsWith("A")).every(q=>save.cleared.includes(q.id))}
function questState(q){
 if(save.cleared.includes(q.id)) return "clear";
 const prev=quests.filter(x=>x.area===q.area&&!x.id.endsWith("A")).filter(x=>x.id!==q.id);
 if(q.id==="Q001") return "available";
 if(q.id==="Q017A") return save.cleared.includes("Q017")?"available":"locked";
 if(q.id==="Q020") return save.cleared.includes("Q019")?"available":"locked";
 if(q.id==="Q018") return save.cleared.includes("Q017")||save.level>=8?"available":"locked";
 if(q.id==="Q019") return save.cleared.includes("Q018")?"available":"locked";
 const idx=quests.filter(x=>x.area===q.area&&!x.id.endsWith("A")).findIndex(x=>x.id===q.id);
 const previous=quests.filter(x=>x.area===q.area&&!x.id.endsWith("A"))[idx-1];
 return !previous||save.cleared.includes(previous.id)?"available":"locked";
}

function renderMap(){
 const g=document.getElementById("mapGrid");
 g.innerHTML=areas.map(a=>{
  const open=isAreaUnlocked(a),done=areaCleared(a);
  return `<div class="map-card ${open?"":"locked"}">
   <div><div class="map-icon">${a.icon}</div><h3>${a.name}${done?" ✓":""}</h3><p>${a.desc}</p></div>
   <button ${open?"":"disabled"} data-area="${a.id}">${open?"入る":"🔒 Lv."+a.unlock}</button>
  </div>`}).join("");
 g.querySelectorAll("[data-area]").forEach(b=>b.onclick=()=>{currentArea=b.dataset.area;renderQuests();show("quests")});
}
function renderQuests(){
 const a=areas.find(x=>x.id===currentArea);document.getElementById("areaTitle").textContent=a.name;
 const qs=quests.filter(q=>q.area===currentArea);
 document.getElementById("questList").innerHTML=qs.map(q=>{
  const st=questState(q), label=st==="clear"?"CLEAR":st==="available"?"挑戦可能":"LOCKED";
  return `<div class="quest-card"><div class="qicon">${st==="clear"?"✅":st==="locked"?"🔒":"📜"}</div><div class="qmain"><span class="badge ${st}">${label}</span><h3>${q.id}｜${q.title}</h3><p>Lv.${q.lv} ・ ${q.desc} ・ EXP ${q.reward}</p></div><button ${st==="available"?"":"disabled"} data-q="${q.id}">${st==="clear"?"クリア済み":"開始"}</button></div>`}).join("");
 document.querySelectorAll("[data-q]").forEach(b=>b.onclick=()=>startQuest(b.dataset.q));
}
function startQuest(id){
 const q=quests.find(x=>x.id===id);if(!q||questState(q)!=="available")return;
 currentQuest=q;selected=[];answered=false;
 document.getElementById("questTag").textContent=`${q.id} / LEVEL ${q.lv}`;
 document.getElementById("questReward").textContent=`EXP ${q.reward}`;
 document.getElementById("questTitle").textContent=q.title;
 document.getElementById("questIntro").textContent=q.desc;
 const body=document.getElementById("questBody");
 if(q.type==="choice") body.innerHTML=`<div class="question-box"><h3>${q.question}</h3><div class="choice-grid">${q.choices.map((c,i)=>`<button class="choice" data-i="${i}">${c}</button>`).join("")}</div></div>`;
 else if(q.type==="multi") body.innerHTML=`<div class="question-box"><h3>${q.question}</h3><div class="choice-grid">${q.choices.map((c,i)=>`<button class="choice" data-i="${i}">${c}</button>`).join("")}</div><p class="muted">複数選択できます。</p></div>`;
 else body.innerHTML=`<div class="question-box"><h3>あなたの回答</h3><p class="muted" style="white-space:pre-line">${q.prompt}</p><textarea id="answerInput" class="text-input" placeholder="ここにあなたの回答を書いてください"></textarea></div>`;
 document.querySelectorAll(".choice").forEach(b=>b.onclick=()=>{
  const i=Number(b.dataset.i);
  if(q.type==="multi"){selected=selected.includes(i)?selected.filter(x=>x!==i):[...selected,i];}
  else selected=[i];
  document.querySelectorAll(".choice").forEach(x=>x.classList.toggle("selected",selected.includes(Number(x.dataset.i))));
 });
 document.getElementById("feedback").className="feedback hidden";
 document.getElementById("checkBtn").textContent=q.type==="master"?"最終評価":"回答を確認";
 show("quest");
}
function evaluate(){
 const q=currentQuest;
 if(!q)return;
 let score=0,good=false;
 if(q.type==="choice"){
  good=(selected.length===1 && selected[0]===q.answer);
  score=good?100:35;
 }else if(q.type==="multi"){
  const actual=[...selected].sort((a,b)=>a-b);
  const expected=[...q.answers].sort((a,b)=>a-b);
  good=actual.length===expected.length && actual.every((v,i)=>v===expected[i]);
  score=good?100:35;
 }else{
  const input=document.getElementById("answerInput");
  const v=(input?.value||"").trim();
  const normalized=v.toLowerCase();
  const hits=q.keywords.filter(k=>normalized.includes(k.toLowerCase())).length;
  score=Math.min(100,Math.round((hits/q.keywords.length)*100));
  if(v.length>=35)score=Math.min(100,score+15);
  good=score>=60;
 }
 const fb=document.getElementById("feedback");
 fb.className=`feedback ${good?"good":"bad"}`;
 fb.innerHTML=good
  ?`<strong>正解！</strong><br>${q.explain}`
  :`<strong>もう一度考えてみよう。</strong><br>${q.explain}<br><span class="muted">ヒント：目的・条件・安全性・確認方法を意識してみよう。</span>`;
 if(!good){
  save.mistakes=[...new Set([...save.mistakes,q.id])];
  persist();
  return;
 }
 completeQuest(q);
 showResult(q,score);
}
function completeQuest(q){
 // クリア判定を1か所に集約。すべてのQで同じ保存処理を通す。
 if(save.cleared.includes(q.id))return;
 save.cleared.push(q.id);
 save.exp+=q.reward;
 save.coins+=Math.max(20,Math.round(q.reward/10));
 save.skills[q.skill]=Math.min(100,(save.skills[q.skill]||0)+Math.max(5,Math.round(q.reward/80)));
 calcLevel();
 persist();
 // 現在エリアの表示も即時更新
 if(currentArea)renderQuests();
}
function showResult(q,score){
 document.getElementById("resultIcon").textContent="🎉";
 document.getElementById("resultTitle").textContent=`${q.id} クリア！`;
 document.getElementById("resultText").textContent=q.explain;
 document.getElementById("resultStats").innerHTML=`<div>スコア <b>${score}</b></div><div>EXP +${q.reward}</div><div>🪙 +${Math.max(20,Math.round(q.reward/10))}</div>`;
 document.getElementById("resultNext").onclick=()=>{currentArea=q.area;renderQuests();show("quests")};
 show("result");
}
function renderProfile(){
 document.getElementById("profileName").textContent=save.name;
 document.getElementById("profileLevel").textContent=`Lv.${save.level} / クリア ${save.cleared.length}クエスト`;
 const names={basic:"AI基礎",prompt:"プロンプト",verify:"検証",work:"仕事活用",image:"画像生成",safety:"安全性",master:"総合"};
 document.getElementById("skills").innerHTML=Object.entries(save.skills).map(([k,v])=>`<div class="skill"><div class="skill-head"><b>${names[k]}</b><span>${v}</span></div><div class="bar"><i style="width:${v}%"></i></div></div>`).join("");
}
document.getElementById("startBtn").onclick=()=>{if(confirm("現在のセーブデータを消して最初から始めますか？")){save=fresh();persist();renderMap();show("map")}};
document.getElementById("continueBtn").onclick=()=>{renderMap();show("map")};
document.getElementById("saveBtn").onclick=()=>{persist();alert("セーブしました。")};
document.getElementById("backQuest").onclick=()=>{renderQuests();show("quests")};
document.getElementById("checkBtn").onclick=evaluate;
document.querySelectorAll("[data-screen]").forEach(b=>b.onclick=()=>{const id=b.dataset.screen;if(id==="map")renderMap();if(id==="profile")renderProfile();show(id)});
updateTop();
document.getElementById("saveHint").textContent=save.cleared.length?"セーブデータがあります。":"新しい冒険を始めよう。";
