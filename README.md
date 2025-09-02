# Interview Challenges

This repository hosts executable starter code for technical interview challenges. Each challenge provides a self-contained Node.js development environment with scaffolding, tests, and documentation.

## Available Challenges

### 1. Algorithm: Pathfinder with Portals
**Category:** Algorithm | **Difficulty:** Medium | **Time:** 90 minutes

Implement Dijkstra's algorithm for pathfinding in a 2D grid with weighted terrain and portal teleportation mechanics.

**Key Features:**
- Weighted terrain movement costs
- Portal teleportation (A-Z letter pairs)
- Obstacle avoidance (walls marked with #)
- Optimal path finding with cost calculation

### 2. API: Weather Data Aggregator  
**Category:** API | **Difficulty:** Medium | **Time:** 120 minutes

Build a REST API service that aggregates weather data from multiple sources with caching and rate limiting.

**Key Features:**
- Multiple weather API integration
- Concurrent request limiting
- In-memory TTL caching
- Error handling and fallback strategies

### 3. Component: Pagination
**Category:** Component | **Difficulty:** Easy | **Time:** 60 minutes

Create a reusable pagination component with state management and navigation controls.

**Key Features:**
- Configurable page sizes and display options
- Boundary handling and navigation
- Clean state management
- Text-based UI rendering

### 4. Database: Query Optimizer
**Category:** Database | **Difficulty:** Hard | **Time:** 150 minutes

Optimize database query performance by improving algorithms for filtering, sorting, and joining operations.

**Key Features:**
- Performance benchmarking
- Algorithm optimization challenges
- Large dataset handling
- Memory efficiency improvements

### 5. Security: Authentication Audit
**Category:** Security | **Difficulty:** Hard | **Time:** 180 minutes

Audit and secure an intentionally vulnerable authentication system by identifying and fixing security flaws.

**Key Features:**
- Vulnerability identification
- Security best practices implementation
- Authentication flow hardening
- Security documentation

## Getting Started

### Prerequisites
- Node.js 20.0.0 or higher
- npm (comes with Node.js)

### Installation
```bash
git clone https://github.com/Jorybraun/excercises.git
cd excercises
npm install
```

### Running All Tests
```bash
npm test
```

### Working on Individual Challenges
Each challenge is in its own directory with its own README and setup:

```bash
cd algorithm-pathfinder
npm test

cd ../api-weather-aggregator
npm start  # Run the server
npm test   # Run tests

cd ../component-pagination
npm test

cd ../db-query-optimizer
npm test
npm run bench  # Performance benchmarks

cd ../security-audit-authflow
npm start  # Run vulnerable server
npm test   # Basic functionality tests
```

## Challenge Validation

Run the validation script to ensure all challenges meet the schema requirements:

```bash
npm run validate
```

This will check:
- Required files exist
- Metadata follows the correct schema
- Package configurations are valid

## Repository Structure

```
├── README.md                          # This file
├── package.json                       # Root workspace configuration
├── challenge-schema.json              # JSON schema for challenge metadata
├── challenges-manifest.json           # List of available challenges
├── scripts/
│   └── validate-challenges.mjs        # Challenge validation script
├── algorithm-pathfinder/              # Pathfinding challenge
├── api-weather-aggregator/            # Weather API challenge
├── component-pagination/              # Pagination component challenge
├── db-query-optimizer/                # Query optimization challenge
└── security-audit-authflow/           # Security audit challenge
```

## Contributing

This repository serves as the source-of-truth for interview challenge implementations. Each challenge includes:

- **Starter Code:** Basic implementation with TODO comments
- **Tests:** Automated tests to verify correctness
- **Documentation:** Clear problem descriptions and requirements
- **Metadata:** Structured challenge information in `challenge.json`

## Metadata Schema

Each challenge includes a `challenge.json` file that follows the schema defined in `challenge-schema.json`. Key fields include:

- `id`: Unique challenge identifier
- `title`: Human-readable challenge name
- `category`: Algorithm|API|Component|Database|Security
- `difficulty`: Easy|Medium|Hard
- `estimatedTimeMinutes`: Expected completion time
- `objectives`: Learning goals
- `requirements`: Functional requirements
- `evaluationCriteria`: Assessment criteria

## License

MIT
