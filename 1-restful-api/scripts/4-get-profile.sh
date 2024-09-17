#!/bin/bash

BASE_URL="http://localhost:3000"

curl \
  -X GET \
  -H 'Content-Type: application/json; charset=utf-8' \
  -H "Authorization: Bearer $TOKEN" \
  "$BASE_URL/api/v1/profile"

