const FormValidator = (() => {

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const nameRegex = /^[A-Za-zÀ-ÿ'’ -]{2,}$/;
  const MIN_BUDGET = 200; // our lowest starting price (piercings)

  // Turns "+27 72 353 6209" or "072-353-6209" into "0723536209"
  function cleanPhone(value) {
    return value.replace(/[\s-]/g, "").replace(/^\+27/, "0");
  }

  // Any South African number: a 0 followed by 9 digits (landline or mobile)
  function isValidPhone(value) {
    return /^0[0-9]{9}$/.test(cleanPhone(value));
  }

  // Mobile numbers start 06, 07 or 08. Landlines (021, 011...) don't
  function isMobile(value) {
    return /^0[6-8][0-9]{8}$/.test(cleanPhone(value));
  }

  // Returns an error message, or "" if the field is fine
  function getError(field) {
    const value = field.value.trim();

    switch (field.name) {
      case "name":
        if (value === "") return "Please enter your name.";
        if (!nameRegex.test(value)) return "Names can only contain letters, spaces, hyphens and apostrophes (at least 2 characters).";
        return "";

      case "email":
        if (value === "") return "Please enter your email address.";
        if (!emailRegex.test(value)) return "That email doesn't look right. Try something like name@example.com.";
        return "";

      case "phone":
        if (value === "") return "Please enter your phone number.";
        if (!isValidPhone(value)) return "Enter a valid South African number, e.g. 082 123 4567 or +27 82 123 4567.";
        return "";

      case "proj_type":
        return value === "" ? "Please choose a project type." : "";

      case "budget": {
        if (value === "") return "Please enter your budget.";
        const amount = Number(value);
        if (Number.isNaN(amount)) return "Budget must be a number.";
        if (amount < MIN_BUDGET) return "Our prices start at R" + MIN_BUDGET + ", so please enter R" + MIN_BUDGET + " or more.";
        return "";
      }

      case "idea":
      case "message":
        if (value === "") return field.name === "idea" ? "Please describe your tattoo idea." : "Please enter a message.";
        if (value.length < 10) return "Please add a bit more detail (at least 10 characters).";
        return "";

      case "contact_method": {
        const checked = field.form.querySelector('input[name="contact_method"]:checked');
        if (!checked) return "Please choose how we should contact you.";

        // The phone and email were typed in step 1, so we check them against the method chosen here
        const phoneEl = field.form.querySelector("#phone");
        const emailEl = field.form.querySelector("#email");
        const phone = phoneEl ? phoneEl.value.trim() : "";
        const email = emailEl ? emailEl.value.trim() : "";

        if (checked.value === "Email" && !emailRegex.test(email)) {
          return "You chose email, but the email address from step 1 doesn't look right. Click Back to fix it.";
        }

        if (checked.value === "Phone call" && !isValidPhone(phone)) {
          return "You chose a phone call, but the phone number from step 1 isn't valid. Click Back to fix it.";
        }

        if (checked.value === "WhatsApp") {
          if (!isValidPhone(phone)) {
            return "You chose WhatsApp, but the phone number from step 1 isn't valid. Click Back to fix it.";
          }
          if (!isMobile(phone)) {
            return "WhatsApp needs a mobile number, but " + phone + " looks like a landline. Click Back to change it, or choose Phone call instead.";
          }
        }

        return "";
      }

      case "consent":
        return field.checked ? "" : "Please tick this box so we can use your details to reply.";

      default:
        return field.required && value === "" ? "This field is required." : "";
    }
  }

  // Radio groups and checkboxes show their error under the wrapper
  function getAnchor(field) {
    return field.closest(".radio-group, .checkbox-row") || field;
  }

  function showError(field, message) {
    const anchor = getAnchor(field);
    const errorId = field.name + "-error";
    let errorEl = document.getElementById(errorId);

    if (!errorEl) {
      errorEl = document.createElement("span");
      errorEl.id = errorId;
      errorEl.className = "error-msg";
      errorEl.setAttribute("role", "alert");
      anchor.insertAdjacentElement("afterend", errorEl);
    }

    errorEl.textContent = message;
    anchor.classList.add("invalid");
    field.setAttribute("aria-invalid", "true");
    field.setAttribute("aria-describedby", errorId);
  }

  function clearError(field) {
    const anchor = getAnchor(field);
    const errorEl = document.getElementById(field.name + "-error");
    if (errorEl) errorEl.remove();
    anchor.classList.remove("invalid");
    field.removeAttribute("aria-invalid");
    field.removeAttribute("aria-describedby");
  }

  function validateField(field) {
    const message = getError(field);
    if (message) {
      showError(field, message);
      return false;
    }
    clearError(field);
    return true;
  }

  // Validates every field inside a container (a whole form or one step)
  function validateContainer(container) {
    const seenRadios = new Set();
    let firstInvalid = null;

    container.querySelectorAll("input, select, textarea").forEach(field => {
      if (field.type === "radio") {
        if (seenRadios.has(field.name)) return;
        seenRadios.add(field.name);
      }
      if (!validateField(field) && !firstInvalid) {
        firstInvalid = field;
      }
    });

    if (firstInvalid) firstInvalid.focus();
    return !firstInvalid;
  }

  function isField(el) {
    return el.matches && el.matches("input, select, textarea");
  }

  // Checks fields as the user leaves them, and re-checks while they fix mistakes
  function attachLiveValidation(form) {
    form.addEventListener("focusout", (e) => {
      const f = e.target;
      if (isField(f) && f.type !== "radio" && f.type !== "checkbox") validateField(f);
    });

    form.addEventListener("input", (e) => {
      const f = e.target;
      if (!isField(f)) return;

      if (f.classList.contains("invalid")) validateField(f);

      // If the contact-method error is showing, re-check it when the phone or email is edited
      if ((f.name === "phone" || f.name === "email") && document.getElementById("contact_method-error")) {
        const radio = form.querySelector('input[name="contact_method"]');
        if (radio) validateField(radio);
      }
    });

    form.addEventListener("change", (e) => {
      const f = e.target;
      if (isField(f) && (f.type === "radio" || f.type === "checkbox" || f.tagName === "SELECT")) {
        validateField(f);
      }
    });
  }

  // On-page response instead of alert()
  function showMessage(box, type, text) {
    box.textContent = text;
    box.className = "form-message " + type;
    box.hidden = false;
    box.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function hideMessage(box) {
    box.hidden = true;
  }

  return { validateField, validateContainer, attachLiveValidation, showMessage, hideMessage };
})();