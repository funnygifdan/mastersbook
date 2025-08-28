
    const footerBtns = document.querySelectorAll("footer button"),
          secs = document.querySelectorAll("section");
    footerBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        secs.forEach(s => s.classList.remove("active"));
        footerBtns.forEach(b => b.classList.remove("active"));
        document.getElementById(btn.dataset.sec).classList.add("active");
        btn.classList.add("active");
      });
    });

    const fileInput = document.getElementById('fileInput'),
          codeView = document.getElementById('codeView'),
          iframe = document.getElementById('editorFrame'),
          toggleBtn = document.getElementById('btnToggle'),
          lineBtn = document.getElementById('btnLines');
    let fileContent = "", showCode=false, showLines=false;

    fileInput.onchange = e => {
      const files = [...e.target.files].slice(0,3);
      if(files.length===0) return;
      Promise.all(files.map(f => new Promise(res=>{
        const r = new FileReader();
        r.onload = ev => res(ev.target.result);
        r.readAsText(f);
      }))).then(contents => {
        fileContent = contents.join('\n\n<!-- FILE BREAK -->\n\n');
        renderCodeView();
        renderIframe(fileContent);
        parseAll(fileContent);
      });
    };

    toggleBtn.onclick = () => {
      showCode = !showCode;
      codeView.style.display = showCode ? "block" : "none";
      iframe.style.display = showCode ? "none" : "block";
      toggleBtn.textContent = showCode ? "Display Output" : "Display Code";
    };

    lineBtn.onclick = () => {
      showLines = !showLines;
      renderCodeView();
    };

    function renderCodeView() {
      if(!fileContent) return;
      const lines = fileContent.split('\n');
      codeView.innerHTML = lines.map((l,i) => {
        const num = showLines ? `<span class="token-linenum">${String(i+1).padStart(3)}</span>` : '';
        let html = escapeHtml(l)
          .replace(/\/\/.*/g, match => `<span class="token-comm">${escapeHtml(match)}</span>`)
          .replace(/("[^"]*"|'[^']*')/g, match => `<span class="token-str">${escapeHtml(match)}</span>`)
          .replace(/\b([A-Za-z_]\w*)\s*(?=\()/g, match => `<span class="token-func">${escapeHtml(match)}</span>`);
        return num + html;
      }).join('\n');
    }

    function escapeHtml(str) {
      return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    function renderIframe(html) {
      iframe.src = URL.createObjectURL(new Blob([html],{type:'text/html'}));
    }

    function parseAll(text) {
      const p = document.getElementById('parserContent');
      p.innerHTML = '';
      const hasHTML = /<\s*\w+/.test(text),
            hasCSS = /<style[\s\S]*<\/style>/.test(text),
            hasJS = /\bfunction\s+\w+\s*\(|=>/.test(text);
      const el = [...text.matchAll(/<\s*([a-zA-Z][\w:-]*)/g)].map(m=>m[1]),
            elements = [...new Set(el)];
      const cssBl = [...text.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(m=>m[1]).join('\n');
      const cssSel = [...new Set([...cssBl.matchAll(/([.#][\w-]+)/g)].map(m=>m[1]))];
      const jsFs = [...new Set([...text.matchAll(/function\s+(\w+)\s*\(|const\s+(\w+)\s*=\s*\(?.*?\)?\s*=>/g)]
        .map(m=>m[1]||m[2]).filter(Boolean))];
      function t(title, h, data) {
        p.appendChild(document.createElement('hr'));
        const hh = document.createElement('h3');
        hh.textContent = title;
        p.appendChild(hh);
        const table = document.createElement('table');
        const trHead = table.insertRow();
        h.forEach(txt=>trHead.insertCell().textContent=txt);
        data.forEach(r=> {
          const tr = table.insertRow();
          r.forEach(c=>tr.insertCell().textContent=c);
        });
        p.appendChild(table);
      }
      t('Files Contain:', ['HTML','CSS','JS'], [[hasHTML?'✅':'❌',hasCSS?'✅':'❌',hasJS?'✅':'❌']]);
      t('HTML Element vs CSS vs JS', ['HTML Element','Used in CSS?','Used in JS?'], elements.map(elm=>[
        elm, cssSel.includes('.'+elm)||cssSel.includes('#'+elm)?'✅':'❌', jsFs.some(fn=>text.includes(elm))?'✅':'❌']));
      t('CSS Selector vs HTML vs JS', ['CSS Selector','Matches HTML?','Used in JS?'], cssSel.map(sel=>[
        sel, elements.includes(sel.replace(/^[.#]/,''))?'✅':'❌', jsFs.some(fn=>text.includes(sel))?'✅':'❌']));
      t('JS Function vs HTML vs CSS', ['JS Function','Touches HTML?','Touches CSS?'], jsFs.map(fn=>[
        fn, elements.some(el=>text.includes(fn))?'✅':'❌', cssSel.some(sel=>text.includes(fn))?'✅':'❌']));
    }
 