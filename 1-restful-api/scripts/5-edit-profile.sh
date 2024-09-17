#!/bin/bash

BASE_URL="http://localhost:3000"

curl \
  -X PATCH \
  -H 'Content-Type: application/json; charset=utf-8' \
  -H "Authorization: Bearer $TOKEN" \
  "$BASE_URL/api/v1/profile" \
  --data-binary @- << EOF
{
    "dob": "1996-01-02",
    "gender": "other",
    "address": "some where in The World",
    "subscribeEnabled": false
}
EOF
