function showForm(modelName = "", prevValues = [], resultText = "") {
  const model = modelName || document.getElementById("model").value;
  const container = document.getElementById("form-container");

  if (!model) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = "";

  const forms = {
    heart: [
      "Age",
      "Sex",
      "ChestPainType",
      "RestingBP",
      "Cholesterol",
      "FastingBS",
      "RestingECG",
      "MaxHR",
      "ExerciseAngina",
      "Oldpeak",
      "ST_Slope",
      "CA",
      "Thal",
    ],
    parkinsons: [
      "MDVP:Fo(Hz)",
      "MDVP:Fhi(Hz)",
      "MDVP:Flo(Hz)",
      "MDVP:Jitter(%)",
      "MDVP:Jitter(Abs)",
      "MDVP:RAP",
      "MDVP:PPQ",
      "Jitter:DDP",
      "MDVP:Shimmer",
      "MDVP:Shimmer(dB)",
      "Shimmer:APQ3",
      "Shimmer:APQ5",
      "MDVP:APQ",
      "Shimmer:DDA",
      "NHR",
      "HNR",
      "RPDE",
      "DFA",
      "spread1",
      "spread2",
      "D2",
      "PPE",
    ],
    diabetes: [
      "Pregnancies",
      "Glucose",
      "BloodPressure",
      "SkinThickness",
      "Insulin",
      "BMI",
      "DiabetesPedigreeFunction",
      "Age",
    ],
  };

  const modelIcons = {
    heart: "fas fa-heart",
    parkinsons: "fas fa-brain",
    diabetes: "fas fa-syringe",
  };

  const modelTitles = {
    heart: "Heart Disease Prediction",
    parkinsons: "Parkinson's Disease Detection",
    diabetes: "Diabetes Risk Assessment",
  };

  const fields = forms[model];
  if (!fields) return;

  const formClass = model === "parkinsons" ? "parkinsons-form" : "";

  let html = `
                <div class="form-card">
                    <h2 class="form-title">
                        <i class="${modelIcons[model]}"></i>
                        ${modelTitles[model]}
                    </h2>
                    <form method="POST" action="/predict#form-container" class="form-grid ${formClass}">
                        <input type="hidden" name="model" value="${model}">
            `;

  fields.forEach((label, i) => {
    const val = prevValues[i] || "";
    html += `<div class="form-group">`;
    html += `<label>${label}</label>`;

    if (label === "Sex") {
      html += `
                        <div class="radio-group">
                            <label class="radio-option">
                                <input type="radio" name="features_${i}" value="1" ${
        val === "1" || val === 1 ? "checked" : ""
      } required>
                                <span class="radio-label">Male</span>
                            </label>
                            <label class="radio-option">
                                <input type="radio" name="features_${i}" value="0" ${
        val === "0" || val === 0 ? "checked" : ""
      } required>
                                <span class="radio-label">Female</span>
                            </label>
                        </div>
                    `;
    } else {
      html += `<input type="text" name="features_${i}" value="${val}" placeholder="Enter ${label}" class="form-input" required>`;
    }

    html += `</div>`;
  });

  html += `
                        <div style="grid-column: 1 / -1;">
                            <button type="submit" class="submit-btn">
                                <i class="fas fa-chart-line"></i>
                                Generate Prediction
                            </button>
                        </div>
                    </form>
            `;

  if (resultText && resultText !== "null") {
    const isPositive = resultText.toLowerCase().includes("detected");
    const resultClass = isPositive ? "positive" : "negative";
    const iconClass = isPositive
      ? "fas fa-exclamation-triangle"
      : "fas fa-check-circle";

    html += `
                    <div class="result ${resultClass}">
                        <h2><i class="${iconClass}"></i> ${resultText}</h2>
                    </div>
                `;
  }

  html += `</div>`;
  container.innerHTML = html;

  const form = container.querySelector("form");
  if (form) {
    form.addEventListener("submit", function (e) {
      const submitBtn = form.querySelector(".submit-btn");
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Processing...';
      form.classList.add("loading");
    });
  }

  if (resultText && resultText !== "null") {
    setTimeout(() => {
      document.getElementById("form-container").scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const sel = document.getElementById("model");
  sel.addEventListener("change", () => showForm());

  // Handle Flask template variables on page load
  if (selectedModel && selectedModel !== "null" && selectedModel !== null) {
    sel.value = selectedModel;
    showForm(selectedModel, features, result);
  }

  // Handle URL hash for scroll positioning after form submission
  if (window.location.hash === "#form-container") {
    setTimeout(() => {
      document.getElementById("form-container").scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 500);
  }
});
