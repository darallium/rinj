import sys
import uuid

from dotenv import load_dotenv

from llm_next.chat import chat_with_history
from llm_next.llm import init_llm


def main() -> None:
    load_dotenv()

    # LLMの初期化
    llm = init_llm(local=False)

    history = []
    # チャットボットとの対話ループ
    while True:
        user_input = input("質問を入力してください (終了するには'exit'と入力): ")
        history.append({"sender": "user", "text": user_input})
        print(history)
        if user_input.lower() == "exit":
            break
        try:
            response = chat_with_history(
                 history=history, llm=llm
            )
            print(f"回答: {response}")
        except Exception as e:
            print(f"エラーが発生しました: {e}")

