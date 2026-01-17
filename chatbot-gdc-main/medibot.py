import os
import re
from flask import Flask, render_template, request, jsonify
from transformers import pipeline
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

# =========================================================
# CONFIG
# =========================================================
DB_FAISS_PATH = "vectorstore/db_faiss"
app = Flask(__name__)

# =========================================================
# LOAD VECTOR STORE (ONCE)
# =========================================================
if not os.path.exists(DB_FAISS_PATH):
    raise FileNotFoundError(
        "FAISS database not found. Run create_memory_for_llm.py first."
    )

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

db = FAISS.load_local(
    DB_FAISS_PATH,
    embeddings,
    allow_dangerous_deserialization=True
)

retriever = db.as_retriever(search_kwargs={"k": 3})

# =========================================================
# LOAD LLM (DETERMINISTIC, SAFE)
# =========================================================
llm = pipeline(
    "text2text-generation",
    model="google/flan-t5-base",
    max_new_tokens=300,
    temperature=0.2,
    do_sample=False
)

# =========================================================
# SAFETY & UTILITY FUNCTIONS
# =========================================================

STOPWORDS = {
    "what", "is", "are", "how", "does", "do",
    "the", "of", "to", "and", "in", "for"
}

def extract_keywords(text):
    words = re.findall(r"[a-zA-Z]{4,}", text.lower())
    return {w for w in words if w not in STOPWORDS}

def disease_relevance_check(question, documents, min_matches=2):
    """
    HARD SAFETY GATE:
    Ensures retrieved documents talk about the same disease/topic.
    """
    q_terms = extract_keywords(question)
    matches = 0

    for doc in documents:
        content = doc.page_content.lower()
        if any(term in content for term in q_terms):
            matches += 1

    return matches >= min_matches

def build_context(documents, max_chars=1800):
    """
    Converts Document objects into clean text.
    Prevents raw metadata leakage.
    """
    context = ""
    for doc in documents:
        clean_text = re.sub(r"\s+", " ", doc.page_content.strip())
        if len(context) + len(clean_text) > max_chars:
            break
        context += clean_text + "\n\n"
    return context.strip()

def build_prompt(context, question):
    """
    STRICT MEDICAL PROMPT
    """
    return f"""
You are a medical information assistant.

RULES:
- Answer ONLY if the context matches the same medical condition.
- Do NOT mix diseases or conditions.
- Do NOT guess or invent information.
- Do NOT mention books, documents, or sources.

Answer in the following structure:
1. Overview
2. Causes
3. Symptoms
4. Treatment / Management
5. When to see a doctor

If the information is insufficient or unclear, reply EXACTLY with:
"I do not have reliable medical information to answer this question."

Context:
{context}

Question:
{question}

Answer:
"""

def sanitize_output(text):
    """
    Final output cleanup for UI safety.
    """
    text = re.sub(r"Document\(.*?\)", "", text)
    text = re.sub(r"\n+", "<br>", text)
    return text.strip()

# =========================================================
# ROUTES
# =========================================================

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/ask", methods=["POST"])
def ask():
    data = request.get_json()
    question = data.get("question", "").strip()

    if not question:
        return jsonify({
            "answer": "Please enter a valid medical question."
        })

    # 1️⃣ Retrieve documents
    docs = retriever.invoke(question)

    # 2️⃣ HARD MEDICAL SAFETY CHECK
    if not docs or not disease_relevance_check(question, docs):
        return jsonify({
            "answer": (
                "I do not have reliable medical information to answer this question."
                "<br><em>Please consult a qualified healthcare professional.</em>"
            )
        })

    # 3️⃣ Build clean context
    context = build_context(docs)

    # 4️⃣ Generate answer
    prompt = build_prompt(context, question)
    result = llm(prompt)
    answer = result[0]["generated_text"]

    # 5️⃣ Sanitize output
    answer = sanitize_output(answer)

    return jsonify({"answer": answer})

# =========================================================
# RUN SERVER
# =========================================================
if __name__ == "__main__":
    app.run(port=5000, debug=True)
