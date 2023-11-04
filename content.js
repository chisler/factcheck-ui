// content.js
const useMockApi = false; // Set this to false to use the real API

function extractAndSendArticleText() {
    const paragraphTags = document.querySelectorAll('p');
    const articleText = Array.from(paragraphTags).map(p => p.textContent.trim()).join('\n\n');

    if (articleText) {
        if (useMockApi) {
            // Mock sending the extracted article text to the API and receiving a response
            const mockApiResponse = [{
                quote: "The home secretary claimed streets risked",
                danger_level: ['low', 'mid', 'high'][Math.floor(Math.random() * 3)], // Random confidence
                reason_for_doubt: 'The quote may not be accurate.'
            },];

            console.log('Success (Mock):', mockApiResponse);
            highlightTextWithQuote(paragraphTags, mockApiResponse.quote, mockApiResponse.reason_for_doubt);
        } else {
            sendArticleToApi(articleText);
        }
    } else {
        console.error('No article text found.');
    }
}

function sendArticleToApi(articleText) {
    const apiUrl = `https://factcheck-api.vercel.app/factcheck`;

    // Set up the options for the fetch request
    const options = {
        method: 'POST', // The API expects a POST request
        headers: {
            'Content-Type': 'text/plain' // The API expects plain text in the body
        },
        body: articleText.substring(0, 1500) // Send the article text directly as a string
    };

    // Send the request to the API
    fetch(apiUrl, options)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data_array => {
            console.log('Success (API):', data_array);
            data_array.forEach(data => { // Assuming data_array is an array
                console.log("processing", data);
                highlightTextWithQuote(document.querySelectorAll('p'), data.quote, data.reason_for_doubt, data.danger_level);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}




function createDoubtBubble(text, href) {
    const bubble = document.createElement('div');
    bubble.style.padding = '5px 10px';
    bubble.style.marginLeft = '10px';
    bubble.style.display = 'inline-block'; // Changed to 'inline-block' for better flow with text
    bubble.style.position = 'relative';
    bubble.style.borderRadius = '4px';
    bubble.style.backgroundColor = '#ffcccb';
    bubble.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    bubble.style.border = '1px solid #ff8888';

    const bubbleContent = createBubble(text, href); // Use createBubble to make the content
    bubble.appendChild(bubbleContent);

    return bubble;
}

function createBubble(text, href) {
    const bubble = document.createElement('span');
    bubble.className = 'bubble';
    bubble.innerHTML = `<span>${text}<a href="${href}" target="_blank" style="text-decoration: none; color: white;">Source 🔗</a></span>`;
    return bubble;
}

function splitQuoteIntoChunks(quote, chunkSize = 4) {
    const words = quote.split(' '); // Split the quote by whitespace
    let chunks = [];

    for (let i = 0; i < words.length; i += chunkSize) {
        chunks.push(words.slice(i, i + chunkSize).join(' '));
    }

    return chunks;
}

function highlightTextWithQuote(paragraphTags, quote, reason_for_doubt, danger_level, href) {
    const quoteChunks = splitQuoteIntoChunks(quote);
    const paragraphsArray = Array.from(paragraphTags);

    paragraphsArray.forEach((p, index) => {
        // Check if any of the chunks are in this paragraph
        const chunkPresent = quoteChunks.some(chunk => p.textContent.includes(chunk));
        if (chunkPresent) {
            // Highlight the paragraph
            if (danger_level === "high") {
                p.style.color = 'red';
            } else if (danger_level === "mid") {
                p.style.color = 'orange';
            } else if (danger_level === "low") {
                p.style.color = 'yellow';
            }
            p.style.fontWeight = 'bold';

            // If this is the first paragraph that contains the quote, append the bubble
            if (index === paragraphsArray.findIndex(p => p.textContent.includes(quoteChunks[0]))) {
                const doubtBubble = createDoubtBubble(reason_for_doubt, href);
                p.appendChild(doubtBubble);
            }
        }
    });
}



// Listen for a message from the popup
chrome.runtime.onMessage.addListener((msg, sender, response) => {
    if (msg.action === 'extractAndSendArticleText') {
        extractAndSendArticleText();
    }
});


