## Phishing URL Submitter

A very simple full-stack demo where users can submit suspicious URLs. The frontend is built with Next.js (App Router) and Tailwind CSS, and the backend API stores submitted URLs in MongoDB using mongoose.

### Tech stack

- **Frontend**: Next.js (App Router, TypeScript)
- **API**: Next.js Route Handlers (`app/api/submit-url/route.ts`)
- **Database**: MongoDB with **mongoose**
- **Styling**: Tailwind CSS

### Folder structure

```text
phishing-url-submitter/
 ├── app/
 │    ├── layout.tsx
 │    ├── globals.css
 │    ├── page.tsx
 │    └── api/
 │         └── submit-url/
 │              └── route.ts
 ├── lib/
 │    └── mongodb.ts
 ├── models/
 │    └── Url.ts
 ├── next.config.mjs
 ├── tailwind.config.ts
 ├── postcss.config.mjs
 ├── tsconfig.json
 ├── package.json
 └── README.md
```

---

## 1. Environment setup

### 1.1 Prerequisites

- **Node.js** 18+ (recommended: latest LTS)
- A **MongoDB** database (Atlas or local)

### 1.2 Create `.env.local`

In the project root (`phishing-url-submitter`), create a file named `.env.local`:

```bash
cd phishing-url-submitter
echo MONGODB_URI=your_mongodb_connection_string_here > .env.local
```

Or create it manually and add:

```text
MONGODB_URI=your_mongodb_connection_string_here
```

Replace `your_mongodb_connection_string_here` with your actual MongoDB connection string, e.g. from MongoDB Atlas.

---

## 2. Running the app locally

From the project root:

```bash
npm install
npm run dev
```

Then open `http://localhost:3000` in your browser.

### What happens

- The homepage (`/`) shows a **"Phishing URL Reporter"** card with:
  - URL input field
  - Submit button
  - Success / error message display
- On submit:
  - Frontend sends `POST /api/submit-url` with JSON body: `{ "url": "https://example.com" }`
  - API validates URL format
  - Connects to MongoDB
  - Stores `{ url, createdAt }` in the `urls` collection
  - Returns JSON:

```json
{
  "success": true,
  "message": "URL stored successfully"
}
```

If something goes wrong, it returns a JSON error with `success: false` and an explanatory `message`.

---

## 3. How it works (high-level)

- **Frontend (`app/page.tsx`)**
  - Simple form with a URL input, using React state to track the URL and submission status.
  - Calls `/api/submit-url` with `fetch` on submit.
  - Displays loading state and success/error messages under the form.

- **API route (`app/api/submit-url/route.ts`)**
  - Accepts `POST` requests only.
  - Reads `url` from `req.json()`.
  - Validates that it is a non-empty string and a syntactically valid URL.
  - Connects to MongoDB via `connectToDatabase()` from `lib/mongodb.ts`.
  - Creates a new `Url` document with the submitted URL.

- **MongoDB & mongoose**
  - `lib/mongodb.ts` manages a single cached mongoose connection using `MONGODB_URI` from `.env.local`.
  - `models/Url.ts` defines a very small schema:
    - `url: String`
    - `createdAt: Date` (default `Date.now`)

---

## 4. Deploying to Vercel

1. **Push the project to GitHub** (see next section).
2. Go to [Vercel](https://vercel.com) and create an account (if needed).
3. Click **"Add New Project"** and import your GitHub repository.
4. Vercel should auto-detect this as a Next.js app.
5. In **Environment Variables** in the Vercel project settings, add:

   - `MONGODB_URI` = your MongoDB connection string

6. Click **Deploy**.
7. After deployment, open the generated Vercel URL. The form should work exactly as it does locally, saving URLs into your MongoDB database.

---

## 5. Pushing to GitHub

From the project root (`phishing-url-submitter`):

1. **Initialize git (if not already initialized):**

```bash
git init
git add .
git commit -m "Initial commit: phishing URL submitter"
```

2. **Create a new repository on GitHub**

- Go to GitHub and click **New repository**.
- Name it, for example, `phishing-url-submitter`.
- Do **not** add a README/license/gitignore from GitHub (you already have files locally).

3. **Add the remote and push:**

```bash
git remote add origin https://github.com/<your-username>/phishing-url-submitter.git
git branch -M main
git push -u origin main
```

Replace `<your-username>` with your actual GitHub username.

After that, your code will be on GitHub and can be imported directly into Vercel.


