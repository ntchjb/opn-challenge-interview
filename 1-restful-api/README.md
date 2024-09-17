# User accounts REST API

This is RESTful API for user registration. API can be found in `scripts` folder.

## Setup

use `node` and `npm`. Run `npm install` and `npm run start` to start the server. The server is listening at port `3000`.

## Usage

Use `curl` to test the server by running scripts in `scripts` folder. For APIs that require authorization token, please signin using `2-signin.sh` first to get JWT token, then set `TOKEN` environment variable with JWT token as its value.

```sh
export TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyNmYzMjJlOS1jZDU1LTQ1NGUtYTBjNC1kZGU..."
```
