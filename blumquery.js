// Function to copy text to clipboard using a temporary text area
function copyToClipboard(text) {
    // Create a temporary text area element
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);

    // Select the text in the text area
    textArea.select();
    textArea.setSelectionRange(0, 99999); // For mobile devices

    // Copy the selected text to clipboard
    try {
        document.execCommand('copy');
        console.log("Text copied to clipboard successfully.");
    } catch (err) {
        console.error("Failed to copy text to clipboard: ", err);
    }

    // Remove the temporary text area element
    document.body.removeChild(textArea);
}

// Get the value from sessionStorage for the key "query_id"
let queryIdValue = sessionStorage.getItem("query_id");

// Ensure the key exists in sessionStorage
if (queryIdValue) {

    // Copy the value to the clipboard
    copyToClipboard(queryIdValue);
} else {
    console.log("Session storage key 'query_id' not found.");
    copyToClipboard("Query not found, bukan blum jirr"); // Message to be copied
}
