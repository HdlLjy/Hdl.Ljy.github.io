const lis = document.querySelectorAll('.boxli li');
const boxLi = document.querySelector('.boxli');
const colors = [
    '#007bff','#6f42c1','#dc3545','#fd7e14','#ffc107','#28a745',
    '#17a2b8','#e91e63','#9c27b0','#5bc0de','#ff5722','#4caf50',
    '#2196f3','#ff9800','#8bc34a','#00bcd4','#ff69b4','#795548'
];

function createBigExplosion(li, color) {
    const particleCount = 18; // 更多粒子
    const rect = li.getBoundingClientRect();
    const containerRect = boxLi.getBoundingClientRect();
    const centerX = rect.left - containerRect.left + rect.width / 2;
    const centerY = rect.top - containerRect.top + rect.height / 2;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('big-particle'); // 独立类名
        particle.style.backgroundColor = color;
        particle.style.left = `${centerX}px`;
        particle.style.top = `${centerY}px`;
        
        // 【已缩小】爆炸范围
        const tx = (Math.random() - 0.5) * 200;
        const ty = (Math.random() - 0.5) * 200;
        
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        boxLi.appendChild(particle);
        setTimeout(() => particle.remove(), 1400);
    }
}

function updateAnimationStep(totalStep, round) {
    const fifthLiIndex = 4;
    const leftStartIndex = 3;
    const leftEndIndex = 0;
    const rightStartIndex = 5;
    const rightEndIndex = 8;
    const rotateDeg = round % 2 === 1 ? 0 : 45;

    lis.forEach((li, index) => {
        if (index !== fifthLiIndex) {
            li.style.opacity = 0;
            li.style.color = '#000';
            li.style.transform = 'rotate(0deg)';
        }
    });

    const currentLeftIndex = leftStartIndex - (totalStep % 4);
    const currentRightIndex = rightStartIndex + (totalStep % 4);
    const currentColor = colors[totalStep % colors.length];

    if (currentLeftIndex >= leftEndIndex && currentLeftIndex !== fifthLiIndex) {
        const li = lis[currentLeftIndex];
        li.style.opacity = 1;
        li.style.color = currentColor;
        li.style.transform = `rotate(${rotateDeg}deg)`;
        createBigExplosion(li, currentColor);
    }
    if (currentRightIndex <= rightEndIndex && currentRightIndex !== fifthLiIndex) {
        const li = lis[currentRightIndex];
        li.style.opacity = 1;
        li.style.color = currentColor;
        li.style.transform = `rotate(${rotateDeg}deg)`;
        createBigExplosion(li, currentColor);
    }
}

function startColorAnimation() {
    let totalStep = 0;
    let round = 1;
    const roundStepCount = 4;
    updateAnimationStep(totalStep, round);
    totalStep++;
    setInterval(() => {
        updateAnimationStep(totalStep, round);
        totalStep++;
        if (totalStep % roundStepCount === 0) round++;
    }, 1000);
}
startColorAnimation();

// ====================== 图片预览（不变） ======================
const imgPreview = document.getElementById('imgPreview');
const previewImg = document.getElementById('previewImg');
const spanElements = document.querySelectorAll('.bx1 span, .bx2 span, .bx3 span');
spanElements.forEach(span => {
    span.addEventListener('mouseover', function() {
        let imgSrc = this.getAttribute('data-img');
        if (!imgSrc) return;
        let shadowColor = this.getAttribute('data-shadow') || '#000000';
        previewImg.src = imgSrc;
        previewImg.style.filter = `drop-shadow(0px 20px 40px ${shadowColor}80)`;
        imgPreview.style.display = 'block';
    });
});

// ====================== 卡片粒子（独立名称，不冲突） ======================
const cards = document.querySelectorAll('.gr1, .gr2, .gr3, .gr4, .gr5, .gr6');
cards.forEach(card => {
    let lastMouseX = 50;
    let lastMouseY = 50;
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
        lastMouseX = e.clientX - rect.left;
        lastMouseY = e.clientY - rect.top;
    });
    card.addEventListener('mouseleave', (e) => {
        card.style.setProperty('--mouse-x', '50%');
        card.style.setProperty('--mouse-y', '50%');
        const particleCount = 20;
        const rect = card.getBoundingClientRect();
        const mouseX = lastMouseX;
        const mouseY = lastMouseY;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('card-particle'); // 独立
            const size = Math.random() * 10 + 3;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 40;
            particle.style.left = `${mouseX + Math.cos(angle) * distance}px`;
            particle.style.top = `${mouseY + Math.sin(angle) * distance}px`;
            card.appendChild(particle);
            setTimeout(() => particle.remove(), 800);
        }
    });
});

// ====================== 激光（不变） ======================
const container = document.getElementById('lasers');
let hue = 0;
let isSingleColor = true;
let singleColor = getRandomBrightColor();
let leftTimer, rightTimer;

function getRandomBrightColor() {
    const h = Math.random() * 360;
    return `hsl(${h}, 100%, ${50 + Math.random() * 10}%)`;
}
function startLasers() {
    if(leftTimer) clearInterval(leftTimer);
    if(rightTimer) clearInterval(rightTimer);
    if(isSingleColor){
        leftTimer = setInterval(createLeftLaser, 280);
        rightTimer = setInterval(createRightLaser, 280);
    }else{
        leftTimer = setInterval(createLeftLaser, 105);
        rightTimer = setInterval(createRightLaser, 105);
    }
}
function startColorCycle() {
    isSingleColor = true;
    singleColor = getRandomBrightColor();
    startLasers();
    setTimeout(() => {
        isSingleColor = false;
        hue = Math.random() * 360;
        startLasers();
        setTimeout(startColorCycle, 4000);
    }, 6000);
}
startColorCycle();

function getColor() {
    if (isSingleColor) return singleColor;
    hue += 4.5;
    if (hue > 360) hue = 0;
    return `hsl(${hue}, 100%, 55%)`;
}
function getRandomAngle() {
    const min = -60; const max = 30;
    return Math.random() * (max - min) + min;
}
function getRightAngle() {
    const min = -10; const max = 70;
    return Math.random() * (max - min) + min;
}
function createLeftLaser(){
    const l=document.createElement('div');
    l.classList.add('laser','laser-left');
    l.style.setProperty('--color', getColor());
    const angle1 = getRandomAngle() + 'deg';
    const angle2 = getRandomAngle() + 'deg';
    l.style.setProperty('--angle-start', angle1);
    l.style.setProperty('--angle-end', angle2);
    l.style.left='0'; l.style.bottom='0';
    l.style.transformOrigin='left bottom';
    const s=2.1+Math.random()*1.6,t=0.05+Math.random()*0.12;
    l.style.animationDuration=`${s}s,${t}s`;
    container.appendChild(l);
    setTimeout(()=>l.remove(),4500);
}
function createRightLaser(){
    const l=document.createElement('div');
    l.classList.add('laser','laser-right');
    l.style.setProperty('--color', getColor());
    const angle1 = getRightAngle() + 'deg';
    const angle2 = getRightAngle() + 'deg';
    l.style.setProperty('--angle-start', angle1);
    l.style.setProperty('--angle-end', angle2);
    l.style.right='0'; l.style.bottom='0';
    l.style.transformOrigin='right bottom';
    const s=2.1+Math.random()*1.6,t=0.05+Math.random()*0.12;
    l.style.animationDuration=`${s}s,${t}s`;
    container.appendChild(l);
    setTimeout(()=>l.remove(),4500);
}

const lyrics1 = [
    {time:4,en:"Caught in between every high and low",cn:"在起起落落之间徘徊"},
    {time:11,en:"I'm stuck in reverse but this dream I can't let go",cn:"我深陷困境 却不愿放弃这场梦"},
    {time:18,en:"So what if we right our wrongs?",cn:"若我们弥补过往的过错"},
    {time:22,en:"Could we leave the past behind?",cn:"能否放下不堪的过去"},
    {time:26,en:"I know that it's been so long but we should try",cn:"我知道已时隔许久 但我们仍该一试"},
    {time:33,en:"We used to float like butterflies like butterflies",cn:"我们曾如蝴蝶般自在飘荡"},
    {time:38,en:"Watching the world go by",cn:"静观世事流转"},
    {time:41,en:"Till we fall into the night just you and I",cn:"直至夜色降临 只剩你我相伴"},
    {time:46,en:"Keep getting lost in the light",cn:"沉醉在光影之中"},
    {time:49.5,en:"Let's go dance under silver skies",cn:"让我们在银白夜空下起舞"},
    {time:53.5,en:"Heart to heart 'til the end of time",cn:"心心相印 直至时光尽头"},
    {time:56.5,en:"And float like butterflies like butterflies",cn:"如蝴蝶般自在飘荡"},
    {time:61,en:"Watching the world go by",cn:"静观世事流转"},
    {time:72,en:"We used to float like butterflies like butterflies",cn:"我们曾如蝴蝶般自在飘荡"},
    {time:76,en:"Watching the world go by",cn:"静观世事流转"},
    {time:92,en:"Watching the world go by",cn:"静观世事流转"},
    {time:96,en:"Uh‑huh‑uh uh‑huh‑uh uh‑huh uh uh",cn:""},
    {time:103,en:"Uh‑huh‑uh uh‑huh‑uh",cn:""},
    {time:107,en:"Watching the world",cn:"静观这世间"},
    {time:109,en:"Hope there's a feeling and we find it deep within",cn:"愿我们能在心底寻得那份悸动"},
    {time:116,en:"And I won't stop believing that we can start again",cn:"我始终相信 我们可以重新开始"},
    {time:124,en:"So what if we right our wrongs?",cn:"若我们弥补过往的过错"},
    {time:128,en:"Could we leave the past behind?",cn:"能否放下不堪的过去"},
    {time:132,en:"I know that it's been so long but we should try",cn:"我知道已时隔许久 但我们仍该一试"},
    {time:139,en:"We used to float like butterflies like butterflies",cn:"我们曾如蝴蝶般自在飘荡"},
    {time:144,en:"Watching the world go by",cn:"静观世事流转"},
    {time:147,en:"Till we fall into the night just you and I",cn:"直至夜色降临 只剩你我相伴"},
    {time:152,en:"Keep getting lost in the light",cn:"沉醉在光影之中"},
    {time:155,en:"Let's go dance under silver skies",cn:"让我们在银白夜空下起舞"},
    {time:159,en:"Heart to heart 'til the end of time",cn:"心心相印 直至时光尽头"},
    {time:162,en:"And float like butterflies like butterflies",cn:"如蝴蝶般自在飘荡"},
    {time:167,en:"Watching the world go by",cn:"静观世事流转"},
    {time:182,en:"Watching the world go by",cn:"静观世事流转"},
    {time:186,en:"Uh‑huh‑uh uh‑huh‑uh uh‑huh uh uh",cn:""},
    {time:193,en:"Uh‑huh‑uh uh‑huh‑uh",cn:""},
    {time:192,en:"Watching the world go by",cn:"静观世事流转"}
];

const lyrics2 = [
    {time:4,en:"High hopes",cn:"满怀希冀"},
    {time:6,en:"Life's getting harder the harder I try",cn:"我越努力 生活越艰难"},
    {time:10,en:"I'm tryin' not to let go",cn:"我不愿就此放手"},
    {time:14,en:"But there's no place left to hide",cn:"却已无处可藏"},
    {time:18,en:"When the darkest of days leave us powerless",cn:"当至暗时刻让我们无力反抗"},
    {time:22,en:"And there's no escaping our heads' a mess",cn:"思绪混乱 无处可逃"},
    {time:25,en:"Holding on to that feeling inside our chest",cn:"坚守心底那份执念"},
    {time:29,en:"Hold on hold on",cn:"坚持下去"},
    {time:33,en:"I know you're sick and you're tired of hoping",cn:"我知道你早已厌倦满怀希望"},
    {time:37,en:"This love won't leave us broken",cn:"这份爱不会让我们支离破碎"},
    {time:40,en:"It's when we're drowning in these moments",cn:"即便我们深陷困境"},
    {time:44,en:"We got to look inside our hearts",cn:"我们也要遵从内心"},
    {time:48,en:"And even if the sky is falling",cn:"纵使天崩地裂"},
    {time:52,en:"This wasn't all for nothing",cn:"一切付出都不会白费"},
    {time:55,en:"To find the answers to all our problems",cn:"为了找寻所有问题的答案"},
    {time:59,en:"We got to look inside our hearts",cn:"我们要遵从内心"},
    {time:85,en:"To find the answers to all our problems",cn:"为了找寻所有问题的答案"},
    {time:89,en:"We got to look inside our hearts",cn:"我们要遵从内心"},
    {time:94,en:"Searching",cn:"不断寻觅"},
    {time:96,en:"In the unknown we don't know what we'll find",cn:"在未知之中 不知前路何方"},
    {time:100,en:"Tryna find our purpose",cn:"试着找寻人生的意义"},
    {time:104,en:"Find a place for you and I",cn:"为你我寻一处归宿"},
    {time:108,en:"When the darkest of days leave us powerless",cn:"当至暗时刻让我们无力反抗"},
    {time:112,en:"And there's no escaping our heads' a mess",cn:"思绪混乱 无处可逃"},
    {time:116,en:"Holding on to that feeling inside our chest",cn:"坚守心底那份执念"},
    {time:120,en:"Hold on hold on",cn:"坚持下去"},
    {time:123,en:"I know you're sick and you're tired of hoping",cn:"我知道你早已厌倦满怀希望"},
    {time:127,en:"This love won't leave us broken",cn:"这份爱不会让我们支离破碎"},
    {time:130,en:"It's when we're drowning in these moments",cn:"即便我们深陷困境"},
    {time:134,en:"We got to look inside our hearts",cn:"我们也要遵从内心"},
    {time:138,en:"And even if the sky is falling",cn:"纵使天崩地裂"},
    {time:142,en:"This wasn't all for nothing",cn:"一切付出都不会白费"},
    {time:145,en:"To find the answers to all our problems",cn:"为了找寻所有问题的答案"},
    {time:149,en:"We got to look inside our hearts",cn:"我们要遵从内心"},
    {time:160,en:"To find the answers to all our problems",cn:"为了找寻所有问题的答案"},
    {time:164,en:"We got to look inside our hearts",cn:"我们要遵从内心"},
    {time:182,en:"Inside our hearts",cn:"遵从内心"},
    {time:187,en:"When there's nowhere else to go",cn:"当我们走投无路"},
    {time:190,en:"Inside our hearts",cn:"遵从内心"},
    {time:194,en:"We got to look inside our hearts",cn:"我们要遵从内心"},
    {time:205,en:"To find the answers to all our problems",cn:"为了找寻所有问题的答案"},
    {time:209,en:"We got to look inside our hearts",cn:"我们要遵从内心"}
];

// 未来弹跳
const lyrics3 = [
    {time:1,en:"Absolute Music",cn:"纯音乐"}
];
const lyrics4 = [
    {time:1,en:"All day all night been looking all my life",cn:"整日整夜 我穷尽一生寻觅"},
    {time:5,en:"Trying to find something new",cn:"试图找寻全新的悸动"},
    {time:9,en:"Still lost but I I'll find my way tonight",cn:"依旧迷茫 但今夜我会找到方向"},
    {time:12,en:"And I know it's because of you",cn:"而我知道 只因有你"},
    {time:16,en:"Eyes are on me I can feel the fire",cn:"目光注视着我 我感受到炽热悸动"},
    {time:19,en:"Not like anything that I've ever known",cn:"是我从未体会过的感受"},
    {time:23,en:"Might be the one and only chance I get with you",cn:"这或许是我与你相遇的唯一契机"},
    {time:27,en:"And I'll regret it if I take it too slow",cn:"若我迟疑不前 定会抱憾终生"},
    {time:31,en:"Something in my body something that's in my soul",cn:"身心深处 灵魂之中有种悸动"},
    {time:35,en:"Tells me you're somebody someone I need to know",cn:"告诉我 你是我必须相知之人"},
    {time:38,en:"No I can't leave here sorry if I just let this go",cn:"我无法就此离去 不愿就此错过"},
    {time:42,en:"Don't wanna hear my heart say",cn:"不想听见心底的声音诉说"},
    {time:44,en:"I told you so",cn:"我早告诉过你"},
    {time:53,en:"No I can't leave here sorry if I just let this go",cn:"我无法就此离去 不愿就此错过"},
    {time:57,en:"Don't wanna hear my heart say",cn:"不想听见心底的声音诉说"},
    {time:59,en:"\"I told you so\"",cn:"我早告诉过你"},
    {time:60,en:"Told you so",cn:"早告诉过你"},
    {time:72,en:"Don't wanna hear my heart say",cn:"不想听见心底的声音诉说"},
    {time:74,en:"\"I told you so\"",cn:"我早告诉过你"},
    {time:87,en:"Don't wanna hear my heart say",cn:"不想听见心底的声音诉说"},
    {time:89,en:"\"I told you so\"",cn:"我早告诉过你"},
    {time:91,en:"Could run could hide but I won't sleep tonight",cn:"可以逃避躲藏 但今夜我彻夜难眠"},
    {time:95,en:"Wondering what did I lose?",cn:"思索我究竟错失了什么"},
    {time:98,en:"Oh no",cn:"噢不"},
    {time:99,en:"I can't deny no when that feeling's right",cn:"当心意真切 我无法否认"},
    {time:102,en:"I bet you'll feel the way I do",cn:"我相信你也与我感同身受"},
    {time:105,en:"Oh your eyes are on me I can feel the fire",cn:"你的目光注视着我 我感受到炽热悸动"},
    {time:109,en:"Not like anything that I've ever known",cn:"是我从未体会过的感受"},
    {time:113,en:"Might be the one and only chance I get with you",cn:"这或许是我与你相遇的唯一契机"},
    {time:116,en:"And I'll regret it if I take it too slow",cn:"若我迟疑不前 定会抱憾终生"},
    {time:120,en:"Something in my body something that's in my soul",cn:"身心深处 灵魂之中有种悸动"},
    {time:125,en:"Tells me you're somebody someone I need to know",cn:"告诉我 你是我必须相知之人"},
    {time:128,en:"No I can't leave here sorry if I just let this go",cn:"我无法就此离去 不愿就此错过"},
    {time:132,en:"Don't wanna hear my heart say",cn:"不想听见心底的声音诉说"},
    {time:134,en:"\"I told you so\"",cn:"我早告诉过你"},
    {time:144,en:"No I can't leave here sorry if I just let this go",cn:"我无法就此离去 不愿就此错过"},
    {time:147,en:"Don't wanna hear my heart say",cn:"不想听见心底的声音诉说"},
    {time:149,en:"\"I told you so\"",cn:"我早告诉过你"},
    {time:149.5,en:"Told you so",cn:"早告诉过你"},
    {time:162,en:"Don't wanna hear my heart say",cn:"不想听见心底的声音诉说"},
    {time:164,en:"\"I told you so\"",cn:"我早告诉过你"},
    {time:177,en:"Don't wanna hear my heart say",cn:"不想听见心底的声音诉说"},
    {time:179,en:"\"I told you so\"",cn:"我早告诉过你"}
];

// 未来锐舞
const lyrics5 = [
    {time:9,en:"Nothing could stop my head from turnin'",cn:"我无法停止神魂颠倒"},
    {time:12,en:"I never seen no voodoo like you do",cn:"从未见过像你这般迷人的魔力"},

    {time:16,en:"Too late to reverse it I heard it I want it",cn:"一切已无法挽回 我聆听着 渴望着"},
    {time:20,en:"I need it that voodoo like you do like you do",cn:"我需要着 你这般迷人的魔力"},

    {time:24,en:"Like voodoo",cn:"如同魔法"},
    {time:27,en:"Like voodoo",cn:"如同魔法"},
    {time:31,en:"Like voodoo",cn:"如同魔法"},
    {time:34.5,en:"Like voodoo",cn:"如同魔法"},

    {time:75,en:"Nothing could stop my head from turnin'",cn:"我无法停止神魂颠倒"},
    {time:78,en:"I never seen no voodoo like you do",cn:"从未见过像你这般迷人的魔力"},

    {time:83,en:"Too late to reverse it I heard it I want it",cn:"一切已无法挽回 我聆听着 渴望着"},
    {time:86,en:"I need it that voodoo like you do like you do",cn:"我需要着 你这般迷人的魔力"},

    {time:93,en:"Like you do",cn:"就像你那样"},
    {time:96,en:"Like you do",cn:"就像你那样"},
    {time:100,en:"Like you do",cn:"就像你那样"},
    {time:104,en:"Like you do",cn:"就像你那样"},

    {time:105,en:"Nothing could stop my head from turnin'",cn:"我无法停止神魂颠倒"},
    {time:108,en:"I never seen no voodoo like you do",cn:"从未见过像你这般迷人的魔力"},

    {time:112,en:"Too late to reverse it I heard it I want it",cn:"一切已无法挽回 我聆听着 渴望着"},
    {time:115,en:"I need it that voodoo like you do like you do",cn:"我需要着 你这般迷人的魔力"},

    {time:122,en:"Like you do",cn:"就像你那样"},
    {time:126,en:"Like you do",cn:"就像你那样"},
    {time:130,en:"Like you do",cn:"就像你那样"},
    {time:134,en:"Like you do",cn:"就像你那样"},
    {time:163,en:"Like you do",cn:"就像你那样"}
];
const lyrics6 = [
    {time:1,en:"Absolute Music",cn:"纯音乐"}
];

function render(el,list){
    el.innerHTML = "";
    list.forEach(i => {
        const d = document.createElement("div");
        d.className = "lyric-line";
        d.innerHTML = `<span class="en">${i.en}</span><span class="cn">${i.cn}</span>`;
        el.appendChild(d);
    });
}

const a1 = document.getElementById("audio1");
const a2 = document.getElementById("audio2");
const a3 = document.getElementById("audio3");
const a4 = document.getElementById("audio4");
const a5 = document.getElementById("audio5");
const a6 = document.getElementById("audio6");

const l1 = document.getElementById("lyric1");
const l2 = document.getElementById("lyric2");
const l3 = document.getElementById("lyric3");
const l4 = document.getElementById("lyric4");
const l5 = document.getElementById("lyric5");
const l6 = document.getElementById("lyric6");

render(l1,lyrics1);
render(l2,lyrics2);
render(l3,lyrics3);
render(l4,lyrics4);
render(l5,lyrics5);
render(l6,lyrics6);

let curLine1=-1,curLine2=-1,curLine3=-1,curLine4=-1,curLine5=-1,curLine6=-1;
const lineHeight = 50;

function setCenter(listEl, idx) {
    listEl.style.marginTop = `${55 - idx * lineHeight}px`;
}

// ===================== WebAudio =====================
const canvas = document.getElementById('waveCanvas');
const canvas2 = document.getElementById('waveCanvas2');
const canvas3 = document.getElementById('waveCanvas3');
const ctx = canvas.getContext('2d');
const ctx2 = canvas2.getContext('2d');
const ctx3 = canvas3.getContext('2d');

let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let analyser = audioCtx.createAnalyser();
analyser.fftSize = 1024;

let src1 = audioCtx.createMediaElementSource(a1);
let src2 = audioCtx.createMediaElementSource(a2);
let src3 = audioCtx.createMediaElementSource(a3);
let src4 = audioCtx.createMediaElementSource(a4);
let src5 = audioCtx.createMediaElementSource(a5);
let src6 = audioCtx.createMediaElementSource(a6);

let gain1 = audioCtx.createGain();
let gain2 = audioCtx.createGain();
let gain3 = audioCtx.createGain();
let gain4 = audioCtx.createGain();
let gain5 = audioCtx.createGain();
let gain6 = audioCtx.createGain();

gain1.gain.value=0;gain2.gain.value=0;gain3.gain.value=0;
gain4.gain.value=0;gain5.gain.value=0;gain6.gain.value=0;

src1.connect(gain1).connect(analyser);
src2.connect(gain2).connect(analyser);
src3.connect(gain3).connect(analyser);
src4.connect(gain4).connect(analyser);
src5.connect(gain5).connect(analyser);
src6.connect(gain6).connect(analyser);
analyser.connect(audioCtx.destination);

let waveAnim = null;
let currentGain = null;
let currentCanvas = canvas;
let currentCtx = ctx;

function getWaveColor() {
    const colors = ['#28a745','#ff9800','#00f','#90f','#ff0073','#ff5722','#0ff'];
    return colors[Math.floor(Math.random()*colors.length)];
}

function drawWave(){
    const w = currentCanvas.width = currentCanvas.offsetWidth;
    const h = currentCanvas.height = currentCanvas.offsetHeight;
    const buf = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteTimeDomainData(buf);

    currentCtx.clearRect(0,0,w,h);
    currentCtx.lineWidth = 2;
    currentCtx.strokeStyle = getWaveColor();
    currentCtx.beginPath();

    const dx = w / buf.length;
    let x = 0;
    for(let i=0;i<buf.length;i++){
        const v = buf[i]/128;
        const y = v * h/2;
        i===0 ? currentCtx.moveTo(x,y) : currentCtx.lineTo(x,y);
        x += dx;
    }
    currentCtx.stroke();
    waveAnim = requestAnimationFrame(drawWave);
}

function startWave(canvasEl, ctxEl){
    document.querySelectorAll('.wave-box').forEach(b => b.style.display = 'none');
    currentCanvas = canvasEl; currentCtx = ctxEl;
    currentCanvas.parentElement.style.display = 'block';
    cancelAnimationFrame(waveAnim); drawWave();
}
function stopWave(){
    document.querySelectorAll('.wave-box').forEach(b => b.style.display = 'none');
    cancelAnimationFrame(waveAnim);
}

// ===================== 互斥停止 =====================
function stopAllOther() {
    gain1.gain.value=0;gain2.gain.value=0;gain3.gain.value=0;
    gain4.gain.value=0;gain5.gain.value=0;gain6.gain.value=0;
    a1.pause();a2.pause();a3.pause();a4.pause();a5.pause();a6.pause();

    document.querySelectorAll(".record,.record2,.record3,.record4,.record5,.record6").forEach(r=>r.classList.remove("rotate"));
    document.querySelectorAll(".play-icon").forEach(btn=>btn.innerText="▶");

    a1.ontimeupdate=null;a2.ontimeupdate=null;a3.ontimeupdate=null;
    a4.ontimeupdate=null;a5.ontimeupdate=null;a6.ontimeupdate=null;

    curLine1=curLine2=curLine3=curLine4=curLine5=curLine6=-1;
    document.querySelectorAll(".lyric-line").forEach(x=>x.classList.remove("active"));
    stopWave(); currentGain = null;
}

// ===================== 顶部按钮 随机大阴影 =====================
const tabFuture = document.getElementById("tabFuture");
const tabProg = document.getElementById("tabProg");
const tabBass = document.getElementById("tabBass");
const boxm1 = document.getElementById("boxm1");
const boxm2 = document.getElementById("boxm2");
const boxm3 = document.getElementById("boxm3");

function clearAllTabShadows() {
  tabFuture.style.boxShadow = "none";
  tabProg.style.boxShadow = "none";
  tabBass.style.boxShadow = "none";
}

function getRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r},${g},${b})`;
}

// ===================== 五彩斑斓大量彩色线条 故障扫描特效 =====================
function createGlitchLines() {
  // 创建遮罩层
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.left = "0";
  overlay.style.top = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.pointerEvents = "none";
  overlay.style.zIndex = "9999";
  document.body.appendChild(overlay);

  // 生成35根彩色线条
  for(let i=0;i<35;i++){
    const line = document.createElement("div");
    const color = getRandomColor();
    const top = Math.random()*100+"%";
    const height = Math.random()*4+1+"px";
    const width = Math.random()*100+50+"%";
    const delay = Math.random()*0.15;

    line.style.position = "absolute";
    line.style.left = "-100%";
    line.style.top = top;
    line.style.width = width;
    line.style.height = height;
    line.style.background = color;
    line.style.boxShadow = `0 0 6px ${color}`;
    line.style.transition = `left 0.25s ease ${delay}s`;
    overlay.appendChild(line);

    // 线条滑入
    setTimeout(()=>{
      line.style.left = "100%";
    }, 10);
  }

  // 280ms后移除
  setTimeout(()=>overlay.remove(), 280);
}

function glitchSwitch(showBox){
  createGlitchLines();
  const allBox = [boxm1,boxm2,boxm3];
  allBox.forEach(b=>b.style.display="none");
  setTimeout(()=>{
    showBox.style.display="block";
  },180);
}

function showBox1(){
  clearAllTabShadows();
  glitchSwitch(boxm1);
  tabProg.style.boxShadow = `0 0 24px 8px ${getRandomColor()}`;
}
function showBox2(){
  clearAllTabShadows();
  glitchSwitch(boxm2);
  tabFuture.style.boxShadow = `0 0 24px 8px ${getRandomColor()}`;
}
function showBox3(){
  clearAllTabShadows();
  glitchSwitch(boxm3);
  tabBass.style.boxShadow = `0 0 24px 8px ${getRandomColor()}`;
}

showBox1();

tabFuture.onclick = ()=>{ stopAllOther(); showBox2(); }
tabProg.onclick = ()=>{ stopAllOther(); showBox1(); }
tabBass.onclick = ()=>{ stopAllOther(); showBox3(); }

// ===================== 6个播放函数 =====================
function togglePlay1(btn) {
    if(currentGain!==gain1)stopAllOther();
    if(a1.paused){audioCtx.resume();a1.play();gain1.gain.value=1;currentGain=gain1;
    document.querySelector(".record").classList.add("rotate");btn.innerText="||";startWave(canvas,ctx);
    a1.ontimeupdate=()=>{const t=a1.currentTime;let idx=-1;for(let i=0;i<lyrics1.length;i++)if(t>=lyrics1[i].time)idx=i;
    if(idx===curLine1)return;document.querySelectorAll("#lyric1 .lyric-line").forEach(x=>x.classList.remove("active"));
    if(idx>=0){document.querySelectorAll("#lyric1 .lyric-line")[idx].classList.add("active");setCenter(l1,idx);}curLine1=idx;}}
    else{a1.pause();gain1.gain.value=0;document.querySelector(".record").classList.remove("rotate");btn.innerText="▶";a1.ontimeupdate=null;stopWave();currentGain=null;}
}
function togglePlay2(btn) {
    if(currentGain!==gain2)stopAllOther();
    if(a2.paused){audioCtx.resume();a2.play();gain2.gain.value=1;currentGain=gain2;
    document.querySelector(".record2").classList.add("rotate");btn.innerText="||";startWave(canvas,ctx);
    a2.ontimeupdate=()=>{const t=a2.currentTime;let idx=-1;for(let i=0;i<lyrics2.length;i++)if(t>=lyrics2[i].time)idx=i;
    if(idx===curLine2)return;document.querySelectorAll("#lyric2 .lyric-line").forEach(x=>x.classList.remove("active"));
    if(idx>=0){document.querySelectorAll("#lyric2 .lyric-line")[idx].classList.add("active");setCenter(l2,idx);}curLine2=idx;}}
    else{a2.pause();gain2.gain.value=0;document.querySelector(".record2").classList.remove("rotate");btn.innerText="▶";a2.ontimeupdate=null;stopWave();currentGain=null;}
}
function togglePlay3(btn) {
    if(currentGain!==gain3)stopAllOther();
    if(a3.paused){audioCtx.resume();a3.play();gain3.gain.value=1;currentGain=gain3;
    document.querySelector(".record3").classList.add("rotate");btn.innerText="||";startWave(canvas2,ctx2);
    a3.ontimeupdate=()=>{const t=a3.currentTime;let idx=-1;for(let i=0;i<lyrics3.length;i++)if(t>=lyrics3[i].time)idx=i;
    if(idx===curLine3)return;document.querySelectorAll("#lyric3 .lyric-line").forEach(x=>x.classList.remove("active"));
    if(idx>=0){document.querySelectorAll("#lyric3 .lyric-line")[idx].classList.add("active");setCenter(l3,idx);}curLine3=idx;}}
    else{a3.pause();gain3.gain.value=0;document.querySelector(".record3").classList.remove("rotate");btn.innerText="▶";a3.ontimeupdate=null;stopWave();currentGain=null;}
}
function togglePlay4(btn) {
    if(currentGain!==gain4)stopAllOther();
    if(a4.paused){audioCtx.resume();a4.play();gain4.gain.value=1;currentGain=gain4;
    document.querySelector(".record4").classList.add("rotate");btn.innerText="||";startWave(canvas2,ctx2);
    a4.ontimeupdate=()=>{const t=a4.currentTime;let idx=-1;for(let i=0;i<lyrics4.length;i++)if(t>=lyrics4[i].time)idx=i;
    if(idx===curLine4)return;document.querySelectorAll("#lyric4 .lyric-line").forEach(x=>x.classList.remove("active"));
    if(idx>=0){document.querySelectorAll("#lyric4 .lyric-line")[idx].classList.add("active");setCenter(l4,idx);}curLine4=idx;}}
    else{a4.pause();gain4.gain.value=0;document.querySelector(".record4").classList.remove("rotate");btn.innerText="▶";a4.ontimeupdate=null;stopWave();currentGain=null;}
}
function togglePlay5(btn) {
    if(currentGain!==gain5)stopAllOther();
    if(a5.paused){audioCtx.resume();a5.play();gain5.gain.value=1;currentGain=gain5;
    document.querySelector(".record5").classList.add("rotate");btn.innerText="||";startWave(canvas3,ctx3);
    a5.ontimeupdate=()=>{const t=a5.currentTime;let idx=-1;for(let i=0;i<lyrics5.length;i++)if(t>=lyrics5[i].time)idx=i;
    if(idx===curLine5)return;document.querySelectorAll("#lyric5 .lyric-line").forEach(x=>x.classList.remove("active"));
    if(idx>=0){document.querySelectorAll("#lyric5 .lyric-line")[idx].classList.add("active");setCenter(l5,idx);}curLine5=idx;}}
    else{a5.pause();gain5.gain.value=0;document.querySelector(".record5").classList.remove("rotate");btn.innerText="▶";a5.ontimeupdate=null;stopWave();currentGain=null;}
}
function togglePlay6(btn) {
    if(currentGain!==gain6)stopAllOther();
    if(a6.paused){audioCtx.resume();a6.play();gain6.gain.value=1;currentGain=gain6;
    document.querySelector(".record6").classList.add("rotate");btn.innerText="||";startWave(canvas3,ctx3);
    a6.ontimeupdate=()=>{const t=a6.currentTime;let idx=-1;for(let i=0;i<lyrics6.length;i++)if(t>=lyrics6[i].time)idx=i;
    if(idx===curLine6)return;document.querySelectorAll("#lyric6 .lyric-line").forEach(x=>x.classList.remove("active"));
    if(idx>=0){document.querySelectorAll("#lyric6 .lyric-line")[idx].classList.add("active");setCenter(l6,idx);}curLine6=idx;}}
    else{a6.pause();gain6.gain.value=0;document.querySelector(".record6").classList.remove("rotate");btn.innerText="▶";a6.ontimeupdate=null;stopWave();currentGain=null;}
}

//白色盒子转变过渡
const box = document.querySelector('.whbox');
const winH = window.innerHeight;
window.addEventListener('scroll', () => {
  const rect = box.getBoundingClientRect();
  if (rect.top < winH - 150 && rect.bottom > 0) {
    box.classList.add('show');
  } else {
    box.classList.remove('show');
  }
});

//头部图片滑动效果
document.addEventListener('DOMContentLoaded', function() {
  const header = document.querySelector('.whbox header');
  const parallaxImg = document.querySelector('.mouse-parallax');
  // 改成30px
  const maxOffset = 20;

  header.addEventListener('mousemove', function(e) {
    const rect = header.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const ratioX = (mouseX - centerX) / centerX;
    const ratioY = (mouseY - centerY) / centerY;

    const offsetX = -ratioX * maxOffset;
    const offsetY = -ratioY * maxOffset;

    parallaxImg.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  });

  header.addEventListener('mouseleave', function() {
    parallaxImg.style.transform = 'translate(0, 0)';
  });
});


//文字滑动
let lastScroll = 0;
let currentMove = 0;
const maxMove = 180;
const step = 10;
const wenz2 = document.querySelector('.wenz2');
const wenz3 = document.querySelector('.wenz3');
const tup7 = document.querySelector('.tup7'); // 触发改为 tup7

// 状态标记
let wenz2Done = false;
let wenz3Done = false;

window.addEventListener('scroll', () => {
  const nowScroll = window.scrollY;
  const rect = tup7.getBoundingClientRect();
  const inRange = rect.top < window.innerHeight && rect.bottom > 0;

  if (inRange) {
    // 向下滚动：先 wenz2，后 wenz3
    if (nowScroll > lastScroll) {
      if (!wenz2Done) {
        if (currentMove < maxMove) {
          currentMove += step;
        } else {
          wenz2Done = true;
        }
        wenz2.style.transform = `translateX(-${currentMove}px)`;
      } else if (!wenz3Done) {
        if (currentMove < maxMove) {
          currentMove += step;
        } else {
          wenz3Done = true;
          wenz3.innerHTML = '<span class="love">Love</span> the World';
        }
        wenz3.style.transform = `translateX(${currentMove}px)`;
      }
    } 
    // 向上滚动：先 wenz3，后 wenz2
    else {
      if (wenz3Done) {
        if (currentMove > 0) {
          currentMove -= step;
        } else {
          wenz3Done = false;
          wenz3.textContent = "Explore the World";
        }
        wenz3.style.transform = `translateX(${currentMove}px)`;
      } else if (wenz2Done) {
        if (currentMove > 0) {
          currentMove -= step;
        } else {
          wenz2Done = false;
        }
        wenz2.style.transform = `translateX(-${currentMove}px)`;
      } else {
        currentMove = 0;
        wenz2.style.transform = `translateX(0)`;
        wenz3.style.transform = `translateX(0)`;
        wenz3.textContent = "Explore the World";
      }
    }
  } else {
    // 离开 tup7 区域全部重置
    currentMove = 0;
    wenz2Done = false;
    wenz3Done = false;
    wenz2.style.transform = `translateX(0)`;
    wenz3.style.transform = `translateX(0)`;
    wenz3.textContent = "Explore the World";
  }

  lastScroll = nowScroll;
});

// 获取所有二进制行数字变化
const rows = document.querySelectorAll('.sz1 div');

setInterval(() => {
    rows.forEach(row => {
        let bits = row.innerText.split('');
        let randomIndex = Math.floor(Math.random() * bits.length);
        bits[randomIndex] = bits[randomIndex] === '0' ? '1' : '0';
        
        let html = bits.map(bit => 
            `<span class="bit-${bit}">${bit}</span>`
        ).join('');
        
        row.innerHTML = html;
    });
}, 150);
// 监听滚动，控制 tup8 / tup9 滑入滑出
document.addEventListener('DOMContentLoaded', function() {
  const items = document.querySelectorAll(
    '.tup1, .tup2, .tup3, .tup4, .tup5, .tup6, .tup7, .tup8, .tup9'
  );

  function scrollAnimate() {
    items.forEach(el => {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      if (rect.top < windowHeight * 0.8 && rect.bottom > 0) {
        el.classList.add('show');
      } 
      else {
        el.classList.remove('show');
      }
    });
  }

  window.addEventListener('scroll', scrollAnimate);
  scrollAnimate();
});


//年计时
let year = 2013;
const minYear = 2013;
const maxYear = 2026;
const el = document.getElementById('yearNum');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

const yearMap = {
  2013: 'timsa',
  2014: 'timsb',
  2015: 'timsc',
  2016: 'timsd',
  2017: 'timse',
  2018: 'timsf',
  2019: 'timsg',
  2020: 'timsh',
  2021: 'timsi',
  2022: 'timsj',
  2023: 'timsk',
  2024: 'timsl',
  2025: 'timsm',
  2026: 'timsn'
};

let timer = setInterval(autoRun, 3000);

function update() {
  el.textContent = year;
  switchContent();
}

function autoRun() {
  year++;
  if (year > maxYear) year = minYear;
  update();
}

function switchContent() {
  Object.values(yearMap).forEach(cls => {
    document.querySelector(`.${cls}`).classList.remove('active');
  });
  const curr = yearMap[year];
  if (curr) document.querySelector(`.${curr}`).classList.add('active');
}

prevBtn.onclick = () => {
  year--;
  if (year < minYear) year = maxYear;
  update();
};

nextBtn.onclick = () => {
  year++;
  if (year > maxYear) year = minYear;
  update();
};

// ✅ 只绑定 tup11 ~ tup37，绝对不会误触其他图片
const targetImages = [
  "tup11","tup12","tup13","tup14","tup15","tup16","tup17","tup18","tup19","tup20",
  "tup21","tup22","tup23","tup24","tup25","tup26","tup27","tup28","tup29","tup30",
  "tup31","tup32","tup33","tup34","tup35","tup36","tup37"
];
targetImages.forEach(className => {
  const el = document.querySelector(`.${className}`);
  if (el) {
    el.addEventListener("mouseenter", () => clearInterval(timer));
    el.addEventListener("mouseleave", () => timer = setInterval(autoRun, 3000));
  }
});

update();


document.addEventListener('DOMContentLoaded', function () {
  const items = document.querySelectorAll('.zjt1, .zjt2, .zjt3, .zjt4, .zjt5, .zjt6, .zjt7, .zjt8');

  function scrollAnimate() {
    items.forEach(el => {
      const rect = el.getBoundingClientRect();
      const winH = window.innerHeight;
      if (rect.top < winH * 0.8 && rect.bottom > 0) {
        el.classList.add('show');
      } else {
        el.classList.remove('show');
      }
    });
  }

  window.addEventListener('scroll', scrollAnimate);
  scrollAnimate();
});

