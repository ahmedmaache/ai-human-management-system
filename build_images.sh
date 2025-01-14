#!/bin/bash

echo "----------------------------------------"
echo "   Building Docker images for AI-Human Management System"
echo "----------------------------------------"

echo "Building RabbitMQ image..."
docker compose build rabbitmq
echo "RabbitMQ image built successfully."

echo "Building Production Agent image..."
docker compose build production_agent
echo "Production Agent image built successfully."

echo "Building Inventory Agent image..."
docker compose build inventory_agent
echo "Inventory Agent image built successfully."

echo "Building Dashboard image..."
docker compose build dashboard
echo "Dashboard image built successfully."

echo "Building Data Processing service image..."
docker compose build data_processing
echo "Data Processing service image built successfully."


echo "Building IOT service image..."
docker compose build iot_server
echo "IOT service image built successfully."

echo "All Docker images built successfully."
echo "----------------------------------------"