import './index.scss';
import submitForm from 'js/submitForm';

const form = document.querySelector('#contactUs-form');
const contactName = document.querySelector('#contactName');
const companyName = document.querySelector('#companyName');
const fromEmail = document.querySelector('#fromEmail');
const submitButton = document.querySelector('#contactUsSubmit');
const assistanceType = document.querySelector('#asistanceType');
const subject = document.querySelector('#subject');
const description = document.querySelector('#description');
const phone = document.querySelector('#phone');
const alertBox = document.querySelector('#contactus-form-alert');

/*
    Function checks if a input field crosses the
    max length allowed and alerts the users if the condition is violated
 */
function removeErrorMsg(selector, maxLength, alertPlaceHolder) {
	if (selector) {
		const actualLength = selector.value.trim().length;
		// if the field is required and value is missing - alerts user
		if (actualLength === 0 && selector.hasAttribute('required')) {
			form.setAttribute('data-valid', 'false');
			alertBox.style.display = 'block';
			alertBox.textContent = `Please enter your ${alertPlaceHolder}.`;
			selector.classList.add('error');
			submitButton.disabled = true;
			event.preventDefault();
			// if the field has chracters more than the limit - alerts user
		} else if (actualLength >= maxLength && maxLength !== 0) {
			alertBox.textContent = `${alertPlaceHolder} must be less than ${maxLength} characters`;
			selector.classList.add('error');
			submitButton.disabled = true;
			form.setAttribute('data-valid', 'false');
			event.preventDefault();
			// else the field is validated and passed
		} else {
			selector.classList.remove('error');
			form.setAttribute('data-valid', 'true');
			alertBox.style.display = 'none';
			submitButton.disabled = false;
			alertBox.textContent = '';
		}
	}
}

function textFieldValidation(selector, alertPlaceHolder) {
	if (alertPlaceHolder === 'phone') {
		if (selector.value.trim().length > 0) {
			let RE = /^[\d\.\-]+$/;
			if (!RE.test(selector.value.trim())) {
				alertBox.style.display = 'block';
				submitButton.disabled = true;
				form.setAttribute('data-valid', 'false');
				alertBox.textContent = `Please enter valid phone number.`;
				selector.classList.add('error');
				return false;
			}
		}
	} else {
		if (selector.value.trim() === "" || selector.value.trim() === null || selector.value.trim() === undefined) {
			alertBox.style.display = 'block';
			submitButton.disabled = true;
			form.setAttribute('data-valid', 'false');
			alertBox.textContent = `Please enter the ${alertPlaceHolder}.`;
			selector.classList.add('error');
		}
		if (alertPlaceHolder === 'email') {
			let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
			if (!selector.value.match(mailformat)) {
				alertBox.style.display = 'block';
				submitButton.disabled = true;
				form.setAttribute('data-valid', 'false');
				alertBox.textContent = `Please enter valid email id.`;
				selector.classList.add('error');
			}
		}
	}
}

function validateRequiredField() {
	removeErrorMsg(contactName, 0, 'contact Name');
	removeErrorMsg(companyName, 0, 'company name');
	removeErrorMsg(fromEmail, 0, 'email');
	removeErrorMsg(subject, 0, 'subject');
	removeErrorMsg(assistanceType, 0, 'assistance type');
	removeErrorMsg(description, 0, 'description');
}

/*
    Function calls the field validation method by passing place holders and maxlength
 */
function formValidate() {
	if (form) {
		validateRequiredField();
		validateRecaptcha();
		textFieldValidation(description, 'description');
		if (assistanceType && assistanceType.value === '--Please select Assistance type--') {
			alertBox.style.display = 'block';
			submitButton.disabled = true;
			alertBox.textContent = `Please select assistance type.`;
			assistanceType.classList.add('error');
		}
		textFieldValidation(subject, 'subject');
		textFieldValidation(phone, 'phone');
		textFieldValidation(fromEmail, 'email');
		textFieldValidation(companyName, 'company name');
		textFieldValidation(contactName, 'contact name');
	}
}

function validateRecaptcha() {
	let isCaptchaValid = form.getAttribute('data-captcha') === 'valid';
	submitButton.disabled = !(isCaptchaValid === true);
}

if (form) {
	validateRecaptcha();
	// On form submit , all the fields are checked if they meet the validation rules
	form.addEventListener('keyup', () => {
		formValidate();
	});
	form.addEventListener('change', () => {
		formValidate();
	});
	submitButton.addEventListener('click', (event) => {
		form.insertAdjacentHTML('afterbegin', '<div class="overlay-loading"><div class="loader-animation"></div></div>');
		event.preventDefault();
		submitForm(form, alertBox, () => {
		}, true);
	});
}