(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function get(k) { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  var NAMES = { 1: "แนวคิดและหลักการออกแบบเว็บไซต์", 2: "พื้นฐานสำหรับการเขียนโปรแกรมบนเว็บ", 3: "พื้นฐานภาษา HTML", 4: "พื้นฐาน CSS", 5: "พื้นฐาน Bootstrap", 6: "พื้นฐานภาษา JavaScript", 7: "พื้นฐานภาษา PHP", 8: "พื้นฐานภาษา MySQLi", 9: "การใช้โปรแกรมสำเร็จรูปเพื่อจัดทำเว็บไซต์", 10: "การจัดตั้งเว็บไซต์" };
  var base = (document.querySelector('link[rel=stylesheet]').getAttribute("href") || "").replace("assets/style.css", "");

  /* theme */
  var tb = $("#theme");
  if (tb) tb.addEventListener("click", function () {
    var cur = document.documentElement.getAttribute("data-theme");
    var dark = cur ? cur === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    var nx = dark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nx);
    try { localStorage.setItem("theme", nx); } catch (e) {}
  });

  /* mobile menu */
  var mb = $("#menuBtn"), menu = $("#menu");
  if (mb && menu) {
    mb.addEventListener("click", function () {
      var o = menu.classList.toggle("open");
      mb.setAttribute("aria-expanded", o ? "true" : "false");
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { menu.classList.remove("open"); mb.setAttribute("aria-expanded", "false"); } });
  }

  /* reading progress bar */
  var bar = $("#bar");
  if (bar && document.body.classList.contains("ch-page")) {
    var onScroll = function () {
      var h = document.documentElement.scrollHeight - innerHeight;
      bar.style.width = (h > 0 ? Math.min(100, scrollY / h * 100) : 0) + "%";
    };
    addEventListener("scroll", onScroll, { passive: true }); onScroll();
  }

  /* syntax highlighting (small, dependency free) */
  function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function lang(t) {
    if (/<\?php|\$[a-zA-Z_]\w*\s*=|->|::/.test(t) && !/^\s*<!doctype|^\s*<html/i.test(t) || /<\?php/.test(t)) return "php";
    if (/^\s*(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|USE|SHOW)\b/i.test(t)) return "sql";
    if (/^\s*</.test(t)) return "html";
    if (/^\s*(\/\/|\/\*)?\s*[.#@a-zA-Z*][^{;]*\{[^}]*:[^}]*;/.test(t) && !/function|=>/.test(t)) return "css";
    if (/^\s*[{[]\s*"/.test(t)) return "json";
    if (/\b(function|const|let|var|document\.|console\.|=>)\b/.test(t)) return "js";
    return "text";
  }
  var KW = {
    js: "function|const|let|var|return|if|else|for|while|switch|case|break|new|class|async|await|try|catch|throw|import|export|from|of|in|typeof|true|false|null|undefined|this",
    php: "function|return|if|else|elseif|foreach|for|while|echo|isset|empty|new|class|public|private|static|try|catch|throw|require|include|require_once|include_once|true|false|null|as|exit|match|fn",
    sql: "SELECT|FROM|WHERE|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|DATABASE|ALTER|DROP|PRIMARY|KEY|FOREIGN|REFERENCES|NOT|NULL|AUTO_INCREMENT|DEFAULT|AND|OR|ORDER|BY|GROUP|LIMIT|JOIN|ON|LEFT|INNER|AS|IN|LIKE|CONSTRAINT|ENGINE|CHARSET|INT|VARCHAR|DOUBLE|TEXT|DATE|USE|COUNT|SUM|DESC|ASC|UNIQUE|INDEX"
  };
  function hl(text, lg) {
    var out = "", i = 0;
    var rules;
    if (lg === "html") {
      rules = [[/^<!--[\s\S]*?-->/, "t-c"], [/^<!DOCTYPE[^>]*>/i, "t-k"], [/^<\/?[a-zA-Z][\w-]*/, "t-t"], [/^\/?>/, "t-t"], [/^[a-zA-Z-:@]+(?==)/, "t-a"], [/^"[^"]*"|^'[^']*'/, "t-s"]];
    } else if (lg === "css") {
      rules = [[/^\/\*[\s\S]*?\*\//, "t-c"], [/^[.#][\w-]+|^@[\w-]+/, "t-k"], [/^[a-zA-Z-]+(?=\s*:)/, "t-a"], [/^#[0-9a-fA-F]{3,8}\b/, "t-s"], [/^-?\d*\.?\d+(px|em|rem|%|vh|vw|s|ms|deg|fr)?/, "t-n"], [/^"[^"]*"|^'[^']*'/, "t-s"]];
    } else if (lg === "json") {
      rules = [[/^"[^"]*"(?=\s*:)/, "t-a"], [/^"[^"]*"/, "t-s"], [/^-?\d+\.?\d*/, "t-n"], [/^(true|false|null)\b/, "t-k"]];
    } else {
      var kw = new RegExp("^(" + KW[lg] + ")\\b", lg === "sql" ? "i" : "");
      rules = [[/^\/\*[\s\S]*?\*\//, "t-c"], [lg === "sql" ? /^--[^\n]*/ : /^\/\/[^\n]*|^#[^\n]*/, "t-c"], [/^"(?:\\.|[^"\\])*"|^'(?:\\.|[^'\\])*'|^`(?:\\.|[^`\\])*`/, "t-s"], [/^<\?php|^\?>/, "t-t"], [/^\$[a-zA-Z_]\w*/, "t-var"], [kw, "t-k"], [/^\d+\.?\d*/, "t-n"]];
    }
    while (i < text.length) {
      var rest = text.slice(i), m = null, cls = null;
      for (var r = 0; r < rules.length; r++) { m = rules[r][0].exec(rest); if (m && m[0].length) { cls = rules[r][1]; break; } m = null; }
      if (m) { out += '<span class="' + cls + '">' + esc(m[0]) + "</span>"; i += m[0].length; }
      else { out += esc(rest.charAt(0)); i++; }
    }
    return out;
  }
  var LN = { html: "HTML", css: "CSS", js: "JavaScript", php: "PHP", sql: "SQL", json: "JSON", text: "โค้ด" };
  $$(".code").forEach(function (box) {
    var codeEl = $("code", box), src = codeEl.textContent, lg = lang(src);
    if (src.length < 20000 && lg !== "text") codeEl.innerHTML = hl(src, lg);
    var lab = $(".bar>span:first-child", box); if (lab) lab.textContent = LN[lg];
    var cp = $(".copy", box);
    if (cp) cp.addEventListener("click", function () {
      var done = function () { cp.textContent = "คัดลอกแล้ว ✓"; setTimeout(function () { cp.textContent = "คัดลอก"; }, 1600); };
      if (navigator.clipboard) navigator.clipboard.writeText(src).then(done, function () {});
    });
    var rn = $(".run", box);
    if (rn) rn.addEventListener("click", function () {
      var nxt = box.nextElementSibling;
      if (nxt && nxt.classList.contains("preview")) { nxt.parentNode.removeChild(nxt); rn.textContent = "▶ ลองรัน"; return; }
      var d = document.createElement("div"); d.className = "preview";
      var f = document.createElement("iframe");
      f.setAttribute("sandbox", "allow-scripts"); f.title = "ผลลัพธ์ตัวอย่าง"; f.srcdoc = src;
      d.appendChild(f); box.parentNode.insertBefore(d, box.nextSibling); rn.textContent = "■ ปิดผลลัพธ์";
    });
  });

  /* progress + resume */
  var prog = get("progress") || {};
  $$(".card[data-ch]").forEach(function (c) { if (prog[c.getAttribute("data-ch")]) c.classList.add("done"); });
  $$("[data-prog]").forEach(function (el) {
    var ns = el.getAttribute("data-prog").split(","), d = ns.filter(function (n) { return prog[n]; }).length;
    el.style.width = (d / ns.length * 100) + "%";
    var t = $('[data-progtxt="' + el.getAttribute("data-prog") + '"]'); if (t) t.textContent = d + "/" + ns.length + " บท";
  });
  var art = $(".chapter[data-ch]");
  if (art) {
    var n = art.getAttribute("data-ch"), cb = $("#done");
    set("last", n);
    if (cb) { cb.checked = !!prog[n]; cb.addEventListener("change", function () { prog[n] = cb.checked; set("progress", prog); }); }
    var links = $$(".side a"), secs = links.map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); });
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { links.forEach(function (l) { l.classList.remove("on"); }); var i = secs.indexOf(e.target); if (i > -1) links[i].classList.add("on"); }
        });
      }, { rootMargin: "-80px 0px -70% 0px" });
      secs.forEach(function (s) { if (s) io.observe(s); });
    }
    var tocbox = $(".tocbox");
    if (tocbox && innerWidth <= 980) tocbox.removeAttribute("open");
  }
  var last = get("last");
  ["resume", "resumeHome"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el && last && NAMES[last]) {
      el.hidden = false;
      el.innerHTML = '<a href="' + base + "chapters/ch" + last + '.html"><span>▶</span><span><small>อ่านต่อจากครั้งก่อน</small><b>บทที่ ' + last + " " + NAMES[last] + "</b></span></a>";
    }
  });
})();
