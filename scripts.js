function createLink() {
  var pasteContent = document.getElementById("pasteText").value;
  var encodedContent = encodeURIComponent(pasteContent);
  var link = window.location.href + "?content=" + encodedContent;
  document.getElementById("linkInput").value = link;
  document.getElementById("linkContainer").style.display = "block";
}

function copyLink() {
  var linkInput = document.getElementById("linkInput");
  linkInput.select();
  document.execCommand("copy");
  alert("Link copied to clipboard!");
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
