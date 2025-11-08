# AI Hub

A marketplace platform for AI agents where users can discover and interact with various AI assistants.

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup (Django)

1. Navigate to backend directory and create a virtual environment:
```bash
cd backend
python -m venv .venv
```

2. Activate the virtual environment:
```bash
# Windows
.venv\Scripts\activate
# Linux/MacOS
source .venv/bin/activate
```

3. Install dependencies:
```bash
pip install django djangorestframework django-cors-headers
```

4. Run migrations and create a superuser:
```bash
python manage.py migrate
python manage.py createsuperuser
```

5. Start the development server:
```bash
python manage.py runserver
```

The backend will be available at http://127.0.0.1:8000

### Frontend Setup (React + Vite)

1. Navigate to frontend directory and install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will be available at http://localhost:5173

## 🏗️ Project Structure

```
AI_Hub/
├── backend/              # Django backend
│   ├── agents/          # Agents app
│   ├── aihub/           # Project settings
│   ├── users/           # User management
│   ├── payments/        # Payment processing
│   └── tenants/         # Multi-tenant support
│
├── frontend/            # React frontend
│   ├── src/
│   │   ├── api/        # API integration
│   │   ├── components/ # Reusable components
│   │   └── pages/      # Page components
│   └── public/         # Static assets
│
└── scripts/            # Utility scripts
    ├── inspect_db.py   # Database inspection
    └── seed_agents.py  # Sample data seeder
```

## 🛠️ Development

### Adding New Agents

1. Create agents through Django admin interface at `/admin/agents/agent/`
2. Or use the provided seed script:
```bash
python scripts/seed_agents.py
```

### API Endpoints

- `GET /api/agents/` - List all available agents
- `POST /api/agents/<id>/call/` - Call a specific agent

## 📦 Production Deployment

1. Set `DEBUG = False` in `backend/aihub/settings.py`
2. Configure proper database settings
3. Set up static files serving
4. Build frontend:
```bash
cd frontend
npm run build
```

## 🔧 Troubleshooting

### Common Issues

1. If agents don't appear in frontend:
   - Check Django server is running
   - Verify database has agents (`python scripts/inspect_db.py`)
   - Check browser console for CORS errors

2. Database issues:
   - Run `python manage.py migrate` to ensure all migrations are applied
   - Use `python scripts/inspect_db.py` to check database state

