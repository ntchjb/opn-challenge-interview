#!/bin/bash

BASE_URL="http://localhost:3000"
PASSWORD="test"

curl \
  -X POST \
  -H 'Content-Type: application/json; charset=utf-8' \
  "$BASE_URL/api/v1/auth/signin" \
  --data-binary @- << EOF
{
    "email": "example@gmail.com",
    "password": "$PASSWORD"
}
EOF