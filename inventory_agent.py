import pandas as pd
from sklearn.linear_model import LinearRegression

class InventoryAgent:
    def __init__(self):
        self.model = LinearRegression()

    def train(self, data):
        X = data.drop(columns=['demand'])
        y = data['demand']
        self.model.fit(X, y)

    def predict(self, input_data):
        return self.model.predict(input_data)

if __name__ == "__main__":
    agent = InventoryAgent()
    data = pd.read_csv("inventory_data.csv")
    agent.train(data)
    print("Inventory Agent is ready!")