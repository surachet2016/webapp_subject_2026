/* ตัวควบคุมสไลด์กลาง รายวิชา 07-034-210
   ใช้: ใส่ <section class="slide" data-title="..."> ใน #stage แล้วเรียก <script src="deck.js" data-ch="2" data-back="../chapters/ch2.html"></script> ท้ายหน้า
   ฟังก์ชันช่วย: Deck.onEnter(ลำดับสไลด์เริ่ม 1, fn), Deck.tabs(element, fn), Deck.pipe(id), Deck.run(textareaId, iframeId) */
(function () {
  var me = document.currentScript, ch = me.dataset.ch || "", back = me.dataset.back || "../chapters.html";
  var st = document.getElementById("stage"), S = [].slice.call(document.querySelectorAll(".slide")), i = 0, enter = {};
  document.body.insertAdjacentHTML("beforeend",
    '<div id="bar"></div><div id="hud"><button id="bPrev" aria-label="สไลด์ก่อนหน้า">←</button><span id="cnt"></span>' +
    '<button id="bNext" aria-label="สไลด์ถัดไป">→</button><button id="bToc">สารบัญ</button><button id="bFull">เต็มจอ</button>' +
    '<a href="' + back + '">ออก</a></div><div id="toc"><h2>สารบัญสไลด์บทที่ ' + ch + '</h2><ol id="tocList"></ol>' +
    '<p style="color:#c7cbe8;margin-top:14px;font-size:18px">กด Esc หรือ O เพื่อปิด</p></div>');
  function fit() { var s = Math.min(innerWidth / 1280, innerHeight / 720) * 0.98; st.style.transform = "translate(-50%,-50%) scale(" + s + ")"; }
  addEventListener("resize", fit); fit();
  function go(n) {
    n = Math.max(0, Math.min(S.length - 1, n));
    S.forEach(function (e, k) { e.classList.toggle("on", k === n); e.classList.toggle("prev", k < n); });
    i = n;
    document.getElementById("cnt").textContent = (n + 1) + " / " + S.length;
    document.getElementById("bar").style.width = ((n + 1) / S.length * 100) + "%";
    history.replaceState(null, "", "#" + (n + 1));
    if (enter[n + 1]) enter[n + 1]();
  }
  function toc() { document.getElementById("toc").classList.toggle("on"); }
  function full() { if (!document.fullscreenElement) { if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen(); } else document.exitFullscreen(); }
  document.addEventListener("keydown", function (e) {
    if (/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
    if (["ArrowRight", "PageDown", " "].indexOf(e.key) > -1) { e.preventDefault(); go(i + 1); }
    else if (["ArrowLeft", "PageUp"].indexOf(e.key) > -1) go(i - 1);
    else if (e.key === "Home") go(0); else if (e.key === "End") go(S.length - 1);
    else if (e.key === "o" || e.key === "O") toc();
    else if (e.key === "Escape") document.getElementById("toc").classList.remove("on");
    else if (e.key === "f" || e.key === "F") full();
  });
  var tx = null;
  document.addEventListener("touchstart", function (e) { tx = e.touches[0].clientX; }, { passive: true });
  document.addEventListener("touchend", function (e) { if (tx === null) return; var d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 60) go(i + (d < 0 ? 1 : -1)); tx = null; });
  document.getElementById("bPrev").onclick = function () { go(i - 1); };
  document.getElementById("bNext").onclick = function () { go(i + 1); };
  document.getElementById("bToc").onclick = toc;
  document.getElementById("bFull").onclick = full;
  var tl = document.getElementById("tocList");
  S.forEach(function (s, k) { var li = document.createElement("li"); li.textContent = s.dataset.title; li.onclick = function () { go(k); toc(); }; tl.appendChild(li); });
  window.Deck = {
    onEnter: function (n, fn) { enter[n] = fn; },
    tabs: function (el, fn) {
      [].forEach.call(el.querySelectorAll("button"), function (b) {
        b.addEventListener("click", function () { [].forEach.call(el.querySelectorAll("button"), function (x) { x.classList.remove("on"); }); b.classList.add("on"); fn(b); });
      });
    },
    pipe: function (id) {
      var sts = [].slice.call(document.querySelectorAll("#" + id + " .st")), k = 0;
      sts.forEach(function (x) { x.classList.remove("lit"); });
      var t = setInterval(function () {
        if (k > 0) sts[k - 1].classList.remove("lit");
        if (k >= sts.length) { clearInterval(t); sts.forEach(function (x) { x.classList.add("lit"); }); return; }
        sts[k].classList.add("lit"); k++;
      }, 450);
    },
    run: function (ta, fr) {
      document.getElementById(fr).srcdoc = '<!doctype html><html lang="th"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><body style="margin:0;padding:12px 16px;font-family:Sarabun,\'Noto Sans Thai\',sans-serif;font-size:19px;line-height:1.5">' + document.getElementById(ta).value + "</body></html>";
    },
    go: function (n) { go(n - 1); }
  };
  function fromHash() { var n = Math.max(0, (parseInt(location.hash.slice(1), 10) || 1) - 1); if (n !== i || !S[n].classList.contains("on")) go(n); }
  addEventListener("hashchange", fromHash);
  setTimeout(fromHash, 0);
})();
