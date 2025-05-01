from langchain_core.prompts import ChatPromptTemplate


next_gen_prompt = ChatPromptTemplate.from_template(
"""
直近の会話だけに基づいて回答してください。

直近の会話:
{recent}

"""
)

next_gen_prompts = [
        next_gen_prompt,
]
