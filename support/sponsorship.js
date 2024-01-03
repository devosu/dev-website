const uploadButton = document.getElementById('uploadButton');
const logoPreview = document.getElementById('logoPreview');
const logoPreview2 = document.getElementById('logoPreview2');
const flyerPreview = document.getElementById('flyerPreview');

function updateLogoPreview(removeClasses, addClass='') {
    logoPreview.classList.remove(...removeClasses);
    logoPreview.classList.add(addClass);
    logoPreview2.classList.remove(...removeClasses);
    logoPreview2.classList.add(addClass);
}

let tierSelected = false;
let logoUploaded = false;



uploadButton.addEventListener('change', () => {
    updateLogoPreview(['square', 'rectangle'], 'fit');
    const file = uploadButton.files[0];
    if (file) {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            logoUploaded = true;
            maybeShowPreview();

            logoPreview.setAttribute('src', reader.result);
            logoPreview2.setAttribute('src', reader.result);
            // measure the image size after it is loaded
            logoPreview.addEventListener('load', () => {
              const width = logoPreview.naturalWidth;
              const height = logoPreview.naturalHeight;
              if (width - height > 20) {
                updateLogoPreview(['fit'], 'rectangle');
              } else {
                updateLogoPreview(['fit'], 'square');
              }
            })
        });
        reader.readAsDataURL(file);
    }
});

const tierCards = document.querySelectorAll('.tier-card');
styles = ['small', 'medium', 'big']
prices = [50, 150, 300]

let history = [];
function selectTier(n, saveHistory=true) {
    if (saveHistory) {
        history.push(n);
    }
    tierSelected = true;
    maybeShowPreview();

    checkout.total = prices[n];
    updateCheckoutButton();

    updateLogoPreview(styles, styles[n]);
    tierCards.forEach((card, i) => {
        if (i === n) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });
    if (n === 0) {
        flyerPreview.classList.add('hidden');
    } else {
        flyerPreview.classList.remove('hidden');
    }
}

tierCards.forEach((card, i) => {
    card.addEventListener('click', () => selectTier(i));
});

const logoPreviewContainer = document.getElementById('logoPreviewContainer');
function maybeShowPreview() {
    if (tierSelected && logoUploaded) {
        logoPreviewContainer.classList.remove('hidden');
    }
    else if (!tierSelected) {
        selectTier(0);
    }
}

const paymentMethodRadio = document.querySelectorAll('input[name="paymentMethod"]');
// const coverFeesCheckbox = document.getElementById('coverFees');
// const coverFeesLabel = document.getElementById('coverFeesLabel');
const donateButton = document.getElementById('donateButton');
const donateText = document.getElementById('donateText');


const baseStripeURL = 'https://donate.stripe.com/cN29BI9st2JCbu0eUU';

let checkout = {
    total: 0,
    method: ''
}

paymentMethodRadio.forEach((radio) => {
    radio.addEventListener('change', () => {
        checkout.method = radio.value;
        updateCheckoutButton();
    });
    if (radio.checked) {
        checkout.method = radio.value;
        updateCheckoutButton();
    }
});

function updateCheckoutButton() {
    donateButtonSection.classList.remove('hidden');
    if (checkout.total == 0 && checkout.method !== '') {
        selectTier(0, false);
    }

    if (checkout.method === 'stripe') {
        donateText.innerText = `We accept most debit and credit cards, Apple and Google Pay, Cash App, ACH Payments through Stripe. We do not directly access, store, or reuse any of your payment information.`;
        donateButton.innerText = `Donate $${checkout.total} with Stripe`;
        const url = `${baseStripeURL}?__prefilled_amount=${checkout.total * 100}`;
        donateButton.setAttribute('href', url);
    }
    else if (checkout.method === 'givebutter') {
        donateText.innerText = `We accept PayPal, Venmo, and most debit and credit cards through Givebutter. You may choose to cover the processing fees, about 3% of your donation, totally up to you. We do not directly access, store, or reuse any of your payment information.`;
        donateButton.innerText = `Donate $${checkout.total} with Givebutter`;
        const url = `https://givebutter.com/dev?amount=${checkout.total}`;
        donateButton.setAttribute('href', url);
    }
    else if (checkout.method === 'direct') {
        donateText.innerText = `We accept direct bank transfers (ACH) to our checking account. Please email us for details.`;
        donateButton.innerText = `Contact club@tosu.dev`;
        const url = `mailto:club@tosu.dev?subject=Sponsorship&body=Hi! I would like to donate $${checkout.total} to Software Engineering Club with a direct bank transfer.`;
        donateButton.setAttribute('href', url);
    }
    else if (checkout.method === 'check') {
        donateText.innerText = `We accept paper checks. Please email us for the mailing address.`;
        donateButton.innerText = `Contact club@tosu.dev`;
        const url = `mailto:club@tosu.dev?subject=Sponsorship&body=Hi! I would like to donate $${checkout.total} to Software Engineering Club with a check.`;
        donateButton.setAttribute('href', url);
    }
}

const thankYouText = document.getElementById('thankYouText');
donateButton.addEventListener('click', () => {
    setTimeout(() => {
        thankYouText.classList.remove('hidden');
        if (checkout.method === 'stripe' || checkout.method === 'givebutter') {
            thankYouText.innerText = `Thank you for your generous donation! We will be in touch with you shortly about your sponsor benefits.`;
        }
        else if (checkout.method === 'direct') {
            thankYouText.innerText = `Thank you for your generous donation! We will get back to you shortly with the bank account details.`; 
        }
        else if (checkout.method === 'check') {
            thankYouText.innerText = `Thank you for your generous donation! We will get back to you shortly with the mailing address.`; 
        }
    }, 1000);
});

const websitePreviewXButton = document.getElementById('websitePreviewXButton');
websitePreviewXButton.addEventListener('click', () => {
    logoPreviewContainer.classList.add('hidden');
    history = [];
});

const websitePreviewBackButton = document.getElementById('websitePreviewBackButton');
websitePreviewBackButton.addEventListener('click', () => {
    if (history.length <= 1) {
        logoPreviewContainer.classList.add('hidden');
    } else {
        history.pop();
        selectTier(history.pop());
    }
});