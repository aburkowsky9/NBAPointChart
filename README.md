# NBAPointChart
A web page which draws a line chart of points scored over time for user-selected NBA team(s)

## Table of Contents

1. [Requirements](#Requirements)
2. [Development](#Development)
3. [API Documentation](#API-Documentation)

## Requirements
- Node ^6.13.0

## Development

### Installing Dependencies

From within the root directory:
```
npm install -g webpack
npm install
```
Build Dev Bundle (uses --watch function): 
```
npm run build-dev
```
Start Server (nodemon):
```
npm start
```
## API-Documentation

| Description | Method | Endpoint |
| --- | --- | --- |
| Get NBA Points data | GET | `/pointsData` |
