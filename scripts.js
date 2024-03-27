function createLink() {
  var pasteContent = document.getElementById("pasteText").value;
  var encodedContent = encodeURIComponent(pasteContent);
  var link = window.location.href + "?content=" + encodedContent;
  document.getElementById("linkInput").value = link;
  document.getElementById("linkContainer").style.display = "block";
  document.getElementById("copyLinkButton").style.display = "block";
  document.getElementById("copyTextButton").style.display = "block";
  document.getElementById("clearTextButton").style.display = "block";
  document.getElementById("pasteText").setAttribute("readonly", true); // Prevent editing after creating the link
}

function copyLink() {
  var linkInput = document.getElementById("linkInput");
  linkInput.select();
  document.execCommand("copy");
  alert("Link copied to clipboard!");
}

function copyText() {
  var pasteText = document.getElementById("pasteText");
  pasteText.select();
  document.execCommand("copy");
  alert("Text copied to clipboard!");
}

function clearText() {
  document.getElementById("pasteText").value = "";
  document.getElementById("linkInput").value = "";
  document.getElementById("linkContainer").style.display = "none";
  document.getElementById("copyLinkButton").style.display = "none";
  document.getElementById("copyTextButton").style.display = "none";
  document.getElementById("clearTextButton").style.display = "none";
  document.getElementById("pasteText").removeAttribute("readonly");
}

// Check if there's content in the URL and populate textarea if found
window.onload = function () {
  var urlParams = new URLSearchParams(window.location.search);
  var content = urlParams.get("content");
  if (content) {
    document.getElementById("pasteText").value = decodeURIComponent(content);
    createLink();
  }
};
