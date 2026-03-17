(function () {
  "use strict";

  // Create and inject CSS
  const style = document.createElement("style");
  style.textContent = `
      .feedback-widget-trigger {
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: #8FA6B8;
        color: white;
        border: none;
        border-radius: 12px;
        padding: 14px 24px;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: all 0.2s ease;
        z-index: 9998;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
  
      .feedback-widget-trigger:hover {
        background: #7A92A4;
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
      }
  
      .feedback-widget-overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.4);
        z-index: 9999;
        animation: fadeIn 0.2s ease;
      }
  
      .feedback-widget-overlay.active {
        display: flex;
        align-items: center;
        justify-content: center;
      }
  
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
  
      .feedback-widget-modal {
        background: white;
        border-radius: 20px;
        padding: 40px;
        width: 90%;
        max-width: 560px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        position: relative;
        animation: slideUp 0.3s ease;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
  
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
  
      .feedback-widget-close {
        position: absolute;
        top: 20px;
        right: 20px;
        background: none;
        border: none;
        font-size: 24px;
        color: #999;
        cursor: pointer;
        padding: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.2s ease;
      }
  
      .feedback-widget-close:hover {
        background: #f0f0f0;
        color: #333;
      }
  
      .feedback-widget-step {
        display: none;
      }
  
      .feedback-widget-step.active {
        display: block;
      }
  
      .feedback-widget-title {
        font-size: 28px;
        font-weight: 700;
        margin: 0 0 12px 0;
        color: #1a1a1a;
      }
  
      .feedback-widget-subtitle {
        font-size: 16px;
        color: #6b7280;
        margin: 0 0 32px 0;
      }
  
      .feedback-widget-options {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-bottom: 24px;
      }
  
      .feedback-widget-option {
        display: flex;
        align-items: center;
        padding: 20px 24px;
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
        background: white;
      }
  
      .feedback-widget-option:hover {
        border-color: #8FA6B8;
        background: #f9fafb;
      }
  
      .feedback-widget-option.selected {
        border-color: #8FA6B8;
        background: #f0f4f7;
      }
  
      .feedback-widget-radio {
        width: 22px;
        height: 22px;
        border: 2px solid #d1d5db;
        border-radius: 50%;
        margin-right: 16px;
        position: relative;
        transition: all 0.2s ease;
        flex-shrink: 0;
      }
  
      .feedback-widget-option.selected .feedback-widget-radio {
        border-color: #8FA6B8;
      }
  
      .feedback-widget-option.selected .feedback-widget-radio::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 12px;
        height: 12px;
        background: #8FA6B8;
        border-radius: 50%;
      }
  
      .feedback-widget-option-label {
        font-size: 18px;
        font-weight: 600;
        color: #1a1a1a;
      }
  
      .feedback-widget-textarea {
        width: 100%;
        min-height: 180px;
        padding: 16px;
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        font-size: 15px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        resize: vertical;
        margin-bottom: 24px;
        transition: border-color 0.2s ease;
        background: #fafafa;
        box-sizing: border-box;
      }
  
      .feedback-widget-textarea:focus {
        outline: none;
        border-color: #8FA6B8;
        background: white;
      }
  
      .feedback-widget-textarea::placeholder {
        color: #9ca3af;
      }
  
      .feedback-widget-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
      }
  
      .feedback-widget-btn {
        padding: 12px 28px;
        border-radius: 10px;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        border: none;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
  
      .feedback-widget-btn-primary {
        background: #8FA6B8;
        color: white;
      }
  
      .feedback-widget-btn-primary:hover:not(:disabled) {
        background: #7A92A4;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(143, 166, 184, 0.3);
      }
  
      .feedback-widget-btn-primary:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
  
      .feedback-widget-btn-secondary {
        background: #e5e7eb;
        color: #4b5563;
      }
  
      .feedback-widget-btn-secondary:hover {
        background: #d1d5db;
      }
  
      .feedback-widget-success {
        text-align: center;
        padding: 20px 0;
      }
  
      .feedback-widget-success-icon {
        font-size: 64px;
        margin-bottom: 16px;
      }
  
      .feedback-widget-success-title {
        font-size: 24px;
        font-weight: 700;
        color: #1a1a1a;
        margin: 0 0 8px 0;
      }
  
      .feedback-widget-success-text {
        font-size: 16px;
        color: #6b7280;
        margin: 0;
      }
  
      @media (max-width: 640px) {
        .feedback-widget-modal {
          padding: 28px;
          width: 95%;
        }
  
        .feedback-widget-title {
          font-size: 24px;
        }
  
        .feedback-widget-option-label {
          font-size: 16px;
        }
      }
    `;
  document.head.appendChild(style);

  // Create HTML structure
  const widgetHTML = `
      <button class="feedback-widget-trigger" id="feedbackWidgetTrigger">
        💬
      </button>
  
      <div class="feedback-widget-overlay" id="feedbackWidgetOverlay">
        <div class="feedback-widget-modal" id="feedbackWidgetModal">
          <button class="feedback-widget-close" id="feedbackWidgetClose">×</button>
  
          <!-- Step 1: Select Type -->
          <div class="feedback-widget-step active" data-step="1">
            <h2 class="feedback-widget-title">What can we improve?</h2>
            <p class="feedback-widget-subtitle"> All details and ideas are very welcome!</p>
            
            <div class="feedback-widget-options">
              <div class="feedback-widget-option" data-type="bug">
                <div class="feedback-widget-radio"></div>
                <span class="feedback-widget-option-label">Found a Bug/Error 🐞</span>
              </div>
              <div class="feedback-widget-option" data-type="feature">
                <div class="feedback-widget-radio"></div>
                <span class="feedback-widget-option-label">Enhancement 💡</span>
              </div>
            </div>
  
            <div class="feedback-widget-actions">
              <button class="feedback-widget-btn feedback-widget-btn-primary" id="feedbackNextBtn" disabled>
                Next
              </button>
            </div>
          </div>
  
          <!-- Step 2: Enter Details -->
          <div class="feedback-widget-step" data-step="2">
            <h2 class="feedback-widget-title">Give us the all the juicy details:</h2>
            
            <textarea 
              class="feedback-widget-textarea" 
              id="feedbackTextarea"
              placeholder="Tell us more..."
            ></textarea>
  
            <div class="feedback-widget-actions">
              <button class="feedback-widget-btn feedback-widget-btn-secondary" id="feedbackBackBtn">
                Back
              </button>
              <button class="feedback-widget-btn feedback-widget-btn-primary" id="feedbackFinishBtn">
                Finish
              </button>
            </div>
          </div>
  
          <!-- Step 3: Success -->
          <div class="feedback-widget-step" data-step="3">
            <div class="feedback-widget-success">
              <div class="feedback-widget-success-icon">✨</div>
              <h3 class="feedback-widget-success-title">Thanks for your feedback!</h3>
              <p class="feedback-widget-success-text">We appreciate you taking the time to help us improve.</p>
            </div>
          </div>
        </div>
      </div>
    `;

  // Inject HTML into page
  document.addEventListener("DOMContentLoaded", function () {
    const container = document.createElement("div");
    container.innerHTML = widgetHTML;
    document.body.appendChild(container);

    // Initialize widget
    initFeedbackWidget();
  });

  function initFeedbackWidget() {
    const trigger = document.getElementById("feedbackWidgetTrigger");
    const overlay = document.getElementById("feedbackWidgetOverlay");
    const modal = document.getElementById("feedbackWidgetModal");
    const closeBtn = document.getElementById("feedbackWidgetClose");
    const nextBtn = document.getElementById("feedbackNextBtn");
    const backBtn = document.getElementById("feedbackBackBtn");
    const finishBtn = document.getElementById("feedbackFinishBtn");
    const options = document.querySelectorAll(".feedback-widget-option");
    const textarea = document.getElementById("feedbackTextarea");

    let currentStep = 1;
    let selectedType = null;

    // Open modal
    trigger.addEventListener("click", () => {
      overlay.classList.add("active");
    });

    // Close modal
    function closeModal() {
      overlay.classList.remove("active");
      setTimeout(() => {
        resetWidget();
      }, 300);
    }

    closeBtn.addEventListener("click", closeModal);

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        closeModal();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay.classList.contains("active")) {
        closeModal();
      }
    });

    // Select feedback type
    options.forEach((option) => {
      option.addEventListener("click", () => {
        options.forEach((opt) => opt.classList.remove("selected"));
        option.classList.add("selected");
        selectedType = option.dataset.type;
        nextBtn.disabled = false;
      });
    });

    // Navigation
    nextBtn.addEventListener("click", () => {
      if (selectedType) {
        goToStep(2);
      }
    });

    backBtn.addEventListener("click", () => {
      goToStep(1);
    });

    finishBtn.addEventListener("click", async () => {
      const feedbackText = textarea.value.trim();

      if (!feedbackText) {
        textarea.focus();
        return;
      }

      finishBtn.disabled = true;
      finishBtn.textContent = "Sending...";

      // Gather data
      const feedbackData = {
        type: selectedType,
        message: feedbackText,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toLocaleString("en-US", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          timeZoneName: "short",
        }),
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        screen: {
          width: window.screen.width,
          height: window.screen.height,
        },
      };

      try {
        // Send to Formspree
        const response = await fetch("https://formspree.io/f/xaqorqry", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _subject: `New ${
              selectedType === "bug" ? "Bug Report" : "Enhancement"
            }`,
            type: feedbackData.type,
            message: feedbackData.message,
            url: feedbackData.url,
            userAgent: feedbackData.userAgent,
            timestamp: feedbackData.timestamp,
            viewport: `${feedbackData.viewport.width}x${feedbackData.viewport.height}`,
            screen: `${feedbackData.screen.width}x${feedbackData.screen.height}`,
          }),
        });

        if (response.ok) {
          goToStep(3);
          setTimeout(() => {
            closeModal();
          }, 2500);
        } else {
          throw new Error("Failed to submit feedback");
        }
      } catch (error) {
        console.error("Feedback submission error:", error);
        alert(
          "Sorry, there was an error submitting your feedback. Please try again."
        );
        finishBtn.disabled = false;
        finishBtn.textContent = "Finish";
      }
    });

    function goToStep(step) {
      const steps = document.querySelectorAll(".feedback-widget-step");
      steps.forEach((s) => s.classList.remove("active"));
      document.querySelector(`[data-step="${step}"]`).classList.add("active");
      currentStep = step;
    }

    function resetWidget() {
      goToStep(1);
      options.forEach((opt) => opt.classList.remove("selected"));
      selectedType = null;
      textarea.value = "";
      nextBtn.disabled = true;
      finishBtn.disabled = false;
      finishBtn.textContent = "Finish";
    }
  }
})();
