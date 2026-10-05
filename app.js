const memeForm = document.getElementById("memeForm");
const memeNumberInput = document.getElementById("memeNumber");
const memeContent = document.getElementById("memeContent");
const memesUrl = "https://api.imgflip.com/get_memes";

function showLoadingMessage() {
  memeContent.innerHTML = '<p class="text-light">Loading...</p>';
}

function showErrorMessage(message) {
  memeContent.innerHTML = `<h2 class="text-danger">${message}</h2>`;
}

function findMemeByNumber(memes, memeNumber) {
  return memes.find((meme, index) => index === memeNumber);
}

function renderMeme(meme) {
  memeContent.innerHTML = `
    <h1 class="meme-title">${meme.name}</h1>
    <img class="meme-image" src="${meme.url}" alt="${meme.name}">
  `;
}

async function getMemes() {
  const response = await fetch(memesUrl);

  if (!response.ok) {
    throw new Error("The meme service could not be reached.");
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error("The meme service returned an error.");
  }

  return data.data.memes;
}

async function handleMemeSubmit(event) {
  event.preventDefault();

  const inputValue = memeNumberInput.value.trim();
  const memeNumber = Number(inputValue);

  if (
    inputValue === "" ||
    !Number.isInteger(memeNumber) ||
    memeNumber < 0 ||
    memeNumber > 99
  ) {
    showErrorMessage("Please Enter Valid Number");
    memeNumberInput.value = "";
    return;
  }

  showLoadingMessage();

  try {
    const memes = await getMemes();
    const selectedMeme = findMemeByNumber(memes, memeNumber);

    if (selectedMeme) {
      renderMeme(selectedMeme);
    } else {
      showErrorMessage("Please Enter Valid Number");
    }
  } catch (error) {
    console.error(error);
    showErrorMessage("Something went wrong!");
  } finally {
    memeNumberInput.value = "";
  }
}

memeForm.addEventListener("submit", handleMemeSubmit);
