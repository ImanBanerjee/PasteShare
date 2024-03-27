async function createLink() {
    var pasteContent = document.getElementById("pasteText").value;
    var encodedContent = encodeURIComponent(pasteContent);
    var longUrl = window.location.href + "?content=" + encodedContent;
    
    // Bitly API access token
    var accessToken = 'be6f34669d4e840d0e0522243fe87660a2faa050';

    try {
        const response = await fetch('https://api-ssl.bitly.com/v4/shorten', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                long_url: longUrl,
            }),
        });
        
        if (!response.ok) {
            throw new Error('Failed to shorten URL');
        }
        
        const data = await response.json();
        var shortUrl = data.link;

        document.getElementById("linkInput").value = shortUrl;
        document.getElementById("linkContainer").style.display = "block";
        document.getElementById("copyLinkButton").style.display = "block";
        document.getElementById("copyTextButton").style.display = "block";
        document.getElementById("clearTextButton").style.display = "block";
        document.getElementById("pasteText").setAttribute("readonly", true); // Prevent editing after creating the link
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to shorten URL. Please try again later.');
    }
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
