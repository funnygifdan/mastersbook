document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const menuOverlay = document.getElementById("menuOverlay");
  const closeMenu = document.getElementById("closeMenu");
  const contentArea = document.getElementById("dynamicContent");

  function closeMenuOverlay() {
    menuOverlay.classList.remove("open");
  }

  function openMenuOverlay() {
    menuOverlay.classList.add("open");
  }

  function toggleMenu() {
    menuOverlay.classList.toggle("open");
  }

  if (menuToggle) menuToggle.addEventListener("click", toggleMenu);
  if (closeMenu) closeMenu.addEventListener("click", closeMenuOverlay);

  // Dynamic loading with <main> content extraction and editor.js loader
  const menuLinks = menuOverlay.querySelectorAll("a");
  menuLinks.forEach(link => {
    link.addEventListener("click", e => {
      const url = link.getAttribute("href");

      if (url && !url.startsWith("http")) {
        e.preventDefault();
        fetch(url)
          .then(res => res.text())
          .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const mainContent = doc.querySelector("main");

            if (mainContent) {
              contentArea.innerHTML = mainContent.innerHTML;

              // Conditionally load editor.js when editor.html is loaded
              if (url.includes("editor.html")) {
                const script = document.createElement("script");
                script.src = "editor.js";
                script.defer = true;
                document.body.appendChild(script);
              }
            } else {
              contentArea.innerHTML = "<p style='color:red;'>No <main> content found in loaded file.</p>";
            }

            closeMenuOverlay();
          })
          .catch(err => {
            contentArea.innerHTML = `<p style="color:red;">Error loading ${url}: ${err.message}</p>`;
            closeMenuOverlay();
          });
      } else {
        closeMenuOverlay(); // Still close even for external links
      }
    });
  });
});