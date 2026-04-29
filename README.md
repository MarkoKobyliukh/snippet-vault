# Snippet Vault

Мінімальний сервіс для збереження корисних фрагментів — посилань, нотаток і команд — з тегами та пошуком.

**Стек:** Next.js (App Router) · NestJS · MongoDB (Mongoose) · TypeScript · Tailwind CSS

**Демо:** [snippet-vault-lac.vercel.app](https://snippet-vault-lac.vercel.app) · **API:** [snippet-vault-production-d085.up.railway.app/api/snippets](https://snippet-vault-production-d085.up.railway.app/api/snippets)

---

## Початок роботи

### Вимоги

- Node.js >= 18
- npm >= 9
- Обліковий запис MongoDB Atlas (безкоштовний M0 tier достатній)

### 1. Клонування репозиторію

```bash
git clone https://github.com/MarkoKobyliukh/snippet-vault.git
cd snippet-vault
```

### 2. Налаштування змінних оточення

**Backend:**

```bash
cp backend/.env.example backend/.env
```

Відкрий `backend/.env` і вкажи свій MongoDB Atlas connection string:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/snippet-vault?appName=Cluster0
PORT=3001
```

**Frontend:**

```bash
cp frontend/.env.example frontend/.env.local
```

`frontend/.env.local` має містити:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 3. Встановлення залежностей

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 4. Запуск у режимі розробки

Відкрий два термінали:

**Термінал 1 — Backend:**
```bash
cd backend
npm run start:dev
# Запущено на http://localhost:3001/api
```

**Термінал 2 — Frontend:**
```bash
cd frontend
npm run dev
# Запущено на http://localhost:3000
```

---

## API

Base URL: `http://localhost:3001/api`

### Ендпоінти

| Method | URL | Опис |
|--------|-----|------|
| `POST` | `/snippets` | Створити сніпет |
| `GET` | `/snippets` | Список сніпетів (пагінація, пошук, фільтр) |
| `GET` | `/snippets/:id` | Отримати один сніпет |
| `PATCH` | `/snippets/:id` | Оновити сніпет |
| `DELETE` | `/snippets/:id` | Видалити сніпет |

### Query параметри для `GET /snippets`

| Параметр | Тип | Опис |
|----------|-----|------|
| `q` | string | Пошук по назві або контенту (частковий збіг) |
| `tag` | string | Фільтр по тегу |
| `page` | number | Номер сторінки (за замовчуванням: 1) |
| `limit` | number | Елементів на сторінці (за замовчуванням: 10) |

### Приклади запитів

**Створити сніпет:**
```bash
curl -X POST http://localhost:3001/api/snippets \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Git force push (safe)",
    "content": "git push --force-with-lease origin main",
    "tags": ["git", "terminal"],
    "type": "command"
  }'
```

**Список всіх сніпетів:**
```bash
curl http://localhost:3001/api/snippets
```

**Пошук за ключовим словом:**
```bash
curl "http://localhost:3001/api/snippets?q=git"
```

**Фільтр по тегу:**
```bash
curl "http://localhost:3001/api/snippets?tag=terminal"
```

**Пагінація:**
```bash
curl "http://localhost:3001/api/snippets?page=2&limit=5"
```

**Отримати один сніпет:**
```bash
curl http://localhost:3001/api/snippets/<id>
```

**Оновити сніпет:**
```bash
curl -X PATCH http://localhost:3001/api/snippets/<id> \
  -H "Content-Type: application/json" \
  -d '{ "title": "Updated title" }'
```

**Видалити сніпет:**
```bash
curl -X DELETE http://localhost:3001/api/snippets/<id>
# Повертає 204 No Content
```

**Приклад помилки валідації (400):**
```bash
curl -X POST http://localhost:3001/api/snippets \
  -H "Content-Type: application/json" \
  -d '{ "title": "", "content": "test", "type": "invalid" }'
```

---

## Продакшн білд

**Backend:**
```bash
cd backend
npm run build
npm run start:prod
```

**Frontend:**
```bash
cd frontend
npm run build
npm run start
```

---

## Структура проекту

```
snippet-vault/
├── backend/                  # NestJS API
│   ├── src/
│   │   ├── snippets/
│   │   │   ├── dto/          # Валідаційні DTO
│   │   │   ├── schemas/      # Mongoose схема
│   │   │   ├── snippets.controller.ts
│   │   │   ├── snippets.service.ts
│   │   │   └── snippets.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── .env.example
└── frontend/                 # Next.js App Router
    ├── app/
    │   ├── page.tsx          # Список + форма створення
    │   └── snippets/[id]/
    │       └── page.tsx      # Деталі + редагування + видалення
    ├── components/
    │   ├── SnippetCard.tsx
    │   ├── SnippetForm.tsx
    │   ├── SearchBar.tsx
    │   └── TagFilter.tsx
    ├── lib/
    │   ├── api.ts            # axios клієнт
    │   └── types.ts          # TypeScript типи
    └── .env.example
```
