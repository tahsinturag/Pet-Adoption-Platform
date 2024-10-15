const showSpinner = () => {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("pet-deals").classList.add("hidden");
};

const hideSpinner = () => {
    document.getElementById("spinner").classList.add("hidden");
    document.getElementById("pet-deals").classList.remove("hidden");
};

let currentCategory = null;
let allPets = [];
let LikedImages = [];

const setActiveCategory = (category) => {
    document
        .querySelectorAll("#dogs-btn, #cats-btn, #rabbits-btn, #birds-btn")
        .forEach((btn) => {
            btn.classList.remove("bg-sec-btn");
            btn.classList.remove("text-white");
            btn.classList.add("bg-gray-100");
        });

    const activeButton = document.getElementById(`${category}-btn`);
    if (activeButton) {
        activeButton.classList.remove("bg-gray-100");
        activeButton.classList.add("bg-gray-300");
        activeButton.classList.add("text-green");
    }
};

// Main functions
const loadCategories = () => {
    showSpinner();
    fetch("https://openapi.programming-hero.com/api/peddy/pets")
        .then((res) => res.json())
        .then((data) => {
            hideSpinner();
            allPets = data.pets;
            displayPets(allPets);
        })
        .catch((error) => {
            console.log(error);
            hideSpinner();
        });
};

const displayPets = (pets) => {
    const petContainer = document.getElementById("pet-deals");
    petContainer.innerHTML = "";

    if (!pets || pets.length === 0) {
        petContainer.classList.remove("grid");
        petContainer.innerHTML = `
          <div class="min-h-[300px] flex flex-col gap-5 justify-center items-center">
            <img src="images/error.png" /> 
            <h2 class="text-center text-xl font-bold"> No Content Here in this Category </h2> 
          </div>`;
    } else {
        petContainer.classList.add("grid");

        pets.forEach((pet) => {
            const Viewpet = document.createElement("div");
            Viewpet.innerHTML = `
            <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300 ease-out min-w-full">
              <img src="${pet.image}" alt="${
                pet.pet_name
            }" class="rounded-lg mb-4">
              <h3 class="text-xl font-semibold mb-2 "> ${pet.pet_name}</h3>
              <p class="text-gray-600 text-sm mb-2">Breed: ${
                  pet.breed || "Not Available"
              }</p>
              <p class="text-gray-600 text-sm mb-2">Birth: ${
                  pet.date_of_birth || "Not Available"
              }</p>
              <p class="text-gray-600 text-sm mb-2">Gender: ${pet.gender}</p>
              <p class="text-gray-600 text-sm mb-2">Price: $${
                  pet.price || "Not Available"
              }</p>
              <div class="flex justify-around">
                <button class="like-btn bg-gray-200 px-3 py-2 rounded-md"><i class="fa-regular fa-thumbs-up"></i></button>
                <button onclick="adoptPet('${
                    pet.petId
                }', this)" class="text-Primary-Btn bg-gray-200 text-sec-btn font-bold px-3 py-2 rounded-md">Adopt</button>
                <button onclick="loadDetails('${
                    pet.petId
                }')" class="text-Primary-Btn bg-gray-200 text-sec-btn font-bold px-4 py-2 rounded-md">Details</button>
              </div>
            </div>`;

            const likeButton = Viewpet.querySelector(".like-btn");
            likeButton.addEventListener("click", () => {
                LikedImages.push(pet.image);
                displayLikedImages();
            });

            petContainer.append(Viewpet);
        });
    }
};

const displayLikedImages = () => {
    const likedPicutureContainer = document.getElementById("Liked-Picture");
    likedPicutureContainer.innerHTML = "";

    LikedImages.forEach((imageSrc) => {
        const imgEle = document.createElement("img");
        imgEle.src = imageSrc;
        imgEle.alt = "liked-pet";
        imgEle.className = "liked-image mb-2";
        likedPicutureContainer.appendChild(imgEle);
    });
};

const loadDetails = async (petId) => {
    console.log(petId);
    const url = `https://openapi.programming-hero.com/api/peddy/pet/${petId}`;
    const res = await fetch(url);
    const data = await res.json();
    displayDetails(data.petData);
};

const displayDetails = (petData) => {
    console.log(petData);
    const detailsContainer = document.getElementById("modal-content");
    document.getElementById("customModal").showModal();

    detailsContainer.innerHTML = `
        <div class="bg-white rounded-lg p-6 hover: transition duration-300 ease-out w-full h-full">
          <img src="${petData.image}" alt="${
        petData.pet_name
    }" class="h-[150px] rounded-lg mb-2 ml-0 lg:ml-20">
          <h3 class="text-xl font-bold mb-2 "> ${petData.pet_name}</h3>
          <div class="grid grid-cols-2">
              <p class="text-gray-600 text-sm mb-2">Breed: ${
                  petData.breed || "Not Available"
              }</p>
              <p class="text-gray-600 text-sm mb-2">Birth: ${
                  petData.date_of_birth || "Not Available"
              }</p>
              <p class="text-gray-600 text-sm mb-2">Gender: ${
                  petData.gender
              }</p>
              <p class="text-gray-600 text-sm mb-2">Price: ${
                  petData.price || "Not Available"
              }</p>
              <p class="text-gray-600 text-sm mb-2">Vaccinated status: ${
                  petData.vaccinated_status || "Not Available"
              }</p>
          </div>
          <p class="text-gray-600 font-bold mb-2">Details Information</p>
          <p class="text-gray-600 text-sm mb-2">Details Information: ${
              petData.pet_details || "Not Available"
          }</p>
           <div class="modal-action ml-10 lg:ml-0">
              <form method="dialog">
                  <button class="btn btn-wide">Cancel</button>
              </form>
          </div> 
        </div>
    `;
};

const adoptPet = (petId, button) => {
    const adoptContent = document.querySelector(".adopt-content");
    adoptContent.innerHTML = `
        <div class="bg-white rounded-lg p-6  w-full h-full">
            <i class="fa-regular fa-handshake"></i>
            <p>Congratulations!</p>
            <p>Adoption Process is start For your pet.</p>
            <div id="countdown"></div>
        </div>
    `;
    const adoptModal = document.getElementById("adoptModal");
    adoptModal.showModal();

    let countdown = 3;
    const countdownDiv = document.getElementById("countdown");

    const interval = setInterval(() => {
        countdownDiv.innerHTML = countdown;
        countdown--;

        if (countdown < 0) {
            clearInterval(interval);
            button.textContent = "Adopted";
            setTimeout(() => {
                adoptModal.close();
            });
        }
    }, 1000);
};

const loadPetsByCategory = (category) => {
    showSpinner();
    currentCategory = category.toLowerCase();
    setActiveCategory(category); // This line sets the active category
    const apiUrl = `https://openapi.programming-hero.com/api/peddy/category/${currentCategory}`;

    fetch(apiUrl)
        .then((res) => res.json())
        .then((data) => {
            hideSpinner();
            showPetsByCategory(data.data);
        })
        .catch((error) => {
            console.log(error);
            hideSpinner();
        });
};

const showPetsByCategory = (pets) => {
    const petContainer = document.getElementById("pet-deals");
    petContainer.innerHTML = "";

    if (!pets || pets.length === 0) {
        petContainer.classList.remove("grid");
        petContainer.innerHTML = `
          <div class="min-h-[300px] flex flex-col gap-5 justify-center items-center">
            <img src="images/error.webp"/> 
            <h2 class="text-center text-xl font-bold">No Information Available</h2>
          </div>
          <p class="text-gray-500 text-center text-sm sm:text-base md:text-lg">It is a long established fact that a reader will be distracted by the readable content of a page when looking at <br> its layout. The point of using Lorem Ipsum is that it has a.
          </p>`;
    } else {
        displayPets(pets);
    }
};

const sortPetsByPrice = (pets) => {
    return pets.sort((a, b) => {
        const priceA = a.price ? parseFloat(a.price) : 0;
        const priceB = b.price ? parseFloat(b.price) : 0;
        return priceB - priceA;
    });
};

const sorting = () => {
    const datashowcontainer = document.getElementById("pet-deals");
    datashowcontainer.classList.remove("grid");
    datashowcontainer.innerHTML = `
        <div class="flex justify-center items-center h-full">
            <span class="loading loading-bars loading-lg"></span>
        </div>
    `;

    setTimeout(() => {
        if (currentCategory) {
            const categoryPets = allPets.filter(
                (pet) =>
                    pet.category &&
                    pet.category.toLowerCase() === currentCategory
            );
            const sortedPets = sortPetsByPrice(categoryPets);
            showPetsByCategory(sortedPets);
        } else {
            const sortedPets = sortPetsByPrice(allPets);
            displayPets(sortedPets);
        }
    }, 1000);
};

// Event listeners
document
    .getElementById("dogs-btn")
    .addEventListener("click", () => loadPetsByCategory("dog"));
document
    .getElementById("cats-btn")
    .addEventListener("click", () => loadPetsByCategory("cat"));
document
    .getElementById("rabbits-btn")
    .addEventListener("click", () => loadPetsByCategory("rabbit"));
document
    .getElementById("birds-btn")
    .addEventListener("click", () => loadPetsByCategory("bird"));
document.getElementById("sort").addEventListener("click", sorting);

loadCategories();
