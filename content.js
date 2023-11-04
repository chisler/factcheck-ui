// content.js
const useMockApi = false; // Set this to false to use the real API

function extractAndSendArticleText() {
    const paragraphTags = document.querySelectorAll('p');
    const articleText = Array.from(paragraphTags).map(p => p.textContent.trim()).join('\n\n');
    console.log("starting");

    if (articleText) {
        if (useMockApi) {
            // Mock sending the extracted article text to the API and receiving a response
            const mockApiResponse = [{
                quote: "The home secretary claimed streets risked",
                confidence: ['low', 'mid', 'high'][Math.floor(Math.random() * 3)], // Random confidence
                reason_to_doubt: 'The quote may not be accurate.'
            },];

            console.log('Success (Mock):', mockApiResponse);
            highlightTextWithQuote(paragraphTags, mockApiResponse.quote, mockApiResponse.reason_to_doubt);
        } else {
            sendArticleToApi(articleText);
        }
    } else {
        console.error('No article text found.');
    }
}

function sendArticleToApi(articleText) {
    const apiUrl = `https://factcheck-api.vercel.app/factcheck?article=${encodeURIComponent(articleText.substring(0, 100))}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data_array => {
            console.log('Success (API):', data_array);
            Array.from(data_array).forEach(data => {
                console.log("processing", data);
                highlightTextWithQuote(document.querySelectorAll('p'), data.quote, data.reason_to_doubt);
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
    bubble.innerHTML = `<a href="${href}" target="_blank" style="text-decoration: none; color: #000;">${text}</a>`;
    return bubble;
}

function highlightTextWithQuote(paragraphTags, quote, reasonToDoubt, href) {
    Array.from(paragraphTags).forEach(p => {
        if (p.textContent.includes(quote)) {
            p.style.color = 'red';
            p.style.fontWeight = 'bold';
            const doubtBubble = createDoubtBubble(reasonToDoubt, href); // Pass the URL as an argument
            p.appendChild(doubtBubble);
        }
    });
}


// Listen for a message from the popup
chrome.runtime.onMessage.addListener((msg, sender, response) => {
    if (msg.action === 'extractAndSendArticleText') {
        extractAndSendArticleText();
    }
});


