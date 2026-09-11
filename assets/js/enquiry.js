document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("enquiryForm");
  const steps = document.querySelectorAll(".form-step");
  const progressSteps = document.querySelectorAll(".progress-step");
  const nextButtons = document.querySelectorAll(".next-btn");
  const backButtons = document.querySelectorAll(".back-btn");
  const reviewSummary = document.getElementById("reviewSummary");

  let currentStep = 1;

  function showStep(stepNumber) {
    // Hide every step, then show only the one we want
    steps.forEach(step => {
      step.classList.toggle("active", Number(step.dataset.step) === stepNumber);
    });

    // Update the progress indicator to match
    progressSteps.forEach(p => {
      const num = Number(p.dataset.step);
      p.classList.toggle("active", num === stepNumber);
      p.classList.toggle("completed", num < stepNumber);
    });

    currentStep = stepNumber;

    // Build the review summary once we reach step 3
    if (stepNumber === 3) {
      buildReviewSummary();
    }
  }

  function validateStep(stepNumber) {
    const stepEl = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
    const requiredFields = stepEl.querySelectorAll("[required]");
    let allValid = true;

    requiredFields.forEach(field => {
      if (!field.checkValidity()) {
        field.reportValidity(); // shows the browser's built-in "please fill this in" message
        allValid = false;
      }
    });

    return allValid;
  }

  function buildReviewSummary() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const artistSelect = document.getElementById("artist");
    const artistText = artistSelect.options[artistSelect.selectedIndex].text;
    const idea = document.getElementById("idea").value;

    reviewSummary.innerHTML = `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Preferred Artist:</strong> ${artistText}</p>
      <p><strong>Idea:</strong> ${idea}</p>
    `;
  }

  nextButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      if (validateStep(currentStep)) {
        showStep(currentStep + 1);
      }
    });
  });

  backButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      showStep(currentStep - 1);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // stops the page from actually reloading, since action="#" has nowhere real to send it yet
    alert("Thanks! Your enquiry has been received. We'll be in touch soon.");
    form.reset();
    showStep(1);
  });

});