import pika
import time
import pandas as pd
from sklearn.linear_model import LinearRegression

class ProductionAgent:
    def __init__(self):
        self.model = LinearRegression()

    def train(self, data):
        X = data.drop(columns=['output'])
        y = data['output']
        self.model.fit(X, y)

    def predict(self, input_data):
        return self.model.predict(input_data)[0]  # Return single prediction

    def run(self):
        connection = pika.BlockingConnection(pika.ConnectionParameters('rabbitmq'))
        channel = connection.channel()
        channel.queue_declare(queue='production_queue')
        data = pd.DataFrame({'input_feature1':[10],'input_feature2':[20]})
        self.train(pd.DataFrame({'input_feature1':[1,2,3,4,5],'input_feature2':[1,2,3,4,5],'output':[2,4,6,8,10]}))
        while True:
            try:
                method_frame, header_frame, body = channel.basic_get(queue='production_queue', auto_ack=True)
                if body:
                    print(f"Production Agent received message: {body.decode()}")
                    prediction = self.predict(data)
                    channel.basic_publish(exchange='', routing_key='dashboard_queue', body=f"Production Output:{prediction}")

                else:
                     print("Production Agent is Waiting for Message")
                time.sleep(5)
            except Exception as e:
                print(e)
            finally:
               pass
        connection.close()


if __name__ == "__main__":
    agent = ProductionAgent()
    agent.run()