
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function setGclidInForms() {
    var gclid = getUrlParameter('gclid');
    
    if (gclid) {
        localStorage.setItem('gclid', gclid);
        localStorage.setItem('gclid_timestamp', Date.now().toString());
        
        var gclidFields = document.querySelectorAll('input[name="gclid"]');
        gclidFields.forEach(function(field) {
            field.value = gclid;
        });
        
       
    } else {
        var storedGclid = localStorage.getItem('gclid');
        var timestamp = localStorage.getItem('gclid_timestamp');
        var thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
        
        if (storedGclid && timestamp && (Date.now() - parseInt(timestamp)) < thirtyDaysInMs) {
            var gclidFields = document.querySelectorAll('input[name="gclid"]');
            gclidFields.forEach(function(field) {
                field.value = storedGclid;
            });
            
           
        }
    }
}

function initGclidHandling() {
    setGclidInForms();
    
    document.addEventListener('shown.bs.modal', function() {
        setTimeout(setGclidInForms, 100); 
    });
    
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                var addedNodes = mutation.addedNodes;
                for (var i = 0; i < addedNodes.length; i++) {
                    var node = addedNodes[i];
                    if (node.nodeType === 1) { 
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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGclidHandling);
} else {
    initGclidHandling();
}
