#!/bin/bash

# Define the base URL of your server
BASE_URL="http://localhost:3000"

# Define the endpoint to add items
ENDPOINT="/items"

# Function to generate dummy data
generate_dummy_data() {
    local random_name=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 10 | head -n 1)
    local random_description=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 20 | head -n 1)
    local random_price=$((RANDOM % 100 + 1))
    local random_cost=$((RANDOM % 50 + 1))
    local random_quantity=$((RANDOM % 100 + 1))
    local random_in_stock=$((RANDOM % 2))

    cat <<EOF
{
    "name": "Dummy Item $random_name",
    "description": "Description for Dummy Item $random_description",
    "price": $random_price,
    "cost": $random_cost,
    "quantity": $random_quantity,
    "in_stock": $random_in_stock
}
EOF
}

# Loop to add 1000 dummy items
for ((i=1; i<=1000; i++)); do
    echo "Adding dummy item $i..."
    curl -s -X POST -H "Content-Type: application/json" -d "$(generate_dummy_data)" "$BASE_URL$ENDPOINT" >/dev/null
done

echo "Done"
