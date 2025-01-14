#!/bin/bash

echo "----------------------------------------"
echo "   Building Docker images for AI-Human Management System"
echo "----------------------------------------"

# Load Config
config_file="config.json"
max_cpu=$(jq -r .max_cpu "$config_file")
max_memory=$(jq -r .max_memory "$config_file")
prometheus_port=$(jq -r .prometheus_port "$config_file")
rabbitmq_host=$(jq -r .rabbitmq_host "$config_file")
iot_api_key=$(jq -r .iot_api_key "$config_file")

echo "Building RabbitMQ image..."
docker compose build rabbitmq
echo "RabbitMQ image built successfully."

echo "Building Production Agent image..."
docker compose build production_agent \
    --build-arg RABBITMQ_HOST="$rabbitmq_host" \
    --build-arg PROMETHEUS_PORT="$prometheus_port" \
    --build-arg max_cpu="$max_cpu" \
    --build-arg max_memory="$max_memory"
echo "Production Agent image built successfully."

echo "Building Inventory Agent image..."
docker compose build inventory_agent \
     --build-arg RABBITMQ_HOST="$rabbitmq_host" \
    --build-arg PROMETHEUS_PORT="$prometheus_port" \
    --build-arg max_cpu="$max_cpu" \
    --build-arg max_memory="$max_memory"
echo "Inventory Agent image built successfully."

echo "Building Dashboard image..."
docker compose build dashboard \
   --build-arg RABBITMQ_HOST="$rabbitmq_host" \
   --build-arg max_cpu="$max_cpu" \
   --build-arg max_memory="$max_memory"
echo "Dashboard image built successfully."

echo "Building Data Processing service image..."
docker compose build data_processing \
    --build-arg RABBITMQ_HOST="$rabbitmq_host" \
    --build-arg PROMETHEUS_PORT="$prometheus_port" \
    --build-arg max_cpu="$max_cpu" \
    --build-arg max_memory="$max_memory"
echo "Data Processing service image built successfully."

echo "Building IOT service image..."
docker compose build iot_server \
   --build-arg RABBITMQ_HOST="$rabbitmq_host" \
    --build-arg PROMETHEUS_PORT="$prometheus_port" \
   --build-arg max_cpu="$max_cpu" \
   --build-arg max_memory="$max_memory" \
    --build-arg API_KEY="$iot_api_key"
echo "IOT service image built successfully."

echo "All Docker images built successfully."
echo "----------------------------------------"