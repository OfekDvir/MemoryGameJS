const apiURLS = {
  dog: "https://dog.ceo/api/breeds/image/random",
  harry: "https://hp-api.herokuapp.com/api/characters",
  country: "https://restcountries.com/v3.1/all"
}
const MINIMUM_CARDS = 10;

async function getUrl(apiType) {
  let response, data;
  let { value: numberOfCards } = document.getElementById('numberOfCards');
  numberOfCards = numberOfCards < MINIMUM_CARDS ? numberOfCards : MINIMUM_CARDS;
  switch (apiType) {
    case ApiType.DOG:
      response = await fetch(apiURLS[apiType] + `/${numberOfCards}`);
      data = await response.json();
      return data.message;
    case ApiType.HARRY_POTTER:
      response = await fetch(apiURLS[apiType]);
      data = await response.json();
      return data.slice(0, numberOfCards).map(character => character.image);
    case ApiType.COUNTRY:
      response = await fetch(apiURLS[apiType]);
      data = await response.json();
      return data.slice(0, numberOfCards).map(country => country.flags.png);
    default:
      console.log("Unknown API type.");
  }
}
const ApiType = {
  DOG: 'dog',
  HARRY_POTTER: 'harry',
  COUNTRY: 'country',
};
async function fetchAndDisplayImagesNoorAdvanced() {
  try {
    const { value: api } = document.getElementById("api");
    const data = await getUrl(api);
    // Duplicate characters to create pairs for memory game
    const charactersForMemoryGame = [...data, ...data];

    // Shuffle the characters (optional)
    charactersForMemoryGame.sort(() => 0.5 - Math.random());

    // Create a container div to hold the memory cards
    const container = document.getElementById('memoryGame');
    container.innerHTML = ""
    // Loop through each character in charactersForMemoryGame and create a memory card for each one
    charactersForMemoryGame.forEach(url => {
      const cardContainer = document.createElement('div');
      cardContainer.className = 'memory-card'; // Optional: Add a class for styling purposes

      const frontCard = document.createElement('img');
      frontCard.src = url; // Assuming each character object has an 'image' property
      frontCard.classList.add("hidden")
      frontCard.classList.add("front")

      // Set initial size and margin styles for the memory card
      // imgElement.style.width = '200px'; // Set width
      // imgElement.style.height = '200px'; // Set height
      // imgElement.style.margin = '10px'; // Set margin

      const backCard = document.createElement('img');
      backCard.src = "back_card.jpg";
      backCard.className = 'back-card';
      backCard.classList.add("back")

      // backCard.style.width = '200px'; // Set width
      // backCard.style.height = '200px'; // Set height
      // backCard.style.margin = '10px'; // Set margin

      backCard.addEventListener('click', function () {
        flipCard(frontCard, backCard);
      });

      // Append the img element to the memory card
      cardContainer.appendChild(frontCard);
      cardContainer.appendChild(backCard);
      container.appendChild(cardContainer);
    });

    matchedPairs = 0;
    totalPairs = data.length; // Correctly set the totalPairs based on the fetched data length

  } catch (error) {
    console.error('Error fetching and displaying images:', error);
  }
}

let flippedCards = [];
let matchedPairs = 0;
let totalPairs = 0; // Dynamically set later

// Function to handle card flipping
function flipCard(front, back) {
  if (flippedCards.length < 2) {
    front.classList.toggle("hidden");
    back.classList.toggle("hidden");
    front.parentElement.classList.add('flipped');

    // Add the card to the flippedCards array
    flippedCards.push({ front, back });

    // Check if two cards are flipped
    if (flippedCards.length === 2) {
      const [card1, card2] = flippedCards;
      if (card1.front.src === card2.front.src) {
        matchedPairs++;
        flippedCards = [];
        // If cards match, check if all pairs are found
        if (matchedPairs === totalPairs) {
          setTimeout(() => {
            alert('Congratulations! You won the game!');
            resetGame();
          }, 500);
        }
      } else {
        // If cards don't match, flip them back after a delay
        setTimeout(() => {
          card1.front.classList.toggle("hidden");
          card1.back.classList.toggle("hidden");
          card1.front.parentElement.classList.remove('flipped');
          card2.front.classList.toggle("hidden");
          card2.back.classList.toggle("hidden");
          card2.front.parentElement.classList.remove('flipped');
          flippedCards = []; // Clear flippedCards array
        }, 1000); // Adjust delay as needed (1000ms = 1 second)
      }
    }
  }
}

function resetbutton() {
  const resetbutton = document.createElement('button');
  resetbutton.id = 'resetbutton';
  resetbutton.textContent = 'Reset Game';
  resetbutton.addEventListener('click', resetGame);
  document.body.appendChild(resetbutton);
}

function resetGame() {
  location.reload();
}

// Function to restrict input to range
function restrictInputToRange(event) {
  const input = event.target;
  const min = parseInt(input.min);
  const max = parseInt(input.max);
  const value = parseInt(input.value + event.key);

  // Allow only numbers
  if (!/^\d*$/.test(event.key)) {
    event.preventDefault();
    return;
  }

  // Prevent if input is not a number or exceeds the range
  if (isNaN(value) || value < min || value > max) {
    event.preventDefault();
  }
}

// Add event listener to input field for restricting input
document.getElementById('numberOfCards').addEventListener('keydown', restrictInputToRange);

// Call the async function to fetch and display the images for the memory game
fetchAndDisplayImagesNoorAdvanced();
