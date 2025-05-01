document.addEventListener('DOMContentLoaded', () => {
    const chatbox = document.getElementById('chatbox');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');

    // 会話履歴を保持する配列
    let chatHistory = [];

    // --- 関数定義 ---

    // 会話履歴をHTMLに描画する関数
    function renderChat() {
        chatbox.innerHTML = ''; // 既存の内容をクリア
        chatHistory.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message');
            // 送信者に応じてクラスを追加
            if (msg.sender === 'あなた') {
                messageDiv.classList.add('user');
                messageDiv.textContent = `${msg.text}`; // 自分のメッセージはテキストのみシンプルに
            } else {
                messageDiv.classList.add('opponent');
                messageDiv.textContent = `${msg.sender}: ${msg.text}`;
            }
            chatbox.appendChild(messageDiv);
        });
        // スクロールを一番下に移動
        chatbox.scrollTop = chatbox.scrollHeight;
    }

    // メッセージを送信し、サーバーからの応答を処理する関数
    async function sendMessage() {
        const text = messageInput.value.trim();
        if (text === '') {
            return; // 入力が空なら何もしない
        }

        // 1. 自分のメッセージを作成して履歴に追加
        const userMessage = { sender: "あなた", text: text };
        chatHistory.push(userMessage);

        // 2. 自分のメッセージをすぐに画面に反映
        renderChat();
        messageInput.value = ''; // 入力欄をクリア

        // 3. サーバーに現在の会話履歴全体を送信
        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // 現在の全会話履歴を送る
                body: JSON.stringify({ messages: chatHistory })
            });

            if (!response.ok) {
                // エラーレスポンスの場合
                const errorData = await response.json();
                console.error('Server Error:', errorData.error || response.statusText);
                // エラーメッセージをチャットに追加（任意）
                chatHistory.push({ sender: "システム", text: `エラー: ${errorData.error || response.statusText}` });
                renderChat();
                return;
            }

            // 4. サーバーから更新された会話履歴 (相手のメッセージ含む) を受け取る
            const data = await response.json();

            // 5. ローカルの会話履歴をサーバーからのもので更新
            chatHistory = data.messages;

            // 6. 更新された履歴で画面を再描画
            renderChat();

        } catch (error) {
            console.error('Fetch Error:', error);
            // 通信エラーなどをチャットに追加（任意）
            chatHistory.push({ sender: "システム", text: `通信エラーが発生しました: ${error}` });
            renderChat();
        }
    }

    // --- イベントリスナー ---

    // 送信ボタンクリック時の処理
    sendButton.addEventListener('click', sendMessage);

    // Enterキー押下時の処理 (入力欄で)
    messageInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    // --- 初期化 ---
    // ページ読み込み時に初期状態を描画 (最初は空)
    renderChat();
});
