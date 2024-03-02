const btnContainer = document.getElementById("btn-container");
const cardContainer = document.getElementById("card-container");
const errorElement = document.getElementById('error-element');
const sortBtn = document.getElementById('sort-btn');

let selectedCategory = 1000 ;
let sortedView = false ;

sortBtn.addEventListener('click', () => {
  sortedView = true;
  fetchDataByCategories(selectedCategory,sortedView);
})

// ----------------Display Button-----------------
const fetchCategories = async () => {
  const url = `https://openapi.programming-hero.com/api/videos/categories`;
  const res = await fetch(url);
  const data = await res.json();
  const cards = data.data;
  disPlayButton(cards);
};

const disPlayButton = (cards) => {
  // console.log(cards);

  cards.forEach((card) => {
    // console.log(card);
    const newButton = document.createElement("button");
    newButton.innerText = card.category;
    newButton.classList = "btn  btn-ghost bg-slate-700 text-white text-lg";

    newButton.addEventListener("click", () => {

      const allBtns = document.querySelectorAll('.btn');
      for(const btn of allBtns){
        btn.classList.remove('bg-red-600')
      }
      newButton.classList.add('bg-red-600');

      fetchDataByCategories(card.category_id);
    });

    btnContainer.appendChild(newButton);
  });
};

// ----------------Display Cards------------------
const fetchDataByCategories = async (categoryId,sortedView) => {

    selectedCategory =  categoryId;
  const url = `https://openapi.programming-hero.com/api/videos/category/${categoryId}`;
  const res = await fetch(url);
  const data = await res.json();
  const vedios = data.data;
  console.log(vedios);

  if(sortedView){
    vedios.sort((a , b) => {
      const totalViewsStringFirst = a.others?.views;
      const totalViewsStringSecond = b.others?.views;

      const totalViewFirstNumber = parseFloat(totalViewsStringFirst.replace("K", '')) || 0;

      const totalViewSeconsNumber = parseFloat(totalViewsStringSecond.replace("K", '')) || 0;

      return totalViewSeconsNumber - totalViewFirstNumber;

    })
  }
  disPlayCards(vedios);
};

const disPlayCards = (vedios) => {
  // console.log(vedios);

  if(vedios.length === 0){
    errorElement.classList.remove('hidden');
  }
  else{
    errorElement.classList.add('hidden')
  }

  cardContainer.textContent = "";

  vedios.forEach((vedio) => {
    // console.log(vedio);
    let varifiedBage = '';
    if(vedio.authors[0].verified){
      varifiedBage = `<img class="w-6 h-6" src="./images/verify.png" alt="">`;
    }

    const newCard = document.createElement("div");
    newCard.innerHTML = 
    `
    <div class="card w-full bg-base-100 shadow-xl">
                <figure class="overflow-hidden h-72">
                    <img class="w-full" src="${vedio.thumbnail}" />
                    <h6 class="absolute bottom-[40%] right-12">0 hr</h6>
                </figure>
                <div class="card-body">
                    <div class="flex space-x-4 justify-start items-start">
                        <div>
                            <img class="w-12 h-12 rounded-full" src="${vedio.thumbnail}" alt="Shoes" />
                        </div>
                        <div>
                            <h2 class="card-title">${vedio.title}</h2>
                            <div class="flex mt-3">
                                <p class="">${vedio.authors[0].profile_name}</p>
                                ${varifiedBage}
                            </div>
                            <p class="mt-3">${vedio.others.views}</p>
                        </div>
                    </div>
                </div>
            </div>
    `;

    cardContainer.appendChild(newCard);
  });
};

fetchCategories();
fetchDataByCategories(selectedCategory,sortedView);
