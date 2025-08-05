Promise.all([
    fetch("./header.html").then(res => res.text()).then(data => $("#header").html(data)),
    fetch("./sidebar.html").then(res => res.text()).then(data => $("#sidebar").html(data)),
    fetch("./footer.html").then(res => res.text()).then(data => $("#footer").html(data))
]).then(() => {
    initNavLink();
    initFAQtabbtn();
    initAnimate();
    initProgressBar();
    initCounter();
    initOdometerCounter();
    initSidebar();
    initSidebarDropdown();
    initSubmitContact();
    initSubmitNewsletter();
  });

function initCounter() {
    var $counters = $('.counter');
    var totalDuration = 2000;
    var maxTarget = 0;

    $counters.each(function() {
        var target = parseFloat($(this).attr('data-target'));
        if (target > maxTarget) {
            maxTarget = target;
        }
    });

    function startCounting($counter) {
        var target = parseFloat($counter.attr('data-target'));
        var count = 0;
        var step = target / (totalDuration / 16);

        function updateCount() {
            if (count < target) {
                count += step;
                if (count > target) count = target;

                if (target >= 1000) {
                    if (target % 1000 === 0) {
                        $counter.text(Math.floor(count / 1000) + "K");
                    } else {
                        $counter.text((count / 1000).toFixed(1) + "K");
                    }
                } else {
                    var decimalPlaces = (target.toString().split('.')[1] || '').length;
                    $counter.text(count.toFixed(decimalPlaces));
                }

                if (count < target - step) {
                    setTimeout(updateCount, 16);
                } else {
                    var decimalPlaces = (target.toString().split('.')[1] || '').length;
                    $counter.text(
                        target >= 1000
                            ? (target / 1000).toFixed(target % 1000 === 0 ? 0 : 1) + "K"
                            : target.toFixed(decimalPlaces)
                    );
                }
            }
        }

        updateCount();
    }

    var observer = new window.IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                $counters.each(function() {
                    startCounting($(this));
                });
                observer.disconnect();
            }
        });
    }, { threshold: 0.3 });

    $counters.each(function() {
        observer.observe(this);
    });
}

function initOdometerCounter() {
    let hasStarted = false;

    function startOdometer() {
        if (hasStarted) return;
        hasStarted = true;

        $('.odometer').each(function () {
            const $el = $(this);
            const rawValue = parseInt($el.attr('data-raw-value'), 10);
            let displayValue = '';
            let suffix = '';

            if (rawValue >= 1000000) {
                displayValue = (rawValue / 1000000).toFixed(1);
                suffix = 'M';
            } else if (rawValue >= 1000) {
                displayValue = (rawValue / 1000).toFixed(1);
                suffix = 'K';
            } else {
                displayValue = rawValue;
                suffix = '';
            }

            // Tambahkan angka di depan titik jika perlu
            if (displayValue.toString().startsWith('.')) {
                displayValue = '0' + displayValue;
            }

            $el.text(displayValue);

            // Cari elemen .odometer-suffix di dalam parent terdekat dan set suffix
            $el.closest('.counter-box').find('.odometer-suffix').text(suffix);
        });
    }

    // Cek apakah ada elemen .odometer di halaman
    const $odometers = $('.odometer');
    if ($odometers.length === 0) return;

    // Gunakan IntersectionObserver agar animasi dimulai saat elemen terlihat di layar
    const observer = new window.IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                startOdometer();
                observer.disconnect();
            }
        });
    }, { threshold: 0.3 });

    // Observe salah satu odometer saja, karena biasanya mereka muncul bersamaan
    observer.observe($odometers.get(0));
}



function  initNavLink() {
    const currentUrl = window.location.href;
    $(".navbar-nav .nav-link").each(function() {
        if (this.href === currentUrl) {
            $(this).addClass("active");
        }
    });
    $(".navbar-nav .dropdown-menu .dropdown-item").each(function() {
        if (this.href === currentUrl) {
            $(this).closest(".dropdown").find(".nav-link.dropdown-toggle").addClass("active");
        }
    });
}

function initFAQtabbtn() {
    var $buttons = $(".tab-btn");
    var $smallTabContents = $(".tab-content-sm .tab-pane");
    var $largeTabContents = $(".tab-content .tab-pane");
    var mediaQuery = window.matchMedia("(max-width: 768px)");

    $buttons.on("click", function () {
        var targetId = $(this).attr("data-bs-target").substring(1);

        if (mediaQuery.matches) {
            $smallTabContents.removeClass("show active");
            $("#" + targetId).addClass("show active");
        } else {
            $largeTabContents.removeClass("show active");
            var $targetContent = $("#" + targetId + "-lg");
            if ($targetContent.length) {
                $targetContent.addClass("show active");
            }
        }

        $buttons.removeClass("active");
        $(this).addClass("active");
    });
}

function initAnimate() {
    var $elements = $('[data-animate]');
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var $el = $(entry.target);
                var delay = $el.attr('data-delay') || 0;
                setTimeout(function() {
                    $el.addClass($el.attr('data-animate'));
                    $el.css('opacity', 1);
                    observer.unobserve(entry.target);
                }, delay);
            }
        });
    }, { threshold: 0.1 });

    $elements.each(function() {
        observer.observe(this);
    });
}
function initProgressBar() {
  $('.progress-bar').each(function () {
    var $progressBar = $(this);
    var $progressBarContainer = $progressBar.closest('.progress-bar-container');
    var $progressMessage = $progressBarContainer.find('.progress-message');
    var $progressMessageSpan = $progressMessage.find('span');
    var target = parseInt($progressBar.attr('data-progress-target'), 10);
    var current = 0;
    var animated = false;

    function animateProgress() {
      if (current <= target) {
        $progressBar.css('width', current + '%');
        $progressMessageSpan.text((current < 10 ? '0' : '') + current + '%');

        var containerWidth = $progressBarContainer.outerWidth();
        var messageWidth = $progressMessage.outerWidth();
        var left = (containerWidth * current / 100) - (messageWidth / 2);
        left = Math.max(0, Math.min(left, containerWidth - messageWidth));
        $progressMessage.css('left', left + 'px');

        current++;
        requestAnimationFrame(animateProgress);
      }
    }

    var observer = new window.IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !animated) {
          animated = true;
          $progressBar.css('width', '0%');
          current = 0;
          animateProgress();
          observer.unobserve($progressBarContainer[0]);
        }
      });
    }, { threshold: 0.3 });

    observer.observe($progressBarContainer[0]);
  });
}

function initSidebar() {
    const $menuBtn = $('.nav-btn');
    const $closeBtn = $('.close-btn');
    const $overlay = $('.sidebar-overlay');
    const $sidebar = $('.sidebar');
  
    $menuBtn.click(function() {
      $overlay.addClass('active');
      setTimeout(() => {
        $sidebar.addClass('active');
      }, 200);
    });
  
    $closeBtn.click(function() {
      $sidebar.removeClass('active');
      setTimeout(() => {
        $overlay.removeClass('active');
      }, 200);
    });
  
    $overlay.click(function() {
      $sidebar.removeClass('active');
      setTimeout(() => {
        $overlay.removeClass('active');
      }, 200);
    });
}

function initSidebarDropdown() {
    var $dropdownButtons = $(".sidebar-dropdown-btn");

    $dropdownButtons.on("click", function () {
        var $dropdownMenu = $(this).parent().next();
        var isOpen = $dropdownMenu.hasClass("active");

        $(".sidebar-dropdown-menu").not($dropdownMenu).removeClass("active");

        $dropdownMenu.toggleClass("active", !isOpen);
    });
}