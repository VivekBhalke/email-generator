console.log("email writeer extension");


const findComposeToolbar = () => {
    const selectors = [
        '.aDh', // Gmail compose toolbar
        '.btC', // Outlook compose toolbar
        '[role="toolbar"]', // Gmail dialog
        '.gU.up', // Outlook dialog
    ];
    for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
            return element;
        }
    }
    return null;
}

const getEmailContent = () => {
    const selectors = [
        '.h7', // Gmail compose toolbar
        '.a3s.aiL', // Outlook compose toolbar
        '[role="presentation"]', // Gmail dialog
        '.gmail_quote', // Outlook dialog
    ];
    for (const selector of selectors) {
        const content = document.querySelector(selector);
        if (content) {
            return content.innerText.trim();
        }
    }
    return "";
}

const createAIButton = () => {
    const button = document.createElement('div');
    button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3';
    button.style.marginRight = '8px';
    button.innerHTML = 'AI Reply';
    button.setAttribute('role', 'button');
    button.setAttribute('data-tooltip', 'Generate AI Reply');
    console.log(button);
    return button;
}

const injectButton = () => {
    const existingButton = document.querySelector('.ai-reply-button');
    if (existingButton) {
        existingButton.remove();
    }
    const toolbar = findComposeToolbar();
    console.log("Toolbar found:", toolbar);
    if (!toolbar) {
        console.log("Compose toolbar not found");
        return;
    }
    const otherButton = createAIButton();
    otherButton.classList.add('ai-reply-button');
    otherButton.addEventListener('click', async () => {
        console.log("AI Reply button clicked");
        try {
            otherButton.innerHTML = 'Generating...';
            otherButton.disabled = true;
            const emailContent = getEmailContent();
            const response = await fetch('https://email-generator-bota.onrender.com/email/generate',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(
                        { 
                            emailContent: emailContent ,
                            tone : "professional",
                        }
                    )
                }
            )
            if(!response.ok) {
                throw new Error('Network response was not ok');
            }
            const generatedReply = await response.text();
            const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');
            if(composeBox)
            {
                composeBox.focus();
                document.execCommand('insertText', false, generatedReply);

            }
            else{
                console.error("Compose box not found");
            }
        } catch (error) {
            console.error("Error generating AI reply:", error);
            alert("Failed to generate AI reply. Please try again later.");  
        }finally{
            otherButton.innerHTML = 'AI Reply';
            otherButton.disabled = false;
        }
    });
    toolbar.insertBefore(otherButton, toolbar.firstChild);
    console.log("AI Reply button injected");
};


const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        const addedNodes = Array.from(mutation.addedNodes);
        const hasComposeElements = addedNodes.some(node =>
            node.nodeType === Node.ELEMENT_NODE &&
            (node.matches('.aDh, .btC, [role="dialog"]') ||
                node.querySelector('.aDh, .btC, [role="dialog"]'))
        );
        if (hasComposeElements) {
            console.log("Compose elements detected");
            setTimeout(injectButton, 500)
        }
    }
});

observer.observe(document.body, { childList: true, subtree: true });