const pageLoader = document.getElementById("pageLoader");
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const year = document.getElementById("year");
const contactForm = document.getElementById("contactForm");
const themeToggle = document.getElementById("themeToggle");
const scrollTopBtn = document.getElementById("scrollTopBtn");
const typedText = document.getElementById("typedText");

function updateFormProgress() {
  const formProgressText = document.getElementById("formProgressText");
  const formProgressFill = document.getElementById("formProgressFill");
  const formProgressStatus = document.getElementById("formProgressStatus");

  const formFields = [
    document.getElementById("contactName"),
    document.getElementById("contactEmail"),
    document.getElementById("contactService"),
    document.getElementById("contactTimeframe"),
    document.getElementById("contactBusinessSize"),
    document.getElementById("contactBudget"),
    document.getElementById("contactMessage")
  ];

  const existingFields = formFields.filter(field => field);
  const completedFields = existingFields.filter(field => field.value.trim() !== "");

  const progress = existingFields.length
    ? Math.round((completedFields.length / existingFields.length) * 100)
    : 0;

  if (formProgressText) {
    formProgressText.textContent = `${progress}%`;
  }

  if (formProgressFill) {
    formProgressFill.style.width = `${progress}%`;
  }

  if (formProgressStatus) {
    formProgressStatus.classList.remove("ready", "almost");

    if (progress === 100) {
      formProgressStatus.textContent = "Ready to send.";
      formProgressStatus.classList.add("ready");
    } else if (progress >= 70) {
      formProgressStatus.textContent = "Almost there — just a few details left.";
      formProgressStatus.classList.add("almost");
    } else if (progress > 0) {
      formProgressStatus.textContent = "Keep going — a few details still needed.";
    } else {
      formProgressStatus.textContent = "Start by adding your enquiry details.";
    }
  }
}

function highlightContactForm() {
  const contactCard = document.querySelector(".contact-card");
  const messageBox = document.getElementById("contactMessage");

  setTimeout(() => {
    if (messageBox) {
      messageBox.focus();
    }

    if (contactCard) {
      contactCard.classList.add("highlight-form");

      setTimeout(() => {
        contactCard.classList.remove("highlight-form");
      }, 1200);
    }

    updateFormProgress();
  }, 600);
}

if (year) {
  year.textContent = new Date().getFullYear();
}

const hideLoader = () => {
  if (!pageLoader) {
    return;
  }

  setTimeout(() => {
    pageLoader.classList.add("hide");
  }, 700);
};

if (document.readyState === "complete") {
  hideLoader();
} else {
  window.addEventListener("load", hideLoader);
}

const savedTheme = localStorage.getItem("appiTheme");
const useDarkTheme = savedTheme === null || savedTheme === "dark";

if (useDarkTheme) {
  document.body.classList.add("dark-mode");
} else {
  document.body.classList.remove("dark-mode");
}

if (themeToggle) {
  themeToggle.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
      themeToggle.textContent = "☀️";
      localStorage.setItem("appiTheme", "dark");
    } else {
      themeToggle.textContent = "🌙";
      localStorage.setItem("appiTheme", "light");
    }
  });
}

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    const menuIsOpen = navLinks.classList.toggle("show");

    menuBtn.textContent = menuIsOpen ? "×" : "☰";
    menuBtn.setAttribute("aria-expanded", menuIsOpen ? "true" : "false");
    menuBtn.setAttribute(
      "aria-label",
      menuIsOpen ? "Close navigation menu" : "Open navigation menu"
    );
  });

  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("show");
      menuBtn.textContent = "☰";
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.setAttribute("aria-label", "Open navigation menu");
    });
  });
}

const sendMessageBtn = document.getElementById("sendMessageBtn");
const copyEnquiryBtn = document.getElementById("copyEnquiryBtn");
const copyToast = document.getElementById("copyToast");
const emailFallbackNotice = document.getElementById("emailFallbackNotice");
const copyEmailBtn = document.getElementById("copyEmailBtn");

const showToast = message => {
  if (!copyToast) {
    return;
  }

  copyToast.textContent = message;
  copyToast.classList.add("show");

  setTimeout(() => {
    copyToast.classList.remove("show");
  }, 2200);
};

if (copyEmailBtn) {
  copyEmailBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText("AppiCoreSolutions@gmail.com");

      const originalButtonText = copyEmailBtn.textContent;

      copyEmailBtn.textContent = "Copied ✓";
      copyEmailBtn.disabled = true;

      showToast("Email address copied");

      setTimeout(() => {
        copyEmailBtn.textContent = originalButtonText;
        copyEmailBtn.disabled = false;
      }, 1800);
    } catch (error) {
      alert("Copy did not work. The email address is AppiCoreSolutions@gmail.com");
    }
  });
}

const highlightFieldError = field => {
  if (!field) {
    return;
  }

  field.classList.remove("field-error");
  void field.offsetWidth;
  field.classList.add("field-error");

  setTimeout(() => {
    field.classList.remove("field-error");
  }, 900);
};

const validateContactForm = () => {
  const requiredFields = [
    "contactName",
    "contactEmail",
    "contactService",
    "contactTimeframe",
    "contactBusinessSize",
    "contactBudget",
    "contactMessage"
  ];

  const firstEmptyFieldId = requiredFields.find(fieldId => {
    const field = document.getElementById(fieldId);
    return field && field.value.trim() === "";
  });

  if (firstEmptyFieldId) {
    const firstEmptyField = document.getElementById(firstEmptyFieldId);

    if (firstEmptyField) {
      firstEmptyField.focus();
      highlightFieldError(firstEmptyField);
    }

    showToast("Please complete the enquiry form first");
    return false;
  }

  const emailField = document.getElementById("contactEmail");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (emailField && !emailPattern.test(emailField.value.trim())) {
    emailField.focus();
    highlightFieldError(emailField);
    showToast("Please enter a valid email address");
    return false;
  }

  const projectMessageField = document.getElementById("contactMessage");

  if (projectMessageField && projectMessageField.value.trim().length < 20) {
    projectMessageField.focus();
    highlightFieldError(projectMessageField);
    showToast("Please add a little more enquiry detail");
    return false;
  }

  return true;
};

const messageField = document.getElementById("contactMessage");
const messageCounter = document.getElementById("messageCounter");

const updateMessageCounter = () => {
  if (!messageField || !messageCounter) {
    return;
  }

  const characterCount = messageField.value.trim().length;

  messageCounter.classList.remove("good", "warning");

  if (characterCount >= 20) {
    messageCounter.textContent = `${characterCount} characters - looks good`;
    messageCounter.classList.add("good");
  } else {
    messageCounter.textContent = `${characterCount} characters - minimum 20 recommended`;
    messageCounter.classList.add("warning");
  }
};

const updateMessageTextareaHeight = () => {
  if (!messageField) {
    return;
  }

  messageField.style.height = "auto";
  messageField.style.height = `${messageField.scrollHeight}px`;
};

if (messageField) {
  messageField.addEventListener("input", () => {
    updateMessageCounter();
    updateMessageTextareaHeight();
  });
}

const updateContactFormState = () => {
  updateFormProgress();
  updateMessageCounter();
  updateMessageTextareaHeight();
};

const getEnquiryDetails = () => {
  const name = document.getElementById("contactName").value;
  const email = document.getElementById("contactEmail").value;
  const service = document.getElementById("contactService").value;
  const timeframe = document.getElementById("contactTimeframe").value;
  const businessSize = document.getElementById("contactBusinessSize").value;
  const budget = document.getElementById("contactBudget").value;
  const message = document.getElementById("contactMessage").value;

  const subject = `New AppiCore Solutions enquiry from ${name}`;

  const body = `
New AppiCore Solutions Enquiry

Name: ${name}
Email: ${email}

Service or support needed:
${service}

Preferred timeframe:
${timeframe}

Business size:
${businessSize}

Estimated budget:
${budget}

Enquiry details:
${message}
  `;

  return {
    subject,
    body
  };
};

if (contactForm) {
  contactForm.addEventListener("submit", event => {
    event.preventDefault();

    if (!validateContactForm()) {
      return;
    }

    const enquiry = getEnquiryDetails();

    const mailtoLink = `mailto:AppiCoreSolutions@gmail.com?subject=${encodeURIComponent(enquiry.subject)}&body=${encodeURIComponent(enquiry.body)}`;

    if (sendMessageBtn) {
      const originalButtonText = sendMessageBtn.textContent;
    
      sendMessageBtn.textContent = "Opening email...";
      sendMessageBtn.disabled = true;
    
      setTimeout(() => {
        sendMessageBtn.textContent = originalButtonText;
        sendMessageBtn.disabled = false;
      }, 2500);
    }
    
      showToast("Opening your email app");
      
      if (emailFallbackNotice) {
        emailFallbackNotice.classList.add("show");
      }
      
      window.location.href = mailtoLink;
  });
}

if (copyEnquiryBtn && copyToast) {
  copyEnquiryBtn.addEventListener("click", async () => {
    if (!validateContactForm()) {
      return;
    }

    const enquiry = getEnquiryDetails();
    const copiedText = `Subject: ${enquiry.subject}\n\n${enquiry.body}`;

    try {
      await navigator.clipboard.writeText(copiedText);

    const originalButtonText = copyEnquiryBtn.textContent;

    copyEnquiryBtn.textContent = "Copied ✓";
    copyEnquiryBtn.disabled = true;
    
    showToast("Enquiry copied to clipboard");

    if (emailFallbackNotice) {
      emailFallbackNotice.classList.remove("show");
    }
    
    setTimeout(() => {
      copyEnquiryBtn.textContent = originalButtonText;
      copyEnquiryBtn.disabled = false;
    }, 1800);
      
    } catch (error) {
      alert("Copy did not work. Please highlight the form details manually and copy them.");
    }
  });
}

if (scrollTopBtn) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add("show");
    } else {
      scrollTopBtn.classList.remove("show");
    }
  });

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

const animatedItems = document.querySelectorAll(
  ".impact-item, .section-title, .before-after-card, .before-after-arrow, .service-card, .who-help-card, .guide-card, .tool-card, .finder-card, .calculator-card, .brief-card, .project-card, .why-content, .process-step, .package-card, .testimonial-card, .about-text, .stats, .faq-item, .trust-box, .cta-box, .contact-info, .custom-service-card, .contact-card"
);

animatedItems.forEach((item, index) => {
  item.classList.add("reveal");

  if (index % 3 === 1) {
    item.classList.add("reveal-delay-1");
  }

  if (index % 3 === 2) {
    item.classList.add("reveal-delay-2");
  }
});

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  {
    threshold: 0.15
  }
);

animatedItems.forEach(item => {
  revealObserver.observe(item);
});

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {
  const question = item.querySelector(".faq-question");

  if (question) {
    question.addEventListener("click", () => {
      item.classList.toggle("active");

      question.setAttribute(
        "aria-expanded",
        item.classList.contains("active") ? "true" : "false"
      );

      const symbol = question.querySelector("span");

      if (symbol) {
        symbol.textContent = item.classList.contains("active") ? "−" : "+";
      }
    });
  }
});

const pageSections = document.querySelectorAll("section[id]");
const navMenuLinks = document.querySelectorAll(".nav-links a");

const updateActiveNavLink = () => {
  let currentSectionId = "";

  pageSections.forEach(section => {
    const sectionTop = section.offsetTop - 140;
    const sectionHeight = section.offsetHeight;

    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentSectionId = section.getAttribute("id");
    }
  });

  navMenuLinks.forEach(link => {
    link.classList.remove("active");

    if (link.getAttribute("href") === `#${currentSectionId}`) {
      link.classList.add("active");
    }
  });
};

window.addEventListener("scroll", updateActiveNavLink);
window.addEventListener("load", updateActiveNavLink);

const typingPhrases = [
  "Digital tools built around your business.",
  "Automation that reduces repetitive work.",
  "Dashboards that make information clear.",
  "Websites that help customers find you.",
  "Simple systems that support growth."
];

let phraseIndex = 0;
let characterIndex = 0;
let isDeleting = false;

const typeHeroText = () => {
  if (!typedText) {
    return;
  }

  const currentPhrase = typingPhrases[phraseIndex];

  if (isDeleting) {
    typedText.textContent = currentPhrase.substring(0, characterIndex - 1);
    characterIndex--;
  } else {
    typedText.textContent = currentPhrase.substring(0, characterIndex + 1);
    characterIndex++;
  }

  let typingSpeed = isDeleting ? 45 : 75;

  if (!isDeleting && characterIndex === currentPhrase.length) {
    typingSpeed = 1600;
    isDeleting = true;
  }

  if (isDeleting && characterIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % typingPhrases.length;
    typingSpeed = 400;
  }

  setTimeout(typeHeroText, typingSpeed);
};

typeHeroText();

const privacyOpen = document.getElementById("privacyOpen");
const privacyModal = document.getElementById("privacyModal");
const privacyClose = document.getElementById("privacyClose");

const closePrivacyModal = () => {
  if (privacyModal) {
    privacyModal.classList.remove("show");
    privacyModal.setAttribute("aria-hidden", "true");
  }
};

if (privacyOpen && privacyModal && privacyClose) {
  privacyOpen.addEventListener("click", event => {
    event.preventDefault();
    privacyModal.classList.add("show");
    privacyModal.setAttribute("aria-hidden", "false");
  });

  privacyClose.addEventListener("click", closePrivacyModal);

  privacyModal.addEventListener("click", event => {
    if (event.target === privacyModal) {
      closePrivacyModal();
    }
  });
}

const siteNotice = document.getElementById("siteNotice");
const noticeAcceptBtn = document.getElementById("noticeAcceptBtn");
const noticePrivacyBtn = document.getElementById("noticePrivacyBtn");

if (siteNotice && noticeAcceptBtn && noticePrivacyBtn) {
  const noticeAccepted = localStorage.getItem("appiNoticeAccepted");

  if (noticeAccepted !== "true") {
    setTimeout(() => {
      siteNotice.classList.add("show");
    }, 1200);
  }

  noticeAcceptBtn.addEventListener("click", () => {
    localStorage.setItem("appiNoticeAccepted", "true");
    siteNotice.classList.remove("show");
  });

  noticePrivacyBtn.addEventListener("click", () => {
    if (privacyModal) {
      privacyModal.classList.add("show");
      privacyModal.setAttribute("aria-hidden", "false");
    }
  });
}

const backupCodeBtn = document.getElementById("backupCodeBtn");

if (backupCodeBtn) {
  document.addEventListener("keydown", event => {
    if (event.ctrlKey && event.key.toLowerCase() === "b") {
      event.preventDefault();
      backupCodeBtn.classList.toggle("show");
    }
  });

  backupCodeBtn.addEventListener("click", () => {
    const fullCode = document.documentElement.outerHTML;
    const blob = new Blob([fullCode], { type: "text/html" });
    const downloadLink = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);

    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `appicore-website-backup-${date}.html`;
    downloadLink.click();

    URL.revokeObjectURL(downloadLink.href);
  });
}

const prefillButtons = document.querySelectorAll(".prefill-service");

prefillButtons.forEach(button => {
  button.addEventListener("click", () => {
    const selectedService = button.getAttribute("data-service");
    const serviceDropdown = document.getElementById("contactService");

    if (serviceDropdown && selectedService) {
      serviceDropdown.value = selectedService;
    }

    updateContactFormState();
    highlightContactForm();
  });
});

const problemSelect = document.getElementById("problemSelect");
const finderResult = document.getElementById("finderResult");
const finderContactBtn = document.getElementById("finderContactBtn");

let selectedFinderService = "";
let selectedFinderMessage = "";

const solutionSuggestions = {
  spreadsheets: {
    title: "Suggested solution: Better Business System",
    service: "Excel Automation",
    text: "If your business information is difficult to manage, we can help organise it into a clearer spreadsheet, dashboard or simple digital system."
  },
  paperwork: {
    title: "Suggested solution: Digital Workflow",
    service: "Business App",
    text: "If a daily process feels slow or awkward, a simple app or digital workflow can make it easier to manage, track and complete."
  },
  reports: {
    title: "Suggested solution: Automated Reporting",
    service: "Excel Automation",
    text: "If reports or updates take too long, automation can reduce repeated work and make key information easier to prepare."
  },
  visibility: {
    title: "Suggested solution: Business Dashboard",
    service: "Power BI Dashboard",
    text: "If it is hard to see what is happening in your business, a dashboard can show important figures, progress and trends in one place."
  },
  website: {
    title: "Suggested solution: Website Build",
    service: "Website",
    text: "If you need a professional online presence, we can build a clean, mobile-friendly website that helps customers understand and contact your business."
  }
};

if (problemSelect && finderResult) {
  problemSelect.addEventListener("change", () => {
    const selectedProblem = problemSelect.value;
    const suggestion = solutionSuggestions[selectedProblem];

    if (!suggestion) {
      selectedFinderService = "";
      selectedFinderMessage = "";

      finderResult.innerHTML = `
        <h3>Your suggested solution will appear here.</h3>
        <p>Select an option above to see what could help.</p>
      `;
      return;
    }

    selectedFinderService = suggestion.service;
    selectedFinderMessage = suggestion.text;

    finderResult.innerHTML = `
      <h3>${suggestion.title}</h3>
      <p>${suggestion.text}</p>
    `;
  });
}

if (finderContactBtn) {
  finderContactBtn.addEventListener("click", () => {
    const serviceDropdown = document.getElementById("contactService");
    const messageBox = document.getElementById("contactMessage");

    if (serviceDropdown && selectedFinderService) {
      serviceDropdown.value = selectedFinderService;
    }

    if (messageBox && selectedFinderMessage) {
      messageBox.value = `I used the Solution Finder and I am interested in this:\n\n${selectedFinderMessage}\n\nEnquiry details:\n`;
    }

    updateContactFormState();
    highlightContactForm();
  });
}

const projectButtons = document.querySelectorAll(".project-detail-btn");
const projectModal = document.getElementById("projectModal");
const projectModalClose = document.getElementById("projectModalClose");
const projectModalTitle = document.getElementById("projectModalTitle");
const projectModalTag = document.getElementById("projectModalTag");
const projectModalText = document.getElementById("projectModalText");
const projectModalProblem = document.getElementById("projectModalProblem");
const projectModalSolution = document.getElementById("projectModalSolution");
const projectModalOutcome = document.getElementById("projectModalOutcome");
const projectModalContact = document.getElementById("projectModalContact");

let currentProject = null;

const projectDetails = {
  training: {
    tag: "Dashboard Project",
    title: "Business Performance Dashboard",
    text: "A reporting dashboard designed to make business information, progress and performance easier to understand.",
    problem: "Important business information can be hard to manage when it is spread across different spreadsheets, documents or systems.",
    solution: "The data is organised and displayed through clear KPIs, progress views, action lists and simple reporting.",
    outcome: "The business can see what is happening, what needs attention and where improvements can be made without manually checking multiple files.",
    service: "Power BI Dashboard"
  },
  paperwork: {
    tag: "Workflow Project",
    title: "Digital Workflow System",
    text: "A digital workflow system designed to organise information, reduce manual work and make everyday processes easier to manage.",
    problem: "Manual processes can become slow, inconsistent and difficult to track as a business grows.",
    solution: "A simple digital system can capture information, guide users through a process and keep records easier to find.",
    outcome: "The business spends less time chasing information and has a clearer way to manage tasks, records and updates.",
    service: "Business App"
  },
  excel: {
    tag: "Automation Project",
    title: "Excel Automation Tools",
    text: "Excel-based tools designed to reduce repetitive work and make reporting faster and more reliable.",
    problem: "Manual spreadsheet updates can take too long and increase the chance of mistakes.",
    solution: "Formulas, Power Query, VBA and better workbook design can automate repeated steps and create cleaner outputs.",
    outcome: "Reports become quicker to produce, easier to understand and more consistent from week to week.",
    service: "Excel Automation"
  }
};

projectButtons.forEach(button => {
  button.addEventListener("click", () => {
    const projectKey = button.getAttribute("data-project");
    const project = projectDetails[projectKey];

    if (!project || !projectModal) {
      return;
    }

    currentProject = project;

    projectModalTag.textContent = project.tag;
    projectModalTitle.textContent = project.title;
    projectModalText.textContent = project.text;
    projectModalProblem.textContent = project.problem;
    projectModalSolution.textContent = project.solution;
    projectModalOutcome.textContent = project.outcome;

    projectModal.classList.add("show");
    projectModal.setAttribute("aria-hidden", "false");
  });
});

const closeProjectModal = () => {
  if (projectModal) {
    projectModal.classList.remove("show");
    projectModal.setAttribute("aria-hidden", "true");
  }
};

if (projectModalContact) {
  projectModalContact.addEventListener("click", () => {
    if (!currentProject) {
      return;
    }

    const serviceDropdown = document.getElementById("contactService");
    const messageBox = document.getElementById("contactMessage");

    if (serviceDropdown) {
      serviceDropdown.value = currentProject.service;
    }

    if (messageBox) {
      messageBox.value = `I am interested in something similar to the ${currentProject.title}.\n\nEnquiry details:\n`;
    }

    closeProjectModal();
    updateContactFormState();
    highlightContactForm();
  });
}

if (projectModalClose && projectModal) {
  projectModalClose.addEventListener("click", closeProjectModal);

  projectModal.addEventListener("click", event => {
    if (event.target === projectModal) {
      closeProjectModal();
    }
  });
}

const hoursSavedInput = document.getElementById("hoursSaved");
const hourlyRateInput = document.getElementById("hourlyRate");
const calculateSavingsBtn = document.getElementById("calculateSavingsBtn");
const savingsResult = document.getElementById("savingsResult");
const calculatorContactBtn = document.getElementById("calculatorContactBtn");

let latestSavingsMessage = "I would like to ask about saving time through automation.";

const updateSavingsCalculator = () => {
  if (!hoursSavedInput || !hourlyRateInput || !savingsResult) {
    return;
  }

  const hoursSaved = Number(hoursSavedInput.value) || 0;
  const hourlyRate = Number(hourlyRateInput.value) || 0;
  const yearlySaving = hoursSaved * hourlyRate * 52;

  savingsResult.innerHTML = `
    <h3>Estimated yearly saving</h3>
    <strong>£${yearlySaving.toLocaleString("en-GB")}</strong>
    <p>Based on ${hoursSaved} hours per week at £${hourlyRate} per hour.</p>
  `;

latestSavingsMessage = `I used the Savings Calculator and would like to ask about saving time with a better digital solution.

Current estimate:
- Repetitive work: ${hoursSaved} hours per week
- Estimated hourly cost: £${hourlyRate}
- Estimated yearly saving: £${yearlySaving.toLocaleString("en-GB")}

Enquiry details:
`;
};

if (calculateSavingsBtn) {
  calculateSavingsBtn.addEventListener("click", updateSavingsCalculator);
}

if (hoursSavedInput && hourlyRateInput) {
  hoursSavedInput.addEventListener("input", updateSavingsCalculator);
  hourlyRateInput.addEventListener("input", updateSavingsCalculator);
}

if (calculatorContactBtn) {
  calculatorContactBtn.addEventListener("click", () => {
    const serviceDropdown = document.getElementById("contactService");
    const messageBox = document.getElementById("contactMessage");

    if (serviceDropdown) {
      serviceDropdown.value = "Excel Automation";
    }

    if (messageBox) {
      messageBox.value = latestSavingsMessage;
    }

    updateContactFormState();
    highlightContactForm();
  });
}

const addBriefBtn = document.getElementById("addBriefBtn");

if (addBriefBtn) {
  addBriefBtn.addEventListener("click", () => {
    const selectedBriefItems = Array.from(
      document.querySelectorAll(".brief-options input:checked")
    ).map(item => item.value);

    const messageBox = document.getElementById("contactMessage");
    const serviceDropdown = document.getElementById("contactService");

    if (selectedBriefItems.length === 0) {
      alert("Please tick at least one option first.");
      return;
    }

    let suggestedService = "Other";

    if (selectedBriefItems.some(item => item.toLowerCase().includes("website"))) {
      suggestedService = "Website";
    } else if (selectedBriefItems.some(item => item.toLowerCase().includes("dashboard"))) {
      suggestedService = "Power BI Dashboard";
    } else if (selectedBriefItems.some(item => item.toLowerCase().includes("power app") || item.toLowerCase().includes("paper"))) {
      suggestedService = "Business App";
    } else if (selectedBriefItems.some(item => item.toLowerCase().includes("excel") || item.toLowerCase().includes("automation"))) {
      suggestedService = "Excel Automation";
    }

    if (serviceDropdown) {
      serviceDropdown.value = suggestedService;
    }

    if (messageBox) {
      messageBox.value = `I used the Project Brief Builder and need help with:

- ${selectedBriefItems.join("\n- ")}

Enquiry details:
`;
    }

    window.location.href = "#contact";

    updateContactFormState();
    highlightContactForm();
  });
}

document
  .querySelectorAll("#contactForm input, #contactForm select, #contactForm textarea")
  .forEach(field => {
    field.addEventListener("input", () => {
      updateContactFormState();

      if (emailFallbackNotice) {
        emailFallbackNotice.classList.remove("show");
      }
    });

    field.addEventListener("change", () => {
      updateContactFormState();

      if (emailFallbackNotice) {
        emailFallbackNotice.classList.remove("show");
      }
    });
  });

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closePrivacyModal();
    closeProjectModal();
  }
});

const clearFormBtn = document.getElementById("clearFormBtn");

if (clearFormBtn) {
  clearFormBtn.addEventListener("click", () => {
    const confirmClear = confirm("Clear all enquiry form details?");

    if (!confirmClear) {
      return;
    }

    const contactFields = [
      "contactName",
      "contactEmail",
      "contactService",
      "contactTimeframe",
      "contactBusinessSize",
      "contactBudget",
      "contactMessage"
    ];

    contactFields.forEach(fieldId => {
      const field = document.getElementById(fieldId);

      if (field) {
        field.value = "";
      }
    });

    updateContactFormState();

    if (emailFallbackNotice) {
      emailFallbackNotice.classList.remove("show");
    }
    
    showToast("Enquiry form cleared");
  });
}

updateSavingsCalculator();
updateContactFormState();
updateActiveNavLink();
