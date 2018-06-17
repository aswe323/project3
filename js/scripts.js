/*
 * TO-ADD:
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
const titleSelect = document.getElementById('title');// job rule menu
const textArea = document.querySelector("#other-title");//text area below job rule menu
//design menu acceses
const designMenu = document.querySelector("#design");// design style menu
const colorMenu = document.querySelector("#color"); // color menu 
// checkboxes in the activities form
const checkBoxes = document.querySelectorAll('.activities input');
//activities form
const checkBoxForm =document.querySelector('.activities');
//labels of check boxes
const checkBoxLabels = document.querySelectorAll(".activities label");
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

var val= false;
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
			event.target.placeholder = "your name please";	
			hideElement(submitButton);
			return isSubmitable()
		}else if (isNaN(event.target.value) === false){
			event.target.placeholder ="no numbers please";		
			hideElement(submitButton);
			return isSubmitable()
		}else{
			event.target.placeholder="";
			nameValidation = true;
		}
			isSubmitable();
	}
)
nameField.addEventListener('focusout', event=>verifier(event.target, nameValidation));

emailField.addEventListener('keyup', (event) =>{ //mail field validation on every key up
	emailValidation = false;
	if(event.target.value == ""){
		event.target.placeholder="required";
		hideElement(submitButton);
		return isSubmitable()
	}else if(event.target.value.includes('@')=== false || event.target.value.includes('.com') === false ){
		event.target.placeholder="invalid email address";
		hideElement(submitButton);
		return isSubmitable()
	}else{
		event.target.placeholder="";
		emailValidation = true;
	}
	isSubmitable();
	}
)
emailField.addEventListener('focusout', event=>verifier(event.target, emailValidation));

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
		event.target.placeholder="numbers only";
		hideElement(submitButton);
		return isSubmitable()
	}else if (event.target.value.length < 13){
		event.target.placeholder="number is too short";
		hideElement(submitButton);
		return isSubmitable()
	}else if (event.target.value==""){
		event.target.placeholder="required";
		hideElement(submitButton);
		return isSubmitable()	
	}else if (event.target.value.length > 16){
		event.target.placeholder="number is too long";
		hideElement(submitButton);
		return isSubmitable()	
	}else{
		event.target.placeholder="";
		creditNumberValidation=true;
	}
	isSubmitable();

})
creditCardNumeberField.addEventListener('focusout', event=>verifier(event.target, creditNumberValidation));

zipField.addEventListener('keyup', (event)=>{// zip number field
	zipValidation = false;
	if (event.target.value === ""){
		event.target.placeholder="requried";
		hideElement(submitButton);
		return isSubmitable()	
	}else if (event.target.value.length < 5 || event.target.value.length > 5){
		event.target.placeholder="not in range";
		hideElement(submitButton);
		return isSubmitable()	 
	}else if (isNaN(event.target.value)){
		event.target.placeholder="numbers only";
		hideElement(submitButton);
		return isSubmitable()	 
	}else{ 
		event.target.placeholder="";
		zipValidation = true;
	}			
	isSubmitable();
})

zipField.addEventListener('focusout', event=>verifier(event.target, zipValidation));

cvvField.addEventListener('keyup', (event)=>{ // cvv number field
	ccvValidation = false;
	if (event.target.value == ""){
		event.target.placeholder="required";
		hideElement(submitButton);
		return isSubmitable()
	}else if(isNaN(event.target.value)){
		event.target.placeholder="numbers";
		hideElement(submitButton);
		return isSubmitable()
	}else if (event.target.value.length < 3||event.target.value.length > 3){
		event.target.placeholder="invalid";
		hideElement(submitButton);
		return isSubmitable()
	}else{
		event.target.placeholder="";
		ccvValidation = true;
	}
	isSubmitable();


})

cvvField.addEventListener('focusout', event=>verifier(event.target, zipValidation));

var main = false;
checkBoxForm.addEventListener('change', event =>{  //event listener for specific button groups
	const tNineToTwelve = [checkBoxes[1] , checkBoxes[3]];//arrey of checkbox elements, Tusday nine am to 12pm
	const tOneToFour = [checkBoxes[2] , checkBoxes[4]];//arrey of checkboxes elements, tusday one pm to four pm
	disableOther(event.target, tNineToTwelve);	
	disableOther(event.target, tOneToFour);
	//use a reduce function to check if the element is checked if true and pos 0 then add 200, else if true add 100, else, nothing;
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
	//WARNING: check specific wanted behavior in the site (disable checkboxes or change with out disableing)
	//
}
)

//event listener for the select menu in the payment option
paymentOptions.addEventListener('change', event =>{
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
	colorMenu.value = "";
	if (event.target.value === 'js puns'){
		colorMenu.children[0].style.display="";
		colorMenu.children[1].style.display="";
		colorMenu.children[2].style.display="";
	}else if (event.target.value == 'heart js'){
		colorMenu.children[3].style.display="";
		colorMenu.children[4].style.display="";
		colorMenu.children[5].style.display="";
	}

})

/*-------------------------------------------------|
 *              function that are used             |
 *-------------------------------------------------|
 */
//function to call every focusout, that wil delete the content of a field if its approproate variable is no true 
function verifier(target, val){
	if (val!==true){
		target.value="";
	}
}
function isSubmitable(){
	console.log('was called');
	if (paymentOptions.value ==="credit card"){creditCardValidity()};
	console.log(activityValidation , paymentValidity , nameValidation , emailValidation);
	if (activityValidation && paymentValidity && nameValidation && emailValidation){
		console.log('enabling');
		showElement(submitButton)
		enableSubmit();	
	}else{
		console.log('disabling');	
		disableSubmit;
		hideElement(submitButton);	
	}

}
// credit card validation
function creditCardValidity (){
	paymentValidity = false;
	console.log(ccvValidation , creditNumberValidation , zipValidation);
	if (ccvValidation && creditNumberValidation && zipValidation){
		paymentValidity = true;
	}
}



//cost of activities
function totalCostElement(){
//create a p element and add it to the end of the activities field
	const sumElement = document.createElement('p');
	checkBoxForm.appendChild(sumElement);
}



//toggle function for disabled and enabled groups of two elements
function disableOther (checkbox, arrey){
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

//on start settings for pamet options
function paymentSettings (){
	paymentOptionsSelectables[0].remove();
	paymentOptions.value ="credit card";
	//hide all divs then show creditcard div
	paymentDivs.forEach((x)=>hideElement(x));
	showElement(creditCardDiv);
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
	totalCostElement();
	hideElement(submitButton);
	disableSubmit();
}
onLoad();
