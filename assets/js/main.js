document.addEventListener("DOMContentLoaded", () => {

  // ===== Footer year =====
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ===== Dynamic content: uses South African time for every visitor =====
  function getSouthAfricaTime() {
    return new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Johannesburg" }));
  }

  // Time-based greeting (home page)
  const greetingEl = document.getElementById("greeting");
  if (greetingEl) {
    const hour = getSouthAfricaTime().getHours();
    let greeting = "Good evening";
    if (hour < 12) greeting = "Good morning";
    else if (hour < 18) greeting = "Good afternoon";
    greetingEl.textContent = greeting + " · Welcome to Stellar";
  }

  // Open / closed badge (home + contact pages). Hours: Mon–Fri, 9AM–6PM
  const statusEl = document.getElementById("openStatus");
  if (statusEl) {
    const now = getSouthAfricaTime();
    const day = now.getDay(); // 0 = Sunday ... 6 = Saturday
    const hour = now.getHours();
    const isOpen = day >= 1 && day <= 5 && hour >= 9 && hour < 18;

    statusEl.textContent = isOpen
      ? "We're open now (until 6PM today)"
      : "We're closed right now. Back Mon–Fri, 9AM–6PM";
    statusEl.classList.toggle("open", isOpen);
    statusEl.classList.toggle("closed", !isOpen);
  }

  // ===== Contact form =====
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    emailjs.init({ publicKey: "yqD4Q5oNe6NyHk4lW" });
    const SERVICE_ID = "service_jty9uuo";
    const TEMPLATE_ID = "template_dyqi969";
    const messageBox = document.getElementById("formMessage");

    FormValidator.attachLiveValidation(contactForm);

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      FormValidator.hideMessage(messageBox);

      if (!FormValidator.validateContainer(contactForm)) return;

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";

      const name = document.getElementById("name").value.trim();

      const params = {
        subject: "New contact message from " + name,
        email: document.getElementById("email").value.trim(),
        details:
          "A visitor just used the contact form.\n\n" +
          "Name: " + name + "\n" +
          "Email: " + document.getElementById("email").value.trim() + "\n" +
          "Project type: " + document.getElementById("proj_type").value + "\n" +
          "Budget: R" + document.getElementById("budget").value + "\n" +
          "Message: " + document.getElementById("message").value.trim()
      };

      emailjs.send(SERVICE_ID, TEMPLATE_ID, params)
        .then(() => {
          contactForm.reset();
          FormValidator.showMessage(messageBox, "success", "Thanks " + name + "! Your message has been sent. We'll get back to you soon.");
        })
        .catch((error) => {
          console.error("EmailJS error:", error);
          FormValidator.showMessage(messageBox, "error", "Sorry, something went wrong sending your message. Please try again.");
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = "Submit";
        });
    });
  }

});