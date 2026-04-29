let currentReciter = 'minshawi';
let currentSurah = null;
let currentAyah = 1;
let currentAyahData = null;
let audioElement = null;
let surahsList = [];
let currentGlobalAyah = null;

// ══════════════════════════════════════
//  متغيرات قسم السورة كاملة (استماع)
// ══════════════════════════════════════
let fullSurahAudio = null;
let fullSurahPlaying = false;
let fullSurahSelectedSurah = null;
let fullSurahReciter = 'minshawi';
let fullSurahData = null;
let fullSurahCurrentAyahIdx = 0;
let fullSurahAyahList = [];

document.addEventListener('DOMContentLoaded', async function() {
    currentReciter = 'minshawi';
    await loadSurahs();
    loadReciters();
    setupEventListeners();
    window.__loadQuickAyah = loadQuickAyah;
});

async function loadSurahs() {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);
        const response = await fetch(QuranConfig.apis.surahs(), { signal: controller.signal });
        clearTimeout(timeout);
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const data = await response.json();
        if (data.data && data.data.length) {
            surahsList = data.data;
            window.surahsList = surahsList;
            populateSurahSelect();
            populateFullSurahSelects();
        } else {
            throw new Error('بيانات السور فارغة');
        }
    } catch (error) {
        console.error('فشل تحميل السور:', error);
        surahsList = [];
        window.surahsList = [];
        const sel = document.getElementById('surahSelect');
        if (sel) sel.innerHTML = '<option value="">⚠️ تعذر تحميل السور — تحقق من الاتصال</option>';
    }
}

function populateSurahSelect() {
    const surahSelect = document.getElementById('surahSelect');
    if (!surahSelect) return;
    surahSelect.innerHTML = '<option value="">-- اختر السورة --</option>';
    surahsList.forEach(surah => {
        const option = document.createElement('option');
        option.value = surah.number;
        option.textContent = surah.number + '. ' + surah.name + ' (' + surah.englishName + ') - ' + surah.numberOfAyahs + ' آية';
        surahSelect.appendChild(option);
    });
    surahSelect.addEventListener('change', function() {
        const n = parseInt(this.value);
        if (n) {
            updateSurahInfo(n);
            const ayahInput = document.getElementById('ayahInSurah');
            if (ayahInput) { ayahInput.max = getSurahAyahCount(n); ayahInput.value = 1; }
            updateAyahRange(n);
        } else {
            hideSurahInfo();
        }
    });
}

function populateFullSurahSelects() {
    const readSel  = document.getElementById('fullReadSurahSelect');
    const audioSel = document.getElementById('fullAudioSurahSelect');
    const audioRecSel = document.getElementById('fullAudioReciterSelect');

    [readSel, audioSel].forEach(sel => {
        if (!sel) return;
        sel.innerHTML = '<option value="">-- اختر السورة --</option>';
        surahsList.forEach(s => {
            const o = document.createElement('option');
            o.value = s.number;
            o.textContent = s.number + '. ' + s.name + ' - ' + s.numberOfAyahs + ' آية';
            sel.appendChild(o);
        });
    });

    if (audioRecSel) {
        audioRecSel.innerHTML = '';
        const grouped = {};
        Object.values(QuranConfig.reciters).forEach(r => {
            const g = r.style || 'مرتل';
            if (!grouped[g]) grouped[g] = [];
            grouped[g].push(r);
        });
        Object.entries(grouped).forEach(([groupName, reciters]) => {
            const optgroup = document.createElement('optgroup');
            optgroup.label = '— ' + groupName + ' —';
            reciters.forEach(r => {
                const o = document.createElement('option');
                o.value = r.id;
                o.textContent = r.name;
                optgroup.appendChild(o);
            });
            audioRecSel.appendChild(optgroup);
        });
        audioRecSel.value = fullSurahReciter;
        audioRecSel.addEventListener('change', function() {
            fullSurahReciter = this.value;
            showToast('تم اختيار: ' + (QuranConfig.reciters[this.value]?.name || ''), 'success');
        });
    }

    if (readSel) {
        readSel.addEventListener('change', function() {
            const n = parseInt(this.value);
            if (n) showFullSurahReadInfo(n);
        });
    }
    if (audioSel) {
        audioSel.addEventListener('change', function() {
            const n = parseInt(this.value);
            if (n) {
                showFullSurahAudioInfo(n);
                resetFullAudioPlayer();
            }
        });
    }
}

function showFullSurahReadInfo(n) {
    const s = surahsList.find(x => x.number === n);
    if (!s) return;
    const infoEl = document.getElementById('fullReadSurahInfo');
    if (infoEl) {
        infoEl.innerHTML = '<span style="color:var(--gold-d);font-weight:700;">' + s.name + '</span> — ' +
            (s.revelationType === 'Meccan' ? 'مكية' : 'مدنية') + ' | ' + s.numberOfAyahs + ' آية';
        infoEl.style.display = 'block';
    }
}

function showFullSurahAudioInfo(n) {
    const s = surahsList.find(x => x.number === n);
    if (!s) return;
    fullSurahSelectedSurah = s;
    const infoEl = document.getElementById('fullAudioSurahInfo');
    if (infoEl) {
        infoEl.innerHTML = '<span style="color:var(--gold-d);font-weight:700;">' + s.name + '</span> — ' + s.numberOfAyahs + ' آية';
        infoEl.style.display = 'block';
    }
}

// ══════════════════════════════════════
//  قسم السورة كاملة - قراءة
// ══════════════════════════════════════
async function loadFullSurahRead() {
    const sn = parseInt(document.getElementById('fullReadSurahSelect')?.value);
    if (!sn) { showToast('يرجى اختيار سورة أولاً', 'warning'); return; }
    const s = surahsList.find(x => x.number === sn);
    if (!s) return;

    // تحديث معلومات السورة
    showFullSurahReadInfo(sn);

    const container = document.getElementById('fullReadContainer');
    if (!container) return;
    container.style.display = 'block';
    container.innerHTML = '<div style="text-align:center;padding:40px;"><div class="spinner" style="margin:0 auto 12px;"></div><div class="load-txt">جاري تحميل سورة ' + s.name + '...</div></div>';

    try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 20000);
        const res = await fetch('https://api.alquran.cloud/v1/surah/' + sn + '/quran-uthmani', { signal: ctrl.signal });
        clearTimeout(t);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        if (!data.data || !data.data.ayahs) throw new Error('no data');
        renderFullSurahRead(data.data, s);
    } catch (e) {
        container.innerHTML = '<div style="text-align:center;padding:30px;color:#ef4444;"><i class="fas fa-exclamation-triangle" style="font-size:2rem;"></i><p style="margin-top:10px;">تعذر تحميل السورة</p><button onclick="loadFullSurahRead()" style="margin-top:10px;padding:8px 20px;background:#1a472a;color:#fff;border:none;border-radius:8px;cursor:pointer;font-family:var(--font-ui);">إعادة المحاولة</button></div>';
    }
}

function renderFullSurahRead(surahData, surahMeta) {
    const container = document.getElementById('fullReadContainer');
    if (!container) return;
    const isNoBasmala = surahData.number === 9;
    const isFatiha    = surahData.number === 1;
    let html = '<div class="full-read-mushaf">';
    html += '<div class="full-read-header"><div class="full-read-title">';
    html += '<span class="full-read-surah-name">' + surahData.name + '</span>';
    html += '<span class="full-read-surah-eng">' + surahMeta.englishName + '</span>';
    html += '</div><div class="full-read-meta">';
    html += '<span>' + (surahMeta.revelationType === 'Meccan' ? '🕋 مكية' : '🕌 مدنية') + '</span>';
    html += '<span>' + surahData.numberOfAyahs + ' آية</span>';
    html += '<span>الجزء ' + (surahData.ayahs[0]?.juz || '') + '</span>';
    html += '</div></div>';
    if (!isNoBasmala && !isFatiha)
        html += '<div class="full-read-basmala">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>';
    html += '<div class="full-read-ayahs">';
    surahData.ayahs.forEach(a => {
        html += '<span class="full-read-ayah" onclick="quickListenAyah(' + surahData.number + ',' + a.numberInSurah + ',this)">';
        html += a.text + ' <span class="full-read-ayah-num">﴿' + toAr(a.numberInSurah) + '﴾</span></span> ';
    });
    html += '</div>';
    html += '<div class="full-read-footer">';
    html += '<button onclick="copyFullSurah(' + surahData.number + ')" class="full-read-action-btn"><i class="fas fa-copy"></i> نسخ السورة</button>';
    html += '<button onclick="shareFullSurah(\'' + surahData.name + '\')" class="full-read-action-btn"><i class="fas fa-share-alt"></i> مشاركة</button>';
    html += '</div></div>';
    container.innerHTML = html;
    container.style.opacity = '0';
    requestAnimationFrame(() => { container.style.transition = 'opacity .4s'; container.style.opacity = '1'; });
}

async function copyFullSurah(sn) {
    try {
        const res = await fetch('https://api.alquran.cloud/v1/surah/' + sn + '/quran-uthmani');
        const data = await res.json();
        if (!data.data) return;
        const text = data.data.ayahs.map(a => a.text + ' ﴿' + a.numberInSurah + '﴾').join('\n');
        navigator.clipboard.writeText(text).then(() => showToast('تم نسخ السورة كاملة', 'success')).catch(() => showToast('تعذر النسخ', 'error'));
    } catch (e) { showToast('تعذر النسخ', 'error'); }
}

function shareFullSurah(name) {
    if (navigator.share) {
        navigator.share({ title: 'سورة ' + name, text: 'اقرأ سورة ' + name + ' من القرآن الكريم', url: location.href }).catch(() => {});
    } else {
        navigator.clipboard.writeText('سورة ' + name + ' - ' + location.href).then(() => showToast('تم نسخ الرابط', 'success'));
    }
}

function quickListenAyah(surah, ayah, el) {
    document.querySelectorAll('.full-read-ayah.active').forEach(e => e.classList.remove('active'));
    if (el) el.classList.add('active');
    const r = QuranConfig.reciters[fullSurahReciter] || QuranConfig.reciters['minshawi'];
    const s = String(surah).padStart(3, '0');
    const a = String(ayah).padStart(3, '0');
    const aud = document.getElementById('mainAud');
    if (!aud) return;
    aud.src = r.sources[0](s, a);
    aud.play().catch(() => showToast('تعذر التشغيل', 'error'));
    const surahMeta = surahsList.find(x => x.number === surah);
    document.getElementById('bRef').textContent = (surahMeta ? surahMeta.name : '') + ' • الآية ' + ayah;
    document.getElementById('bRec').textContent = r.name;
    document.getElementById('barEl').classList.add('on');
}

// ══════════════════════════════════════════════════════════════
//  قسم السورة كاملة - استماع
// ══════════════════════════════════════════════════════════════

function resetFullAudioPlayer() {
    if (fullSurahAudio) {
        fullSurahAudio.pause();
        fullSurahAudio.src = '';
        fullSurahAudio.onended = null;
        fullSurahAudio.onerror = null;
        fullSurahAudio = null;
    }
    fullSurahPlaying       = false;
    fullSurahData          = null;
    fullSurahAyahList      = [];
    fullSurahCurrentAyahIdx = 0;

    const btn      = document.getElementById('fullAudioPlayBtn');
    const ayahPrg  = document.getElementById('fullAudioAyahProgress');
    const surahPrg = document.getElementById('fullAudioSurahProgress');
    const counter  = document.getElementById('fullAudioCounter');
    const curTime  = document.getElementById('fullAudioCurTime');
    const durTime  = document.getElementById('fullAudioDurTime');

    if (btn)      btn.innerHTML       = '<i class="fas fa-play"></i>';
    if (ayahPrg)  ayahPrg.style.width  = '0%';
    if (surahPrg) surahPrg.style.width = '0%';
    if (counter)  counter.textContent  = '0 / 0';
    if (curTime)  curTime.textContent  = '0:00';
    if (durTime)  durTime.textContent  = '0:00';

    document.querySelectorAll('.full-audio-ayah-item.playing').forEach(e => e.classList.remove('playing'));
}

/**
 * الدالة الرئيسية — تشغيل السورة كاملة آية تلو آية
 */
async function startFullSurahAudioWithList() {
    const sn = parseInt(document.getElementById('fullAudioSurahSelect')?.value);
    if (!sn) { showToast('يرجى اختيار سورة أولاً', 'warning'); return; }
    const s = surahsList.find(x => x.number === sn);
    if (!s) return;

    fullSurahSelectedSurah = s;
    fullSurahReciter = document.getElementById('fullAudioReciterSelect')?.value || fullSurahReciter;

    // أوقف أي تشغيل سابق
    resetFullAudioPlayer();

    const playerEl  = document.getElementById('fullAudioPlayer');
    const listEl    = document.getElementById('fullAudioAyahList');
    const nowEl     = document.getElementById('fullAudioNowPlaying');
    const recEl     = document.getElementById('fullAudioReciterName');
    const counterEl = document.getElementById('fullAudioCounter');

    // ★ إظهار المشغّل فوراً
    if (playerEl) playerEl.style.display = 'block';
    if (listEl)   listEl.innerHTML = '<div style="text-align:center;padding:24px;"><div class="spinner" style="margin:0 auto 10px;"></div><div style="color:var(--muted);font-size:.88rem;">جاري تحميل سورة ' + s.name + '...</div></div>';
    if (nowEl)    nowEl.innerHTML  = 'جاري تحميل <span style="color:var(--gold-d);">' + s.name + '</span>...';

    const reciterInfo = QuranConfig.reciters[fullSurahReciter];
    if (recEl && reciterInfo) recEl.textContent = reciterInfo.name;

    // جلب نصوص الآيات
    try {
        const ctrl = new AbortController();
        const t    = setTimeout(() => ctrl.abort(), 20000);
        const res  = await fetch('https://api.alquran.cloud/v1/surah/' + sn + '/quran-uthmani', { signal: ctrl.signal });
        clearTimeout(t);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        if (!data.data || !data.data.ayahs) throw new Error('no data');
        fullSurahData = data.data;
    } catch (e) {
        showToast('تعذر تحميل نصوص السورة', 'error');
        if (listEl) listEl.innerHTML = '<div style="text-align:center;padding:24px;color:#ef4444;"><i class="fas fa-exclamation-triangle"></i><p>تعذر تحميل السورة. تحقق من الاتصال.</p></div>';
        return;
    }

    // بناء قائمة روابط الصوت
    const reciter = QuranConfig.reciters[fullSurahReciter];
    if (!reciter) { showToast('القارئ غير موجود', 'error'); return; }

    fullSurahAyahList = fullSurahData.ayahs.map(a => ({
        surah:   sn,
        ayah:    a.numberInSurah,
        text:    a.text,
        url:     reciter.sources[0](String(sn).padStart(3,'0'), String(a.numberInSurah).padStart(3,'0'))
    }));

    // بناء قائمة الآيات المرئية
    buildFullAudioAyahList(fullSurahData, sn);

    // تحديث المعلومات
    if (nowEl)    nowEl.innerHTML  = '<span style="color:var(--gold-d);font-weight:700;">' + s.name + '</span>';
    if (counterEl) counterEl.textContent = '1 / ' + fullSurahAyahList.length;

    // البدء بالآية الأولى
    fullSurahCurrentAyahIdx = 0;
    playFullSurahAyah(0);
}

/**
 * تشغيل آية محددة بفهرسها في القائمة
 */
function playFullSurahAyah(idx) {
    if (!fullSurahAyahList || idx < 0 || idx >= fullSurahAyahList.length) {
        // انتهت السورة
        fullSurahPlaying = false;
        const btn = document.getElementById('fullAudioPlayBtn');
        if (btn) btn.innerHTML = '<i class="fas fa-play"></i>';
        const s = fullSurahSelectedSurah;
        showToast('انتهت تلاوة سورة ' + (s ? s.name : '') + ' 🌙', 'success');
        const ayahPrg  = document.getElementById('fullAudioAyahProgress');
        const surahPrg = document.getElementById('fullAudioSurahProgress');
        if (ayahPrg)  ayahPrg.style.width  = '100%';
        if (surahPrg) surahPrg.style.width = '100%';
        return;
    }

    fullSurahCurrentAyahIdx = idx;
    const item = fullSurahAyahList[idx];
    const total = fullSurahAyahList.length;

    // تحديث العداد
    const counterEl = document.getElementById('fullAudioCounter');
    if (counterEl) counterEl.textContent = (idx + 1) + ' / ' + total;

    // تحديث اسم الآية
    const nowEl = document.getElementById('fullAudioNowPlaying');
    const s = fullSurahSelectedSurah;
    if (nowEl && s) {
        nowEl.innerHTML = '<span style="color:var(--gold-d);font-weight:700;">' + s.name + '</span> — الآية ' + toAr(item.ayah);
    }

    // تحديث شريط تقدم السورة
    const surahPrg = document.getElementById('fullAudioSurahProgress');
    if (surahPrg) surahPrg.style.width = ((idx / total) * 100).toFixed(1) + '%';

    // تمييز الآية في القائمة
    _highlightFullAudioAyah(idx);

    // إنشاء عنصر الصوت
    if (fullSurahAudio) {
        fullSurahAudio.pause();
        fullSurahAudio.onended       = null;
        fullSurahAudio.onerror       = null;
        fullSurahAudio.ontimeupdate  = null;
        fullSurahAudio.onplay        = null;
        fullSurahAudio.onpause       = null;
    }
    fullSurahAudio = new Audio();

    fullSurahAudio.addEventListener('timeupdate', _onFullAudioTimeUpdate);

    fullSurahAudio.addEventListener('play', () => {
        fullSurahPlaying = true;
        const btn = document.getElementById('fullAudioPlayBtn');
        if (btn) btn.innerHTML = '<i class="fas fa-pause"></i>';
    });

    fullSurahAudio.addEventListener('pause', () => {
        fullSurahPlaying = false;
        const btn = document.getElementById('fullAudioPlayBtn');
        if (btn) btn.innerHTML = '<i class="fas fa-play"></i>';
    });

    fullSurahAudio.addEventListener('ended', () => {
        playFullSurahAyah(idx + 1);
    });

    // معالجة الخطأ — جرّب المصدر البديل للقارئ
    let errorAttempts = 0;
    fullSurahAudio.addEventListener('error', () => {
        errorAttempts++;
        const reciter = QuranConfig.reciters[fullSurahReciter];
        if (reciter && reciter.sources.length > 1 && errorAttempts === 1) {
            const altUrl = reciter.sources[1](
                String(item.surah).padStart(3,'0'),
                String(item.ayah).padStart(3,'0')
            );
            fullSurahAudio.src = altUrl;
            fullSurahAudio.play().catch(() => setTimeout(() => playFullSurahAyah(idx + 1), 500));
            return;
        }
        console.warn('[FullAudio] تعذر تحميل الآية ' + item.ayah + '، تخطي...');
        setTimeout(() => playFullSurahAyah(idx + 1), 500);
    });

    fullSurahAudio.src = item.url;
    fullSurahAudio.play().catch(err => {
        console.error('[FullAudio] play() رُفض:', err);
        fullSurahPlaying = false;
        const btn = document.getElementById('fullAudioPlayBtn');
        if (btn) btn.innerHTML = '<i class="fas fa-play"></i>';
        showToast('انقر على زر التشغيل للبدء', 'info');
    });
}

/** تحديث شريط تقدم الآية الحالية */
function _onFullAudioTimeUpdate() {
    if (!fullSurahAudio || isNaN(fullSurahAudio.duration) || !fullSurahAudio.duration) return;
    const ratio = fullSurahAudio.currentTime / fullSurahAudio.duration;
    const pct   = (ratio * 100).toFixed(2);

    const ayahPrg = document.getElementById('fullAudioAyahProgress');
    const curTime = document.getElementById('fullAudioCurTime');
    const durTime = document.getElementById('fullAudioDurTime');

    if (ayahPrg)  ayahPrg.style.width = pct + '%';
    if (curTime)  curTime.textContent  = fmt(fullSurahAudio.currentTime);
    if (durTime)  durTime.textContent  = fmt(fullSurahAudio.duration);
}

function _highlightFullAudioAyah(index) {
    document.querySelectorAll('.full-audio-ayah-item').forEach((el, i) => {
        el.classList.toggle('playing', i === index);
        if (i === index) {
            el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });
}

/** تبديل التشغيل/الإيقاف */
function toggleFullSurahPlay() {
    if (!fullSurahAudio || !fullSurahAudio.src) {
        // لم يبدأ التشغيل بعد — ابدأ
        startFullSurahAudioWithList();
        return;
    }
    if (fullSurahPlaying) {
        fullSurahAudio.pause();
    } else {
        fullSurahAudio.play().catch(() => {});
    }
}

/** الآية السابقة */
function fullSurahPrev() {
    const idx = fullSurahCurrentAyahIdx - 1;
    if (idx >= 0) playFullSurahAyah(idx);
    else showToast('هذه أول آية في السورة', 'info');
}

/** الآية التالية */
function fullSurahNext() {
    const idx = fullSurahCurrentAyahIdx + 1;
    if (idx < fullSurahAyahList.length) playFullSurahAyah(idx);
    else showToast('انتهت السورة', 'info');
}

/** البحث في الآية الحالية */
function seekFullAudio(e) {
    if (!fullSurahAudio || isNaN(fullSurahAudio.duration)) return;
    const bar = document.getElementById('fullAudioAyahBar');
    if (!bar) return;
    const r = bar.getBoundingClientRect();
    fullSurahAudio.currentTime = ((e.clientX - r.left) / r.width) * fullSurahAudio.duration;
}

/** بناء قائمة الآيات المرئية */
function buildFullAudioAyahList(surahData, sn) {
    const listEl = document.getElementById('fullAudioAyahList');
    if (!listEl) return;
    const isNoBasmala = sn === 9;
    const isFatiha    = sn === 1;
    let html = '';
    if (!isNoBasmala && !isFatiha)
        html += '<div class="full-audio-basmala">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>';
    surahData.ayahs.forEach((a, i) => {
        html += '<div class="full-audio-ayah-item" onclick="seekToAyahIdx(' + i + ')" id="fullAudioAyah_' + i + '">';
        html += '<span class="full-audio-ayah-num">' + toAr(a.numberInSurah) + '</span>';
        html += '<span class="full-audio-ayah-text">' + a.text + '</span>';
        html += '<i class="fas fa-volume-up full-audio-play-icon"></i>';
        html += '</div>';
    });
    listEl.innerHTML = html;
}

/** الانتقال لآية معينة بالنقر على القائمة */
function seekToAyahIdx(index) {
    playFullSurahAyah(index);
}

// ══════════════════════════════════════════════════════════════
//  الكود الأصلي — بحث عن آية
// ══════════════════════════════════════════════════════════════

function updateSurahInfo(n) {
    const surah = surahsList.find(s => s.number === n);
    if (!surah) return;
    const el = document.getElementById('surahInfo');
    if (!el) return;
    el.innerHTML = surah.englishName + ' - ' + (surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية') + ' | آيات: ' + surah.numberOfAyahs;
    el.style.display = 'block';
    updateAyahRange(n);
}

function updateAyahRange(n) {
    const surah = surahsList.find(s => s.number === n);
    if (!surah) return;
    const maxEl   = document.getElementById('maxAyah');
    const rangeEl = document.getElementById('ayahRange');
    if (maxEl)   maxEl.textContent   = surah.numberOfAyahs;
    if (rangeEl) rangeEl.style.display = 'block';
}

function hideSurahInfo() {
    const si = document.getElementById('surahInfo');
    const ar = document.getElementById('ayahRange');
    if (si) si.style.display = 'none';
    if (ar) ar.style.display = 'none';
}

function loadReciters() {
    const sel = document.getElementById('reciterSelect');
    if (!sel) return;
    sel.innerHTML = '';
    const grouped = {};
    Object.values(QuranConfig.reciters).forEach(r => {
        const g = r.style || 'مرتل';
        if (!grouped[g]) grouped[g] = [];
        grouped[g].push(r);
    });
    Object.entries(grouped).forEach(([groupName, reciters]) => {
        const optgroup = document.createElement('optgroup');
        optgroup.label = '— ' + groupName + ' —';
        reciters.forEach(r => {
            const opt = document.createElement('option');
            opt.value = r.id;
            opt.textContent = r.name;
            optgroup.appendChild(opt);
        });
        sel.appendChild(optgroup);
    });
    sel.value = currentReciter;
    sel.addEventListener('change', function() {
        currentReciter = this.value;
        if (currentAyahData) loadAudio(currentAyahData);
    });
}

function setupEventListeners() {
    const a = document.getElementById('ayahInSurah');
    const g = document.getElementById('globalAyah');
    if (a) a.addEventListener('keypress', e => { if (e.key === 'Enter') fetchAyahBySurah(); });
    if (g) g.addEventListener('keypress', e => { if (e.key === 'Enter') searchByGlobalAyah(); });
}

function loadQuickAyah(surah, ayah) {
    if (!surahsList || surahsList.length === 0) {
        let attempts = 0;
        const wait = setInterval(() => {
            attempts++;
            if (surahsList && surahsList.length > 0) { clearInterval(wait); _doLoadQuickAyah(surah, ayah); }
            else if (attempts > 25) { clearInterval(wait); if (typeof showToast === 'function') showToast('تعذر تحميل بيانات السورة', 'error'); }
        }, 200);
        return;
    }
    _doLoadQuickAyah(surah, ayah);
}

function _doLoadQuickAyah(surah, ayah) {
    if (typeof showTab === 'function') showTab('search');
    const ss = document.getElementById('surahSelect');
    const ai = document.getElementById('ayahInSurah');
    if (ss) ss.value = surah;
    if (ai) ai.value = ayah;
    updateSurahInfo(surah);
    updateAyahRange(surah);
    setTimeout(() => fetchAyahBySurah(), 150);
}

async function fetchAyahBySurah() {
    const sn = parseInt(document.getElementById('surahSelect')?.value);
    const an = parseInt(document.getElementById('ayahInSurah')?.value);
    if (!sn) { showError(QuranConfig.messages.selectSurah); return; }
    const surah = surahsList.find(s => s.number === sn);
    if (!surah) { showError('السورة غير موجودة'); return; }
    if (!an || an < 1 || an > surah.numberOfAyahs) { showError(QuranConfig.messages.ayahOutOfRange, 'يجب أن يكون بين 1 و ' + surah.numberOfAyahs); return; }
    currentSurah = sn; currentAyah = an;
    hideError(); showLoading(true);
    try {
        const d = await getAyahBySurahNumber(sn, an);
        displayAyah(d);
        await Promise.allSettled([loadAudio(d), loadTranslation(d.number), loadTafseer(d.number), loadTajweed(d.number)]);
        showAdditionalSections();
        currentAyahData = d; currentGlobalAyah = d.number;
    } catch (e) {
        showError(QuranConfig.messages.error, e.message || 'تحقق من اتصالك بالإنترنت');
    } finally { showLoading(false); }
}

async function searchByGlobalAyah() {
    const val = document.getElementById('globalAyah')?.value?.trim();
    const n   = parseInt(val);
    if (!n || n < 1 || n > QuranConfig.totalAyahs) { showError(QuranConfig.messages.invalidAyah, 'يجب أن يكون بين 1 و ' + QuranConfig.totalAyahs); return; }
    hideError(); showLoading(true);
    try {
        const d = await getAyahData(n);
        const ss = document.getElementById('surahSelect');
        const ai = document.getElementById('ayahInSurah');
        if (ss) ss.value = d.surah.number;
        if (ai) ai.value = d.numberInSurah;
        updateSurahInfo(d.surah.number); updateAyahRange(d.surah.number);
        displayAyah(d);
        await Promise.allSettled([loadAudio(d), loadTranslation(n), loadTafseer(n), loadTajweed(n)]);
        showAdditionalSections();
        currentAyahData = d; currentSurah = d.surah.number; currentAyah = d.numberInSurah; currentGlobalAyah = n;
    } catch (e) {
        showError(QuranConfig.messages.error, e.message || 'تحقق من اتصالك بالإنترنت');
    } finally { showLoading(false); }
}

async function getAyahData(n) {
    const controller = new AbortController();
    const timeout    = setTimeout(() => controller.abort(), 15000);
    try {
        const res  = await fetch(QuranConfig.apis.ayah(n), { signal: controller.signal });
        clearTimeout(timeout);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        if (!data.data) throw new Error('الآية غير موجودة');
        return data.data;
    } catch (e) { clearTimeout(timeout); throw e; }
}

async function getAyahBySurahNumber(s, a) {
    const controller = new AbortController();
    const timeout    = setTimeout(() => controller.abort(), 15000);
    try {
        const res  = await fetch(QuranConfig.apis.ayahBySurah(s, a), { signal: controller.signal });
        clearTimeout(timeout);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        if (!data.data) throw new Error('الآية غير موجودة');
        return data.data;
    } catch (e) { clearTimeout(timeout); throw e; }
}

function displayAyah(d) {
    const surah   = surahsList.find(s => s.number === d.surah.number);
    const display = document.getElementById('ayahDisplay');
    if (!display) return;
    display.innerHTML = `
        <div style="text-align:center;">
            <div style="display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:12px;margin-bottom:20px;">
                <span style="background:linear-gradient(135deg,#2d6a4f,#1a472a);color:white;padding:8px 20px;border-radius:20px;font-weight:700;">
                    ${d.surah.name} ${surah ? '(' + surah.englishName + ')' : ''}
                </span>
                <span style="color:var(--muted);font-size:.85rem;">الآية ${d.numberInSurah} من ${d.surah.numberOfAyahs}</span>
                <span style="color:var(--muted);font-size:.85rem;">الجزء ${d.juz}</span>
            </div>
            <div style="background:var(--mushaf);padding:28px;border-radius:16px;border:1px solid var(--border);margin-bottom:20px;">
                <p style="font-family:var(--font-quran, 'Noto Naskh Arabic', serif);font-size:2rem;line-height:2.8;color:var(--txt);margin-bottom:16px;">${d.text}</p>
                <div style="font-family:var(--font-quran, 'Noto Naskh Arabic', serif);font-size:2rem;color:var(--gold-d);">﴿${d.numberInSurah}﴾</div>
            </div>
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;">
                ${[['رقم الآية العام',d.number],['رقم السورة',d.surah.number],['الصفحة',d.page],['رقم الآية',d.numberInSurah]].map(([l,v])=>`
                    <div style="padding:12px;background:var(--surface2);border-radius:12px;text-align:center;border:1px solid var(--border);">
                        <div style="font-size:0.75rem;color:var(--muted);margin-bottom:6px;">${l}</div>
                        <div style="font-size:1.4rem;font-weight:700;color:var(--heading);">${v}</div>
                    </div>`).join('')}
            </div>
        </div>`;
    document.getElementById('resultsSection').style.display = 'block';
}

const QALQALAH_LETTERS  = ['ق','ط','ب','ج','د'];
const MADD_LETTERS       = ['ا','و','ي'];
const TAFKHEEM_LETTERS   = ['ص','ض','ط','ظ'];
const GHUNNAH_LETTERS    = ['ن','م'];

function colorAyahText(text) {
    if (!text) return text;
    let result = '';
    const chars = [...text];
    for (let i = 0; i < chars.length; i++) {
        const ch   = chars[i];
        const prev = i > 0 ? chars[i - 1] : '';
        if (isHaraka(ch) || ch === 'ّ') { result += ch; continue; }
        let charWithDiacritics = ch;
        let j = i + 1;
        while (j < chars.length && (isHaraka(chars[j]) || chars[j] === 'ّ' || chars[j] === 'ْ')) { charWithDiacritics += chars[j]; j++; }
        const hasSukun   = charWithDiacritics.includes('ْ');
        const hasShaddah = charWithDiacritics.includes('ّ');
        let color = null, title = '';
        if      (QALQALAH_LETTERS.includes(ch) && (hasSukun || isEndOfWord(chars, j))) { color = '#DD0008'; title = 'قلقلة'; }
        else if (TAFKHEEM_LETTERS.includes(ch))                                          { color = '#FF4500'; title = 'تفخيم'; }
        else if (MADD_LETTERS.includes(ch) && isMaddContext(chars, i, prev))             { color = '#337FFF'; title = 'مد'; }
        else if (GHUNNAH_LETTERS.includes(ch) && hasShaddah)                             { color = '#FF7E1E'; title = 'غنة'; }
        else if (ch === 'ن' && hasSukun && isIkhfaaNext(chars[j]))                       { color = '#81B622'; title = 'إخفاء'; }
        else if (ch === 'ن' && hasSukun && isIdghaamLetter(chars[j]))                    { color = '#169200'; title = 'إدغام'; }
        else if (ch === 'ن' && hasSukun && chars[j] === 'ب')                             { color = '#26BFFD'; title = 'إقلاب'; }
        if (color) result += '<span class="tj-word" style="color:' + color + '" title="' + title + '">' + charWithDiacritics + '</span>';
        else       result += charWithDiacritics;
        i = j - 1;
    }
    return result;
}

function isHaraka(ch) { return /[\u064B-\u065F\u0670]/.test(ch); }
function isEndOfWord(chars, idx) { return !chars[idx] || chars[idx] === ' ' || chars[idx] === '\n'; }
function isMaddContext(chars, i, prev) {
    if (!prev) return false;
    const ch = chars[i];
    if (ch === 'ا') return /[\u064E]/.test(prev);
    if (ch === 'و') return /[\u064F]/.test(prev);
    if (ch === 'ي') return /[\u0650]/.test(prev);
    return false;
}
function isIkhfaaNext(ch)   { return ch && 'صذثكجشقسدطزفتضظ'.includes(ch); }
function isIdghaamLetter(ch){ return ch && 'يرملون'.includes(ch); }

function renderTajweedLegend() {
    if (!QuranConfig || !QuranConfig.tajweedRules) return '';
    const rules = QuranConfig.tajweedRules;
    return '<div id="tajweedLegend" style="margin-top:16px;background:var(--surface2);border-radius:13px;border:1px solid var(--border);overflow:hidden;">' +
        '<div style="padding:12px 16px;background:linear-gradient(135deg,rgba(201,168,76,.12),rgba(201,168,76,.04));border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;cursor:pointer;" onclick="toggleLegend()">' +
        '<div style="display:flex;align-items:center;gap:8px;font-weight:700;color:var(--heading);font-size:.9rem;"><i class="fas fa-palette" style="color:var(--gold);"></i> دليل ألوان أحكام التجويد</div>' +
        '<i class="fas fa-chevron-down" id="legendIcon" style="color:var(--muted);font-size:.8rem;transition:transform .28s;"></i>' +
        '</div><div id="legendBody" style="display:none;padding:14px 16px;">' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:7px;">' +
        rules.map(r =>
            '<div style="display:flex;align-items:center;gap:8px;padding:7px 10px;background:var(--surface);border-radius:8px;border:1px solid var(--border);">' +
            '<div style="width:14px;height:14px;border-radius:50%;background:' + r.color + ';flex-shrink:0;box-shadow:0 0 4px ' + r.color + '55;"></div>' +
            '<div><div style="font-size:.8rem;font-weight:700;color:var(--txt);">' + r.name + '</div>' +
            '<div style="font-size:.68rem;color:var(--muted);line-height:1.3;">' + r.desc + '</div></div></div>'
        ).join('') + '</div></div></div>';
}

function toggleLegend() {
    const body = document.getElementById('legendBody');
    const icon = document.getElementById('legendIcon');
    if (!body) return;
    const open = body.style.display === 'none';
    body.style.display = open ? 'block' : 'none';
    if (icon) icon.style.transform = open ? 'rotate(180deg)' : '';
}

async function loadTajweed(globalN) {
    const container = document.getElementById('tajweedCard');
    if (!container) return;
    container.style.display = 'block';
    try {
        const controller = new AbortController();
        const timeout    = setTimeout(() => controller.abort(), 12000);
        const res        = await fetch('https://api.alquran.cloud/v1/ayah/' + globalN, { signal: controller.signal });
        clearTimeout(timeout);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        if (!data.data || !data.data.text) throw new Error('no text');
        const colored = colorAyahText(data.data.text);
        container.innerHTML =
            '<div style="display:flex;align-items:center;gap:9px;margin-bottom:12px;">' +
            '<div style="width:36px;height:36px;background:rgba(201,168,76,.12);border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--gold-d);font-size:14px;"><i class="fas fa-palette"></i></div>' +
            '<div><div style="font-weight:700;color:var(--txt);font-size:.92rem;">تلاوة مُلوَّنة بأحكام التجويد</div>' +
            '<div style="font-size:.72rem;color:var(--muted);">مرّ على الحرف لمعرفة الحكم</div></div></div>' +
            '<div style="font-family:var(--font-quran, \'Noto Naskh Arabic\', serif);font-size:1.6rem;line-height:2.8;text-align:center;padding:16px;background:var(--mushaf);border-radius:12px;border:1px solid var(--border);">' +
            colored + '</div>' + renderTajweedLegend();
    } catch (e) {
        container.innerHTML =
            '<div style="display:flex;align-items:center;gap:9px;margin-bottom:12px;">' +
            '<div style="width:36px;height:36px;background:rgba(201,168,76,.12);border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--gold-d);font-size:14px;"><i class="fas fa-palette"></i></div>' +
            '<div><div style="font-weight:700;color:var(--txt);font-size:.92rem;">دليل أحكام التجويد</div></div></div>' +
            renderTajweedLegend();
    }
}

async function loadAudio(d) {
    const reciter = QuranConfig.reciters[currentReciter];
    if (!reciter) return;
    const nameEl = document.getElementById('reciterName');
    if (nameEl)  nameEl.textContent = 'تلاوة ' + reciter.name;
    const surah   = String(d.surah.number).padStart(3, '0');
    const ayah    = String(d.numberInSurah).padStart(3, '0');
    const display = document.getElementById('audioDisplay');
    if (!display) return;
    display.innerHTML = '<div style="text-align:center;padding:12px;color:var(--muted);font-size:.85rem;"><i class="fas fa-spinner fa-spin" style="margin-left:6px;"></i>جاري تحميل التلاوة...</div>';
    let url = null;
    for (const fn of reciter.sources) {
        const u = fn(surah, ayah);
        try {
            const ctrl = new AbortController();
            const t    = setTimeout(() => ctrl.abort(), 5000);
            const r    = await fetch(u, { method: 'HEAD', signal: ctrl.signal });
            clearTimeout(t);
            if (r.ok) { url = u; break; }
        } catch (e) { continue; }
    }
    if (!url) url = reciter.sources[0](surah, ayah);
    display.innerHTML = '<audio id="ayahAudio" controls style="width:100%;border-radius:12px;" preload="metadata"><source src="' + url + '" type="audio/mpeg"></audio>' +
        '<p style="text-align:center;color:var(--muted);font-size:0.85rem;margin-top:8px;">' + reciter.name + ' - ' + reciter.style + '</p>';
    audioElement = document.getElementById('ayahAudio');
}

async function loadTranslation(n) {
    const display = document.getElementById('translationDisplay');
    if (!display) return;
    display.innerHTML = '<div style="text-align:center;padding:10px;color:var(--muted);font-size:.82rem;"><i class="fas fa-spinner fa-spin"></i></div>';
    try {
        const controller = new AbortController();
        const timeout    = setTimeout(() => controller.abort(), 12000);
        const res        = await fetch(QuranConfig.apis.translation(n, 'en.asad'), { signal: controller.signal });
        clearTimeout(timeout);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        if (data.data && data.data.text) {
            display.innerHTML = '<div style="background:var(--surface);padding:16px;border-radius:12px;border:1px solid #bfdbfe;"><p style="color:var(--txt);line-height:1.8;text-align:left;" dir="ltr">' + data.data.text + '</p><p style="font-size:0.8rem;color:#60a5fa;margin-top:10px;border-top:1px solid #dbeafe;padding-top:8px;">By Muhammad Asad</p></div>';
        } else {
            display.innerHTML = '<p style="color:var(--muted);font-size:.85rem;padding:10px;text-align:center;">الترجمة غير متوفرة</p>';
        }
    } catch (e) {
        display.innerHTML = '<p style="color:var(--muted);font-size:.82rem;padding:10px;text-align:center;"><i class="fas fa-wifi" style="margin-left:5px;"></i>تعذر تحميل الترجمة</p>';
    }
}

async function loadTafseer(n) {
    const display = document.getElementById('tafseerDisplay');
    if (!display) return;
    display.innerHTML = '<div style="text-align:center;padding:10px;color:var(--muted);font-size:.82rem;"><i class="fas fa-spinner fa-spin"></i></div>';
    try {
        const controller = new AbortController();
        const timeout    = setTimeout(() => controller.abort(), 12000);
        const res        = await fetch(QuranConfig.apis.tafseer(n, 'ar.muyassar'), { signal: controller.signal });
        clearTimeout(timeout);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        if (data.data && data.data.text) {
            display.innerHTML = '<div style="background:var(--surface);padding:16px;border-radius:12px;border:1px solid #ddd6fe;"><p style="color:var(--txt);line-height:1.8;">' + data.data.text + '</p><p style="font-size:0.8rem;color:#a78bfa;margin-top:10px;border-top:1px solid #ede9fe;padding-top:8px;">التفسير الميسر</p></div>';
        } else {
            display.innerHTML = '<p style="color:var(--muted);font-size:.85rem;padding:10px;text-align:center;">التفسير غير متوفر</p>';
        }
    } catch (e) {
        display.innerHTML = '<p style="color:var(--muted);font-size:.82rem;padding:10px;text-align:center;"><i class="fas fa-wifi" style="margin-left:5px;"></i>تعذر تحميل التفسير</p>';
    }
}

function showAdditionalSections() {
    const shareCard = document.getElementById('shareCard');
    const navCard   = document.getElementById('navigationCard');
    if (shareCard) shareCard.style.display = 'block';
    if (navCard)   navCard.style.display   = 'block';
}

function previousAyah() {
    if (!currentSurah || !currentAyah) return;
    if (currentAyah > 1) loadQuickAyah(currentSurah, currentAyah - 1);
    else if (currentSurah > 1) {
        const prev = surahsList.find(s => s.number === currentSurah - 1);
        if (prev) loadQuickAyah(currentSurah - 1, prev.numberOfAyahs);
    } else showToast('هذه أول آية في القرآن الكريم', 'info');
}

function nextAyah() {
    if (!currentSurah || !currentAyah) return;
    const surah = surahsList.find(s => s.number === currentSurah);
    if (!surah) return;
    if (currentAyah < surah.numberOfAyahs) loadQuickAyah(currentSurah, currentAyah + 1);
    else if (currentSurah < 114)           loadQuickAyah(currentSurah + 1, 1);
    else                                    showToast('هذه آخر آية في القرآن الكريم', 'info');
}

function playAudio()  { if (audioElement) audioElement.play().catch(() => showToast('تعذر تشغيل الصوت', 'error')); }
function pauseAudio() { if (audioElement) audioElement.pause(); }
function downloadAudio() {
    const src = audioElement?.querySelector?.('source')?.src;
    if (src) { const a = document.createElement('a'); a.href = src; a.download = 'quran_' + currentSurah + '_' + currentAyah + '.mp3'; a.click(); }
}

async function shareAyah() {
    if (!currentAyahData) return;
    const text = currentAyahData.text + '\n\n' + currentAyahData.surah.name + ' - الآية ' + currentAyahData.numberInSurah + '\n\nمن تطبيق قرآن كريم';
    if (navigator.share) {
        try { await navigator.share({ title: 'آية قرآنية', text, url: location.href }); }
        catch (e) { if (e.name !== 'AbortError') copyAyah(); }
    } else copyAyah();
}

function copyAyah() {
    if (!currentAyahData) return;
    const text = currentAyahData.text + '\n\n' + currentAyahData.surah.name + ' - الآية ' + currentAyahData.numberInSurah;
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(() => showToast('تم نسخ الآية', 'success')).catch(() => showToast('تعذر النسخ', 'error'));
}

function showLoading(show) {
    const ls  = document.getElementById('loadingState');
    const rs  = document.getElementById('resultsSection');
    const btn = document.getElementById('searchBtn');
    const sp  = document.getElementById('searchSpinner');
    if (show) {
        if (ls)  ls.style.display  = 'block';
        if (rs)  rs.style.display  = 'none';
        if (sp)  sp.style.display  = '';
        if (btn) btn.disabled      = true;
    } else {
        if (ls)  ls.style.display  = 'none';
        if (sp)  sp.style.display  = 'none';
        if (btn) btn.disabled      = false;
    }
}

function showError(msg, details) {
    const el = document.getElementById('errorMsg');
    const et = document.getElementById('errorText');
    const ed = document.getElementById('errorDetails');
    if (!el) return;
    if (et) et.textContent = msg || 'حدث خطأ';
    if (ed) ed.textContent = details || '';
    el.style.display = 'block';
    setTimeout(() => hideError(), 6000);
}
function hideError() { const el = document.getElementById('errorMsg'); if (el) el.style.display = 'none'; }
function getSurahAyahCount(n) { const s = surahsList.find(s => s.number === n); return s ? s.numberOfAyahs : 0; }

function fmt(s) {
    if (!s || isNaN(s)) return '0:00';
    return Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
}

function toAr(n) {
    return String(n).split('').map(d => '٠١٢٣٤٥٦٧٨٩'[+d] !== undefined ? '٠١٢٣٤٥٦٧٨٩'[+d] : d).join('');
}

// ── Expose globally ──────────────────────────────────────────
window.loadQuickAyah               = loadQuickAyah;
window.__loadQuickAyah             = loadQuickAyah;
window.playAudio                   = playAudio;
window.pauseAudio                  = pauseAudio;
window.downloadAudio               = downloadAudio;
window.shareAyah                   = shareAyah;
window.copyAyah                    = copyAyah;
window.fetchAyahBySurah            = fetchAyahBySurah;
window.searchByGlobalAyah          = searchByGlobalAyah;
window.previousAyah                = previousAyah;
window.nextAyah                    = nextAyah;
window.toggleLegend                = toggleLegend;
window.loadFullSurahRead           = loadFullSurahRead;
window.startFullSurahAudioWithList = startFullSurahAudioWithList;
window.toggleFullSurahPlay         = toggleFullSurahPlay;
window.fullSurahPrev               = fullSurahPrev;
window.fullSurahNext               = fullSurahNext;
window.seekFullAudio               = seekFullAudio;
window.seekToAyahIdx               = seekToAyahIdx;
window.copyFullSurah               = copyFullSurah;
window.shareFullSurah              = shareFullSurah;
window.quickListenAyah             = quickListenAyah;
window.fmt                         = fmt;
window.toAr                        = toAr;
window.showFullSurahReadInfo       = showFullSurahReadInfo;
window.showFullSurahAudioInfo      = showFullSurahAudioInfo;
window.resetFullAudioPlayer        = resetFullAudioPlayer;
window.playFullSurahAyah           = playFullSurahAyah;
