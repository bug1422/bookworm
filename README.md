# Bookworm E-commerce

A modern full-stack e-commerce website for selling books, built with React and Python.

## Features

### Customer Features
- **Browse Books**
  - View books on sale
  - Browse recommended and popular books
  - Filter books by category, author, and rating
  - Sort books by price, popularity, and discounts

- **Book Details**
  - View detailed book information
  - Read book summaries
  - See author information
  - View book ratings and reviews

- **Shopping Cart**
  - Add/remove books
  - Adjust quantities
  - Persistent cart across sessions
  - Seamless guest-to-user cart transfer

- **User Account**
  - User registration/login
  - Review and rate books
  - Order history
  - Profile management

### Technical Features
- Responsive design for all devices
- Real-time price updates
- Client-side form validation
- Server-side data validation
- Automatic code formatting
- Continuous Integration pipeline

## Tech Stack

### Frontend
- React
- TanStack Query
- Tailwind CSS
- Shadcn/ui Components
- Vite

### Backend
- Python
- FastAPI
- SQLModel
- PostgreSQL

## Development

### Prerequisites
- Node.js 20+
- Python 3.11+
- PostgreSQL

### Environment Variables
```env
# Frontend (.env)
VITE_BACKEND_URL=http://localhost:8000
VITE_MIN_ITEM_QUANTITY=1
VITE_MAX_ITEM_QUANTITY=8
VITE_CURRENCY_MODE=USD

# Backend (.env)
DATABASE_URL=postgresql://user:password@localhost:5432/bookworm
```

### Setup

1. Clone the repository
```bash
git clone https://github.com/bug1422/bookworm.git
cd bookworm
```

2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

3. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
### Code Quality

The project uses automated code quality checks:

- Frontend: Prettier for code formatting
- Backend: Ruff for Python linting

To run checks locally:

```bash
# Frontend
npx prettier --check "src/**/*.{js,jsx,ts,tsx,json,css,scss,md}"

# Backend
ruff check .
```
