# New Gen Atari

Welcome to **New Gen Atari**, a playful sandbox where we transform simple games like Tic-Tac-Toe with AI, overengineering, and a touch of chaos. Why? It’s fun, and we learn a lot along the way! Think of it as a modern spin on retro gaming—without pixelated graphics (for now).

Our first project? An **AI-powered Tic-Tac-Toe** that evolved from basic two-player mode to a wild ride with Hugging Face and OpenAI. Check out the full story on [Dev.to](link coming soon!) and explore the code [here](https://github.com/altuix/new-gen-atari).

## What’s This About?

We’re passionate about:

- Turning simple ideas into delightfully complex projects.
- Experimenting with AI models, APIs, and modern tech stacks.
- Learning through trial, error, and occasional “why did we do this?” moments.

Expect more games, experiments, and lessons as this repo grows. Got a wild idea? See “Contributing” below!

## Tech Stack

Here’s what fuels our chaos:

- **Next.js**: Unified frontend and backend.
- **React**: Dynamic, state-driven UIs.
- **Hugging Face**: Free AI models for the adventurous.
- **OpenAI**: Smarter AI when free models don’t cut it.
- **JavaScript**: The glue holding it together.

## Getting Started

Ready to run or tinker with it? Here’s how.

### Prerequisites

- **Node.js**: v16 or higher.
- **npm**: Verify with `npm -v`.
- **Git**: Confirm with `git --version`.
- **API Keys** (optional):
  - Hugging Face token ([get one](https://huggingface.co)).
  - OpenAI API key ([get one](https://openai.com)).

### Installation

1. **Clone the Repo**
   ```bash
   git clone https://github.com/altuix/new-gen-atari.git
   cd new-gen-atari
   ```
2. **Install Dependencies**

   ```bash
    npm install
    cd new-gen-atari
   ```

3. **Create a .env.local file in the root directory:**

   ````bash
    HUGGINGFACE_API_TOKEN=your-huggingface-token
    OPENAI_API_KEY=your-openai-api-key
    ```
   No keys? The game runs in two-player mode by default.

   ````

4. **Running the Project**
   Start the Dev Server
   ```bash
     npm run dev
     Visit http://localhost:3000 to see the Tic-Tac-Toe grid.
   ```

## Play Around

Two-player mode works instantly.
For AI mode, toggle the vsAI flag in gameBoard.tsx and ensure your OpenAI key is set.

## How It Works

Two-Player Mode: Click cells, take turns, win or draw—classic Tic-Tac-Toe.
AI Mode: You play as X; AI (O) uses OpenAI’s API for moves.

### Code breakdown:

- gameBoard.tsx: Game logic and UI.
- opponent.ts: Handles API calls.
- open-ai/route.ts: OpenAI integration.
- huggingface/route.ts: Failed Hugging Face experiments.
- Contributing
  Love overcomplicating things? Join the fun!

## Fork this repo.

- Clone your fork: git clone <your-fork-url>.
- Create a branch: git checkout -b my-crazy-idea.
- Code, commit, push: git push origin my-crazy-idea.
  Open a PR and share your wild addition!
  Got ideas—AI-driven Pong? Supercharged Snake? Comment or open an issue!

## What’s Next?

This is just the beginning. We’re planning more games to overengineer—maybe a neural-net Pac-Man or a predictive Tetris. Contribute, follow along, or enjoy the chaos. Let’s make retro gaming weird again!
