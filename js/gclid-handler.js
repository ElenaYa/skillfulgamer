/**
 * GCLID (Google Click ID) Handler
 * Captures gclid parameter from URL and stores it for form submissions
 */

// Function to get URL parameter
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Function to set GCLID in forms
function setGclidInForms() {
    var gclid = getUrlParameter('gclid');
    
    if (gclid) {
        // Store GCLID in localStorage for future page visits
        localStorage.setItem('gclid', gclid);
        localStorage.setItem('gclid_timestamp', Date.now().toString());
        
        // Set GCLID in all forms with gclid field
        var gclidFields = document.querySelectorAll('input[name="gclid"]');
        gclidFields.forEach(function(field) {
            field.value = gclid;
        });
        
        console.log('GCLID captured and set:', gclid);
    } else {
        // Check if we have stored GCLID from previous visit (within 30 days)
        var storedGclid = localStorage.getItem('gclid');
        var timestamp = localStorage.getItem('gclid_timestamp');
        var thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
        
        if (storedGclid && timestamp && (Date.now() - parseInt(timestamp)) < thirtyDaysInMs) {
            var gclidFields = document.querySelectorAll('input[name="gclid"]');
            gclidFields.forEach(function(field) {
                field.value = storedGclid;
            });
            
            console.log('Stored GCLID used:', storedGclid);
        }
    }
}

// Function to initialize GCLID handling
function initGclidHandling() {
    // Set GCLID when page loads
    setGclidInForms();
    
    // Also set GCLID when modals open (for forms in modals)
    document.addEventListener('shown.bs.modal', function() {
        setTimeout(setGclidInForms, 100); // Small delay to ensure modal is fully rendered
    });
    
    // Handle dynamically loaded forms
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                var addedNodes = mutation.addedNodes;
                for (var i = 0; i < addedNodes.length; i++) {
                    var node = addedNodes[i];
                    if (node.nodeType === 1) { // Element node
                        var gclidFields = node.querySelectorAll ? node.querySelectorAll('input[name="gclid"]') : [];
                        if (gclidFields.length > 0) {
                            setGclidInForms();
                        }
                    }
                }
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGclidHandling);
} else {
    initGclidHandling();
}
