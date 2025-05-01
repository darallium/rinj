from __future__ import annotations
from typing import Optional, Callable
import sys

from langchain.schema.output_parser import StrOutputParser
from langchain_core.messages import AIMessage, HumanMessage

from llm_next.prompt import next_gen_prompts

output_parser = StrOutputParser()

def chat_with_history( history: list[dict[str, str]], llm, filter: Optional[Callable[[str],str]] = None) -> str:
    """回答を生成する"""
    print(history[0]["sender"])
    recent = "\n".join([f"{msg['sender']}: {msg['text']}" for msg in history])

    pipe = next_gen_prompts[0] | llm | output_parser

    answer = pipe.invoke({
        "recent": recent, 
    })
    if filter:
        answer = filter(answer)
    return answer







