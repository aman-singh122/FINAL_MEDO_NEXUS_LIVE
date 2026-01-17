import re
import os
from langchain_community.document_loaders import (
    PyPDFLoader,
    DirectoryLoader,
    WebBaseLoader,
    CSVLoader
)
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

DATA_PATH = "data/"
DB_FAISS_PATH = "vectorstore/db_faiss"

# -------------------------------
# LOAD DATA
# -------------------------------
def load_pdf_files():
    loader = DirectoryLoader(DATA_PATH, glob="*.pdf", loader_cls=PyPDFLoader)
    docs = loader.load()
    for d in docs:
        d.metadata["source"] = "pdf"
    return docs

def load_web_data():
    urls = [
        "https://medlineplus.gov/heartattack.html",
        "https://medlineplus.gov/diabetes.html",
        "https://medlineplus.gov/hairloss.html",
        "https://www.who.int/news-room/fact-sheets/detail/cancer"
    ]
    docs = []
    for url in urls:
        loaded = WebBaseLoader(url).load()
        for d in loaded:
            d.metadata["source"] = "trusted_web"
        docs.extend(loaded)
    return docs

def load_csv_data():
    csv_path = os.path.join(DATA_PATH, "disease_symptom.csv")
    if os.path.exists(csv_path):
        return CSVLoader(file_path=csv_path).load()
    return []

# -------------------------------
# CLEANING (MEDICAL SAFE)
# -------------------------------
def clean_text(text):
    text = re.sub(r"\s+", " ", text)
    sentences = []
    for s in re.split(r"\.|\n", text):
        s = s.strip()
        if len(s) < 40:
            continue
        if any(x in s.lower() for x in [
            "copyright", "isbn", "figure", "table", "references"
        ]):
            continue
        sentences.append(s)
    return ". ".join(sentences)

def clean_documents(docs):
    for d in docs:
        d.page_content = clean_text(d.page_content)
    return docs

# -------------------------------
# CHUNKING
# -------------------------------
def create_chunks(docs):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=400,
        chunk_overlap=50,
        separators=["\n\n", ".", ";"]
    )
    return splitter.split_documents(docs)

# -------------------------------
# MAIN
# -------------------------------
if __name__ == "__main__":
    print("Loading data...")
    documents = load_pdf_files() + load_web_data() + load_csv_data()

    print("Cleaning text...")
    documents = clean_documents(documents)

    print("Chunking...")
    chunks = create_chunks(documents)

    print("Creating FAISS index...")
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )

    db = FAISS.from_documents(chunks, embeddings)
    db.save_local(DB_FAISS_PATH)

    print("✅ Vector store created safely")
