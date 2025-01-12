import pandas as pd
from sklearn.ensemble import RandomForestRegressor

class ProductionAgent:
    def __init__(self):
        self.model = RandomForestRegressor()

    def train(self, data):
        X = data.drop(columns=['output'])
        y = data['output']
        self.model.fit(X, y)

    def predict(self, input_data):
        return self.model.predict(input_data)

if __name__ == "__main__":
    agent = ProductionAgent()
    data = pd.read_csv("production_data.csv")
    agent.train(data)
    print("Production Agent is ready!")