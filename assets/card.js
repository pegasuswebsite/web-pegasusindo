/* ============================================================================
   PEGASUS CARD (frontend domain) — card.js
   Menarik data dari API backend (config.js), render DOM aman (textContent).
   Nomor telepon/WA TIDAK pernah ada di HTML — WA diminta on-click ke API,
   telepon hanya lewat file .vcf. Analytics anonim via GET ringan.
   Halaman pemakai: set window.PC_SLUG sebelum memuat file ini.
   ========================================================================== */
(function () {
  var CFG = window.PEGASUS_CONFIG || {};
  var SLUG = window.PC_SLUG || '';
  var D = null;

  /* ---------- ikon (inline SVG path, viewBox 0 0 24 24) ---------- */
  var IKON = {
    save_contact: 'M12 2a5 5 0 015 5 5 5 0 01-5 5 5 5 0 01-5-5 5 5 0 015-5m0 12c3.9 0 8 1.9 8 4.5V21H4v-2.5C4 15.9 8.1 14 12 14m7-6h2v2h2v2h-2v2h-2v-2h-2v-2h2V8z',
    whatsapp: 'M12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2m0 1.8a8.2 8.2 0 11-4.1 15.3l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 0112 3.8m-3.1 4c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.4 3.8 2.1.9 2.6.7 3 .7.5 0 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2l-.4-.2-1.5-.7c-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.7 6.7 0 01-3.3-2.9c-.1-.2 0-.4.1-.5l.5-.6c.1-.2.2-.3.1-.5l-.7-1.7c-.2-.5-.4-.4-.5-.4h-.4z',
    email: 'M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2m0 2v.5l8 5 8-5V6H4m0 2.9V18h16V8.9l-8 5-8-5z',
    website: 'M12 2a10 10 0 100 20 10 10 0 000-20m6.9 6h-2.6a15 15 0 00-1.2-3.4A8 8 0 0118.9 8M12 4c.8 1.1 1.5 2.5 1.9 4h-3.8c.4-1.5 1.1-2.9 1.9-4M4.3 14a8.2 8.2 0 010-4h3a17 17 0 000 4h-3m.8 2h2.6c.3 1.2.7 2.4 1.2 3.4A8 8 0 015.1 16m2.6-8H5.1a8 8 0 014.8-3.4c-.5 1-.9 2.2-1.2 3.4M12 20c-.8-1.1-1.5-2.5-1.9-4h3.8c-.4 1.5-1.1 2.9-1.9 4m2.3-6H9.7a15 15 0 010-4h4.6a15 15 0 010 4m.8 5.4c.5-1 .9-2.2 1.2-3.4h2.6a8 8 0 01-4.8 3.4m1.6-5.4a17 17 0 000-4h3a8.2 8.2 0 010 4h-3z',
    wechat: 'M9.5 4C5.4 4 2 6.8 2 10.2c0 1.9 1 3.6 2.7 4.7l-.7 2.1 2.4-1.2c.7.2 1.4.3 2.1.3h.4A6 6 0 019 14.5C9 11.2 12 8.6 15.7 8.6h.4C15.4 6 12.7 4 9.5 4M7 7.5a1 1 0 110 2 1 1 0 010-2m5 0a1 1 0 110 2 1 1 0 010-2m4 2.6c-3.3 0-6 2.2-6 4.9s2.7 4.9 6 4.9c.6 0 1.2-.1 1.8-.2l2 1-.6-1.7c1.4-.9 2.3-2.3 2.3-4-.1-2.7-2.7-4.9-5.5-4.9m-2.2 2.7a.9.9 0 110 1.8.9.9 0 010-1.8m4.4 0a.9.9 0 110 1.8.9.9 0 010-1.8z',
    linkedin: 'M4.9 3a2 2 0 100 4 2 2 0 000-4M3.5 8.5h2.9V21H3.5V8.5m5.4 0h2.8v1.7h.1c.4-.8 1.6-1.9 3.4-1.9 3.6 0 4.3 2.2 4.3 5.2V21h-2.9v-6.6c0-1.6-.1-3.6-2.2-3.6s-2.6 1.7-2.6 3.5V21H8.9V8.5z',
    instagram: 'M7.8 2h8.4A5.8 5.8 0 0122 7.8v8.4a5.8 5.8 0 01-5.8 5.8H7.8A5.8 5.8 0 012 16.2V7.8A5.8 5.8 0 017.8 2m-.2 2A3.6 3.6 0 004 7.6v8.8A3.6 3.6 0 007.6 20h8.8a3.6 3.6 0 003.6-3.6V7.6A3.6 3.6 0 0016.4 4H7.6m9.7 1.5a1.3 1.3 0 110 2.5 1.3 1.3 0 010-2.5M12 7a5 5 0 110 10 5 5 0 010-10m0 2a3 3 0 100 6 3 3 0 000-6z',
    maps: 'M12 2a8 8 0 00-8 8c0 5.4 7 11.5 7.3 11.8a1 1 0 001.4 0C13 21.5 20 15.4 20 10a8 8 0 00-8-8m0 2a6 6 0 016 6c0 3.4-3.9 7.8-6 9.7-2.1-1.9-6-6.3-6-9.7a6 6 0 016-6m0 3a3 3 0 100 6 3 3 0 000-6z'
  };
  var LABEL = { whatsapp: 'WhatsApp', email: 'Email', website: 'Website', wechat: 'WeChat',
                linkedin: 'LinkedIn', instagram: 'Instagram', maps: 'Lokasi Kantor' };

  function el(tag, cls) { var n = document.createElement(tag); if (cls) n.className = cls; return n; }
  function svgIkon(jenis) {
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', IKON[jenis] || IKON.website);
    s.appendChild(p);
    return s;
  }
  function inisial(nama) {
    var kata = String(nama || '').replace(/^Pegasus\s+/i, '').trim().split(/\s+/);
    return (kata[0] || 'P').charAt(0).toUpperCase();
  }

  /* ---------- analytics anonim (tanpa data pribadi, gagal = diam) ---------- */
  function sesiAnon() {
    try {
      var k = localStorage.getItem('pc_anon');
      if (!k) {
        k = 'a' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
        localStorage.setItem('pc_anon', k);
      }
      return k;
    } catch (e) { return 'tanpa-sesi'; }
  }
  function deviceKategori() {
    var ua = navigator.userAgent;
    if (/iPad|Tablet/i.test(ua)) return 'tablet';
    if (/Mobi|iPhone|Android/i.test(ua)) return 'mobile';
    return 'desktop';
  }
  function browserNama() {
    var ua = navigator.userAgent;
    if (/Edg\//.test(ua)) return 'Edge';
    if (/Firefox\//.test(ua)) return 'Firefox';
    if (/Chrome\//.test(ua)) return 'Chrome';
    if (/Safari\//.test(ua)) return 'Safari';
    return 'Lainnya';
  }
  function srcKunjungan() {
    try { return new URLSearchParams(location.search).get('src') === 'qr' ? 'qr' : 'link'; }
    catch (e) { return 'link'; }
  }
  function catat(jenis) {
    try {
      var q = '?action=event&k=' + encodeURIComponent(SLUG) + '&jenis=' + encodeURIComponent(jenis) +
        '&device=' + deviceKategori() + '&browser=' + browserNama() +
        '&ref=' + encodeURIComponent((document.referrer || '').substring(0, 200)) +
        '&sesi=' + encodeURIComponent(sesiAnon()) + '&src=' + srcKunjungan();
      fetch(CFG.API + q).catch(function () {});
    } catch (e) {}
  }

  /* ---------- aksi tombol ---------- */
  function aksiTombol(jenis) {
    catat(jenis);
    if (jenis === 'save_contact') { location.href = D.vcfUrl; return; }
    if (jenis === 'whatsapp') {
      fetch(CFG.API + '?action=wa&k=' + encodeURIComponent(SLUG))
        .then(function (r) { return r.json(); })
        .then(function (j) { if (j && j.url) window.open(j.url, '_blank'); })
        .catch(function () {});
      return;
    }
    if (jenis === 'email') { location.href = 'mailto:' + D.email; return; }
    if (jenis === 'website') { window.open(D.website, '_blank'); return; }
    if (jenis === 'linkedin') { window.open(D.linkedin, '_blank'); return; }
    if (jenis === 'instagram') { window.open(D.instagram, '_blank'); return; }
    if (jenis === 'maps') {
      var url = D.mapsUrl || ('https://www.google.com/maps/search/' + encodeURIComponent(D.alamat));
      window.open(url, '_blank'); return;
    }
    if (jenis === 'wechat') {
      document.getElementById('wcId').textContent = D.wechatId ? 'ID: ' + D.wechatId : '';
      var w = document.getElementById('wcQrWadah');
      w.textContent = '';
      if (D.wechatQrUri) { var img = el('img'); img.src = D.wechatQrUri; img.alt = 'QR WeChat'; w.appendChild(img); }
      document.getElementById('modalWc').classList.add('buka');
    }
  }

  /* ---------- render ---------- */
  function render() {
    var lg = document.getElementById('logoGrup');
    if (D.logoUri) { var im = el('img'); im.src = D.logoUri; im.alt = D.namaGrup || D.perusahaan; lg.appendChild(im); }
    else { var m = el('div', 'logo-mono'); m.textContent = 'P'; lg.appendChild(m); }

    var fw = document.getElementById('fotoWadah');
    if (D.fotoUri) { var f = el('img', 'foto'); f.src = D.fotoUri; f.alt = D.nama; fw.appendChild(f); }
    else { var ph = el('div', 'foto-ph'); ph.textContent = inisial(D.nama); fw.appendChild(ph); }

    document.getElementById('nama').textContent = D.nama || '';
    document.getElementById('jabatan').textContent = D.jabatan || '';
    document.getElementById('perusahaan').textContent = D.perusahaan || '';
    var de = document.getElementById('deskripsi');
    if (D.deskripsi) de.textContent = D.deskripsi; else de.style.display = 'none';
    var qt = document.getElementById('quote');
    if (D.quote) qt.textContent = '“' + D.quote + '”'; else qt.style.display = 'none';

    var daftar = (D.tombol || []).slice();
    var iSave = daftar.indexOf('save_contact');
    if (iSave >= 0) {
      daftar.splice(iSave, 1);
      var bs = el('button', 'simpan');
      bs.appendChild(svgIkon('save_contact'));
      bs.appendChild(document.createTextNode('Save Contact'));
      bs.onclick = function () { aksiTombol('save_contact'); };
      document.getElementById('areaSimpan').appendChild(bs);
    }
    var grid = document.getElementById('gridTombol');
    daftar.forEach(function (jenis) {
      var b = el('button', 'tbl');
      b.appendChild(svgIkon(jenis));
      b.appendChild(document.createTextNode(LABEL[jenis] || jenis));
      b.onclick = function () { aksiTombol(jenis); };
      grid.appendChild(b);
    });
    if (daftar.length && daftar.length % 2 === 1) grid.lastChild.style.gridColumn = '1 / -1';

    if (D.brands && D.brands.length) {
      var area = document.getElementById('areaBrand');
      var j = el('div', 'brand-judul anim'); j.style.animationDelay = '.44s';
      j.textContent = 'Pegasus Brands'; area.appendChild(j);
      var daftarB = el('div', 'brand-daftar anim'); daftarB.style.animationDelay = '.47s';
      D.brands.forEach(function (b) {
        var kartu = el('div', 'brand');
        if (b.logoUri) { var li = el('img'); li.src = b.logoUri; li.alt = b.nama; kartu.appendChild(li); }
        else { var bm = el('div', 'brand-mono'); bm.textContent = inisial(b.nama); kartu.appendChild(bm); }
        var nm = el('span'); nm.textContent = b.nama; kartu.appendChild(nm);
        daftarB.appendChild(kartu);
      });
      area.appendChild(daftarB);
    }

    var tg = document.getElementById('tagline');
    if (D.tagline) tg.textContent = '“' + D.tagline + '”'; else tg.style.display = 'none';
    document.getElementById('footer').textContent = D.namaGrup || CFG.NAMA_GRUP || '';

    document.getElementById('muat').style.display = 'none';
    document.getElementById('wadah').style.display = 'block';
    catat('view');
  }

  function gagalMuat(pesan) {
    var m = document.getElementById('muat');
    m.innerHTML = '';
    var t = el('div'); t.textContent = pesan || 'Kartu tidak dapat dimuat. Periksa koneksi lalu muat ulang.';
    m.appendChild(t);
  }

  /* ---------- mulai ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    if (window.PC_MOCK) { D = window.PC_MOCK; render(); return; }  // utk preview lokal
    if (!CFG.API || !SLUG) { gagalMuat('Konfigurasi belum lengkap.'); return; }
    fetch(CFG.API + '?action=data&k=' + encodeURIComponent(SLUG))
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (j && j.ok && j.data) { D = j.data; render(); }
        else gagalMuat('Kartu tidak tersedia.');
      })
      .catch(function () { gagalMuat(); });
  });
})();
