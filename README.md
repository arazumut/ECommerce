# E-Commerce Application with Django Oscar and React

A comprehensive e-commerce platform built with Django Oscar for the backend API and React for the frontend interface.

## Features

- **Powerful E-Commerce Backend**: Built with Django Oscar, providing a robust foundation for e-commerce operations including product catalog, order management, and customer accounts
- **RESTful API**: Uses Oscar API to expose e-commerce functionality to the frontend
- **Modern React Frontend**: Responsive user interface built with React and Bootstrap
- **Complete Shopping Experience**: Browse products, search functionality, add to cart, checkout process
- **User Account Management**: Registration, login, profile management, order history
- **Payment Integration**: Credit card and bank transfer payment options
- **Admin Dashboard**: Complete management interface for products, orders, customers, and settings

## Technology Stack

### Backend
- Django 5.2+
- Django Oscar (E-commerce framework)
- Oscar API (RESTful API)
- Haystack (Search functionality)
- SQLite (Development database)

### Frontend
- React 18
- React Router
- React Bootstrap
- Axios (API client)
- React Icons

## Installation and Setup

### Prerequisites
- Python 3.10+
- Node.js 14+
- npm 7+

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ecommerce-app.git
cd ecommerce-app
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # For Linux/Mac
# OR
venv\Scripts\activate  # For Windows
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Apply migrations:
```bash
python manage.py migrate
```

5. Create a superuser:
```bash
python manage.py createsuperuser
```

6. Load sample data (optional):
```bash
python manage.py loaddata sample_data.json
```

7. Start the Django development server:
```bash
python manage.py runserver
```

The backend will be available at http://127.0.0.1:8000/

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend application will be available at http://localhost:3000/

## Project Structure

```
ecommerce-app/
├── ecommerce/              # Django project settings
├── store/                  # Custom Django app
├── templates/              # Django templates
├── static/                 # Static files (CSS, JS, images)
├── media/                  # User-uploaded content
├── frontend/               # React frontend
│   ├── public/             # Public assets
│   └── src/                # React source files
│       ├── components/     # Reusable components
│       ├── pages/          # Page components
│       ├── context/        # React context providers
│       └── assets/         # Static assets
└── requirements.txt        # Python dependencies
```

## API Endpoints

- `/api/` - API root
- `/api/basket/` - Shopping basket operations
- `/api/products/` - Product listing and details
- `/api/categories/` - Product categories
- `/api/checkout/` - Checkout process
- `/api/orders/` - Order management
- `/api/user/` - User profile operations

## Admin Interface

The Django admin interface is available at http://127.0.0.1:8000/admin/ and provides comprehensive management capabilities for:

- Products and categories
- Customer orders
- User accounts
- Site configuration
- Content management

The Oscar dashboard is available at http://127.0.0.1:8000/dashboard/ and offers additional e-commerce specific management tools.

## Development

### Backend Development

- Make migrations after model changes: `python manage.py makemigrations`
- Apply migrations: `python manage.py migrate`
- Run tests: `python manage.py test`

### Frontend Development

- Install new dependencies: `npm install package-name`
- Build for production: `npm run build`
- Run tests: `npm test`

## Deployment

### Backend Deployment

For production deployment, consider:
- Using PostgreSQL instead of SQLite
- Configuring proper email settings
- Setting up static files hosting with a CDN
- Using a WSGI server like Gunicorn
- Setting up Nginx as a reverse proxy

### Frontend Deployment

The React application can be built using:
```bash
cd frontend
npm run build
```
