import pika
import time
import json

def data_processing():
    connection = pika.BlockingConnection(pika.ConnectionParameters('rabbitmq'))
    channel = connection.channel()
    channel.queue_declare(queue='iot_queue')
    channel.queue_declare(queue='dashboard_queue')

    def callback(ch, method, properties, body):
        try:
          message = json.loads(body.decode())
          temperature = message.get('temperature')
          print(f"Data Processing service receive this temp {temperature}")
          channel.basic_publish(exchange='', routing_key='dashboard_queue', body=f"Temperature : {temperature}°C")
        except Exception as e:
          print(e)
        finally:
            pass


    channel.basic_consume(queue='iot_queue', on_message_callback=callback)
    print('Data Processing service listening for IoT messages')
    channel.start_consuming()


if __name__ == "__main__":
    data_processing()