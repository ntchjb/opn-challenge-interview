#!/bin/bash

BASE_URL="http://localhost:3000"

curl \
  -X POST \
  -H 'Content-Type: application/json; charset=utf-8' \
  "$BASE_URL/api/v1/auth/signup" \
  --data-binary @- << EOF
{
    "email": "example@gmail.com",
    "password": "test",
    "name": "yay",
    "dob": "1997-01-02",
    "gender": "male",
    "address": "123 OPN Building, Bangkok, Thailand, 10101",
    "subscribeEnabled": true
}
EOF