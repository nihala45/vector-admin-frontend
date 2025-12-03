🚀 Turborepo with shadcn/ui Components
 A monorepo setup using Turborepo, Vite, Next.js, Tailwind CSS v4, and shadcn/ui components.

 Prerequisites

Make sure the following are installed:

Node.js 20+

pnpm 10+

Check versions:

node -v
pnpm -v
Installation

Clone the repository:

git clone https://github.com/your-username/your-repo.git
cd your-repo


Install dependencies:

pnpm install
Build

Build all apps and packages:

pnpm build
 Add a New UI Component

Use shadcn/ui generator to add components to the shared ui package:

pnpm ui card
 Run All Apps Together

Start all repos at once:

pnpm run dev

Run Apps Individually

Run the admin app:

pnpm admin


Run the staff app:

pnpm staff


Run the user app (if exists):

pnpm user
Tools Used

Turborepo (monorepo management)

Vite (build system for UI library)

Next.js (frontend apps)

Tailwind CSS v4

shadcn/ui reusable components

pnpm workspaces

