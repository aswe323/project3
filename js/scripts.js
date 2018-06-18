/*
 * TO-ADD:
 * 	TODO: make a functin that will get an error string, an element, and  a true or false value
 * 	, if true will make a new p element ABOVE the given element with the string
 *	if false will remove the p element.
 *	TODO: make individuale event listeners for each relevent element :(
 *		1.use keyup for input fields
 *		2. use change for select menus
 *		3. use loop over checkboxes for checked atribute.
 *		
 *		* use the current validation if statements for basics for each validation
 *		* use the same validation if statement thatc checks for true/false in all relevent elements
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

nameField.addEventListener('keyup' , (event) =>{ //name field validation on every key up
		nameValidation = false;
		if (event.target.value == ""){
			errorHandler("your name please", event.target, nameValidation);
			return isSubmitable()
		}else if (isNaN(event.target.value) === false){
			errorHandler("no numbers please", event.target, nameValidation);
			return isSubmitable()
		}else{
			nameValidation = true;
			errorHandler("if you see this there have been an internal error in the error handeler", event.target, nameValidation);
		}
			isSubmitable();
	}
)

emailField.addEventListener('keyup', (event) =>{ //mail field validation on every key up
	emailValidation = false;
	if(event.target.value == ""){
		errorHandler("required",event.target,emailValidation);		
		return isSubmitable()
	}else if(event.target.value.includes('@')=== false || event.target.value.includes('.com') === false ){
		errorHandler("invalid email addres",event.target,emailValidation);		
		return isSubmitable()
	}else{
		emailValidation = true;
		errorHandler("error handeler fail",event.target,emailValidation);		
	}
	isSubmitable();
	}
)

checkBoxForm.addEventListener('change', (event) =>{ //Activity checkboxes validation
	activityValidation = false;	
	checkBoxes.forEach(x=>{
			if(x.checked){
				activityValidation = true;
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

creditCardNumeberField.addEventListener('keyup' , (event)=>{// credit card number
	creditNumberValidation=false;
	if (isNaN(event.target.value)){
		errorHandler('numbers only', event.target, creditNumberValidation);
		return isSubmitable()
	}else if (event.target.value.length < 13){
		event.target.placeholder="number is too short";
		errorHandler('number is too short', event.target, creditNumberValidation);
		return isSubmitable()
	}else if (event.target.value==""){
		errorHandler('required', event.target, creditNumberValidation);
		return isSubmitable()	
	}else if (event.target.value.length > 16){
		errorHandler('number too long', event.target, creditNumberValidation);
		return isSubmitable()	
	}else{
		creditNumberValidation=true;
		errorHandler('errorHandeler failed', event.target, creditNumberValidation);
	}
	isSubmitable();

})

zipField.addEventListener('keyup', (event)=>{// zip number field
	zipValidation = false;
	if (event.target.value === ""){
		errorHandler('requried', event.target, zipValidation);	
		return isSubmitable()	
	}else if (event.target.value.length < 5 || event.target.value.length > 5){
		errorHandler('not in range', event.target, zipValidation);	
		return isSubmitable()	 
	}else if (isNaN(event.target.value)){
		errorHandler('numbers only', event.target, zipValidation);	
		return isSubmitable()	 
	}else{ 
		zipValidation = true;
		errorHandler('errorHandeler failed', event.target, zipValidation);	
	}			
	isSubmitable();
})


cvvField.addEventListener('keyup', (event)=>{ // cvv number field
	ccvValidation = false;
	if (event.target.value == ""){
		errorHandler('required', event.target, ccvValidation);	
		return isSubmitable()
	}else if(isNaN(event.target.value)){
		errorHandler('numebrs only', event.target, ccvValidation);	
		return isSubmitable()
	}else if (event.target.value.length < 3||event.target.value.length > 3){
		errorHandler('invalid', event.target, ccvValidation);	
		return isSubmitable()
	}else{
		ccvValidation = true;
		errorHandler('errorHandeler failed', event.target, ccvValidation);	
	}
	isSubmitable();


})


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

function isSubmitable(){ //checking if the user input is valid.
	if (paymentOptions.value ==="credit card"){creditCardValidity()};
	if (activityValidation && paymentValidity && nameValidation && emailValidation){
		enableSubmit();	
	}else{
		disableSubmit;
	}

}
function creditCardValidity (){ // credit card fields validation
	paymentValidity = false;
	console.log(ccvValidation , creditNumberValidation , zipValidation);
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
		error.setAttribute('class', 'error');
		console.log(' attempting to insert error message');
		element.parentNode.insertBefore(error, element.nextElementSibling);
	}
	else if(bool === true && errorElement){
		errorElement.remove();
	}
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
	submitButton.setAttribute('disabled',"true");
}

function enableSubmit(){
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
	disableSubmit();
}
onLoad();
