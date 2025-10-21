# Electronic Parts Database

A modern web application for managing electronic parts inventory built with Next.js, PostgreSQL, and shadcn/ui components.

## Features

- **CRUD Operations**: Create, read, update, and delete electronic parts
- **Search & Filter**: Search by part number, name, or manufacturer; filter by category
- **Modern UI**: Clean, responsive interface built with Tailwind CSS and shadcn/ui
- **Flexible Specifications**: Store custom specifications as JSON data
- **No Authentication**: Simple, open access for easy use

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Containerization**: Docker Compose

## Database Schema

The application uses a single `electronic_parts` table with the following fields:

- `id` - Primary key (auto-increment)
- `part_number` - Unique part identifier
- `name` - Component name
- `description` - Detailed description
- `manufacturer` - Manufacturer name
- `category` - Component category (Resistor, Capacitor, IC, etc.)
- `quantity` - Stock quantity
- `unit_price` - Price per unit
- `location` - Storage location
- `datasheet_url` - Optional datasheet URL
- `specifications` - JSONB field for flexible specifications
- `created_at`, `updated_at` - Timestamps

## Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- npm or yarn

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd electronic-parts-database
npm install
```

### 2. Start the Database

```bash
# Start PostgreSQL container
docker-compose up -d

# Verify the database is running
docker-compose ps
```

### 3. Set Up the Database

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Seed the database with sample data
npx prisma db seed
```

### 4. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Usage

### Adding Parts

1. Click the "Add Part" button
2. Fill in the required fields (Part Number and Name are required)
3. Optionally add manufacturer, category, quantity, price, location, and datasheet URL
4. Click "Create Part" to save

### Editing Parts

1. Click the edit button (pencil icon) next to any part in the table
2. Modify the fields as needed
3. Click "Update Part" to save changes

### Searching and Filtering

- Use the search box to find parts by part number, name, or manufacturer
- Use the category dropdown to filter by component type
- Combine search and filter for more precise results

### Deleting Parts

1. Click the delete button (trash icon) next to any part
2. Confirm the deletion in the popup dialog

## API Endpoints

The application provides RESTful API endpoints:

- `GET /api/parts` - List all parts (supports search and category filters)
- `POST /api/parts` - Create a new part
- `GET /api/parts/[id]` - Get a specific part
- `PUT /api/parts/[id]` - Update a specific part
- `DELETE /api/parts/[id]` - Delete a specific part

## Database Management

### Viewing the Database

```bash
# Connect to the PostgreSQL container
docker-compose exec postgres psql -U postgres -d electronic_parts

# Or use Prisma Studio for a GUI
npx prisma studio
```

### Backup and Restore

```bash
# Backup
docker-compose exec postgres pg_dump -U postgres electronic_parts > backup.sql

# Restore
docker-compose exec -T postgres psql -U postgres electronic_parts < backup.sql
```

### Resetting the Database

```bash
# Stop the application
docker-compose down

# Remove the database volume
docker-compose down -v

# Start fresh
docker-compose up -d
npx prisma migrate dev --name init
```

## Development

### Adding New Fields

1. Update the Prisma schema in `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name add-new-field`
3. Update the TypeScript interfaces in the frontend
4. Update the API routes and UI components

### Adding New Components

The application uses shadcn/ui components. To add new ones:

```bash
npx shadcn@latest add [component-name]
```

## Troubleshooting

### Database Connection Issues

1. Ensure Docker is running: `docker --version`
2. Check if the PostgreSQL container is running: `docker-compose ps`
3. Verify the connection string in `.env`

### Build Issues

1. Clear Next.js cache: `rm -rf .next`
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Regenerate Prisma client: `npx prisma generate`

### Port Conflicts

If port 3000 is in use, update the `package.json` scripts or use:

```bash
npm run dev -- -p 3001
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.