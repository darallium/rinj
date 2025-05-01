from flask import (
    render_template,
    request,
    jsonify,
)
from llm_next.chat import chat_with_history
from llm_next.llm import init_llm

from rinj.app import app

llm = init_llm()
# ルートURLでHTMLを表示
@app.route('/')
def index():
    """チャット画面のHTMLをレンダリング"""
    return render_template('index.html')

# /chat エンドポイント (POSTリクエストを受け付ける)
@app.route('/chat', methods=['POST'])
def handle_chat():
    """
    クライアントから会話履歴を受け取り、
    相手のメッセージを追加して返す
    """
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    messages = data.get('messages', []) # messagesキーがない場合は空のリスト

    #msg = generate_message(messages)
    msg = chat_with_history(history=messages, llm=llm, filter=filter)
    opponent_message = {"sender": "相手", "text": msg}
    messages.append(opponent_message)

    # 更新された会話履歴をJSONで返す
    print(messages)
    return jsonify({"messages": messages})


import re
f = re.compile('CTF\{.+\}')
def filter(msg: str) -> str:
    return f.sub(repl='CTF{xxxxxxxxxxx}',string=msg)
