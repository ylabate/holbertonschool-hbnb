# HBnB Evolution - Part 2: API Implementation

## 📋 Overview

Part 2 of the HBnB Evolution project implements a RESTful API for a property rental application (similar to AirBnB). This implementation uses a three-layered architecture pattern with Flask-RESTX for API documentation and in-memory data persistence.

## 🏗️ Architecture

The application follows a **three-layered architecture**:

```
┌─────────────────────────────────────┐
│     Presentation Layer (API)        │
│         Flask-RESTX                  │
├─────────────────────────────────────┤
│     Business Logic Layer             │
│      (Facade Pattern)                │
├─────────────────────────────────────┤
│     Persistence Layer                │
│   (Repository Pattern)               │
└─────────────────────────────────────┘
```

### Layers Description

1. **Presentation Layer** (`app/api/v1/`):
   - RESTful API endpoints using Flask-RESTX
   - Request validation and response formatting
   - API documentation (Swagger UI)

2. **Business Logic Layer** (`app/services/`):
   - `HBnBFacade` class that orchestrates all operations
   - Business rules and validations
   - Data transformations

3. **Persistence Layer** (`app/persistence/`):
   - Repository pattern implementation
   - `InMemoryRepository` for data storage
   - Abstract `Repository` interface for future implementations

## 🛠️ Technologies

- **Python 3.x**
- **Flask**: Web framework
- **Flask-RESTX**: REST API framework with Swagger documentation
- **Design Patterns**: Facade, Repository

## 📁 Project Structure

```
part2/
├── config.py                    # Configuration settings
├── run.py                       # Application entry point
├── requirement.txt              # Python dependencies
├── app/
│   ├── __init__.py             # App factory
│   ├── api/
│   │   └── v1/                 # API version 1
│   │       ├── users.py        # User endpoints
│   │       ├── amenities.py    # Amenity endpoints
│   │       ├── places.py       # Place endpoints
│   │       └── reviews.py      # Review endpoints
│   ├── models/                 # Data models
│   │   ├── entity.py           # Base entity class
│   │   ├── user.py             # User model
│   │   ├── amenity.py          # Amenity model
│   │   ├── place.py            # Place model
│   │   └── review.py           # Review model
│   ├── services/               # Business logic
│   │   └── facade.py           # Facade pattern implementation
│   └── persistence/            # Data persistence
│       └── repository.py       # Repository pattern implementation
```

## 🚀 Installation & Setup

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Installation Steps

1. **Navigate to the part2 directory**:
   ```bash
   cd part2
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirement.txt
   ```

3. **Run the application**:
   ```bash
   python run.py
   ```

4. **Access the API**:
   - API Base URL: `http://localhost:5000/api/v1/`
   - Swagger Documentation: `http://localhost:5000/api/v1/`

## 📚 API Endpoints

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/users` | Retrieve all users |
| POST | `/api/v1/users` | Create a new user |
| GET | `/api/v1/users/<user_id>` | Get user by ID |
| PUT | `/api/v1/users/<user_id>` | Update user information |

### Amenities

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/amenities` | Retrieve all amenities |
| POST | `/api/v1/amenities` | Create a new amenity |
| GET | `/api/v1/amenities/<amenity_id>` | Get amenity by ID |
| PUT | `/api/v1/amenities/<amenity_id>` | Update amenity information |

### Places

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/places` | Retrieve all places |
| POST | `/api/v1/places` | Create a new place |
| GET | `/api/v1/places/<place_id>` | Get place by ID |
| PUT | `/api/v1/places/<place_id>` | Update place information |

### Reviews

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/reviews` | Retrieve all reviews |
| POST | `/api/v1/reviews` | Create a new review |
| GET | `/api/v1/reviews/<review_id>` | Get review by ID |
| PUT | `/api/v1/reviews/<review_id>` | Update review information |
| DELETE | `/api/v1/reviews/<review_id>` | Delete a review |
| GET | `/api/v1/reviews/by_place/<place_id>` | Get all reviews for a place |

## 📝 Data Models

### User
```json
{
  "first_name": "string",
  "last_name": "string",
  "email": "string"
}
```

### Amenity
```json
{
  "name": "string",
  "description": "string"
}
```

### Place
```json
{
  "title": "string",
  "description": "string",
  "price": "number",
  "latitude": "number",
  "longitude": "number",
  "owner_id": "string",
  "amenities": ["array of amenity IDs"]
}
```

### Review
```json
{
  "text": "string",
  "rating": "number (1-5)",
  "user_id": "string",
  "place_id": "string"
}
```

## 🔍 Key Features

- **Automatic ID Generation**: All entities automatically receive a unique UUID
- **Email Validation**: Users must have valid email addresses (unique constraint)
- **Data Validation**: Input validation using Flask-RESTX models
- **Relationship Management**: Places can have multiple amenities and reviews
- **Business Logic Validation**: 
  - Owners must exist when creating places
  - Amenities must exist when associating with places
  - Users and places must exist when creating reviews
- **Interactive API Documentation**: Swagger UI for testing endpoints

## 🔧 Configuration

Configuration is managed in `config.py`:

```python
class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'default_secret_key')
    DEBUG = False

class DevelopmentConfig(Config):
    DEBUG = True
```

## 🧪 Testing

The API can be tested using:
- **Swagger UI**: `http://localhost:5000/api/v1/`
- **cURL**: Command-line HTTP client
- **Postman**: API testing tool
- **Python requests library**: Programmatic testing
- **Python doctest**: All tests use Python's `doctest` module and must be run from the `part2/` directory

### Example: Create a User with cURL

```bash
curl -X POST http://localhost:5000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com"
  }'
```

## 🎯 Design Patterns Used

### Facade Pattern
The `HBnBFacade` class provides a simplified interface to the complex subsystem of models and repositories. It encapsulates business logic and coordinates operations across multiple repositories.

### Repository Pattern
The `Repository` abstract class and `InMemoryRepository` implementation provide an abstraction layer for data persistence. This allows easy switching between different storage mechanisms (in-memory, database, etc.) without changing business logic.

### Factory Pattern
The `create_app()` function in `app/__init__.py` implements the Application Factory pattern, allowing flexible application configuration and testing.

## 📈 Future Enhancements

- Database integration (SQLAlchemy)
- User authentication and authorization
- File upload for place images
- Search and filtering capabilities
- Pagination for list endpoints
- Rate limiting
- Caching layer

## 👨‍💻 Development

### Running in Development Mode

The application runs in development mode by default with:
- Debug mode enabled
- Auto-reload on code changes
- Detailed error messages

### Adding New Endpoints

1. Create a new namespace in `app/api/v1/`
2. Define models using Flask-RESTX fields
3. Implement Resource classes with methods
4. Register the namespace in `app/__init__.py`
5. Add corresponding business logic in the Facade

## 📄 License

This project is part of the Holberton School curriculum.

## 🤝 Contributing

This is an educational project. Please refer to your Holberton School guidelines for contribution rules.

---

**Note**: This application uses in-memory storage. All data will be lost when the server is restarted.

```bash
# Models
python3 -m doctest app/models/tests.txt

# Facade (business logic)
python3 -m doctest app/services/tests_facade.txt

# API endpoints
python3 -m doctest app/api/v1/tests.txt
```


> **Note:** The application uses an `InMemoryRepository` — all data is lost on server restart.