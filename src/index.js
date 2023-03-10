import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const input = document.querySelector("input#search-box");

const listCountry = document.querySelector(".country-list")
const informationAboutCountry = document.querySelector(".country-info")
listCountry.style.visibility = "hidden";
informationAboutCountry.style.visibility = "hidden";

input.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

function onInputSearch(event) {
    event.preventDefault();
    const searchCountry = event.target.value.trim();

    if(!searchCountry){
    listCountry.style.visibility = "hidden";
    informationAboutCountry.style.visibility = "hidden";
    listCountry.innerHTML = "";
    informationAboutCountry.innerHTML = "";
    return;
    }

fetchCountries(searchCountry)
.then ((data) => {
    if(data.length > 10) {
        Notify.info("Too many matches found. Please enter a more specific name.");
        return;
    }
    renderedCountries(data);
})
.catch((error) => {
    listCountry.innerHTML = "";
    informationAboutCountry.innerHTML = "";
    Notify.failure("Oops, there is no country with that name")
})
};

function renderedCountries(data){
    const inputSymbolQuantity = data.length;

    if(inputSymbolQuantity === 1) {
       listCountry.innerHTML = "";
       listCountry.style.visibility = "hidden";
       informationAboutCountry.style.visibility = "visible";
       createCountryMarkup(data);
    }
    if(inputSymbolQuantity > 1 && inputSymbolQuantity <= 10) {
        informationAboutCountry.innerHTML = "";
        informationAboutCountry.style.visibility = "hidden";
        listCountry.style.visibility = "visible";
        createListMarkup(data);
     }
}

function createListMarkup (data) {
    const listMarkup = data.map((({name, flags}) => {
        return `<li>
        <img src="${flags.svg}" alt="${name}" width="50" height="auto">
        <span>${ name.official }</span>
        </li>`
    })).join("");
    
    listCountry.innerHTML = listMarkup;
    return listMarkup;
}

function createCountryMarkup (data) {
  const markup = data.map(({flags, name, capital, population, languages}) => {
    languages = Object.values(languages).join("/");
    return `<img src="${flags.svg}" alt="${name}" width="300" height="auto">
    <p> ${ name.official }</p>
    <p>Capital: <span>${ capital }</span></p>
    <p>Population: <span>${ population }</span></p>
    <p>Languages: <span>${ languages }</span></p>`
}).join("");
informationAboutCountry.innerHTML = markup;
return markup;
}

