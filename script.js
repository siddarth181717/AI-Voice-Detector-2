const form = document.getElementById("uploadForm");
const resultDiv = document.getElementById("result");
const loadingDiv = document.getElementById("loading");
const fileInput = document.getElementById("audio");
const fileLabel = document.getElementById("file-label");

// Helper: Typewriter effect for a specific element
function typeEffect(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = ""; // Clear existing text
    return new Promise((resolve) => {
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                resolve();
            }
        }
        type();
    });
}

// Show file name when selected
fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
        fileLabel.innerHTML = `📄 <span style="color: #00f2ff; text-shadow: 0 0 10px #00f2ff;">${fileInput.files[0].name}</span>`;
    }
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const audioFile = fileInput.files[0];
    const language = document.getElementById("language").value;

    if (!audioFile) {
        alert("Integrity Error: No audio file detected.");
        return;
    }

    const formData = new FormData();
    formData.append("audio", audioFile);
    formData.append("language", language);

    loadingDiv.style.display = "block";
    resultDiv.innerHTML = "";

    try {
        const response = await fetch("http://127.0.0.1:8000/detect", {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        loadingDiv.style.display = "none";

        // Create the card container first
        resultDiv.innerHTML = `
            <div class="result-card">
                <h3 id="res-status" style="color: #7000ff">INITIALIZING...</h3>
                <p><strong>Identity:</strong> <span id="res-identity" style="color: #00f2ff"></span></p>
                <p><strong>Confidence:</strong> <span id="res-conf"></span></p>
            </div>
        `;

        // Trigger the high-tech typewriter sequence
        await typeEffect(document.getElementById("res-status"), "ANALYSIS COMPLETE");
        await typeEffect(document.getElementById("res-identity"), data.classification);
        await typeEffect(document.getElementById("res-conf"), `${Math.round(data.confidence_score * 100)}%`);

    } catch (error) {
        loadingDiv.style.display = "none";
        resultDiv.innerHTML = "<p style='color:#ff4444; font-weight:bold;'>CRITICAL ERROR: Connection Terminated</p>";
        console.error(error);
    }
});