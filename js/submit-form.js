function initSubmitContact() {
    var $form = $("#contactForm");
    var $name = $("#name");
    var $email = $("#email");
    var $phone = $("#phone");
    var $subject = $("#subject");
    var $message = $("#message");
    var $successMessage = $("#success-message");
    var $errorMessage = $("#error-message");

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
            showError($name, "Name is required");
            isValid = false;
        } else {
            clearError($name);
        }

        // Validate Email
        if ($.trim($email.val()) === "") {
            showError($email, "Email is required");
            isValid = false;
        } else if (!validateEmail($email.val())) {
            showError($email, "Invalid email format");
            isValid = false;
        } else {
            clearError($email);
        }

        // Validate Phone
        if ($.trim($phone.val()) === "") {
            showError($phone, "Phone is required");
            isValid = false;
        } else {
            clearError($phone);
        }

        // Validate Subject
        if ($.trim($subject.val()) === "") {
            showError($subject, "Subject is required");
            isValid = false;
        } else {
            clearError($subject);
        }

        // Validate Message
        if ($.trim($message.val()) === "") {
            showError($message, "Message is required");
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

        $successMessage.removeClass("hidden");
        $form[0].reset();

        // Remove error-border and hide error-text after successful submit
        $form.find(".error-border").removeClass("error-border");
        $form.find(".error-text").addClass("hidden");

        setTimeout(function () {
            $successMessage.addClass("hidden");
        }, 3000);
    });
}

$(function () {
    initSubmitContact();
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
            $errorText.text('Email is required').removeClass('hidden');
            isValid = false;
        } else if (!validateEmail($email.val().trim())) {
            $email.addClass('error-border');
            $errorText.text('Invalid email format').removeClass('hidden');
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