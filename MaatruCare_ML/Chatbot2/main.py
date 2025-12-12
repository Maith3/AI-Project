from langgraph.graph import StateGraph, START, END
from typing import TypedDict, Annotated
from langchain_core.messages import BaseMessage, HumanMessage
from langchain_ollama import ChatOllama
from langgraph.graph.message import add_messages
from langgraph.checkpoint.memory import MemorySaver

class ChatState(TypedDict):
    messages: Annotated[list[BaseMessage],add_messages]
    
checkpointer=MemorySaver()
graph = StateGraph(ChatState)

llm = ChatOllama(model="llama3.2:1b")

def chat_node(state: ChatState):
    #take user from state
    messages = state['messages']
    
    #send to llm
    response = llm.invoke(messages)
    
    #response store state
    return {'messages': [response]}
    
    

#adding nodes
graph.add_node('chat_node',chat_node)
graph.add_edge(START, 'chat_node')
graph.add_edge('chat_node',END)

chatbot = graph.compile(checkpointer=checkpointer)

thread_id = '1'

config = {'configurable': {'thread_id': thread_id}}

while True:
    user_message = input('You: ')
    if user_message.strip().lower() in ['quit','exit','bye']:
        response=chatbot.invoke({'messages': [HumanMessage(content=user_message)]},config=config)
        print('Bot: ',response['messages'][-1].content)
        break
    response=chatbot.invoke({'messages': [HumanMessage(content=user_message)]},config=config)
    print('Bot: ',response['messages'][-1].content)
    
    