// popup.js
document.getElementById('extractText').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    console.log("test");
    chrome.tabs.sendMessage(tabs[0].id, { action: 'extractAndSendArticleText' });
  });
});

function createBubble(text, href) {
  const bubble = document.createElement('span');
  bubble.className = 'bubble';
  bubble.innerHTML = `
      <a href="${href}" target="_blank">${text}</a>
    `;
  return bubble;
}

document.getElementById('showProblems').addEventListener('click', () => {
  const problemList = document.getElementById('problemList');
  problemList.style.display = 'block'; // Show the problematic list

  // Assume you have a function that gets the problems from the content script or API
  getProblems().then((problems) => {
    problemList.innerHTML = ''; // Clear existing list
    problems.forEach((problem) => {
      const item = document.createElement('div');
      item.className = 'problem-item';
      item.innerHTML = `
          <strong>Quote:</strong> ${problem.quote}<br>
          <strong>Confidence:</strong> ${problem.confidence}<br>
          <strong>Reason to Doubt:</strong> ${problem.reason_to_doubt}<br>
          <strong>Reference:</strong> <a href="${problem.reference}" target="_blank">Link</a>
        `;
      problemList.appendChild(item);
    });
  });
});

// Mock function for getting the problematic elements. Replace this with your actual API call.
function getProblems() {
  // This should be replaced with the actual API call and logic to get the problematic items
  return new Promise((resolve) => {
    resolve([
      // Dummy data for illustration
      {
        quote: 'Factually incorrect statement',
        confidence: 'High',
        reason_to_doubt: 'This statement is contradicted by official sources.',
        reference: 'https://www.example.com/source'
      },
      // Add more items as needed
    ]);
  });
}

reasonElement.appendChild(createBubble(problem.reason_to_doubt, problem.reason_to_doubt_link));


