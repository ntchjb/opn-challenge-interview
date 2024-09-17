#!/bin/bash

BASE_URL="http://localhost:3000"

curl \
  -X POST \
  -H 'Content-Type: application/json; charset=utf-8' \
  -H "Authorization: Bearer $TOKEN" \
  "$BASE_URL/api/v1/auth/delete" \
    --data-binary @- << EOF
{
    "currentPassword": "testtest"
}
EOF
