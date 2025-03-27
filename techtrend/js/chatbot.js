// Khởi tạo chatbot
document.addEventListener('DOMContentLoaded', function() {
    const chatbotContainer = document.querySelector('.chatbot-container');
    const chatbotToggle = document.querySelector('.chatbot-toggle');
    const closeChat = document.querySelector('.close-chat');
    const chatInput = document.querySelector('.chatbot-input input');
    const sendButton = document.querySelector('.chatbot-input button');
    const chatMessages = document.querySelector('.chatbot-messages');

    // Mở/đóng chatbot
    chatbotToggle.addEventListener('click', function() {
        chatbotContainer.classList.toggle('active');
    });

    closeChat.addEventListener('click', function() {
        chatbotContainer.classList.remove('active');
    });

    // Danh sách câu hỏi thường gặp và câu trả lời
    const faqs = [
        {
            question: ['xin chào', 'hello', 'hi', 'chào'],
            answer: 'Xin chào! Tôi là Techy, trợ lý ảo của TechTrend. Tôi có thể giúp gì cho bạn?'
        },
        {
            question: ['giờ mở cửa', 'mấy giờ mở cửa', 'giờ làm việc'],
            answer: 'TechTrend mở cửa từ 8:00 - 22:00 tất cả các ngày trong tuần.'
        },
        {
            question: ['chính sách đổi trả', 'đổi trả', 'trả hàng'],
            answer: 'Chúng tôi có chính sách đổi trả trong vòng 7 ngày nếu sản phẩm có lỗi từ nhà sản xuất. Bạn có thể xem chi tiết tại <a href="#">đây</a>.'
        },
        // Thêm các câu hỏi khác
    ];

    // Thêm tin nhắn vào khung chat
    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = isUser ? 'user-message' : 'bot-message';
        messageDiv.innerHTML = message;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Xử lý tin nhắn từ người dùng
    function handleUserMessage() {
        const message = chatInput.value.trim();
        if (message === '') return;

        addMessage(message, true);
        chatInput.value = '';

        // Hiệu ứng "đang nhập..."
        setTimeout(() => {
            const typingIndicator = document.createElement('div');
            typingIndicator.className = 'bot-message typing';
            typingIndicator.innerHTML = 'Techy đang nhập...';
            chatMessages.appendChild(typingIndicator);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            setTimeout(() => {
                chatMessages.removeChild(typingIndicator);
                processMessage(message);
            }, 1000 + Math.random() * 2000); // Ngẫu nhiên từ 1-3 giây
        }, 500);
    }

    // Xử lý và trả lời tin nhắn
    function processMessage(message) {
        const lowerMessage = message.toLowerCase();
        let response = '';

        // Kiểm tra câu hỏi thường gặp
        for (const faq of faqs) {
            if (faq.question.some(q => lowerMessage.includes(q))) {
                response = faq.answer;
                break;
            }
        }

        // Nếu không tìm thấy trong FAQ
        if (!response) {
            const randomResponses = [
                'Xin lỗi, tôi không hiểu câu hỏi của bạn. Bạn có thể diễn đạt lại không?',
                'Hiện tôi chưa được lập trình để trả lời câu hỏi này. Bạn có thể liên hệ hotline 1900 1234 để được hỗ trợ.',
                'Câu hỏi của bạn khá thú vị! Tôi sẽ chuyển lại cho đội ngũ kỹ thuật để cải thiện chatbot.'
            ];
            response = randomResponses[Math.floor(Math.random() * randomResponses.length)];
        }

        addMessage(response);
    }

    // Sự kiện gửi tin nhắn
    sendButton.addEventListener('click', handleUserMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleUserMessage();
        }
    });

    // Tin nhắn chào mừng
    setTimeout(() => {
        addMessage('Xin chào! Tôi là Techy, trợ lý ảo của TechTrend. Tôi có thể giúp gì cho bạn?');
    }, 1000);

    // CSS cho tin nhắn
    const style = document.createElement('style');
    style.textContent = `
        .user-message {
            background-color: #0066cc;
            color: white;
            padding: 10px 15px;
            border-radius: 15px 15px 0 15px;
            margin-bottom: 10px;
            max-width: 80%;
            margin-left: auto;
        }
        
        .typing {
            color: #86868b;
            font-style: italic;
        }
    `;
    document.head.appendChild(style);
});