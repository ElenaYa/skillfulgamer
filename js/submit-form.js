function initSubmitContact() {
    var $form = $("#contactForm");
    var $name = $("#name");
    var $email = $("#email");
    var $phone = $("#phone");
    var $subject = $("#subject");
    var $message = $("#message");
    var $successMessage = $("#success-message");
    var $errorMessage = $("#error-message");

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
                
                localStorage.removeItem('contactFormData');
            } catch (e) {
               
            }
        }
    }

    restoreFormData();

    function showError($input, message) {
        $input.addClass("error-border");
        var $errorText = $input.siblings(".error-text");
        if ($errorText.length === 0) {
            $errorText = $('<div class="error-text"></div>');
            $input.after($errorText);
        }
        $errorText.text(message).removeClass("hidden");
    }

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

        if ($.trim($name.val()) === "") {
            showError($name, "Ім'я обов'язкове");
            isValid = false;
        } else {
            clearError($name);
        }

        if ($.trim($email.val()) === "") {
            showError($email, "Email обов'язковий");
            isValid = false;
        } else if (!validateEmail($email.val())) {
            showError($email, "Неправильний формат email");
            isValid = false;
        } else {
            clearError($email);
        }

        if ($.trim($phone.val()) === "") {
            showError($phone, "Телефон обов'язковий");
            isValid = false;
        } else {
            clearError($phone);
        }

        if ($.trim($subject.val()) === "") {
            showError($subject, "Тема обов'язкова");
            isValid = false;
        } else {
            clearError($subject);
        }

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

        var formData = {
            name: $name.val(),
            email: $email.val(),
            phone: $phone.val(),
            subject: $subject.val(),
            message: $message.val()
        };
        localStorage.setItem('contactFormData', JSON.stringify(formData));

        $successMessage.removeClass("hidden");

        $form.find(".error-border").removeClass("error-border");
        $form.find(".error-text").addClass("hidden");

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

    function showError($input, message) {
        $input.addClass("error-border");
        var $errorText = $input.siblings(".error-text");
        if ($errorText.length === 0) {
            $errorText = $('<div class="error-text"></div>');
            $input.after($errorText);
        }
        $errorText.text(message).removeClass("hidden");
    }

    function clearError($input) {
        $input.removeClass("error-border");
        $input.siblings(".error-text").addClass("hidden");
    }

    function clearAllErrors() {
        $form.find('.error-border').removeClass('error-border');
        $form.find('.error-text').addClass('hidden');
        $successMessage.addClass("hidden");
        $errorMessage.addClass("hidden");
    }

    function validateForm() {
        var isValid = true;
        clearAllErrors();

        if ($name.val().trim() === "") {
            showError($name, "Будь ласка, введіть ваше ім'я");
            isValid = false;
        }

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

    function saveFormData() {
        var formData = {
            name: $name.val(),
            email: $email.val(),
            platform: $platform.val()
        };
        localStorage.setItem('gameListFormData', JSON.stringify(formData));
    }

    $form.on("submit", function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            saveFormData();
            
            $successMessage.removeClass("hidden");
            
            setTimeout(function() {
                window.location.href = "thank-you.html";
            }, 2000);
        }
    });

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