![Image Preview](https://raw.githubusercontent.com/HarshVz/MotionMind/main/Frontend/public/preview.png)

# 🎞️ MotionMind - Manim-Based Animation Generator (Proof of Concept)

This is a **proof-of-work** web application that allows users to generate simple Manim animations via a web interface. It integrates a Python backend powered by **LangChain** and **Gemini (LLM)** with a **Next.js** frontend styled using **TailwindCSS**.

---

## 🔧 Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/), [TailwindCSS](https://tailwindcss.com/)
- **Backend**: Python, [LangChain](https://www.langchain.com/), Gemini (LLM)
- **Animation Engine**: [Manim](https://docs.manim.community/)

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/HarshVz/MotionMind.git
cd manim-animation-generator
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Install Python Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 4. Configure API Key

Replace the placeholder in the backend with your **Gemini API key**. Create a `.env` file or directly update the key in your code, depending on how you handle secrets.

---

## 🚀 Running the Project

### Frontend (Next.js)

```bash
npm run dev
```

### Backend (Python)

```bash
python app.py  # or your entry point
```

---

## 🧭 Routes (Frontend)

- `/` – Landing Page
- `/video` – Interface to generate animations
- `/examples` – Displays example animations

---

## ⚠️ Notes

- This is **not production-ready**.
- It is a basic **proof of concept** to demonstrate frontend–LLM–Manim integration.
- Contributions and suggestions are welcome!

---

## 📄 License

This project is open-sourced under the [MIT License](LICENSE).
