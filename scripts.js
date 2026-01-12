/* ---------- Utilities ---------- */

function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function showControls(show) {
    document.getElementById("linkContainer").style.display = show ? "block" : "none";
    document.getElementById("copyLinkButton").style.display = show ? "inline-block" : "none";
    document.getElementById("copyTextButton").style.display = show ? "inline-block" : "none";
    document.getElementById("clearTextButton").style.display = show ? "inline-block" : "none";
}

/* ---------- Core Logic ---------- */

function createLink() {
    const textarea = document.getElementById("pasteText");
    const content = textarea.value.trim();

    if (!content) {
        alert("You can't share empty text.");
        return;
    }

    const code = generateCode();
    localStorage.setItem("paste_" + code, content);

    const link = `${window.location.origin}/PasteShare/${code}`;

    document.getElementById("linkInput").value = link;
    textarea.setAttribute("readonly", true);
    showControls(true);

    // Update browser URL without reloading
    window.history.pushState({}, "", `/PasteShare/${code}`);
}

function copyLink() {
    const input = document.getElementById("linkInput");
    input.select();
    document.execCommand("copy");
    alert("Link copied");
}

function copyText() {
    const textarea = document.getElementById("pasteText");
    textarea.select();
    document.execCommand("copy");
    alert("Text copied");
}

function clearText() {
    const textarea = document.getElementById("pasteText");

    textarea.value = "";
    textarea.removeAttribute("readonly");

    document.getElementById("linkInput").value = "";
    showControls(false);

    // Reset URL cleanly
    window.history.pushState({}, "", "/PasteShare/");
}

/* ---------- Load From URL ---------- */

window.onload = function () {
    const pathParts = window.location.pathname.split("/");
    const code = pathParts[pathParts.length - 1];

    if (/^\d{6}$/.test(code)) {
        const stored = localStorage.getItem("paste_" + code);

        if (stored) {
            const textarea = document.getElementById("pasteText");
            textarea.value = stored;
            textarea.setAttribute("readonly", true);

            document.getElementById("linkInput").value =
                `${window.location.origin}/PasteShare/${code}`;

            showControls(true);
        }
    }
};
