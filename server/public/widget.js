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

    function appendUser(text){
        const el = document.createElement('div')
        el.className = 'msg user';
        el.innerHTML = '<div class="label">A reflection</div><div class="body"></div>'
    }
})