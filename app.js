(() => {
  const cfg = window.DATE_CONFIG;

  // ============================================================
  // State
  // ============================================================
  const state = {
    step: "ask",
    noCount: 0,
    soundOn: true,
    date: "",
    timeSlot: cfg.timeSlots[2], // Default: Golden Hour
    foods: [],
    customFood: "",
    desserts: [],
    customDessert: "",
    activities: [],
    note: ""
  };

  // ============================================================
  // Cute Web Audio Synthesizer (no external audio files needed!)
  // ============================================================
  let audioCtx = null;
  function playTone(freq, duration = 0.11, type = "sine", vol = 0.08, delay = 0) {
    if (!state.soundOn) return;
    try {
      if (!audioCtx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        audioCtx = new AC();
      }
      if (audioCtx.state === "suspended") audioCtx.resume();
      const now = audioCtx.currentTime + delay;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(vol, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + duration + 0.02);
    } catch {
      // Ignore audio errors
    }
  }

  function playPop() {
    playTone(580, 0.08, "sine", 0.07);
    playTone(760, 0.07, "sine", 0.05, 0.04);
  }

  function playBoing() {
    playTone(360, 0.09, "triangle", 0.06);
    playTone(290, 0.1, "triangle", 0.05, 0.05);
  }

  function playCelebrate() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, i) => playTone(n, 0.18, "sine", 0.08, i * 0.08));
  }

  // ============================================================
  // Helpers
  // ============================================================
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  function showToast(msg) {
    const toast = $("#toast");
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("show"), 2600);
  }

  function formatLocalISO(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function formatPrettyDate(isoStr) {
    if (!isoStr) return "Soon 💕";
    const [y, m, d] = isoStr.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric"
    });
  }

  function nextWeekday(targetDay) {
    // 0 = Sun ... 6 = Sat
    const now = new Date();
    const diff = (targetDay - now.getDay() + 7) % 7 || 7;
    const d = new Date(now);
    d.setDate(now.getDate() + diff);
    return d;
  }

  // ============================================================
  // Floating Background Hearts
  // ============================================================
  function initFloaters() {
    const container = $("#bgFloaters");
    const icons = ["💕", "✨", "🌸", "💗", "🍓", "🎀", "☁️"];
    for (let i = 0; i < 16; i++) {
      const el = document.createElement("span");
      el.className = "floater";
      el.textContent = icons[i % icons.length];
      el.style.left = `${Math.random() * 100}%`;
      el.style.fontSize = `${14 + Math.random() * 16}px`;
      el.style.animationDuration = `${11 + Math.random() * 12}s`;
      el.style.animationDelay = `${-Math.random() * 16}s`;
      container.appendChild(el);
    }
  }

  // ============================================================
  // Confetti Engine
  // ============================================================
  const confettiCanvas = $("#confettiCanvas");
  const cCtx = confettiCanvas.getContext("2d");
  let confettiPieces = [];
  let confettiAnimId = null;

  function resizeConfetti() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeConfetti);
  resizeConfetti();

  function launchConfetti(count = 95) {
    const colors = ["#ff6b9d", "#ff9ebb", "#ffd166", "#a8e6cf", "#ffb3c6", "#c8b6ff"];
    for (let i = 0; i < count; i++) {
      confettiPieces.push({
        x: window.innerWidth * (0.15 + Math.random() * 0.7),
        y: window.innerHeight * 0.35 + (Math.random() - 0.5) * 80,
        vx: (Math.random() - 0.5) * 11,
        vy: -5 - Math.random() * 9,
        size: 6 + Math.random() * 7,
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * 360,
        vrot: (Math.random() - 0.5) * 12,
        life: 1
      });
    }
    if (!confettiAnimId) animateConfetti();
  }

  function animateConfetti() {
    cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiPieces = confettiPieces.filter((p) => p.life > 0.02 && p.y < confettiCanvas.height + 30);
    confettiPieces.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.28;
      p.vx *= 0.99;
      p.rot += p.vrot;
      p.life -= 0.008;

      cCtx.save();
      cCtx.translate(p.x, p.y);
      cCtx.rotate((p.rot * Math.PI) / 180);
      cCtx.globalAlpha = Math.max(0, p.life);
      cCtx.fillStyle = p.color;
      cCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
      cCtx.restore();
    });

    if (confettiPieces.length > 0) {
      confettiAnimId = requestAnimationFrame(animateConfetti);
    } else {
      confettiAnimId = null;
      cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  // ============================================================
  // Screen Navigation
  // ============================================================
  const progressSteps = {
    datetime: { idx: 1, total: 4, hearts: "💕" },
    food: { idx: 2, total: 4, hearts: "💕💕" },
    dessert: { idx: 3, total: 4, hearts: "💕💕💕" },
    activity: { idx: 4, total: 4, hearts: "💕💕💕💕" }
  };

  function goTo(stepName) {
    state.step = stepName;
    $$(".screen").forEach((s) => s.classList.remove("active"));
    const target = $(`#screen-${stepName}`);
    if (target) target.classList.add("active");

    // Reset runaway No button if leaving ask screen
    const btnNo = $("#btnNo");
    if (stepName !== "ask" && btnNo.classList.contains("floating-no")) {
      btnNo.classList.remove("floating-no");
      btnNo.style.left = "";
      btnNo.style.top = "";
    }

    const pWrap = $("#progressWrap");
    if (progressSteps[stepName]) {
      const info = progressSteps[stepName];
      pWrap.classList.remove("hidden");
      $("#progressLabel").textContent = `Step ${info.idx} of ${info.total}`;
      $("#progressHearts").textContent = info.hearts;
      $("#progressFill").style.width = `${(info.idx / info.total) * 100}%`;
    } else {
      pWrap.classList.add("hidden");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ============================================================
  // Screen 1: Runaway No Button & Growing Yes Button
  // ============================================================
  function setupAskScreen() {
    $$("[data-gf-name]").forEach((el) => {
      el.textContent = cfg.girlfriendName;
    });

    const btnYes = $("#btnYes");
    const btnNo = $("#btnNo");
    const subtitle = $("#askSubtitle");
    const rejectWord = $("#rejectWord");

    function triggerRejectStamp(attemptNum) {
      // Keeps growing bigger every single time she tries to press No!
      const stampScale = 1 + (attemptNum - 1) * 0.38;
      rejectWord.style.setProperty("--stamp-scale", stampScale.toFixed(2));
      rejectWord.classList.remove("pop");
      // Force reflow so animation replays cleanly every attempt
      void rejectWord.offsetWidth;
      rejectWord.classList.add("pop");
    }

    const subtitles = [
      "I promise good food, cute vibes, and my best company 🥺✨",
      "Wait... did your finger slip? 🤨💕",
      "Pretty please with a strawberry on top? 🍓",
      "I already picked out my cutest outfit though! 🥺",
      "Resistance is futile, just press Yes! 😜🎀"
    ];

    function dodgeNo(e) {
      if (e) e.preventDefault();
      playBoing();
      state.noCount += 1;
      triggerRejectStamp(state.noCount);

      const noMsgs = cfg.noButtonMessages.slice(1);
      btnNo.textContent = noMsgs[(state.noCount - 1) % noMsgs.length];
      subtitle.textContent = subtitles[((state.noCount - 1) % (subtitles.length - 1)) + 1];

      // Grow the Yes button!
      const scale = Math.min(1 + state.noCount * 0.12, 2.1);
      btnYes.style.transform = `scale(${scale})`;

      // Move No button to a safe random spot inside viewport
      btnNo.classList.add("floating-no");
      const pad = 16;
      const bw = btnNo.offsetWidth || 120;
      const bh = btnNo.offsetHeight || 48;
      const maxX = Math.max(pad, window.innerWidth - bw - pad);
      const maxY = Math.max(pad, window.innerHeight - bh - pad);
      const randX = pad + Math.random() * (maxX - pad);
      const randY = pad + Math.random() * (maxY - pad);

      btnNo.style.left = `${randX}px`;
      btnNo.style.top = `${randY}px`;
    }

    btnNo.addEventListener("mouseenter", dodgeNo);
    btnNo.addEventListener("touchstart", dodgeNo, { passive: false });
    btnNo.addEventListener("click", dodgeNo);

    btnYes.addEventListener("click", () => {
      playCelebrate();
      launchConfetti(110);
      goTo("yay");
    });

    $("#btnStartPlan").addEventListener("click", () => {
      playPop();
      goTo("datetime");
    });
  }

  // ============================================================
  // Screen 3: Date & Time
  // ============================================================
  function setupDateTimeScreen() {
    const dateInput = $("#dateInput");
    const quickDays = $("#quickDays");
    const timeGrid = $("#timeGrid");

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const thu = nextWeekday(4);
    const fri = nextWeekday(5);
    const sat = nextWeekday(6);
    const sun = nextWeekday(0);

    const presets = [
      { label: "Tomorrow 🌸", date: formatLocalISO(tomorrow) },
      { label: "This Thursday 🎀", date: formatLocalISO(thu) },
      { label: "This Friday ✨", date: formatLocalISO(fri) },
      { label: "This Saturday 💕", date: formatLocalISO(sat) },
      { label: "This Sunday ☀️", date: formatLocalISO(sun) }
    ];

    // Default to This Saturday
    state.date = presets[3].date;
    dateInput.min = formatLocalISO(new Date());
    dateInput.value = state.date;

    function renderQuickDays() {
      quickDays.innerHTML = "";
      presets.forEach((p) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "quick-pill" + (state.date === p.date ? " selected" : "");
        b.textContent = p.label;
        b.addEventListener("click", () => {
          playPop();
          state.date = p.date;
          dateInput.value = p.date;
          renderQuickDays();
        });
        quickDays.appendChild(b);
      });
    }

    dateInput.addEventListener("change", () => {
      state.date = dateInput.value;
      renderQuickDays();
    });

    function renderTimeSlots() {
      timeGrid.innerHTML = "";
      cfg.timeSlots.forEach((slot) => {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "time-card" + (state.timeSlot.id === slot.id ? " selected" : "");
        card.innerHTML = `
          <span class="tc-emoji">${slot.emoji}</span>
          <span class="tc-label">${slot.label}</span>
          <span class="tc-time">${slot.time}</span>
        `;
        card.addEventListener("click", () => {
          playPop();
          state.timeSlot = slot;
          renderTimeSlots();
        });
        timeGrid.appendChild(card);
      });
    }

    renderQuickDays();
    renderTimeSlots();

    $("#btnNextFromDate").addEventListener("click", () => {
      if (!state.date) {
        showToast("Pick a day first! 📅");
        return;
      }
      playPop();
      goTo("food");
    });
  }

  // ============================================================
  // Option Grids (Food, Dessert, Activity)
  // ============================================================
  function buildOptionGrid(containerId, items, stateKey) {
    const grid = $(containerId);
    function render() {
      grid.innerHTML = "";
      items.forEach((item) => {
        const isSelected = state[stateKey].some((x) => x.id === item.id);
        const card = document.createElement("button");
        card.type = "button";
        card.className = "option-card" + (isSelected ? " selected" : "");
        card.innerHTML = `
          <span class="opt-emoji">${item.emoji}</span>
          <span class="opt-label">${item.label}</span>
          <span class="opt-tag">${item.tag}</span>
        `;
        card.addEventListener("click", () => {
          playPop();
          if (isSelected) {
            state[stateKey] = state[stateKey].filter((x) => x.id !== item.id);
          } else {
            state[stateKey] = [...state[stateKey], item];
          }
          render();
        });
        grid.appendChild(card);
      });
    }
    render();
  }

  function setupPickers() {
    buildOptionGrid("#foodGrid", cfg.foods, "foods");
    buildOptionGrid("#dessertGrid", cfg.desserts, "desserts");
    buildOptionGrid("#activityGrid", cfg.activities, "activities");

    $("#btnNextFromFood").addEventListener("click", () => {
      state.customFood = $("#customFood").value.trim();
      if (state.foods.length === 0 && !state.customFood) {
        showToast("Pick at least one yummy food! 🍣");
        return;
      }
      playPop();
      goTo("dessert");
    });

    $("#btnNextFromDessert").addEventListener("click", () => {
      state.customDessert = $("#customDessert").value.trim();
      if (state.desserts.length === 0 && !state.customDessert) {
        showToast("Pick a sweet treat or drink! 🧋");
        return;
      }
      playPop();
      goTo("activity");
    });

    $("#btnFinish").addEventListener("click", () => {
      state.note = $("#specialNote").value.trim();
      if (state.activities.length === 0) {
        showToast("Pick at least one fun activity! 🎀");
        return;
      }
      playCelebrate();
      populateTicket();
      goTo("ticket");
      launchConfetti(120);
    });

    // Back buttons
    $$("[data-back]").forEach((btn) => {
      btn.addEventListener("click", () => {
        playPop();
        goTo(btn.getAttribute("data-back"));
      });
    });
  }

  // ============================================================
  // Summary & Ticket
  // ============================================================
  function getSummaryData() {
    const foodList = state.foods.map((f) => `${f.emoji} ${f.label}`);
    if (state.customFood) foodList.push(`✨ ${state.customFood}`);

    const dessertList = state.desserts.map((d) => `${d.emoji} ${d.label}`);
    if (state.customDessert) dessertList.push(`✨ ${state.customDessert}`);

    const activityList = state.activities.map((a) => `${a.emoji} ${a.label}`);

    return {
      couple: `${cfg.girlfriendName} & ${cfg.yourName}`,
      dateTime: `${formatPrettyDate(state.date)} • ${state.timeSlot.time}`,
      food: foodList.join(", ") || "Surprise Me! ✨",
      dessert: dessertList.join(", ") || "Surprise Me! 🍓",
      activity: activityList.join(", ") || "Surprise Me! 🎀",
      note: state.note
    };
  }

  function populateTicket() {
    const data = getSummaryData();
    $("#ticketCouple").textContent = data.couple;
    $("#ticketDateTime").textContent = data.dateTime;
    $("#ticketFood").textContent = data.food;
    $("#ticketDessert").textContent = data.dessert;
    $("#ticketActivity").textContent = data.activity;

    const noteRow = $("#ticketNoteRow");
    if (data.note) {
      $("#ticketNote").textContent = data.note;
      noteRow.classList.remove("hidden");
    } else {
      noteRow.classList.add("hidden");
    }

    const code = Math.floor(100 + Math.random() * 900);
    $("#ticketSerial").textContent = `LOVE-${new Date().getFullYear()}-${code}`;
  }

  function buildShareText() {
    const d = getSummaryData();
    const lines = [
      `💕 IT'S A DATE! (${d.couple}) 🎟️`,
      ``,
      `📅 When: ${d.dateTime}`,
      `🍽️ Food: ${d.food}`,
      `🍓 Dessert: ${d.dessert}`,
      `🎀 Activity: ${d.activity}`
    ];
    if (d.note) lines.push(`💌 Note: ${d.note}`);
    lines.push(``, `Can't wait!! 🥰✨`);
    return lines.join("\n");
  }

  // ============================================================
  // High-DPI Native Canvas PNG Ticket Downloader (works 100% offline!)
  // ============================================================
  function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";
    let currY = y;
    for (let i = 0; i < words.length; i++) {
      const test = line ? `${line} ${words[i]}` : words[i];
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, x, currY);
        line = words[i];
        currY += lineHeight;
      } else {
        line = test;
      }
    }
    if (line) ctx.fillText(line, x, currY);
    return currY + lineHeight;
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function downloadTicketPNG() {
    const d = getSummaryData();
    const scale = 2;
    const width = 640;
    const height = d.note ? 560 : 500;

    const canvas = document.createElement("canvas");
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext("2d");
    ctx.scale(scale, scale);

    // Outer pastel background
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, "#fff5f8");
    bgGrad.addColorStop(1, "#ffe3ee");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Subtle decorative hearts in corners
    ctx.font = "28px sans-serif";
    ctx.fillText("🌸", 20, 42);
    ctx.fillText("✨", width - 52, 42);
    ctx.fillText("💕", 22, height - 20);
    ctx.fillText("🎀", width - 52, height - 20);

    // Ticket card
    const tx = 44;
    const ty = 44;
    const tw = width - 88;
    const th = height - 88;

    ctx.save();
    ctx.shadowColor = "rgba(255, 107, 157, 0.22)";
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 10;
    roundRect(ctx, tx, ty, tw, th, 28);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.restore();

    roundRect(ctx, tx, ty, tw, th, 28);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#ffb3ce";
    ctx.stroke();

    // Header
    ctx.fillStyle = "#d6336c";
    ctx.font = "700 13px Quicksand, sans-serif";
    ctx.fillText("ADMIT TWO  •  OFFICIAL DATE PASS", tx + 28, ty + 42);

    ctx.fillStyle = "#4a2535";
    ctx.font = "700 28px Fredoka, sans-serif";
    ctx.fillText(d.couple, tx + 28, ty + 76);

    // Stamp
    ctx.save();
    ctx.translate(tx + tw - 92, ty + 54);
    ctx.rotate(-0.1);
    roundRect(ctx, -64, -18, 128, 34, 10);
    ctx.fillStyle = "#fff0f6";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#ff6b9d";
    ctx.stroke();
    ctx.fillStyle = "#d6336c";
    ctx.font = "700 13px Fredoka, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("CONFIRMED 💕", 0, 4);
    ctx.restore();

    // Dashed divider
    const divY = ty + 106;
    ctx.save();
    ctx.setLineDash([8, 6]);
    ctx.strokeStyle = "#ffb3ce";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(tx + 14, divY);
    ctx.lineTo(tx + tw - 14, divY);
    ctx.stroke();
    ctx.restore();

    // Ticket notches
    ctx.fillStyle = "#ffecf3";
    ctx.beginPath();
    ctx.arc(tx, divY, 12, 0, Math.PI * 2);
    ctx.arc(tx + tw, divY, 12, 0, Math.PI * 2);
    ctx.fill();

    // Rows
    const rows = [
      { label: "📅 Date & Time", val: d.dateTime },
      { label: "🍽️ Food", val: d.food },
      { label: "🍓 Dessert", val: d.dessert },
      { label: "🎀 Activity", val: d.activity }
    ];
    if (d.note) rows.push({ label: "💌 Note", val: d.note });

    let currY = divY + 38;
    rows.forEach((r) => {
      ctx.fillStyle = "#8a5a6e";
      ctx.font = "700 15px Quicksand, sans-serif";
      ctx.fillText(r.label, tx + 28, currY);

      ctx.fillStyle = "#4a2535";
      ctx.font = "700 16px Quicksand, sans-serif";
      currY = wrapCanvasText(ctx, r.val, tx + 175, currY, tw - 205, 22) + 18;
    });

    // Footer barcode
    const footY = ty + th - 48;
    ctx.fillStyle = "#ffe6f0";
    ctx.fillRect(tx + 28, footY - 12, tw - 56, 2);

    ctx.fillStyle = "rgba(214, 51, 108, 0.45)";
    let bx = tx + 28;
    for (let i = 0; i < 42; i++) {
      const bw = i % 3 === 0 ? 4 : 2;
      ctx.fillRect(bx, footY + 4, bw, 22);
      bx += bw + (i % 2 === 0 ? 4 : 2);
    }

    ctx.fillStyle = "#8a5a6e";
    ctx.font = "700 13px monospace";
    ctx.textAlign = "right";
    ctx.fillText($("#ticketSerial").textContent, tx + tw - 28, footY + 20);

    // Trigger download
    const link = document.createElement("a");
    link.download = `${cfg.girlfriendName.toLowerCase()}-date-ticket.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    showToast("Date Ticket saved! 📸💕");
  }

  function setupTicketActions() {
    $("#btnWhatsApp").addEventListener("click", () => {
      playPop();
      const text = encodeURIComponent(buildShareText());
      const phone = (cfg.whatsappNumber || "").replace(/\D/g, "");
      const url = phone
        ? `https://wa.me/${phone}?text=${text}`
        : `https://wa.me/?text=${text}`;
      window.open(url, "_blank", "noopener,noreferrer");
    });

    $("#btnDownload").addEventListener("click", () => {
      playPop();
      downloadTicketPNG();
    });

    $("#btnCopy").addEventListener("click", async () => {
      playPop();
      const text = buildShareText();
      try {
        await navigator.clipboard.writeText(text);
        showToast("Copied to clipboard! 📋💕");
      } catch {
        showToast("Screenshot the ticket to share! 📸");
      }
    });

    $("#btnEdit").addEventListener("click", () => {
      playPop();
      goTo("datetime");
    });
  }

  // ============================================================
  // Sound Toggle
  // ============================================================
  function setupSoundToggle() {
    $("#soundToggle").addEventListener("click", () => {
      state.soundOn = !state.soundOn;
      $("#soundIcon").textContent = state.soundOn ? "🔊" : "🔇";
      if (state.soundOn) playPop();
    });
  }

  // ============================================================
  // Init
  // ============================================================
  initFloaters();
  setupSoundToggle();
  setupAskScreen();
  setupDateTimeScreen();
  setupPickers();
  setupTicketActions();
})();
