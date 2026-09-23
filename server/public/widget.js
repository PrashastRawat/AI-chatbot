(()=>{
    const API_BASE = 'htt[://localhost:5000';
    const STORAGE_KEY = 'gita-companion-visitor'
    
    const log = document.getElementById('log')
    const input = document.getElementById('composer-input')
    const sendBtn = document.getElementById('send-btn')
    const chips = document.querySelectorAll('.chip')

    let state = loadState()

    function  loadState(){
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            return raw ? JSON.parse(raw) : {visitorId: null, conversationId: null}
        } catch{
            return { visitorId: null, conversationId: null}
        }
    }

    function saveState(){
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    }

    function appendUser(text) {
    const el = document.createElement('div');
    el.className = 'msg user';
    el.innerHTML = '<div class="bubble"></div>';
    el.querySelector('.bubble').textContent = text;
    log.appendChild(el);
    scrollToBottom();
  }

    function appendAssistant(text){
        const el = document.createElement('div');
        el.className = 'msg assistant';
        el.innerHTML = '<div class="label">A reflection</div><div class="body"></div>';
        el.querySelector('.body').textContent = text;
        log.appendChild(el);
        scrollToBottom();
        return el;
    }

    function appendTyping() {
    const el = document.createElement('div');
    el.className = 'msg assistant';
    el.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>';
    log.appendChild(el);
    scrollToBottom();
    return el;
  }

  function scrollToBottom() {
    log.scrollTop = log.scrollHeight;
  }
 
  function setSending(isSending) {
    input.disabled = isSending;
    sendBtn.disabled = isSending || input.value.trim() === '';
  }
 
  async function onboard(name) {
    const res = await fetch(`${API_BASE}/api/widget/onboard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        profession: 'Visitor',
        goal: 'Seeking guidance'
      })
    });
    if (!res.ok) throw new Error('onboard failed');
    const data = await res.json();
    state = { visitorId: data.visitorId, conversationId: data.conversationId };
    saveState();
  }
 
  async function sendChat(message) {
    const res = await fetch(`${API_BASE}/api/conversation/history/chathistory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorId: state.visitorId,
        conversationId: state.conversationId,
        message
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'chat request failed');
    }
    const data = await res.json();
    return data.reply;
  }
 
  async function restoreHistory() {
    if (!state.visitorId) return;
    try {
      const res = await fetch(`${API_BASE}/api/widget/history/${state.visitorId}`, {
        method: 'POST'
      });
      if (!res.ok) return;
      const data = await res.json();
      data.messages.forEach((m) => {
        if (m.sender === 'visitor') appendUser(m.text);
        else appendAssistant(m.text);
      });
    } catch (e) {
      console.error('Could not restore history', e);
    }
  }
 
  async function handleSend() {
    const text = input.value.trim();
    if (!text) return;
 
    input.value = '';
    setSending(true);
 
    // First message ever: treat it as the visitor's name and onboard silently.
    if (!state.visitorId) {
      appendUser(text);
      const typing = appendTyping();
      try {
        await onboard(text);
        typing.remove();
        appendAssistant(`It's good to have you here, ${text}. What's on your mind?`);
      } catch (e) {
        typing.remove();
        appendAssistant('Something went wrong getting started — please try again in a moment.');
      }
      setSending(false);
      input.focus();
      return;
    }
 
    appendUser(text);
    const typing = appendTyping();
    try {
      const reply = await sendChat(text);
      typing.remove();
      appendAssistant(reply);
    } catch (e) {
      typing.remove();
      appendAssistant('Something went wrong sending that — please try again in a moment.');
    }
    setSending(false);
    input.focus();
  }
 
  sendBtn.addEventListener('click', handleSend);
 
  input.addEventListener('input', () => {
    sendBtn.disabled = input.value.trim() === '';
  });
 
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });
 
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      input.value = chip.textContent;
      input.dispatchEvent(new Event('input'));
      input.focus();
    });
  });
 
  // Init: restore a returning visitor's history, or greet a first-time one.
  if (state.visitorId) {
    restoreHistory();
  } else {
    appendAssistant('Before we begin, what should I call you?');
  }
})()