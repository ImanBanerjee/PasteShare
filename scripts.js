/* ===== scripts.js ===== */
(() => {
  "use strict";

  /* ───────────── Constants ───────────── */
  const STORAGE_PREFIX = "pastes:";
  const ID_LENGTH = 6;

  /* ───────────── Elements ───────────── */
  const textarea = document.getElementById("paste");
  const createBtn = document.getElementById("createBtn");
  const copyLinkBtn = document.getElementById("copyLinkBtn");
  const copyTextBtn = document.getElementById("copyTextBtn");
  const clearBtn = document.getElementById("clearBtn");
  const statusEl = document.getElementById("status");

  let currentId = null;

  /* ───────────── Utilities ───────────── */
  const autoResize = () => {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  };

  const generateId = () => {
    const min = Math.pow(10, ID_LENGTH - 1);
    const max = Math.pow(10, ID_LENGTH) - 1;
    return String(
      Math.floor(Math.random() * (max - min + 1)) + min
    );
  };

  const savePaste = (id, content) => {
    localStorage.setItem(STORAGE_PREFIX + id, content);
  };

  const loadPaste = (id) => {
    return localStorage.getItem(STORAGE_PREFIX + id);
  };

  const setReadonlyMode = (readonly) => {
    textarea.readOnly = readonly;
    createBtn.disabled = readonly;
    copyLinkBtn.disabled = !readonly;
  };

  const setStatus = (message) => {
    statusEl.textContent = message || "";
  };

  const updateURL = (id) => {
    const parts = window.location.pathname.split("/").filter(Boolean);
    const base = "/" + parts.slice(0, parts.length - 1).join("/");
    const url = (base.endsWith("/") ? base : base + "/") + id;
    history.pushState({ id }, "", url);
  };

  const resetURL = () => {
    const parts = window.location.pathname.split("/").filter(Boolean);
    const base = "/" + parts.slice(0, parts.length - 1).join("/");
    history.pushState({}, "", base || "/");
  };

  const extractIdFromURL = () => {
    const parts = window.location.pathname.split("/").filter(Boolean);
    const last = parts[parts.length - 1];
    return /^\d{6}$/.test(last) ? last : null;
  };

  /* ───────────── Actions ───────────── */
  createBtn.addEventListener("click", () => {
    const content = textarea.value.trim();
    if (!content) {
      setStatus("Nothing to save.");
      return;
    }

    let id;
    do {
      id = generateId();
    } while (loadPaste(id) !== null);

    savePaste(id, content);
    currentId = id;

    updateURL(id);
    setReadonlyMode(true);
    setStatus("Link created.");
  });

  copyLinkBtn.addEventListener("click", async () => {
    if (!currentId) return;

    try {
      await navigator.clipboard.writeText(window.location.href);
      setStatus("Link copied.");
    } catch {
      setStatus("Clipboard access failed.");
    }
  });

  copyTextBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(textarea.value);
      setStatus("Text copied.");
    } catch {
      setStatus("Clipboard access failed.");
    }
  });

  clearBtn.addEventListener("click", () => {
    textarea.value = "";
    autoResize();
    setReadonlyMode(false);
    currentId = null;
    setStatus("");
    resetURL();
  });

  textarea.addEventListener("input", autoResize);

  window.addEventListener("popstate", () => {
    const id = extractIdFromURL();
    if (!id) return;

    const data = loadPaste(id);
    if (data === null) {
      setStatus("Paste not found.");
      return;
    }

    textarea.value = data;
    autoResize();
    currentId = id;
    setReadonlyMode(true);
    setStatus("Viewing saved paste.");
  });

  /* ───────────── Init ───────────── */
  const init = () => {
    autoResize();

    const id = extractIdFromURL();
    if (!id) return;

    const data = loadPaste(id);
    if (data === null) {
      setStatus("Paste not found.");
      return;
    }

    textarea.value = data;
    autoResize();
    currentId = id;
    setReadonlyMode(true);
    setStatus("Viewing saved paste.");
  };

  init();
})();
