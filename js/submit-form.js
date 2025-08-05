function initSubmitContact() {
    var $form = $("#contactForm");
    var $name = $("#name");
    var $email = $("#email");
    var $phone = $("#phone");
    var $subject = $("#subject");
    var $message = $("#message");
    var $successMessage = $("#success-message");
    var $errorMessage = $("#error-message");

    // Restore form data if returning from thank you page
    function restoreFormData() {
        var savedData = localStorage.getItem('contactFormData');
        if (savedData) {
            try {
                var formData = JSON.parse(savedData);
                $name.val(formData.name || '');
                $email.val(formData.email || '');
                $phone.val(formData.phone || '');
                $subject.val(formData.subject || '');
                $message.val(formData.message || '');
                
                // Clear saved data after restoring
                localStorage.removeItem('contactFormData');
            } catch (e) {
                console.log('Error restoring form data:', e);
            }
        }
    }

    // Restore form data on page load
    restoreFormData();

    // Helper to show error
    function showError($input, message) {
        $input.addClass("error-border");
        var $errorText = $input.siblings(".error-text");
        if ($errorText.length === 0) {
            $errorText = $('<div class="error-text"></div>');
            $input.after($errorText);
        }
        $errorText.text(message).removeClass("hidden");
    }

    // Helper to clear error
    function clearError($input) {
        $input.removeClass("error-border");
        var $errorText = $input.siblings(".error-text");
        $errorText.addClass("hidden");
    }

    function validateEmail(email) {
        var pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return pattern.test(email);
    }

    $form.on("submit", function (event) {
        event.preventDefault();

        var isValid = true;

        // Validate Name
        if ($.trim($name.val()) === "") {
            showError($name, "Ім'я обов'язкове");
            isValid = false;
        } else {
            clearError($name);
        }

        // Validate Email
        if ($.trim($email.val()) === "") {
            showError($email, "Email обов'язковий");
            isValid = false;
        } else if (!validateEmail($email.val())) {
            showError($email, "Неправильний формат email");
            isValid = false;
        } else {
            clearError($email);
        }

        // Validate Phone
        if ($.trim($phone.val()) === "") {
            showError($phone, "Телефон обов'язковий");
            isValid = false;
        } else {
            clearError($phone);
        }

        // Validate Subject
        if ($.trim($subject.val()) === "") {
            showError($subject, "Тема обов'язкова");
            isValid = false;
        } else {
            clearError($subject);
        }

        // Validate Message
        if ($.trim($message.val()) === "") {
            showError($message, "Повідомлення обов'язкове");
            isValid = false;
        } else {
            clearError($message);
        }

        if (!isValid) {
            $errorMessage.removeClass("hidden");
            $successMessage.addClass("hidden");
            setTimeout(function () {
                $errorMessage.addClass("hidden");
            }, 3000);
            return;
        } else {
            $errorMessage.addClass("hidden");
        }

        // Store form data before redirect
        var formData = {
            name: $name.val(),
            email: $email.val(),
            phone: $phone.val(),
            subject: $subject.val(),
            message: $message.val()
        };
        localStorage.setItem('contactFormData', JSON.stringify(formData));

        // Show success message briefly then redirect (keep form filled)
        $successMessage.removeClass("hidden");

        // Remove error-border and hide error-text after successful submit
        $form.find(".error-border").removeClass("error-border");
        $form.find(".error-text").addClass("hidden");

        // Redirect to thank you page after 1.5 seconds (without clearing form)
        setTimeout(function () {
            window.location.href = "thank-you.html";
        }, 1500);
    });
}

$(function () {
    initSubmitContact();
    initSubmitGameList();
});

function initSubmitNewsletter() {
    $('#newsletterForm').on('submit', function(event) {
        event.preventDefault();

        var $email = $('#newsletter-email');
        var $successMessage = $('#newsletter-success');
        var $errorText = $email.next('.error-text');

        var isValid = true;

        function validateEmail(email) {
            var pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return pattern.test(email);
        }

        if (!$email.val().trim()) {
            $email.addClass('error-border');
            $errorText.text('Email обов\'язковий').removeClass('hidden');
            isValid = false;
        } else if (!validateEmail($email.val().trim())) {
            $email.addClass('error-border');
            $errorText.text('Неправильний формат email').removeClass('hidden');
            isValid = false;
        } else {
            $email.removeClass('error-border');
            $errorText.addClass('hidden');
        }

        if (isValid) {
            $successMessage.removeClass('hidden');
            $('#newsletterForm')[0].reset();
            setTimeout(function() {
                $successMessage.addClass('hidden');
            }, 3000);
        }
    });
}

function initSubmitGameList() {
    var $form = $("#gameListForm");
    var $name = $("#gameListName");
    var $email = $("#gameListEmail");
    var $platform = $("#gameListPlatform");
    var $successMessage = $("#gameList-success-message");
    var $errorMessage = $("#gameList-error-message");

    // Helper to show error
    function showError($input, message) {
        $input.addClass("error-border");
        var $errorText = $input.siblings(".error-text");
        if ($errorText.length === 0) {
            $errorText = $('<div class="error-text"></div>');
            $input.after($errorText);
        }
        $errorText.text(message).removeClass("hidden");
    }

    // Helper to clear error
    function clearError($input) {
        $input.removeClass("error-border");
        $input.siblings(".error-text").addClass("hidden");
    }

    // Clear all errors
    function clearAllErrors() {
        $form.find('.error-border').removeClass('error-border');
        $form.find('.error-text').addClass('hidden');
        $successMessage.addClass("hidden");
        $errorMessage.addClass("hidden");
    }

    // Validate form
    function validateForm() {
        var isValid = true;
        clearAllErrors();

        // Validate name
        if ($name.val().trim() === "") {
            showError($name, "Будь ласка, введіть ваше ім'я");
            isValid = false;
        }

        // Validate email
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if ($email.val().trim() === "") {
            showError($email, "Будь ласка, введіть ваш email");
            isValid = false;
        } else if (!emailPattern.test($email.val().trim())) {
            showError($email, "Будь ласка, введіть правильний email");
            isValid = false;
        }

        return isValid;
    }

    // Save form data to localStorage
    function saveFormData() {
        var formData = {
            name: $name.val(),
            email: $email.val(),
            platform: $platform.val()
        };
        localStorage.setItem('gameListFormData', JSON.stringify(formData));
    }

    // Form submit handler
    $form.on("submit", function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // Save form data before redirect
            saveFormData();
            
            // Show success message
            $successMessage.removeClass("hidden");
            
            // Redirect after 2 seconds
            setTimeout(function() {
                window.location.href = "thank-you.html";
            }, 2000);
        }
    });

    // Clear errors on input
    $name.on("input", function() {
        if ($(this).val().trim() !== "") {
            clearError($(this));
        }
    });

    $email.on("input", function() {
        if ($(this).val().trim() !== "" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($(this).val().trim())) {
            clearError($(this));
        }
    });
}