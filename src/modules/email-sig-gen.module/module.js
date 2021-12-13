
//
//ELEMENTS
//
//form to enter data for custom signature
var emsig_form = document.querySelector("#emsig-form");
//form fields
var emsig_fullName = document.querySelector("#emsig-full-name");
var emsig_jobTitle = document.querySelector("#emsig-job-title");
var emsig_schoolOrDepartment = document.querySelector("#emsig-school-or-department");
var emsig_phone = document.querySelector("#emsig-phone");
var emsig_pronouns = document.querySelector("#emsig-pronouns");
//container element to display preview of signature
var emsig_preview = document.querySelector("#emsig-prev");
//element to display status message
var status_message = document.querySelector("#status-message");

// this is basically unused, but the idea is that if we get more complex status updates or whatever
// based on input changes, etc, then we can keep them a little cleaner by managing updates more centrally
// (if so, would also help to move input state in here and use 1-way binding)
var appState = (function () {
    var copySuccess = null;
    var logoLoaded = null;
    var logoUrl = 'https://educate.bastyr.edu/hubfs/Bastyr%20Brand%20Guide%20Content/Logos/Bastyr%20University_Horizontal.png';
    var previewReady = false;

    function updateStatusMessage (message) {
        
    }

    return ({
        copySuccess : function () {
            return copySuccess;
        },
        setCopySuccess : function (value) {
            copySuccess = value;
        },

        logoLoaded : function () {
            return logoLoaded
        },
        setLogoLoaded : function (value) {
            return logoLoaded = value;
        },

        logoUrl : function () {
            return logoUrl
        },

        previewReady : function () {
            return null
        },
        setPreviewReady : function () {
            return null
        }

    })
})();

// example values
emsig_preview.replaceChildren (
    renderSignature (
        "John Bastyr",
        "Cofounder",
        "Hall of Fame",
        "(425) 602-3000",
        "he/him/his",
    )
);

emsig_phone.addEventListener("keyup", function(event) {
    event.target.value = formatPhoneNumber(
            event.target.value
        )
})

emsig_form.addEventListener("submit", function(e) {
    var data = new FormData(e.target);
    var form = e.target;

    e.preventDefault();

    var fullName = emsig_fullName.value;
    var jobTitle = emsig_jobTitle.value;
    var schoolOrDepartment = emsig_schoolOrDepartment.value;
    var phoneNumber = emsig_phone.value;
    var pronouns = emsig_pronouns.value;

    var signature = renderSignature( fullName, jobTitle, schoolOrDepartment, phoneNumber, pronouns );
    emsig_preview.replaceChildren (
        signature
    );

    var copySuccess = copyTextToClipboard(signature.innerHTML);
    appState.copy_success = copySuccess;
});

function setStatusMessage (message) {

}

function renderSignature(
    fullName,
    jobTitle,
    schoolOrDepartment,
    phoneNumber,
    pronouns,
    ) {
    const signature = document.createElement('div');
    signature.id = 'email-signature';
    const signature_styles = `
        <style type="text/css" scoped>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;900&display=swap" rel="stylesheet">
            #email-signature, #email-signature * {
                all: initial;
            }
            #email-signature p {
                font-family: Lato, sans-serif;
                padding: 0;
                margin: 0;
                line-height: 1.4;
            }
        </style>
        <!--[if mso]>
            <style type=”text/css”>
                #email-signature {
                    font-family: Arial, sans-serif;
                }
            </style>
        <![endif]-->
    `;

    signature.innerHTML = `
        ${signature_styles}
        ${fullName ? `<p style="font-family: Lato, sans-serif; font-weight: 900; font-size: 21px;">${fullName}</p>` : ''}
        ${jobTitle ? `<p style="font-family: Lato, sans-serif; font-size: 18px;">${jobTitle}</p>` : ''}
        ${schoolOrDepartment ? `<p style="font-family: Lato, sans-serif; font-size: 16px; font-style: italic;">${schoolOrDepartment}</p>` : ''}
        ${phoneNumber ? `<p style="font-family: Lato, sans-serif; font-size: 16px;">${phoneNumber}</p>` : ''}
        <p><img width="255" id="signature__logo" src="${appState.logoUrl()}"></img></p>
        ${pronouns ? `<p style="font-family: Lato, sans-serif; font-size: 16px;">${pronouns}</p>` : ''}
    `;

    console.log("signature el", signature)

    // var logoImage = signature.querySelector('#signature__logo');

    // console.log(logoImage);

    // const response = fetch('https://bastyr.edu/images/sticky_logo.png').then(function(response) {
    //     return response.blob();
    // }).then(function(myBlob) {
    //     var objectURL = URL.createObjectURL(myBlob);
    //     logoImage.src = objectURL;
    // });
            
    return signature;
}

//stackoverflow 
function toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        var reader = new FileReader();
        reader.onloadend = function() {
        callback(reader.result);
        }
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}

//stackoverflow
function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
      return fallbackCopyTextToClipboard(text);
    }
    navigator.clipboard.writeText(text).then(function() {
      console.log('Async: Copying to clipboard was successful!');
      return true;
    }, function(err) {
      console.error('Async: Could not copy text: ', err);
      return false;
    });
}

function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
  
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
  
    try {
      var successful = document.execCommand('copy');
      var msg = successful ? true : false;
      console.log('Fallback: Success in copying? ' + msg);
    } catch (err) {
      console.error('Fallback: Success in copying?', err);
    }
  
    document.body.removeChild(textArea);
    return msg;
  }

//  https://tomduffytech.com/how-to-format-phone-number-in-javascript/
function formatPhoneNumber(value) {
    // if input value is falsy eg if the user deletes the input, then just return
    if (!value) return value;

    // clean the input for any non-digit values.
    const phoneNumber = value.replace(/[^\d]/g, "");

    // phoneNumberLength is used to know when to apply our formatting for the phone number
    const phoneNumberLength = phoneNumber.length;

    // we need to return the value with no formatting if its less then four digits
    // this is to avoid weird behavior that occurs if you  format the area code to early
    if (phoneNumberLength < 4) return phoneNumber;

    // if phoneNumberLength is greater than 4 and less the 7 we start to return
    // the formatted number
    if (phoneNumberLength < 7) {
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }

    // finally, if the phoneNumberLength is greater then seven, we add the last
    // bit of formatting and return it.
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
        3,
        6
    )}-${phoneNumber.slice(6, 10)}`;
}





// probably NOT NEEDED because gmail doesn't support base64 encoding

// the point of either of these is to take steps to include the logo image data as something other than
// an img src url... apparently that's not supported my many web clients, so nevermind!
// toDataURL('https://educate.bastyr.edu/hubfs/Bastyr%20Brand%20Guide%20Content/Logos/Bastyr%20University_Horizontal.png', 
// function(dataUrl) {
//     appState.logoBlob = dataUrl;
//     dataUrlTest1 = dataUrl;
//     console.log(dataUrlTest1)
// });

// fetch('https://educate.bastyr.edu/hubfs/Bastyr%20Brand%20Guide%20Content/Logos/Bastyr%20University_Horizontal.png')
//     .then(function(response) {
//     return response.blob();
//     }).then(function(myBlob) {
//         var objectURL = URL.createObjectURL(myBlob);
//         dataUrlTest2 = objectURL;
//         console.log(dataUrlTest2)
//     });

