(function () {
  "use strict";
  const D = window.SITE_DATA || {};
  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const fmtDate = (iso) => (iso ? iso.replace(/-/g, ".") : "");
  const year = (iso) => (iso ? iso.slice(0, 4) : "—");
  const host = (url) => {
    try { return new URL(url).hostname.replace(/^www\./, ""); } catch (e) { return url; }
  };

  /* ---------------- NEWS (auto-generated, latest first) ---------------- */
  function buildNews() {
    const wrap = $("#news");
    const pubs = (D.publications || []).map((p) => ({ ...p, cat: "Publication" }));
    const spk = (D.speaking || []).map((p) => ({ ...p, cat: "Speaking" }));
    const all = pubs.concat(spk).filter((x) => x.date).sort((a, b) => (a.date < b.date ? 1 : -1));
    const latest = all.slice(0, 7);

    const hero = el("div", "hero");
    hero.innerHTML = `
      <div class="hero-eyebrow">AI · Risk · Governance</div>
      <h1>${esc(D.name_ja)}<span class="en">${esc(D.name_en)}</span></h1>
      <p class="lead">${esc(D.tagline)}</p>`;
    wrap.appendChild(hero);

    if (D.book) {
      const b = D.book;
      const card = el("a", "feature-card");
      card.href = b.link; card.target = "_blank"; card.rel = "noopener";
      card.innerHTML = `
        ${b.cover ? `<img class="feature-cover" src="${esc(b.cover)}" alt="${esc(b.title)} 書影" loading="lazy" />` : ""}
        <div>
          <div class="feature-badge">${esc(b.badge)}</div>
          <h3>${esc(b.title)}</h3>
          <div class="feature-meta">${esc(b.meta)}</div>
          <p>${esc(b.desc)}</p>
          <span class="btn-link">詳細を見る <span class="arrow">→</span></span>
        </div>`;
      wrap.appendChild(card);
    }

    const head = el("div", "section-head");
    head.innerHTML = `<h2>最新の活動</h2><span class="en-label">Latest</span>`;
    wrap.appendChild(head);

    const list = el("div", "news-list");
    latest.forEach((item) => {
      const url = (item.links && item.links[0]) || (item.subs && item.subs[0] && item.subs[0].links && item.subs[0].links[0]);
      const node = url ? el("a", "news-item linked") : el("div", "news-item");
      if (url) { node.href = url; node.target = "_blank"; node.rel = "noopener"; }
      node.innerHTML = `
        <span class="news-date">${fmtDate(item.date)}</span>
        <span class="news-title">${esc(item.title)}</span>
        <span class="news-cat">${esc(item.cat)}</span>`;
      list.appendChild(node);
    });
    wrap.appendChild(list);
  }

  /* ---------------- PROFILE ---------------- */
  function buildProfile() {
    const wrap = $("#profile");
    wrap.appendChild(sectionHead("プロフィール", "Profile"));

    const grid = el("div", "profile-grid");

    const bio = el("div", "bio");
    (D.profile_bio && D.profile_bio.length ? D.profile_bio : [D.intro, D.tagline])
      .forEach((p) => bio.appendChild(el("p", "intro-text", esc(p))));

    // career detail (JA)
    if (D.career_ja && D.career_ja.length) {
      bio.appendChild(disclosure("経歴（詳細）", D.career_ja));
    }
    if (D.career_en && D.career_en.length) {
      bio.appendChild(disclosure("English Profile", D.career_en));
    }
    grid.appendChild(bio);

    // roles side card
    const side = el("div", "side-card");
    side.appendChild(el("h4", null, "現在の活動 / Roles"));
    const ul = el("ul", "roles");
    (D.roles || []).forEach((r) => {
      const li = el("li");
      li.innerHTML = r.link ? `<a href="${esc(r.link)}" target="_blank" rel="noopener">${esc(r.text)}</a>` : esc(r.text);
      if (r.sub && r.sub.length) {
        const sub = el("ul", "sub");
        r.sub.forEach((s) => {
          const sli = el("li");
          sli.innerHTML = s.link ? `<a href="${esc(s.link)}" target="_blank" rel="noopener">${esc(s.text)}</a>` : esc(s.text);
          sub.appendChild(sli);
        });
        li.appendChild(sub);
      }
      ul.appendChild(li);
    });
    side.appendChild(ul);
    grid.appendChild(side);

    wrap.appendChild(grid);
  }

  function disclosure(title, paras) {
    const d = el("details", "disclosure");
    const sum = el("summary");
    sum.innerHTML = `<span>${esc(title)}</span><span class="plus">+</span>`;
    d.appendChild(sum);
    const body = el("div", "disc-body");
    paras.forEach((p) => body.appendChild(el("p", null, esc(p))));
    d.appendChild(body);
    return d;
  }

  /* ---------------- TIMELINE (pubs / speaking) ---------------- */
  function buildTimeline(panelId, items, titleJa, titleEn) {
    const wrap = $("#" + panelId);
    wrap.appendChild(sectionHead(titleJa, titleEn));

    const sorted = items.slice().filter(Boolean).sort((a, b) => ((a.date || "") < (b.date || "") ? 1 : -1));
    const listWrap = el("div");
    const render = () => {
      listWrap.innerHTML = "";
      const ul = el("ul", "tl");
      let curYear = null;
      sorted.forEach((it) => {
        const y = year(it.date);
        if (y !== curYear) { curYear = y; ul.appendChild(el("li", "tl-year", y)); }
        const li = el("li", "tl-item");
        let links = "";
        if (it.links && it.links.length) {
          links = `<div class="tl-links">${it.links.map((l) => `<a href="${esc(l)}" target="_blank" rel="noopener">${esc(host(l))}</a>`).join("")}</div>`;
        }
        let subs = "";
        if (it.subs && it.subs.length) {
          subs = `<ul class="tl-subs">${it.subs.map((s) => {
            const su = s.links && s.links[0];
            const t = esc(s.title);
            return `<li>${su ? `<a href="${esc(su)}" target="_blank" rel="noopener">${t}</a>` : t}</li>`;
          }).join("")}</ul>`;
        }
        li.innerHTML = `
          <span class="tl-date">${fmtDate(it.date)}</span>
          <div class="tl-body"><div class="tl-title">${esc(it.title)}</div>${links}${subs}</div>`;
        ul.appendChild(li);
      });
      listWrap.appendChild(ul);
    };
    render();
    wrap.appendChild(listWrap);
  }

  /* ---------------- LINKS ---------------- */
  // Swap the iframe to the channel's newest upload.
  // 1) Prefer a same-origin JSON kept fresh by a GitHub Action (reliable, no CORS).
  // 2) Fall back to fetching the RSS feed via a public CORS proxy (best effort).
  // 3) If all else fails, the pre-set fallback video stays in place.
  async function loadLatestYouTube(opts, iframe) {
    if (!iframe) return;
    const setSrc = (id) => {
      const next = "https://www.youtube.com/embed/" + id + "?rel=0";
      if (iframe.src !== next) iframe.src = next;
    };

    // 1) same-origin file maintained server-side
    if (opts.file) {
      try {
        const r = await fetch(opts.file + "?t=" + Date.now(), { cache: "no-store" });
        if (r.ok) {
          const j = await r.json();
          if (j && j.videoId) { setSrc(j.videoId); return; }
        }
      } catch (e) {
        /* fall through to proxy */
      }
    }

    // 2) RSS via CORS proxy
    if (opts.channelId) {
      const feed = "https://www.youtube.com/feeds/videos.xml?channel_id=" + opts.channelId;
      const proxies = [
        (u) => "https://api.allorigins.win/raw?url=" + encodeURIComponent(u),
        (u) => "https://corsproxy.io/?url=" + encodeURIComponent(u),
      ];
      for (const wrap of proxies) {
        try {
          const r = await fetch(wrap(feed));
          if (!r.ok) continue;
          const text = await r.text();
          const m = text.match(/<yt:videoId>([\w-]{6,})<\/yt:videoId>/);
          if (m && m[1]) { setSrc(m[1]); return; }
        } catch (e) {
          /* try next proxy */
        }
      }
    }
  }

  function buildLinks() {
    const wrap = $("#links");
    const sections = D.link_sections || [
      { title: "リンク・連絡先", en: "Links & Contacts", contact: true, links: D.links || [] },
    ];

    sections.forEach((sec, i) => {
      if (i > 0) wrap.appendChild(el("hr", "rule"));
      wrap.appendChild(sectionHead(sec.title, sec.en || ""));

      if (sec.youtube_fallback_video || sec.youtube_channel_id) {
        const yt = el("div", "yt-embed");
        const vid = sec.youtube_fallback_video || "";
        yt.innerHTML =
          `<iframe src="${vid ? "https://www.youtube.com/embed/" + esc(vid) + "?rel=0" : ""}" ` +
          `title="${esc(sec.title)} — 最新動画" ` +
          `loading="lazy" frameborder="0" allowfullscreen ` +
          `allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>`;
        wrap.appendChild(yt);
        wrap.appendChild(el("div", "yt-caption", "▶ 最新エピソードを自動表示"));
        if (sec.youtube_channel_id || sec.youtube_latest_file) {
          loadLatestYouTube(
            { channelId: sec.youtube_channel_id, file: sec.youtube_latest_file },
            yt.querySelector("iframe")
          );
        }
      }

      const grid = el("div", "link-grid");
      (sec.links || []).forEach((l) => {
        const a = el("a", "link-card");
        a.href = l.url; a.target = "_blank"; a.rel = "noopener";
        a.innerHTML = `<span class="lc-label">${esc(l.label)}</span><span class="lc-arrow">↗</span>`;
        grid.appendChild(a);
      });
      wrap.appendChild(grid);

      if (sec.contact && D.email) {
        const c = el("div", "contact-block");
        c.innerHTML = `<h4>Contact</h4><div class="email">${esc(D.email)}</div>`;
        wrap.appendChild(c);
      }
    });
  }

  function sectionHead(ja, en) {
    const h = el("div", "section-head");
    h.innerHTML = `<h2>${esc(ja)}</h2><span class="en-label">${esc(en)}</span>`;
    return h;
  }

  /* ---------------- Tabs / routing ---------------- */
  function setupTabs() {
    const tabs = Array.from(document.querySelectorAll(".tab"));
    const panels = Array.from(document.querySelectorAll(".panel"));
    const menuToggle = $("#menuToggle");
    const nav = $("#tabs");

    function activate(name, push) {
      tabs.forEach((t) => t.classList.toggle("active", t.dataset.tab === name));
      panels.forEach((p) => p.classList.toggle("active", p.dataset.panel === name));
      nav.classList.remove("open");
      menuToggle.classList.remove("open");
      window.scrollTo({ top: 0, behavior: "auto" });
      if (push) history.replaceState(null, "", "#" + name);
    }

    document.addEventListener("click", (e) => {
      const t = e.target.closest("[data-tab]");
      if (!t) return;
      e.preventDefault();
      activate(t.dataset.tab, true);
    });

    menuToggle.addEventListener("click", () => {
      nav.classList.toggle("open");
      menuToggle.classList.toggle("open");
    });

    const initial = (location.hash || "#news").slice(1);
    activate(panels.some((p) => p.dataset.panel === initial) ? initial : "news", false);
  }

  /* ---------------- Init ---------------- */
  document.addEventListener("DOMContentLoaded", function () {
    buildNews();
    buildProfile();
    buildTimeline("publications", D.publications || [], "記事・メディア出演", "Publications / Interviews");
    buildTimeline("speaking", D.speaking || [], "登壇・講演", "Speaking");
    buildLinks();
    setupTabs();
    $("#year").textContent = new Date().getFullYear();
  });
})();
