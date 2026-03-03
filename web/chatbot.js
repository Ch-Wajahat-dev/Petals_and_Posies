(function () {

    /* ─── Styles ─────────────────────────────────────────────── */
    const style = document.createElement('style');
    style.textContent = `
    /* Toggle button */
    #pp-chat-toggle {
        position: fixed;
        bottom: 28px;
        right: 28px;
        width: 58px;
        height: 58px;
        border-radius: 50%;
        background: #d34572;
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 16px rgba(211,69,114,0.45);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99990;
        transition: transform 0.2s, background 0.2s;
    }
    #pp-chat-toggle:hover { background: #b82e5e; transform: scale(1.08); }
    #pp-chat-toggle svg { width: 28px; height: 28px; fill: #fff; transition: transform 0.3s; }
    #pp-chat-toggle.open svg { transform: rotate(90deg); }

    /* Unread badge */
    #pp-chat-badge {
        position: absolute;
        top: -4px; right: -4px;
        background: #ff4757;
        color: #fff;
        font-size: 10px;
        font-weight: 700;
        border-radius: 50%;
        width: 18px; height: 18px;
        display: flex; align-items: center; justify-content: center;
        font-family: 'Poppins', sans-serif;
    }

    /* Chat window */
    #pp-chat-window {
        position: fixed;
        bottom: 100px;
        right: 28px;
        width: 340px;
        max-width: calc(100vw - 40px);
        height: 480px;
        max-height: calc(100vh - 120px);
        background: #fff;
        border-radius: 18px;
        box-shadow: 0 12px 40px rgba(0,0,0,0.18);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        z-index: 99989;
        transform: translateY(20px) scale(0.95);
        opacity: 0;
        pointer-events: none;
        transition: transform 0.25s ease, opacity 0.25s ease;
        font-family: 'Poppins', sans-serif;
    }
    #pp-chat-window.show {
        transform: translateY(0) scale(1);
        opacity: 1;
        pointer-events: all;
    }

    /* Header */
    #pp-chat-header {
        background: linear-gradient(135deg, #d34572, #e8658e);
        padding: 14px 16px;
        display: flex;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
    }
    #pp-chat-avatar {
        width: 38px; height: 38px;
        background: rgba(255,255,255,0.25);
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-size: 20px;
        flex-shrink: 0;
    }
    #pp-chat-header-info { flex: 1; }
    #pp-chat-header-info strong {
        display: block;
        color: #fff;
        font-size: 14px;
        font-weight: 700;
    }
    #pp-chat-header-info span {
        font-size: 11px;
        color: rgba(255,255,255,0.8);
    }
    #pp-chat-close {
        background: rgba(255,255,255,0.2);
        border: none;
        color: #fff;
        width: 28px; height: 28px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 16px;
        display: flex; align-items: center; justify-content: center;
        transition: background 0.2s;
        flex-shrink: 0;
    }
    #pp-chat-close:hover { background: rgba(255,255,255,0.35); }

    /* Messages area */
    #pp-chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 14px 12px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        background: #fdf6fa;
    }
    #pp-chat-messages::-webkit-scrollbar { width: 4px; }
    #pp-chat-messages::-webkit-scrollbar-thumb { background: #f0c8d8; border-radius: 4px; }

    /* Message bubbles */
    .pp-msg {
        max-width: 82%;
        padding: 9px 13px;
        border-radius: 16px;
        font-size: 13px;
        line-height: 1.5;
        word-break: break-word;
        animation: ppFadeIn 0.2s ease;
    }
    @keyframes ppFadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
    .pp-msg.bot {
        background: #fff;
        color: #333;
        border-radius: 4px 16px 16px 16px;
        box-shadow: 0 1px 4px rgba(0,0,0,0.08);
        align-self: flex-start;
    }
    .pp-msg.user {
        background: #d34572;
        color: #fff;
        border-radius: 16px 4px 16px 16px;
        align-self: flex-end;
    }

    /* Typing indicator */
    .pp-typing {
        display: flex; align-items: center; gap: 4px;
        padding: 10px 14px;
        background: #fff;
        border-radius: 4px 16px 16px 16px;
        width: fit-content;
        box-shadow: 0 1px 4px rgba(0,0,0,0.08);
        align-self: flex-start;
    }
    .pp-typing span {
        width: 7px; height: 7px;
        background: #d34572;
        border-radius: 50%;
        animation: ppBounce 1.2s infinite;
        display: inline-block;
    }
    .pp-typing span:nth-child(2) { animation-delay: 0.2s; }
    .pp-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes ppBounce {
        0%,60%,100% { transform: translateY(0); }
        30% { transform: translateY(-6px); }
    }

    /* Quick replies */
    #pp-quick-replies {
        padding: 8px 10px 4px;
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        background: #fdf6fa;
        flex-shrink: 0;
        border-top: 1px solid #f5e0ea;
    }
    .pp-quick-btn {
        background: #fff;
        border: 1.5px solid #f0c0d4;
        color: #d34572;
        font-size: 11.5px;
        font-weight: 600;
        padding: 5px 11px;
        border-radius: 20px;
        cursor: pointer;
        font-family: inherit;
        transition: background 0.15s, border-color 0.15s;
        white-space: nowrap;
    }
    .pp-quick-btn:hover { background: #fde8f2; border-color: #d34572; }

    /* Input row */
    #pp-chat-input-row {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 12px;
        background: #fff;
        border-top: 1px solid #f0e0e8;
        flex-shrink: 0;
    }
    #pp-chat-input {
        flex: 1;
        border: 1.5px solid #e8d0dc;
        border-radius: 20px;
        padding: 8px 14px;
        font-size: 13px;
        outline: none;
        font-family: inherit;
        background: #fdf6fa;
        transition: border-color 0.2s;
    }
    #pp-chat-input:focus { border-color: #d34572; background: #fff; }
    #pp-chat-send {
        width: 36px; height: 36px;
        border-radius: 50%;
        background: #d34572;
        border: none;
        cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0;
        transition: background 0.2s;
    }
    #pp-chat-send:hover { background: #b82e5e; }
    #pp-chat-send svg { width: 16px; height: 16px; fill: #fff; }

    @media (max-width: 400px) {
        #pp-chat-window { right: 12px; bottom: 90px; width: calc(100vw - 24px); }
        #pp-chat-toggle { right: 16px; bottom: 20px; }
    }
    `;
    document.head.appendChild(style);

    /* ─── HTML ───────────────────────────────────────────────── */
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
    <button id="pp-chat-toggle" aria-label="Open chat">
        <span id="pp-chat-badge">1</span>
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.03 2 11c0 2.7 1.24 5.12 3.2 6.8L4 20.5l3.2-1.6C8.6 19.6 10.26 20 12 20c5.52 0 10-4.03 10-9S17.52 2 12 2zm1 13h-2v-2h2v2zm0-4h-2V7h2v4z"/>
        </svg>
    </button>

    <div id="pp-chat-window" role="dialog" aria-label="PetalsBot chat">
        <div id="pp-chat-header">
            <div id="pp-chat-avatar">🌸</div>
            <div id="pp-chat-header-info">
                <strong>PetalsBot</strong>
                <span>Petals &amp; Posies Assistant</span>
            </div>
            <button id="pp-chat-close" aria-label="Close chat">✕</button>
        </div>

        <div id="pp-chat-messages"></div>

        <div id="pp-quick-replies">
            <button class="pp-quick-btn" data-q="What flowers do you have?">🌸 Our Flowers</button>
            <button class="pp-quick-btn" data-q="What are your prices?">💰 Prices</button>
            <button class="pp-quick-btn" data-q="How do I add item to cart?">🛒 Add to Cart</button>
            <button class="pp-quick-btn" data-q="How do I remove item from cart?">🗑️ Remove Item</button>
            <button class="pp-quick-btn" data-q="How long does delivery take?">⏱️ Delivery Time</button>
            <button class="pp-quick-btn" data-q="Does this store have limited time offers?">🏷️ Offers</button>
            <button class="pp-quick-btn" data-q="Is delivery free?">📦 Delivery Fee</button>
            <button class="pp-quick-btn" data-q="How do I checkout?">✅ Checkout</button>
            <button class="pp-quick-btn" data-q="Do you deliver?">🚚 Delivery</button>
            <button class="pp-quick-btn" data-q="Where are you located?">📍 Location</button>
            <button class="pp-quick-btn" data-q="What payment methods do you accept?">💳 Payment</button>
            <button class="pp-quick-btn" data-q="How do I track my order?">📦 My Order</button>
            <button class="pp-quick-btn" data-q="Do you do wedding flowers?">💍 Wedding</button>
            <button class="pp-quick-btn" data-q="How do I contact you?">📞 Contact</button>
        </div>

        <div id="pp-chat-input-row">
            <input id="pp-chat-input" type="text" placeholder="Ask me anything..." autocomplete="off">
            <button id="pp-chat-send" aria-label="Send">
                <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </button>
        </div>
    </div>
    `;
    document.body.appendChild(wrapper);

    /* ─── Q&A Data ───────────────────────────────────────────── */
    const qa = [
        {
            patterns: ['hello', 'hi', 'hey', 'helo', 'salam', 'assalam', 'good morning', 'good evening'],
            answer: "Hello! Welcome to Petals & Posies 🌸 I'm PetalsBot. How can I help you today?"
        },
        {
            patterns: ['flower', 'sell', 'have', 'collection', 'type', 'variety', 'bouquet', 'rose', 'tulip', 'peony', 'dahlia', 'iris', 'sunflower'],
            answer: "We carry a beautiful range of:\n🌹 Roses (classic red, colorful)\n🌷 Tulips (solo, bouquet, purple)\n🌸 Peonies & Dahlias\n💐 Floral Bouquets\n🌻 Sunflower arrangements\n🌺 Seasonal blooms\n\nBrowse our full collection in the Shop section!"
        },
        {
            patterns: ['price', 'cost', 'how much', 'pkr', 'rate', 'expensive', 'cheap', 'affordable'],
            answer: "Our flowers are priced to suit every budget 💰\n\n• Starting from PKR 2,499\n• Most bouquets: PKR 3,500–6,000\n• Premium arrangements: up to PKR 6,995\n\nCheck the Shop page for all prices!"
        },
        {
            patterns: ['deliver', 'delivery', 'shipping', 'send', 'dispatch', 'ship'],
            answer: "Yes, we deliver all over Pakistan! 🚚\n\n✅ Free delivery on orders over PKR 2,500\n⚡ Fast delivery available\n📦 All across Pakistan\n\nAdd your address at checkout!"
        },
        {
            patterns: ['location', 'address', 'where', 'find us', 'visit', 'come', 'shop address', 'pirmahal'],
            answer: "You can find us at 📍\n\nMain Bazar, Shop #09\nStreet #01, PirMahal\n\nCome visit us anytime — we'd love to meet you!"
        },
        {
            patterns: ['contact', 'phone', 'call', 'email', 'reach', 'whatsapp', 'number', 'helpline'],
            answer: "Reach us through:\n\n📞 +92 304 1169537\n📧 samda6@gmail.com\n\nWe're happy to help with any queries!"
        },
        {
            patterns: ['hour', 'time', 'open', 'close', 'timing', 'when', 'schedule'],
            answer: "For our latest opening hours, please call us at 📞 +92 304 1169537. We try to stay open every day for our lovely customers! 🌸"
        },
        {
            patterns: ['wedding', 'event', 'occasion', 'decor', 'ceremony', 'bride', 'bridal'],
            answer: "We specialize in wedding flowers! 💍\n\n🌸 Bridal bouquets\n🏛️ Wedding décor\n💐 Ceremony arrangements\n🎊 Event flowers\n\nContact us for custom wedding packages and pricing!"
        },
        {
            patterns: ['payment', 'pay', 'cash', 'card', 'method', 'online', 'cod', 'bank'],
            answer: "We accept the following payment methods 💳\n\n• Cash on Delivery (COD)\n• Online bank transfer\n• Easy Paisa / Jazz Cash\n\nSelect your preferred method at checkout!"
        },
        {
            patterns: ['order', 'buy', 'purchase', 'place', 'checkout', 'how to order'],
            answer: "Ordering is simple! 🛒\n\n1️⃣ Browse our Shop\n2️⃣ Add items to your cart\n3️⃣ Fill in delivery details\n4️⃣ Choose payment method\n5️⃣ Confirm your order!\n\nLogin first to track your orders easily."
        },
        {
            patterns: ['track', 'status', 'where is', 'my order', 'order status', 'update'],
            answer: "To track your order 📦\n\n1. Log into your account\n2. Click your name in the top menu\n3. Go to 'My Orders'\n\nYou'll see the live status of every order!"
        },
        {
            patterns: ['gift', 'wrap', 'basket', 'customize', 'custom', 'personalize', 'message'],
            answer: "We love making gifts special! 🎁\n\n• Custom bouquet arrangements\n• Gift baskets\n• Personalized gift messages\n• Special occasion packaging\n\nAdd a gift message at checkout or call us for fully custom orders!"
        },
        {
            patterns: ['offer', 'discount', 'sale', 'deal', 'promo', 'coupon', 'limited'],
            answer: "Check out our Limited Time Offers section on the homepage! 🏷️\n\nCurrent perks:\n✅ Free delivery on orders over PKR 2,500\n🎁 Customizable gift options\n\nNew deals are added regularly — keep an eye out!"
        },
        {
            patterns: ['bestseller', 'popular', 'recommended', 'best', 'favourite', 'top'],
            answer: "Our top-selling arrangements are 🌟\n\n🌹 Red Roses – PKR 5,560\n🌻 Sunny Floral – PKR 6,790\n💐 Vibrant Blossom – PKR 6,995\n\nFind them in our New Arrivals section!"
        },
        {
            patterns: ['return', 'refund', 'cancel', 'exchange', 'wrong order'],
            answer: "For cancellations or issues with your order, please contact us within 24 hours 📞\n\n+92 304 1169537\nsamda6@gmail.com\n\nWe'll make sure it's resolved quickly!"
        },
        {
            patterns: ['signup', 'register', 'account', 'login', 'sign up', 'create account'],
            answer: "Creating an account is easy! 👤\n\nClick 'Log In' in the top menu → then 'Sign Up'.\n\nBenefits of an account:\n✅ Track your orders\n✅ Faster checkout\n✅ Order history"
        },
        {
            patterns: ['thank', 'thanks', 'shukriya', 'thnx', 'great', 'helpful', 'awesome'],
            answer: "You're so welcome! 😊 It was a pleasure helping you. Is there anything else I can assist with? 🌸"
        },
        {
            patterns: ['bye', 'goodbye', 'see you', 'later', 'take care', 'khuda hafiz'],
            answer: "Goodbye! Thank you for visiting Petals & Posies 🌷 Have a beautiful day and come back soon! 🌸"
        },
        {
            patterns: ['minimum', 'minimum order', 'min order', 'smallest'],
            answer: "We don't have a strict minimum order! You can order a single tulip or a grand arrangement. 🌷 Every order gets the same care and love!"
        },
        {
            patterns: ['add to cart', 'add item', 'add product', 'how to add', 'put in cart', 'add flower'],
            answer: "Adding an item to your cart is easy! 🛒\n\n1️⃣ Go to the Shop or New Arrivals section\n2️⃣ Browse the flowers you like\n3️⃣ Click the 🛒 cart icon on any product card\n4️⃣ The item is instantly added to your cart!\n\nThe cart count in the top-right navbar updates right away. You can add multiple items before checking out."
        },
        {
            patterns: ['remove from cart', 'remove item', 'delete from cart', 'delete item', 'how to remove', 'clear cart', 'empty cart'],
            answer: "To remove an item from your cart 🗑️\n\n1️⃣ Click the cart icon (🛒) in the top navbar\n2️⃣ Your cart panel will slide open\n3️⃣ Find the item you want to remove\n4️⃣ Click the ✕ or minus (−) button next to it\n\nTo clear the entire cart, remove all items one by one or start a fresh session."
        },
        {
            patterns: ['how long', 'delivery time', 'days delivery', 'when will', 'how many days', 'delivery duration', 'arrive', 'when deliver'],
            answer: "Our estimated delivery times are ⏱️\n\n📍 PirMahal & nearby areas: Same day or next day\n🏙️ Major cities (Lahore, Karachi, Islamabad): 2–3 working days\n🌍 Other areas of Pakistan: 3–5 working days\n\nFor urgent orders, please call us at 📞 +92 304 1169537 and we'll do our best to help!"
        },
        {
            patterns: ['limited time', 'limited offer', 'special offer', 'time offer', 'does store have offer', 'any offer', 'current offer', 'active offer'],
            answer: "Yes! We do have Limited Time Offers 🏷️\n\nYou can find them in the Offer section right on our homepage. Each offer includes:\n🎁 A special discounted price\n⏳ A live countdown timer showing when it expires\n🖼️ Product preview images\n\nOffers are updated regularly by our team, so check back often for new deals!"
        },
        {
            patterns: ['change quantity', 'update quantity', 'increase quantity', 'decrease quantity', 'how many', 'quantity'],
            answer: "To change the quantity of an item in your cart 🔢\n\n1️⃣ Open the cart panel (click 🛒 in the navbar)\n2️⃣ Use the + button to increase quantity\n3️⃣ Use the − button to decrease quantity\n\nThe total price updates automatically as you adjust quantities!"
        },
        {
            patterns: ['checkout', 'how to checkout', 'place order', 'complete order', 'finish order', 'proceed to checkout'],
            answer: "Ready to checkout? Here's how 📋\n\n1️⃣ Add items to your cart\n2️⃣ Click the cart icon in the navbar\n3️⃣ Click the 'Checkout' button in the cart panel\n4️⃣ Fill in your delivery details (name, address, phone)\n5️⃣ Choose your delivery type and payment method\n6️⃣ Optionally add a gift message 🎁\n7️⃣ Click 'Place Order' — done! ✅"
        },
        {
            patterns: ['free delivery', 'free shipping', 'delivery charge', 'delivery fee', 'shipping cost', 'no delivery charge'],
            answer: "Great news about delivery charges! 📦\n\n✅ FREE delivery on all orders above PKR 2,500\n💸 Standard delivery charge applies for orders below PKR 2,500\n\nSo the more you order, the more you save on delivery! 🌸"
        },
        {
            patterns: ['change order', 'edit order', 'modify order', 'update order', 'change my order'],
            answer: "Need to change your order? ✏️\n\nPlease contact us as soon as possible — ideally within 1–2 hours of placing the order:\n\n📞 +92 304 1169537\n📧 samda6@gmail.com\n\nOnce an order is dispatched, changes may not be possible."
        },
        {
            patterns: ['safe', 'secure', 'trust', 'legit', 'reliable', 'genuine', 'real'],
            answer: "Absolutely! Petals & Posies is a trusted, family-owned flower shop 🌸\n\n✅ Real customer orders fulfilled daily\n✅ Cash on Delivery option available (pay when you receive)\n✅ Direct contact via phone and email\n✅ Located at Main Bazar, Shop #09, PirMahal\n\nYour satisfaction is our top priority!"
        },
        {
            patterns: ['fresh', 'how fresh', 'quality', 'are flowers fresh', 'wilted', 'condition'],
            answer: "We take freshness very seriously! 🌹\n\nAll our flowers are:\n✅ Sourced fresh regularly\n✅ Carefully handled and packaged\n✅ Delivered as quickly as possible to preserve freshness\n\nIf you receive flowers that aren't up to standard, contact us within 24 hours and we'll make it right!"
        }
    ];

    /* ─── Logic ──────────────────────────────────────────────── */
    const messagesEl   = document.getElementById('pp-chat-messages');
    const inputEl      = document.getElementById('pp-chat-input');
    const sendBtn      = document.getElementById('pp-chat-send');
    const toggleBtn    = document.getElementById('pp-chat-toggle');
    const chatWindow   = document.getElementById('pp-chat-window');
    const closeBtn     = document.getElementById('pp-chat-close');
    const badge        = document.getElementById('pp-chat-badge');
    const quickBtns    = document.querySelectorAll('.pp-quick-btn');

    let isOpen = false;

    function scrollBottom() {
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function addMessage(text, isUser) {
        const div = document.createElement('div');
        div.className = 'pp-msg ' + (isUser ? 'user' : 'bot');
        div.textContent = text;
        messagesEl.appendChild(div);
        scrollBottom();
    }

    function showTyping() {
        const t = document.createElement('div');
        t.className = 'pp-typing';
        t.id = 'pp-typing-indicator';
        t.innerHTML = '<span></span><span></span><span></span>';
        messagesEl.appendChild(t);
        scrollBottom();
        return t;
    }

    function removeTyping() {
        const t = document.getElementById('pp-typing-indicator');
        if (t) t.remove();
    }

    function getResponse(text) {
        const lower = text.toLowerCase().trim();
        for (const item of qa) {
            if (item.patterns.some(p => lower.includes(p))) {
                return item.answer;
            }
        }
        return "I'm not sure about that 🤔 Please call us at 📞 +92 304 1169537 or email samda6@gmail.com and we'll be happy to help!";
    }

    function sendMessage(text) {
        const msg = (text || inputEl.value).trim();
        if (!msg) return;
        inputEl.value = '';

        addMessage(msg, true);
        const typing = showTyping();

        setTimeout(() => {
            removeTyping();
            addMessage(getResponse(msg), false);
        }, 700 + Math.random() * 400);
    }

    function openChat() {
        isOpen = true;
        chatWindow.classList.add('show');
        toggleBtn.classList.add('open');
        badge.style.display = 'none';
        inputEl.focus();
    }

    function closeChat() {
        isOpen = false;
        chatWindow.classList.remove('show');
        toggleBtn.classList.remove('open');
    }

    // Toggle
    toggleBtn.addEventListener('click', () => isOpen ? closeChat() : openChat());
    closeBtn.addEventListener('click', closeChat);

    // Send on button click
    sendBtn.addEventListener('click', () => sendMessage());

    // Send on Enter
    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Quick reply buttons
    quickBtns.forEach(btn => {
        btn.addEventListener('click', () => sendMessage(btn.dataset.q));
    });

    // Welcome message on first open
    let welcomed = false;
    toggleBtn.addEventListener('click', () => {
        if (!welcomed && isOpen) {
            welcomed = true;
            setTimeout(() => {
                addMessage("Hi there! 👋 I'm PetalsBot, your Petals & Posies assistant. Ask me anything or pick a quick question below! 🌸", false);
            }, 300);
        }
    });

})();
