/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

/* Cloudflare Worker URL */
const WORKER_URL = "https://loreal-chatbox-worker.lianarenarocquel.workers.dev/";

/* System Prompt (L’Oréal‑only assistant) */
const systemPrompt = `
You are a helpful L’Oréal beauty assistant.
You ONLY answer questions about:
- L’Oréal products
- Beauty routines
- Haircare, skincare, makeup
- Product recommendations

If a user asks anything unrelated, politely refuse and redirect to beauty topics.

Format ALL responses using clean HTML.
Use <p> for paragraphs.
Use <ul><li> for bullet points.
Use <strong> for product names.
Never include <html>, <body>, or any page-level tags.
`;

/* Initial greeting */
chatWindow.innerHTML = `
  <div class="assistant-msg">
    👋 Hello! I’m your L’Oréal beauty advisor. What can I help you with today?
  </div>
`;

/* Append message helper */
function addMessage(content, sender = "user") {
  const msg = document.createElement("div");
  msg.classList.add(sender === "user" ? "user-msg" : "assistant-msg");
  msg.innerHTML = content;
  chatWindow.appendChild(msg);

  chatWindow.scrollTop = chatWindow.scrollHeight;
}

/* Gold typing indicator */
function showTypingIndicator() {
  const typing = document.createElement("div");
  typing.classList.add("assistant-msg");
  typing.innerHTML = `
    <div class="typing">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
  `;
  chatWindow.appendChild(typing);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return typing;
}

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const message = userInput.value.trim();
  if (!message) return;

  // Show user message
  addMessage(message, "user");
  userInput.value = "";

  // Show typing indicator
  const typingIndicator = showTypingIndicator();
function showTypingIndicator() {
  const typing = document.createElement("div");
  typing.classList.add("assistant-msg");
  typing.innerHTML = `
    <p><strong>GlowUp inbound… ✨</strong></p>
    <div class="typing">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
  `;
  chatWindow.appendChild(typing);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return typing;
}


  try {
    /* Call your Cloudflare Worker */
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();
    const aiReply = data.choices?.[0]?.message?.content || "No response.";

    typingIndicator.remove();
    addMessage(aiReply, "assistant");

  } catch (err) {
    typingIndicator.remove();
    addMessage(
      "⚠️ Oops! I’m having trouble connecting right now. Try again in a moment.",
      "assistant"
    );
    console.error(err);
  }
});
