const countryKeys = ['china', 'india', 'indonesia', 'thailand', 'korea', 'japan'], countryData = {
    china: { 
        title: "China —<br>ancient jade gates,crimson lantern shadows 🏮 ", 
        image: "china-roof.png", 
        chars: ["华夏文明", "丝绸之路", "飞檐重翘", "江山如画"],
        facts: ["Morning: Mist gathers over undulating layered roofline eaves.", "Afternoon: Glazed golden courtyard tiles reflect radiant neon grids.", "Evening: Silk-road calligraphy maps glow under modern skyscraper illumination."]
    },
    india: { 
        title: "India —<br>sacred<br>chhatri domes,<br>slokas, carved<br>sandstone<br>heritage ૐ🚩  ", 
  
        image: "india-roof.png", 
        chars: ["नमस्ते", "शान्तिः", "सत्य메व", "भारत"],
        facts: ["Morning: Early sun rays pierce ornate carved chhatri domes.", "Afternoon: Sandstone mirrors geometric shadows along dynamic stepwells.", "Evening: Saffron twilight silhouettes sharp contemporary architectural frameworks."]
    },
    indonesia: { 
        title: "Indonesia —<br>emerald volcanic peaks<br>turqouise island waters 🌋 ",
        image: "indonesia-roof.png", chars: ["Nusantara", "ꦤꦸꦱꦤ꧀ꦠ", "ꦥꦸꦱꦏ", "ꦨꦶꦤ꧀ꦤꦺ"],
        facts: ["Morning: Volcanic mist outlines dramatic sweeping maritime horn vectors.", "Afternoon: Tropical sunlight ripples across green volcanic stone facades.", "Evening: Minimalist eco-structures catch refreshing waves from dark indigo coastlines."]
    },
    thailand: { 
        title: "Thailand —<br>serene<br>flame gables,<br>spires, and<br>meditative<br>lotus balance 🐘", 
        image: "thailand-roof.png", 
        chars: ["สวัสดี", "เมืองไทย", "สยาม", "ความสงบ"],
        facts: ["Morning: Dew settles quietly on high-pitched gilded flame gables.", "Afternoon: Lotus blossoms catch geometric light inside mirrors-of-glass shrines.", "Evening: Saffron spires reflect vibrant modern capital canal currents."]
    },
    korea: { 
        title: "Korea —<br>quiet<br>hanok curves,<br>clay tiles,<br>seasonal<br>reflections 🍚", 
        image: "korea-roof.png", 
        chars: ["한옥의기와", "푸른하늘", "아름다운", "경복궁"],
        facts: ["Morning: Hanok clay tiles gleam under soft monochrome fog contours.", "Afternoon: Symmetrical dancheong patterns mesh with sharp glass tech hubs.", "Evening: Asymmetrical mountain shadows framework illuminated sleek city skylines."]
    },
    japan: { 
        title: "Japan —<br>transient<br>zen pagodas,<br>timber craft,<br>and silent<br>haiku space 🍵 ", 
        image: "japan-roof.png", 
        chars: ["五重塔", "禅の心", "桜舞う", "古都"],
        facts: ["Morning: Moss gardens catch fleeting light beneath timber beams.", "Afternoon: Cedar wood shadows fall across modern asymmetrical plazas.", "Evening: Crystalline glass lanterns paint stark silhouettes against winter sun sets."]
    }
};

let currentCountryIndex = 0, trackedCharacters = [], mousePos = { x: -1000, y: -1000 }, isTransitioning = false, lastSoundTime = 0;
const $ = id => document.getElementById(id), stage = $('chime-stage'), roofImage = $('roof-image'), countryTitle = $('country-title'), navDots = document.querySelectorAll('.nav-dot');

// Secure insertion mapping alignment inside the structural text blocks parent
const countryFact = document.createElement('p');
countryTitle.parentNode.appendChild(countryFact);

const getTimeIndex = () => {
    const hr = new Date().getHours();
    return hr >= 5 && hr < 12 ? 0 : hr >= 12 && hr < 17 ? 1 : 2;
};

Object.keys(countryData).forEach(k => countryData[k].sounds = [new Audio(`${k}1.mp3`), new Audio(`${k}2.mp3`)]);

function playRegionalChime(key, vel, isMusic = false) {
    const now = performance.now(), s = countryData[key].sounds[isMusic ? 1 : 0];
    if (isMusic) { s.volume = 0.35; s.loop = true; s.play().catch(() => {}); return; }
    if ((!s.paused && s.currentTime > 0) || now - lastSoundTime <= 180) return;
    s.volume = Math.min(0.12 + (vel * 0.05), 0.6); s.currentTime = 0; s.play().catch(() => {}); lastSoundTime = now;
}

function buildChimeThreads(arr, anim = false) {
    stage.innerHTML = ''; trackedCharacters = [];
    const tc = 26, w = stage.clientWidth || 600, h = stage.clientHeight || 320;
    
    for (let i = 0; i < tc; i++) {
        const p = arr[i % arr.length], bx = ((14 + (i * (72 / (tc - 1)))) / 100) * w;
        for (let j = 0; j < p.length; j++) {
            const el = document.createElement('span'), d = j / (p.length - 1 || 1), by = d * (h - 30);
            el.className = 'chime-char'; el.textContent = p.charAt(j); 
            Object.assign(el.style, { left: '0px', top: '0px', opacity: anim ? '0' : '0.45' });
            
            if (anim) { 
                el.style.transform = "translate3d(0,-15px,0) scale(0.9)"; 
                setTimeout(() => { if (!isTransitioning) Object.assign(el.style, { opacity: "0.45" }); }, i * 8 + j * 12); 
            } else el.style.opacity = "0.45";
            
            stage.appendChild(el); 
            
            trackedCharacters.push({ 
                element: el, col: i, row: j, baseX: bx, baseY: by, 
                x: bx, y: by, oldX: bx, oldY: by, depth: d, 
                targetRestLength: ((h - 30) / p.length) * 0.98
            });
        }
    }
}

// UNIFIED TOUCH AND MOUSE HANDLER
const handleInputMovement = (clientX, clientY) => {
    if (isTransitioning) return;
    const r = stage.getBoundingClientRect();
    mousePos.x = clientX - r.left;
    mousePos.y = clientY - r.top;
};

document.addEventListener('mousemove', e => handleInputMovement(e.clientX, e.clientY));
document.addEventListener('touchmove', e => {
    if (e.touches.length > 0) handleInputMovement(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: true });

const clearInputCoordinates = () => { mousePos = { x: -1000, y: -1000 }; };
document.addEventListener('mouseleave', clearInputCoordinates);
document.addEventListener('touchend', clearInputCoordinates);

window.addEventListener('resize', () => {
    if (!trackedCharacters.length) return;
    const w = stage.clientWidth, h = stage.clientHeight;
    trackedCharacters.forEach(m => {
        const dx = m.x - m.baseX, dy = m.y - m.baseY;
        m.baseX = ((14 + (m.col * (72 / 25))) / 100) * w; 
        m.baseY = m.depth * (h - 30); 
        m.x = m.baseX + dx; m.y = m.baseY + dy;
    });
});

// SUBTLE RAINDROP WATER DISPERSION PHYSICS MACHINE
function updatePhysicsEngineLoop() {
    const k = countryKeys[currentCountryIndex], w = stage.clientWidth, h = stage.clientHeight;
    const gravity = 0.35, friction = 0.92, radius = 6;

    trackedCharacters.forEach(m => {
        if (m.row === 0) return;

        let vx = (m.x - m.oldX) * friction;
        let vy = (m.y - m.oldY) * friction;

        m.oldX = m.x; m.oldY = m.y;
        m.x += vx; m.y += vy + gravity;

        const dx = m.x - mousePos.x, dy = m.y - mousePos.y, dist = Math.sqrt(dx * dx + dy * dy);
        const dispersionRadius = 65; 

        if (dist < dispersionRadius && !isTransitioning) {
            const proximityFactor = (dispersionRadius - dist) / dispersionRadius;
            const rippleForce = proximityFactor * 2.2 * (0.5 + m.depth * 0.5);
            
            m.x += (dist > 0 ? (dx / dist) : 0) * rippleForce;
            m.y += (dist > 0 ? (dy / dist) : 0) * rippleForce * 0.5;
        }
    });

    for (let pass = 0; pass < 4; pass++) {
        trackedCharacters.forEach(m => {
            if (m.row === 0) { m.x = m.baseX; m.y = m.baseY; return; }
            const parent = trackedCharacters.find(p => p.col === m.col && p.row === m.row - 1);
            if (!parent) return;

            const dx = m.x - parent.x, dy = m.y - parent.y, dist = Math.sqrt(dx * dx + dy * dy);
            if (dist === 0) return;
            const diff = m.targetRestLength - dist;
            const percent = (diff / dist) * 0.5;
            const offsetX = dx * percent, offsetY = dy * percent;

            m.x += offsetX; m.y += offsetY;
            if (parent.row !== 0) { parent.x -= offsetX; parent.y -= offsetY; }
        });
    }

    trackedCharacters.forEach(m => {
        let vx = m.x - m.oldX, vy = m.y - m.oldY;
        if (m.x < radius) { m.x = radius; m.oldX = m.x + Math.abs(vx) * 0.6; } 
        else if (m.x > w - radius) { m.x = w - radius; m.oldX = m.x - Math.abs(vx) * 0.6; }
        if (m.y < radius) { m.y = radius; m.oldY = m.y + Math.abs(vy) * 0.6; } 
        else if (m.y > h - radius) { m.y = h - radius; m.oldY = m.y - Math.abs(vy) * 0.6; }

        m.element.style.transform = `translate3d(${m.x}px, ${m.y}px, 0)`;

        const currentVelocity = Math.sqrt(vx * vx + vy * vy);
        const act = currentVelocity > 1.4 && !isTransitioning;
        Object.assign(m.element.style, { color: act ? '#b83b3b' : '', opacity: act ? '1' : '0.45' });
        
        if (act && currentVelocity > 2.5) playRegionalChime(k, currentVelocity, false);
    });

    requestAnimationFrame(updatePhysicsEngineLoop);
}
requestAnimationFrame(updatePhysicsEngineLoop);

function transitionCountry(k) {
    const d = countryData[k]; if (!d || isTransitioning) return; isTransitioning = true; clearInputCoordinates();
    countryData[countryKeys[currentCountryIndex]].sounds.forEach(s => { s.pause(); s.currentTime = 0; });
    currentCountryIndex = countryKeys.indexOf(k);
    navDots.forEach((dot, idx) => dot.classList.toggle('active', idx === currentCountryIndex));
    trackedCharacters.forEach(m => setTimeout(() => { if (m.element) Object.assign(m.element.style, { opacity: "0" }); }, m.col * 6));
    Object.assign(countryTitle.style, { opacity: '0', transform: 'translateY(-4px)' }); 
    Object.assign(countryFact.style, { opacity: '0', transform: 'translateY(4px)' });
    Object.assign(roofImage.style, { transform: "scale(0.97) translateY(6px)", opacity: '0' });
    setTimeout(() => {
        countryTitle.innerHTML = d.title; roofImage.src = d.image; roofImage.alt = k;
        countryFact.textContent = d.facts[getTimeIndex()];
        buildChimeThreads(d.chars, true); playRegionalChime(k, 0, true);
Object.assign(countryTitle.style, { opacity: '1', transform: 'translateY(0)' });Object.assign(countryFact.style, { opacity: '0.85', transform: 'translateY(0)' });Object.assign(roofImage.style, { transform: "scale(1) translateY(0)", opacity: '0.98' });setTimeout(() => isTransitioning = false, 400);}, 600);}const bindClick = (btn, dir) => btn && btn.addEventListener('click', () => { if (isTransitioning) return; let idx = currentCountryIndex + dir; if (idx < 0) idx = countryKeys.length - 1; if (idx >= countryKeys.length) idx = 0; transitionCountry(countryKeys[idx]); });bindClick($('prev-btn'), -1); bindClick($('next-btn'), 1);navDots.forEach(dot => dot.addEventListener('click', e => { if (!isTransitioning) { const t = e.target.getAttribute('data-country'); if (t && t !== countryKeys[currentCountryIndex]) transitionCountry(t); } }));window.addEventListener('DOMContentLoaded', () => {buildChimeThreads(countryData.china.chars, false);countryFact.textContent = countryData.china.facts[getTimeIndex()];document.addEventListener('click', () => { if(!isTransitioning && countryData.china.sounds.paused) playRegionalChime('china', 0, true); }, { once: true });});