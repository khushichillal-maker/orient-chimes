const countryKeys = ['china', 'india', 'indonesia', 'thailand', 'korea', 'japan'], countryData = {
    china: { 
        title: "China —<br>golden<br>courtyards...", desc: "Woven together by binding stories.", image: "china-roof.png", chars: ["华夏文明", "丝绸之路", "飞檐重翘", "江山如画"],
        facts: ["Morning: Mist gathers over undulating layered roofline eaves.", "Afternoon: Glazed golden courtyard tiles reflect radiant neon grids.", "Evening: Silk-road calligraphy maps glow under modern skyscraper illumination."]
    },
    india: { 
        title: "India —<br>sacred<br>domes...", desc: "Resonating structural verses.", image: "india-roof.png", chars: ["नमस्ते", "शान्तिः", "सत्यमेव", "भारत"],
        facts: ["Morning: Early sun rays pierce ornate carved chhatri domes.", "Afternoon: Sandstone mirrors geometric shadows along dynamic stepwells.", "Evening: Saffron twilight silhouettes sharp contemporary architectural frameworks."]
    },
    indonesia: { 
        title: "Indonesia —<br>mystic...", desc: "Sweeping upward vectors.", image: "indonesia-roof.png", chars: ["Nusantara", "ꦤꦸꦱꦤ꧀ꦠ", "ꦥꦸꦱꦏ", "ꦨꦶꦤ꧀ꦤꦺ"],
        facts: ["Morning: Volcanic mist outlines dramatic sweeping maritime horn vectors.", "Afternoon: Tropical sunlight ripples across green volcanic stone facades.", "Evening: Minimalist eco-structures catch refreshing waves from dark indigo coastlines."]
    },
    thailand: { 
        title: "Thailand —<br>serene...", desc: "Golden architectural peaks.", image: "thailand-roof.png", chars: ["สวัสดี", "เมืองไทย", "สยาม", "ความสงบ"],
        facts: ["Morning: Dew settles quietly on high-pitched gilded flame gables.", "Afternoon: Lotus blossoms catch geometric light inside mirrors-of-glass shrines.", "Evening: Saffron spires reflect vibrant modern capital canal currents."]
    },
    korea: { 
        title: "Korea —<br>quiet...", desc: "Gentle horizontal eaves.", image: "korea-roof.png", chars: ["한옥의기와", "푸른하늘", "아름다운", "경복궁"],
        facts: ["Morning: Hanok clay tiles gleam under soft monochrome fog contours.", "Afternoon: Symmetrical dancheong patterns mesh with sharp glass tech hubs.", "Evening: Asymmetrical mountain shadows framework illuminated sleek city skylines."]
    },
    japan: { 
        title: "Japan —<br>transient...", desc: "Minimal frameworks structural design.", image: "japan-roof.png", chars: ["五重塔", "禅の心", "桜舞う", "古都"],
        facts: ["Morning: Moss gardens catch fleeting light beneath timber beams.", "Afternoon: Cedar wood shadows fall across modern asymmetrical plazas.", "Evening: Crystalline glass lanterns paint stark silhouettes against winter sun sets."]
    }
};

let currentCountryIndex = 0, trackedCharacters = [], mousePos = { x: -1000, y: -1000 }, isTransitioning = false, lastSoundTime = 0;
const $ = id => document.getElementById(id), stage = $('chime-stage'), roofImage = $('roof-image'), countryTitle = $('country-title'), countryDesc = $('country-desc'), navDots = document.querySelectorAll('.nav-dot');

// Create the dynamic fact element block programmatically right below the title layout frame
const countryFact = document.createElement('p');
Object.assign(countryFact.style, { fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase', opacity: '0.8', marginTop: '12px', fontStyle: 'italic', transition: 'opacity 0.4s ease, transform 0.4s ease', color: '#8c2222', maxWidth: '340px', lineHeight: '1.4' });
countryTitle.parentNode.appendChild(countryFact);

// Evaluates the current local system hour block to slice out the temporal index state variables
const getTimeIndex = () => {
    const hr = new Date().getHours();
    return hr >= 5 && hr < 12 ? 0 : hr >= 12 && hr < 17 ? 1 : 2; // Morning (5-11), Afternoon (12-16), Evening/Night (17+)
};

Object.keys(countryData).forEach(k => countryData[k].sounds = [new Audio(`${k}1.mp3`), new Audio(`${k}2.mp3`)]);

function playRegionalChime(key, vel, isMusic = false) {
    const now = performance.now(), s = countryData[key].sounds[isMusic ? 1 : 0];
    if (isMusic) { s.volume = 0.35; s.loop = true; s.play().catch(() => {}); return; }
    if ((!s.paused && s.currentTime > 0) || now - lastSoundTime <= 180) return;
    s.volume = Math.min(0.15 + (vel * 0.07), 0.7); s.currentTime = 0; s.play().catch(() => {}); lastSoundTime = now;
}

function buildChimeThreads(arr, anim = false) {
    stage.innerHTML = ''; trackedCharacters = [];
    const tc = 30, w = stage.clientWidth || 600, h = stage.clientHeight || 360;
    for (let i = 0; i < tc; i++) {
        const p = arr[i % arr.length], bx = ((12 + (i * (76 / (tc - 1)))) / 100) * w;
        for (let j = 0; j < p.length; j++) {
            const el = document.createElement('span'), d = j / (p.length - 1 || 1), by = d * (h - 40);
            el.className = 'chime-char'; el.textContent = p.charAt(j); Object.assign(el.style, { left: `${bx}px`, top: `${by}px`, opacity: anim ? '0' : '0.45' });
            if (anim) { el.style.transform = "translate3d(0,-20px,0) scale(0.85)"; setTimeout(() => { if (!isTransitioning) Object.assign(el.style, { opacity: "0.45", transform: "translate3d(0,0,0) scale(1)" }); }, i * 10 + j * 18); }
            stage.appendChild(el); trackedCharacters.push({ element: el, col: i, row: j, baseX: bx, baseY: by, x: bx, y: by, vx: 0, depth: d });
        }
    }
}

const updateMouse = e => { if (!isTransitioning) { const r = stage.getBoundingClientRect(); mousePos = { x: e.clientX - r.left, y: e.clientY - r.top }; } };
document.addEventListener('mousemove', updateMouse);
document.addEventListener('mouseleave', () => mousePos = { x: -1000, y: -1000 });

window.addEventListener('resize', () => {
    if (!trackedCharacters.length) return;
    const w = stage.clientWidth, h = stage.clientHeight;
    trackedCharacters.forEach(m => {
        const dx = m.x - m.baseX; m.baseX = ((12 + (m.col * (76 / 29))) / 100) * w; m.baseY = m.depth * (h - 40); m.x = m.baseX + dx; m.y = m.baseY;
        Object.assign(m.element.style, { left: `${m.baseX}px`, top: `${m.baseY}px` });
    });
});

function updatePhysicsEngineLoop() {
    const k = countryKeys[currentCountryIndex];
    trackedCharacters.forEach(m => {
        const dx = m.x - mousePos.x, dy = m.y - mousePos.y, dist = Math.sqrt(dx * dx + dy * dy);
        let px = (dist < 130 && !isTransitioning) ? ((130 - dist) / 130) * 120 * (0.2 + m.depth * 1.5) * (dx > 0 ? 1 : -1) : 0;
        m.vx = (m.vx + (m.baseX - m.x) * 0.08 + px * 0.3) * 0.88;
    });
    trackedCharacters.forEach((m, idx) => {
        const dn = trackedCharacters[idx + 1], rt = trackedCharacters.find(n => n.col === m.col + 1 && n.row === m.row);
        if (dn && dn.col === m.col) { const d = dn.x - m.x; m.vx += d * 0.06; dn.vx -= d * 0.06; }
        if (rt) { const d = (rt.x - m.x) - (rt.baseX - m.baseX); m.vx += d * 0.03; rt.vx -= d * 0.03; }
    });
    trackedCharacters.forEach(m => {
        m.x = m.row === 0 ? m.baseX : m.x + m.vx; if (m.row === 0) m.vx = 0;
        m.element.style.transform = `translate3d(${m.x - m.baseX}px,0,0) rotate(${m.vx * 0.5}deg)`;
        const act = Math.abs(m.vx) > 1.2 && !isTransitioning; Object.assign(m.element.style, { color: act ? '#b83b3b' : '', opacity: act ? '1' : '' });
        if (act && Math.abs(m.vx) > 2.3) playRegionalChime(k, Math.abs(m.vx), false);
    });
    requestAnimationFrame(updatePhysicsEngineLoop);
}
requestAnimationFrame(updatePhysicsEngineLoop);

function transitionCountry(k) {
    const d = countryData[k]; if (!d || isTransitioning) return; isTransitioning = true; mousePos = { x: -1000, y: -1000 };
    countryData[countryKeys[currentCountryIndex]].sounds.forEach(s => { s.pause(); s.currentTime = 0; });
    currentCountryIndex = countryKeys.indexOf(k);
    navDots.forEach((dot, idx) => dot.classList.toggle('active', idx === currentCountryIndex));
    trackedCharacters.forEach(m => setTimeout(() => { if (m.element) Object.assign(m.element.style, { opacity: "0", transform: `translate3d(${m.x - m.baseX}px,25px,0) scale(0.85)` }); }, m.col * 8));
    
    // Animate out text elements seamlessly
    Object.assign(countryTitle.style, { opacity: '0', transform: 'translateY(-5px)' }); 
    Object.assign(countryFact.style, { opacity: '0', transform: 'translateY(5px)' });
    Object.assign(countryDesc.style, { opacity: '0' }); 
    Object.assign(roofImage.style, { transform: "scale(0.96) translateY(8px)", opacity: '0' });
    
    setTimeout(() => {
        countryTitle.innerHTML = d.title; 
        countryDesc.textContent = d.desc; 
        roofImage.src = d.image; 
        roofImage.alt = k;
        
        // Dynamically extract and assign the precise timeline fact
        countryFact.textContent = d.facts[getTimeIndex()];
        
        buildChimeThreads(d.chars, true); 
        playRegionalChime(k, 0, true);
        
        Object.assign(countryTitle.style, { opacity: '1', transform: 'translateY(0)' }); 
        Object.assign(countryFact.style, { opacity: '0.85', transform: 'translateY(0)' });
        Object.assign(countryDesc.style, { opacity: '0.6' }); 
        Object.assign(roofImage.style, { transform: "scale(1) translateY(0)", opacity: '0.98' });
        
        setTimeout(() => isTransitioning = false, 400);
    }, 600);
}

const bindClick = (btn, dir) => btn && btn.addEventListener('click', () => { if (isTransitioning) return; let idx = currentCountryIndex + dir; if (idx < 0) idx = countryKeys.length - 1; if (idx >= countryKeys.length) idx = 0; transitionCountry(countryKeys[idx]); });
bindClick($('prev-btn'), -1); bindClick($('next-btn'), 1);
navDots.forEach(dot => dot.addEventListener('click', e => { if (!isTransitioning) { const t = e.target.getAttribute('data-country'); if (t && t !== countryKeys[currentCountryIndex]) transitionCountry(t); } }));

window.addEventListener('DOMContentLoaded', () => { 
    buildChimeThreads(countryData.china.chars, false);
    countryFact.textContent = countryData.china.facts[getTimeIndex()]; // Init the initial fact string frame
document.addEventListener('click', () => { if(!isTransitioning && countryData.china.sounds.paused) playRegionalChime('china', 0, true); }, { once: true });});
