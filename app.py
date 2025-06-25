from flask import Flask, render_template, request
import pickle
import numpy as np

app = Flask(__name__)

# Load models once at startup
diabetes_model = pickle.load(open('models/diabetes_model.pkl', 'rb'))
parkinsons_model = pickle.load(open('models/parkinsons_model.pkl', 'rb'))
heart_model = pickle.load(open('models/heart_model.pkl', 'rb'))

# Define the input fields required for each model
forms = {
    'diabetes': ['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 'Insulin',
                 'BMI', 'DiabetesPedigreeFunction', 'Age'],
    'parkinsons': ['MDVP:Fo(Hz)', 'MDVP:Fhi(Hz)', 'MDVP:Flo(Hz)', 'MDVP:Jitter(%)',
                   'MDVP:Jitter(Abs)', 'MDVP:RAP', 'MDVP:PPQ', 'Jitter:DDP',
                   'MDVP:Shimmer', 'MDVP:Shimmer(dB)', 'Shimmer:APQ3', 'Shimmer:APQ5',
                   'MDVP:APQ', 'Shimmer:DDA', 'NHR', 'HNR', 'RPDE', 'DFA', 'spread1',
                   'spread2', 'D2', 'PPE'],
    'heart': ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg',
              'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal']
}


@app.route('/')
def home():
    return render_template(
        'index.html',
        result=None,
        selected_model=None,
        features=[]
    )



@app.route('/predict', methods=['POST'])
def predict():
    selected_model = request.form.get('model')

    if selected_model not in forms:
        return render_template('index.html', result="Invalid model selected.", selected_model=None, features=None)

    try:
        # Get input values as floats
        input_values = []
        for i in range(len(forms[selected_model])):
            val = request.form.get(f"features_{i}")
            input_values.append(float(val))
    except (ValueError, TypeError):
        return render_template(
            'index.html',
            result="Invalid input values.",
            selected_model=selected_model,
            features=None
        )

    # Select the correct model
    if selected_model == 'diabetes':
        prediction = diabetes_model.predict([input_values])
        result_text = "Diabetes Detected" if prediction[0] == 1 else "Healthy"

    elif selected_model == 'parkinsons':
        prediction = parkinsons_model.predict([input_values])
        result_text = "Parkinson's Detected" if prediction[0] == 1 else "Healthy"

    elif selected_model == 'heart':
        prediction = heart_model.predict([input_values])
        result_text = "Heart Disease Detected" if prediction[0] == 1 else "Healthy"

    else:
        result_text = "Unknown model."

    return render_template(
        'index.html',
        selected_model=selected_model,
        features=input_values,
        result=result_text
    )


if __name__ == '__main__':
    app.run(debug=True)
