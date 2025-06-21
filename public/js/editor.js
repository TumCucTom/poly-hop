"use strict";

(function () {
  const WIDTH = 16;
  const HEIGHT = 24;
  const CELL = 16; // px
  const palette = [
    { name: "transparent", code: null, hex: "#00000000" }, // index 0
    { name: "skin", code: "skin", hex: "#f1c27d" }, // 1
    { name: "hair", code: "hair", hex: "#8b4513" }, // 2
    { name: "primary", code: "outfit1", hex: "#8b4513" }, // 3
    { name: "secondary", code: "outfit2", hex: "#654321" }, // 4
    { name: "accent", code: "outfit3", hex: "#ffd700" }, // 5
    { name: "eye", code: "eye", hex: "#000000" }, // 6
    { name: "mouth", code: "mouth", hex: "#8b0000" }, //7
  ];

  // Build modal elements
  const modal = document.createElement("div");
  modal.id = "pixel-editor-modal";
  modal.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;display:none;justify-content:center;align-items:center;background:rgba(0,0,0,0.8);z-index:9999;";

  modal.innerHTML = `
    <div class="pe-wrapper">
        <h3>🖌️ Pixel Editor</h3>
        <canvas id="pixel-editor-canvas" width="${WIDTH * CELL}" height="${HEIGHT * CELL}"></canvas>
        <div class="pe-palette">
            ${palette
              .map(
                (p, i) =>
                  `<button data-idx="${i}" style="background:${p.hex};" title="${p.name}"></button>`
              )
              .join("")}
        </div>
        <textarea id="ai-prompt" placeholder="Describe your avatar (e.g., wizard in blue robe)"></textarea>
        <div class="pe-actions">
            <button id="ai-generate" class="modal-btn primary">✨ Generate with AI</button>
            <button id="editor-save" class="modal-btn success">Save</button>
            <button id="editor-cancel" class="modal-btn">Cancel</button>
        </div>
    </div>`;
  document.body.appendChild(modal);

  const canvas = modal.querySelector("#pixel-editor-canvas");
  const ctx = canvas.getContext("2d");
  let currentColorIdx = 1;
  let buffer = new Array(WIDTH * HEIGHT).fill(0);

  // draw grid
  function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++) {
        const idx = buffer[y * WIDTH + x];
        const hex = palette[idx]?.hex ?? "#00000000";
        ctx.fillStyle = hex;
        ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
        ctx.strokeStyle = "#333";
        ctx.strokeRect(x * CELL, y * CELL, CELL, CELL);
      }
    }
  }

  redraw();

  // palette buttons
  modal.querySelectorAll("button[data-idx]").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentColorIdx = parseInt(btn.dataset.idx, 10);
    });
  });

  // custom color not supported in metadata (optional)

  canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / CELL);
    const y = Math.floor((e.clientY - rect.top) / CELL);
    buffer[y * WIDTH + x] = currentColorIdx;
    redraw();
  });

  const openBtn = document.createElement("button");
  openBtn.textContent = "🖌️ Edit Pixels";
  openBtn.className = "mint-btn";
  document.querySelector(".character-customization .customization-controls").appendChild(openBtn);

  openBtn.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  modal.querySelector("#editor-cancel").addEventListener("click", () => {
    modal.style.display = "none";
  });

  modal.querySelector("#editor-save").addEventListener("click", () => {
    const hexString = buffer.map((v) => v.toString(16)).join("");
    window.customPixelHex = hexString;
    const applyTo = window.game?.character || window.character;
    if (applyTo && typeof applyTo.setCustomPixelData === "function") {
      applyTo.setCustomPixelData(hexString);
      // Force p5.js to render one extra frame with new sprite
      if (window.game && window.game.p5 && typeof window.game.p5.redraw === "function") {
        window.game.p5.redraw();
      }
    }
    modal.style.display = "none";
  });

  // AI generate
  modal.querySelector('#ai-generate').addEventListener('click', async () => {
    const promptInput = modal.querySelector('#ai-prompt');
    const text = promptInput.value.trim();
    if (!text) return alert('Enter a description first');
    modal.querySelector('#ai-generate').textContent = '⏳ Generating...';
    try {
      const res = await fetch('/api/design-to-pixels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'LLM error');
      const hex = data.hex;
      buffer = hex.split('').map((h) => parseInt(h, 16));
      redraw();
    } catch (e) {
      alert('AI generation failed: ' + e.message);
      console.error(e);
    } finally {
      modal.querySelector('#ai-generate').textContent = '✨ Generate with AI';
    }
  });
})(); 