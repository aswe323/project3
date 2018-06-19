/*
 * TO-ADD:
 *---->	TODO:make all the validation testing FUNCTIONS with individuale function per field
 *
 *	TODO:make sure to update the lists when  all the current todo's are done 
 * 	KNOWN BUGS:
 *	email validation:
 *		look up how to validate email address.
 *
 *	TO REFACTOR:
 *		TODO:refactor the disableOther function to be more concise. (high order function?)
 * */

//accessing neccesery elements
const cvvField = document.querySelector('#cvv'); // cvv field
const zipField = document.querySelector('#zip'); // zip field
const creditCardNumeberField = document.querySelector('#cc-num'); //credit card number field
const nameField = document.querySelector('#name');//name input field 
const emailField = document.querySelector('#mail'); // mail input field
const textArea = document.querySelector("#other-title");//text area below job rule menu
//design menu acceses
const designMenu = document.querySelector("#design");// design style menu
const colorMenu = document.querySelector("#color"); // color menu 
// checkboxes in the activities form
const checkBoxes = document.querySelectorAll('.activities input');
//activities form
const checkBoxForm =document.querySelector('.activities');
//acces to the payment options menu
const paymentOptions = document.querySelector("#payment");
const paymentOptionsSelectables = paymentOptions.querySelectorAll('option');
//acess to payment divs
const creditCardDiv = document.querySelector('.credit-card');//credit card div
const paymentDivs= paymentOptions.parentNode.querySelectorAll('fieldset>div');//all divs in the payment fieldset
//acces to submit element
const submitButton = document.querySelector('button');


/*-------------------------------------------------|
 *              validation variables		   |
 *-------------------------------------------------|
*/

var activityValidation = null;
var ccvValidation = null;
var paymentValidity= null;
var zipValidation = null;
var creditNumberValidation = null; 
var emailValidation = null;
var nameValidation = null;


/*-------------------------------------------------|
 *              event listeneers                   |
 *-------------------------------------------------|
 */
submitButton.addEventListener('click', ()=>{
	if (activityValidation && paymentValidity && nameValidation && emailValidation){}
	else{
		if (activityValidation !== true){
			checkBoxForm.querySelector('p').innerHTML ="please choose an activity";
			checkBoxForm.querySelector('p').style.color ="red";
		}
		nameFieldValidation();
		cvvValidator();
		zipValidator();
		creditsNumberValidation();
		emailFieldValidation();
		disableSubmit();
	}

	console.log('clicked')

});

document.querySelector('#title').addEventListener('change', (event)=>{
	if (event.target.value === 'other'){
		showElement(textArea);	
	}else{
		hideElement(textArea);
	}
})

nameField.addEventListener('keyup' ,() => nameFieldValidation());

emailField.addEventListener('keyup', () =>emailFieldValidation());

checkBoxForm.addEventListener('change', (event) =>{ //Activity checkboxes validation
	activityValidation = false;	
	checkBoxes.forEach(x=>{
			if(x.checked){
				activityValidation = true;
				return
			}
		})
	isSubmitable();
	}
)

paymentOptions.addEventListener('change', (event) =>{ //payment options validation
		paymentValidity = false;
		if (event.target.value === "paypal" || event.target.value === "bitcoin"){paymentValidity = true;}
		isSubmitable();
})

//event listeners for the credit card options

creditCardNumeberField.addEventListener('keyup' , ()=>creditsNumberValidation());

zipField.addEventListener('keyup', ()=>zipValidator());


cvvField.addEventListener('keyup', ()=>cvvValidator());


checkBoxForm.addEventListener('change', event =>{  //event listener for specific button groups
	const tNineToTwelve = [checkBoxes[1] , checkBoxes[3]];//arrey of checkbox elements, Tusday nine am to 12pm
	const tOneToFour = [checkBoxes[2] , checkBoxes[4]];//arrey of checkboxes elements, tusday one pm to four pm
	disableOther(event.target, tNineToTwelve);	
	disableOther(event.target, tOneToFour);
	let totalCost = Array.from(checkBoxes).reduce((costSum, box)=>{
		if (box.checked && box == checkBoxes[0]){
			costSum  = costSum + 200;
		}else if (box.checked && box !== checkBoxes[0]){
			costSum  = costSum + 100;
		}
		return costSum;
	}, 0)
	//adding total cost to the inner html of the p element under the checkboxes
	if (totalCost === 0){
		checkBoxForm.querySelector('p').style.color ="red";
		totalCost = "please choose an activity"
	}else{
		checkBoxForm.querySelector('p').style.color ="";
		totalCost= '$'+totalCost
	}
	checkBoxForm.querySelector('p').innerHTML = totalCost;	
}
)

paymentOptions.addEventListener('change', event =>{ //event listener for the select menu in the payment option
	let indexValue=0;
	let selected = paymentOptionsSelectables.forEach((x,index)=>{
		if(x.value == event.target.value){indexValue = index};
	});
	if (indexValue === 0){return}else{};
	paymentDivs.forEach(x=>hideElement(x));
	paymentDivs.item(indexValue-1).style.display = '';
	//show the selected div
})

designMenu.addEventListener('change', event =>{  //desgin event listener, updates the color menu on change,
	if (designMenu.value == "Select Theme"){
		hideElement(colorMenu.parentNode)

	}else{
		showElement(colorMenu.parentNode)
	};
	hideColors();
	if (event.target.value === 'js puns'){
		colorMenu.children[0].style.display="";
		colorMenu.children[1].style.display="";
		colorMenu.children[2].style.display="";
		colorMenu.value = 'cornflowerblue';
	}else if (event.target.value == 'heart js'){
		colorMenu.children[3].style.display="";
		colorMenu.children[4].style.display="";
		colorMenu.children[5].style.display="";
		colorMenu.value = 'dimgrey';
	}

})

/*-------------------------------------------------|
 *              function that are used             |
 *-------------------------------------------------|
 */

function cvvValidator(){
	ccvValidation = false;
	if (cvvField.value === ""){
		errorHandler('required', cvvField, ccvValidation);	
		return isSubmitable()
	}else if(isNaN(cvvField.value)){
		errorHandler('numebrs only', cvvField, ccvValidation);	
		return isSubmitable()
	}else if (cvvField.value.length < 3||cvvField.value.length > 3){
		errorHandler('invalid', cvvField, ccvValidation);	
		return isSubmitable()
	}else{
		ccvValidation = true;
		errorHandler('errorHandeler failed', cvvField, ccvValidation);	
	}
	isSubmitable();
}



function zipValidator(){
	zipValidation = false;
	if (zipField.value === ""){
		errorHandler('requried', zipField, zipValidation);	
		return isSubmitable()	
	}else if (zipField.value.length < 5 || zipField.value.length > 5){
		errorHandler('not in range', zipField, zipValidation);	
		return isSubmitable()	 
	}else if (isNaN(zipField.value)){
		errorHandler('numbers only', zipField, zipValidation);	
		return isSubmitable()	 
	}else{ 
		zipValidation = true;
		errorHandler('errorHandeler failed', zipField, zipValidation);	
	}			
	isSubmitable();
}


function creditsNumberValidation(){
	creditNumberValidation=false;
	if (isNaN(creditCardNumeberField.value)){
		errorHandler('numbers only', creditCardNumeberField, creditNumberValidation);
		return isSubmitable()
	}else if (creditCardNumeberField.value==""){
		errorHandler('required', creditCardNumeberField, creditNumberValidation);
		return isSubmitable()	
	}else if (creditCardNumeberField.value.length < 13){
		errorHandler('number is too short', creditCardNumeberField, creditNumberValidation);
		return isSubmitable()
	}else if (creditCardNumeberField.value.length > 16){
		errorHandler('number too long', creditCardNumeberField, creditNumberValidation);
		return isSubmitable()	
	}else{
		creditNumberValidation=true;
		errorHandler('errorHandeler failed', creditCardNumeberField, creditNumberValidation);
	}
	isSubmitable();
}	

function emailFieldValidation(){
	emailValidation = false;
	if(emailField.value == ""){
		errorHandler("required",emailField,emailValidation);		
		return isSubmitable()
	}else if(emailField.value.includes('@')=== false || emailField.value.includes('.com') === false ){
		errorHandler("invalid email addres",emailField,emailValidation);		
		return isSubmitable()
	}else{
		emailValidation = true;
		errorHandler("error handeler fail",emailField,emailValidation);		
	}
	isSubmitable();
}


function nameFieldValidation(){
		nameValidation = false;
		if (nameField.value == ""){
			errorHandler("your name please", nameField, nameValidation);
			return isSubmitable()
		}else if (isNaN(nameField.value) === false){
			errorHandler("no numbers please", nameField, nameValidation);
			return isSubmitable()
		}else{
			nameValidation = true;
			errorHandler("if you see this there have been an internal error in the error handeler", nameField, nameValidation);
		}
			isSubmitable();
}	
function isSubmitable(){ //checking if the user input is valid.
	if (paymentOptions.value ==="credit card"){creditCardValidity()};
	if (activityValidation && paymentValidity && nameValidation && emailValidation){
		enableSubmit();
	}
}

function creditCardValidity (){ // credit card fields validation
	paymentValidity = false;
	if (ccvValidation && creditNumberValidation && zipValidation){
		paymentValidity = true;
	}
}



function addPElementTo(appended){ //adding a p element to the checkbox form
//create a p element and add it to the end of the activities field
	const sumElement = document.createElement('p');
	appended.appendChild(sumElement);
}



function disableOther (checkbox, arrey){ //toggle function for disabled and enabled groups of two elements
	//if the check box is disabled then enable it
	if(arrey.includes(checkbox)){}else{return};
	if (arrey[1].hasAttribute('disabled', 'true')|| arrey[0].hasAttribute('disabled', 'true')){
		arrey.splice(arrey.indexOf(checkbox),1);
		arrey[0].removeAttribute('disabled');
		arrey[0].parentNode.style.background = '';
		return;
	//otherwise if the arrey has the target element, disable the outer element in the arrey
	}else if (arrey.includes(checkbox)){
		arrey.splice(arrey.indexOf(checkbox),1);
		arrey[0].checked = false;
		arrey[0].setAttribute('disabled', 'true');
		arrey[0].parentNode.style.background = 'grey';
		return;
	}	
}

function paymentSettings (){//on start settings for payment options
	paymentOptionsSelectables[0].remove();
	paymentOptions.value ="credit card";
	//hide all divs then show creditcard div
	paymentDivs.forEach((x)=>hideElement(x));
	showElement(creditCardDiv);
}

//error element handeling
function errorHandler(str, element, bool){
	let errorElement = element.parentNode.querySelector('#'+element.id+'+ p[class="error"]');
	if (bool === false){
		if(errorElement){
			element.nextElementSibling.remove();	
		}
		let error = document.createElement('p');
		error.innerHTML = str;
		error.style.color = "red";
		error.setAttribute('class', 'error');
		element.parentNode.insertBefore(error, element.nextElementSibling);
	}
	else if(bool === true && errorElement){
		errorElement.remove();
	}
}

function intoDiv(){
	let selectedLabel = document.querySelector('label[for="exp-month"]');
        let selectedexpMonth = document.querySelector('#exp-month');
	const div = document.createElement('div');
	div.insertBefore(selectedexpMonth, null);
	div.insertBefore(selectedLabel, selectedexpMonth);
	div.style.clear ="both";
	creditCardDiv.insertBefore(div, document.querySelector('label[for="exp-year"]'));
}


//hiding a given element.
function hideElement(element){
	return element.style.display ="none";
}

//showing the given element 
function showElement(element){
	return element.style.display="";
}

//undisplaying the options in the color menu
function hideColors(){
	colorMenu.querySelectorAll('option').forEach((color)=>hideElement(color)); 
}

//on page load (when the js is loaded i gues?) make the first textfield focus
function setFocus (){
	nameField.setAttribute('autofocus', 'true');
}

//hide the textfield
function textAreaHide(){
	textArea.style.display="none";
}


function disableSubmit(){
	console.log('disabling');
	submitButton.setAttribute('disabled',"true");
	submitButton.style.color="grey";
	submitButton.innerHTML= "invalid";
}

function enableSubmit(){
	console.log('enabling');
	submitButton.style.color="white";
	submitButton.innerHTML= "Register";
	submitButton.removeAttribute('disabled',"true");
}

//wha will happen when the js is loaded
function onLoad(){
	setFocus();
	textAreaHide();
	hideColors();
	paymentSettings();
	hideElement(colorMenu.parentNode);
	addPElementTo(checkBoxForm);
//	disableSubmit();
	intoDiv();
	isSubmitable();
}
onLoad();
