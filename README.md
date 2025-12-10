# ⚖️ AI Legal Due Diligence Engine

### A Smart Assistant for Mergers & Acquisitions

When one company buys another (M&A), lawyers have to read thousands of boring legal documents to find "red flags"—like hidden debts or lawsuits. This takes weeks and costs a fortune.

**This project builds an AI Robot that does that work in seconds.**

It reads the files, finds the risky parts, and tells the human owners exactly what they need to worry about.

---

## 📸 What It Looks Like

### 1. The Dashboard (The "Big Picture")
*Here you can see the total risk score (0 to 100). A low score means the deal is safe. A high score means "Watch out!"*

![Dashboard Screenshot](./screenshots/dashboard.png)
*(Please upload your screenshot here)*

### 2. The Detailed Report
*This list shows exactly which file has a problem. For example, it found a "Financial Risk" in the Loan Agreement.*

![Report Screenshot](./screenshots/report.png)
*(Please upload your screenshot here)*

---

## 🚀 What This Project Does

* **📄 Reads Everything:** You can drag and drop 500+ documents (PDFs, Word docs, Images) at once.
* **🔍 Finds Hidden Dangers:** It looks for specific bad things, like:
    * **"Unlimited Debt"** (Indemnification without a cap).
    * **"Expired Patents"** (The company doesn't own its ideas anymore).
    * **"Lawsuits"** (Someone is suing the company).
* **📊 Scores the Risk:** It gives the whole deal a score. 
    * *Example:* **6/100** (Very Safe).
* **🚩 Color-Coded Warnings:** It shows a Red Bar if the risk is Financial, or a Blue Bar if it's Legal.
* **⚠️ Checks Quality:** If you upload a blurry scan that the computer can't read, it warns you: *"OCR Required"* (meaning: "Please give me a clear picture").

---

## 🛠️ How We Built It (Tech Stack)

We used the best modern tools to make this fast and smart.

| Part of App | Tool Used | Why? |
| :--- | :--- | :--- |
| **The Website (Frontend)** | **React + Tailwind** | Makes it look good and work smoothly in your browser. |
| **The Brain (Backend)** | **Python FastAPI** | Handles heavy thinking and manages all the files quickly. |
| **The Logic** | **Python Analysis** | The code that actually reads the words and finds the "Red Flags." |
| **Deployment** | **Vercel & Render** | Puts the website on the internet so anyone can use it. |

---

## ⚙️ How to Run It on Your Computer

If you want to test this yourself, follow these steps:

### Step 1: Download the Code
```bash
git clone [https://github.com/pavan-1712-2003/AI-Legal-DD-Engine]
cd AI-Legal-DD-Engine
