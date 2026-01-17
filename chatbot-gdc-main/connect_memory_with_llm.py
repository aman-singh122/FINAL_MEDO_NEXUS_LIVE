import re
from transformers import pipeline
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

DB_FAISS_PATH = "vectorstore/db_faiss"

# -------------------------------
# LOAD MODEL
# -------------------------------
llm = pipeline(
    "text2text-generation",
    model="google/flan-t5-base",
    max_new_tokens=300,
    temperature=0.2,
    do_sample=False
)

# -------------------------------
# LOAD VECTORSTORE
# -------------------------------
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

db = FAISS.load_local(
    DB_FAISS_PATH,
    embeddings,
    allow_dangerous_deserialization=True
)

retriever = db.as_retriever(search_kwargs={"k": 3})

# -------------------------------
# UTILITIES
# -------------------------------
def extract_context(docs, max_chars=1800):
    text = ""
    for d in docs:
        if len(text) > max_chars:
            break
        text += d.page_content + "\n"
    return text.strip()

def is_relevant(question, context):
    keywords = re.findall(r"[a-zA-Z]{4,}", question.lower())
    matches = sum(1 for k in keywords if k in context.lower())
    return matches >= 2

def build_prompt(context, question):
    return f"""
You are a medical information assistant.

Rules:
- Do NOT mix diseases
- Do NOT guess
- Answer ONLY from the context

Structure:
1. Overview
2. Causes
3. Symptoms
4. Treatment
5. When to see a doctor

If unsure, say:
"I do not have reliable medical information."

Context:
{context}

Question:
{question}

Answer:
"""

# -------------------------------
# RUN
# -------------------------------
if __name__ == "__main__":
    query = input("Ask a medical question: ")

    docs = retriever.invoke(query)
    context = extract_context(docs)

    if not context or not is_relevant(query, context):
        print("\nI do not have reliable medical information.")
    else:
        response = llm(build_prompt(context, query))
        print("\n", response[0]["generated_text"])
