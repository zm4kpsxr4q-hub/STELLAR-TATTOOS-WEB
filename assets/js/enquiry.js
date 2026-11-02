document.addEventListener("DOMContentLoaded", () => {

  // ===== EmailJS setup =====
  emailjs.init({ publicKey: "yqD4Q5oNe6NyHk4lW" });
  const SERVICE_ID = "service_jty9uuo";
  const TEMPLATE_ID = "template_dyqi969";

  const form = document.getElementById("enquiryForm");
  const steps = document.querySelectorAll(".form-step");
  const progressSteps = document.querySelectorAll(".progress-step");
  const nextButtons = document.querySelectorAll(".next-btn");
  const backButtons = document.querySelectorAll(".back-btn");
  const reviewSummary = document.getElementById("reviewSummary");
  const messageBox = document.getElementById("formMessage");

  let currentStep = 1;

  FormValidator.attachLiveValidation(form);

  function showStep(stepNumber) {
    steps.forEach(step => {
      step.classList.toggle("active", Number(step.dataset.step) === stepNumber);
    });

    progressSteps.forEach(p => {
      const num = Number(p.dataset.step);
      p.classList.toggle("active", num === stepNumber);
      p.classList.toggle("completed", num < stepNumber);
    });

    currentStep = stepNumber;

    if (stepNumber === 3) {
      buildReviewSummary();
    }
  }

  function currentStepEl() {
    return document.querySelector(`.form-step[data-step="${currentStep}"]`);
  }

  // Only moves forward if every field on this step passes validation
  function goNext() {
    FormValidator.hideMessage(messageBox);
    if (FormValidator.validateContainer(currentStepEl())) {
      showStep(currentStep + 1);
    }
  }

  // Builds the review rows with textContent so typed text can never inject HTML
  function addSummaryRow(label, value) {
    const p = document.createElement("p");
    const strong = document.createElement("strong");
    strong.textContent = label + ":";
    p.appendChild(strong);
    p.appendChild(document.createTextNode(" " + value));
    reviewSummary.appendChild(p);
  }

  function buildReviewSummary() {
    reviewSummary.innerHTML = "";

    const artistSelect = document.getElementById("artist");
    const artistText = artistSelect.options[artistSelect.selectedIndex].text;
    const method = form.querySelector('input[name="contact_method"]:checked');

    addSummaryRow("Name", document.getElementById("name").value.trim());
    addSummaryRow("Email", document.getElementById("email").value.trim());
    addSummaryRow("Phone", document.getElementById("phone").value.trim());
    addSummaryRow("Preferred Artist", artistText);
    addSummaryRow("Contact Method", method ? method.value : "");
    addSummaryRow("Idea", document.getElementById("idea").value.trim());
  }

  nextButtons.forEach(btn => {
    btn.addEventListener("click", goNext);
  });

  backButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      FormValidator.hideMessage(messageBox);
      showStep(currentStep - 1);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Pressing Enter on steps 1-2 should move forward, not submit early
    if (currentStep < 3) {
      goNext();
      return;
    }

    if (!FormValidator.validateContainer(currentStepEl())) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    const name = document.getElementById("name").value.trim();
    const artistSelect = document.getElementById("artist");
    const artistText = artistSelect.options[artistSelect.selectedIndex].text;
    const method = form.querySelector('input[name="contact_method"]:checked').value;

    const params = {
      subject: "New tattoo enquiry from " + name,
      email: document.getElementById("email").value.trim(),
      details:
        "A visitor just submitted the enquiry form.\n\n" +
        "Name: " + name + "\n" +
        "Email: " + document.getElementById("email").value.trim() + "\n" +
        "Phone: " + document.getElementById("phone").value.trim() + "\n" +
        "Preferred artist: " + artistText + "\n" +
        "Preferred contact method: " + method + "\n" +
        "Idea: " + document.getElementById("idea").value.trim()
    };

    emailjs.send(SERVICE_ID, TEMPLATE_ID, params)
      .then(() => {
        form.reset();
        showStep(1);
        FormValidator.showMessage(
          messageBox,
          "success",
          "Thanks " + name + "! Your enquiry has been sent. We'll contact you by " + method.toLowerCase() + " soon."
        );
      })
      .catch((error) => {
        console.error("EmailJS error:", error);
        FormValidator.showMessage(messageBox, "error", "Sorry, something went wrong sending your enquiry. Please try again.");
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit Enquiry";
      });
  });

});