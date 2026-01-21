# SonarQube Configuration

This project includes SonarQube Community Edition integration for code quality analysis.

## What is SonarQube Community Edition?

**SonarQube Community Edition** is the free, open-source version of SonarQube that can be run locally or on your own server. It provides:

- ✅ Code quality and security analysis
- ✅ Support for 30+ programming languages
- ✅ Code smell detection
- ✅ Bug and vulnerability detection
- ✅ Code coverage integration
- ✅ Technical debt tracking

## Setup

### 1. Install Dependencies

Already installed via:

```bash
yarn add -D sonarqube-scanner
```

### 2. Run SonarQube Server (Docker)

The easiest way to run SonarQube Community Edition is with Docker:

```bash
# Pull and run SonarQube Community Edition
docker run -d --name sonarqube \
  -p 9000:9000 \
  -v sonarqube_data:/opt/sonarqube/data \
  -v sonarqube_logs:/opt/sonarqube/logs \
  -v sonarqube_extensions:/opt/sonarqube/extensions \
  sonarqube:community
```

Wait for startup (check logs):

```bash
docker logs -f sonarqube
```

Access SonarQube at: **http://localhost:9000**

Default credentials:

- **Username**: `admin`
- **Password**: `admin` (you'll be prompted to change on first login)

### 3. Create Project in SonarQube

1. Login to SonarQube at http://localhost:9000
2. Click **"Create Project"** → **"Manually"**
3. Enter:
   - **Project key**: `linkiez_BoletoSDK`
   - **Display name**: `BoletoSDK`
4. Click **"Set Up"**
5. Choose **"Locally"**
6. Generate a token:
   - Enter token name (e.g., `boletosdk-local`)
   - Click **"Generate"**
   - **Copy the token** (you won't see it again!)

### 4. Configure Project

The project is configured via `sonar-project.properties`. Key settings:

- **Project Key**: `linkiez_BoletoSDK`
- **Sources**: `src/`
- **Tests**: `tests/`
- **Coverage**: `coverage/lcov.info`
- **Exclusions**: `node_modules`, `dist`, `coverage`, test files

### 5. Set Environment Variables

Create a `.env` file or export:

```bash
export SONAR_TOKEN=your_generated_token
export SONAR_HOST_URL=http://localhost:9000
```

Or add to your shell profile (`~/.bashrc`, `~/.zshrc`):

```bash
echo 'export SONAR_TOKEN="sqp_59ea3a31c54b3248a667bf0d8f5049c59b5e2a03"' >> ~/.bashrc
echo 'export SONAR_HOST_URL="http://localhost:9000"' >> ~/.bashrc
source ~/.bashrc
```

### 6. Run Analysis

```bash
# Generate coverage first
yarn test:coverage

# Run SonarQube analysis
yarn sonar
```

View results at: **http://localhost:9000/dashboard?id=linkiez_BoletoSDK**

## Pre-push Hook Integration

The SonarQube analysis is integrated into the pre-push hook (Step 4/4):

- **If configured** (SONAR_TOKEN set): Runs analysis but doesn't block push on failure
- **If not configured**: Skips analysis with a message

This allows:

- ✅ Local development without SonarQube
- ✅ CI/CD pipelines with full analysis
- ⚠️ Non-blocking to avoid interrupting development flow

## Docker Compose Setup (Recommended)

For persistent setup, create `docker-compose.yml`:

```yaml
version: '3'

services:
  sonarqube:
    image: sonarqube:community
    container_name: sonarqube
    ports:
      - '9000:9000'
    environment:
      - SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true
    volumes:
      - sonarqube_data:/opt/sonarqube/data
      - sonarqube_logs:/opt/sonarqube/logs
      - sonarqube_extensions:/opt/sonarqube/extensions
    networks:
      - sonarnet

volumes:
  sonarqube_data:
  sonarqube_logs:
  sonarqube_extensions:

networks:
  sonarnet:
    driver: bridge
```

Start with:

```bash
docker-compose up -d
```

## CI/CD Integration

### GitHub Actions with Self-Hosted SonarQube

```yaml
name: SonarQube Analysis

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  sonarqube:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0 # Full history for better analysis

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: yarn install

      - name: Run tests with coverage
        run: yarn test:coverage

      - name: SonarQube Scan
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
          SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }} # Your server URL
        run: yarn sonar
```

**GitHub Secrets to configure:**

- `SONAR_TOKEN`: Token generated in SonarQube
- `SONAR_HOST_URL`: Your SonarQube server URL (e.g., `http://your-server:9000`)

## Configuration Options

Edit `sonar-project.properties` to customize:

```properties
# Coverage threshold
sonar.coverage.exclusions=**/*.test.ts,**/*.spec.ts

# Duplicate code detection
sonar.cpd.exclusions=**/*.test.ts

# Code complexity
sonar.javascript.globals=global,jest,describe,it,expect
```

## Viewing Results

After analysis:

1. Go to your SonarCloud dashboard
2. View metrics: bugs, vulnerabilities, code smells, coverage
3. Review detailed issues and hotspots
4. Track quality gate status

## Troubleshooting

### "SONAR_TOKEN not found"

Set the environment variable or skip SonarQube in pre-push.

### "Coverage file not found"

Run `yarn test:coverage` before `yarn sonar`.

### "Connection refused"

Make sure SonarQube server is running:

```bash
docker ps | grep sonarqube
# or
docker-compose ps
```

### "Analysis failed"

Check:

- SonarQube server is running and accessible
- Token is valid and not expired
- Host URL is correct (default: `http://localhost:9000`)
- Network connectivity
- Project key matches SonarQube project

### "Out of memory"

Increase Docker memory:

```bash
docker run -d --name sonarqube \
  -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true \
  -m 2g \
  -p 9000:9000 \
  sonarqube:community
```

### Stop/Start SonarQube

```bash
# Docker
docker stop sonarqube
docker start sonarqube

# Docker Compose
docker-compose stop
docker-compose start
```

## Manual Execution

Skip SonarQube during push:

```bash
git push --no-verify
```

Run SonarQube separately:

```bash
yarn test:coverage && yarn sonar
```
