const fileInput = document.getElementById('fileInput');
const codeView = document.getElementById('codeView');
const iframe = document.getElementById('editorFrame');
const toggleBtn = document.getElementById('btnToggle');
const lineBtn = document.getElementById('btnLines');

let fileContent = "", showCode = false, showLines = false;

fileInput.onchange = e => {
  const files = Array.from(e.target.files);
  if (!files.length) return;

  const htmlFile = files.find(f => f.name.endsWith('.html'));
  const cssFile = files.find(f => f.name.endsWith('.css'));
  const jsFile  = files.find(f => f.name.endsWith('.js'));

  if (!htmlFile && !(files.length === 1 && files[0].type === "text/html")) {
    alert("Please upload at least one HTML file or an all-in-one document.");
    return;
  }

  const readFiles = htmlFile ? [htmlFile, cssFile, jsFile].filter(Boolean) : files;

  Promise.all(readFiles.map(f => new Promise(res => {
    const reader = new FileReader();
    reader.onload = ev => res({ name: f.name, content: ev.target.result });
    reader.readAsText(f);
  }))).then(results => {
    let html = '', css = '', js = '';
    results.forEach(file => {
      if (file.name.endsWith('.html')) html = file.content;
      else if (file.name.endsWith('.css')) css = `<style>${file.content}</style>`;
      else if (file.name.endsWith('.js')) js = `<script>${file.content}</script>`;
    });

    fileContent = html + css + js;
    codeView.textContent = fileContent;
    renderIframe(fileContent);
  });
};

toggleBtn.onclick = () => {
  showCode = !showCode;
  codeView.classList.toggle('show', showCode);
  iframe.classList.toggle('show', !showCode);
  toggleBtn.textContent = showCode ? "Display Output" : "Display Code";
};

function renderIframe(html) {
  const blob = new Blob([html], { type: 'text/html' });
  iframe.src = URL.createObjectURL(blob);
}