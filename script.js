document.addEventListener('DOMContentLoaded', init);

const dataContainer = document.getElementById('data-container')
const spinner = document.querySelector('.spinner-container');


function init() {
    filter()
    getData()
}

function filter() {
    const inputSearch = document.getElementById('input-search');
    const btnSearch = document.getElementById('btn-search');

    btnSearch.addEventListener('click', () => {
        if (inputSearch.value < 1) {
            localStorage.removeItem('item')
            spinner.style.display = 'none';
            return;
        }
        localStorage.removeItem('item')
        localStorage.setItem('item', inputSearch.value)
        location.reload()
    })
}

async function getData() {
    const localData = localStorage.getItem('item')
    let URL = `https://images-api.nasa.gov/search?q=${localData}`

    const response = await fetch(URL);

    if (!response.ok) throw new Error(`Response error ${response.status}`);

    const data = await response.json();

    const { collection } = data

    const slicedData = collection.items.slice(0, 21);

    showData(slicedData)

}

async function getImages(url) {
    const response = await fetch(url, { contentType: 'application/json', dataType: 'jsonp', });
    if (!response.ok) throw new Error(`Error getting images. Code error ${response.status}`)
    const data = await response.json();

    return data
}

async function showData(dataObject) {

    let template = ``;

    for (let item of dataObject) {

        const { data, href } = item

        const dataItem = data[0];

        const images = await getImages(href)

        if (images[0].endsWith(".jpg")) {

            template += `
                <div class="col-12 col-md-6 col-xl-4">
                    <div class="card">
                        <img src="${images[0]}" class="card-img-top" height='400' alt="...">
                        <div class="card-body">
                            <h5 class="card-title">${dataItem.title}</h5>
                            <div class="overflow-auto" style="height:150px;">
                                <p class="card-text">${dataItem.description}</p>
                            </div>
                            
                        </div>
                    </div>
                </div>
        `
        } else if (images[0].endsWith(".mp4")) {
            template += `

            <div class="col-12 col-md-6 col-xl-4">
                <div class="card">
                    <div class="embed-responsive embed-responsive-1by1  text-center">
                        <iframe class="embed-responsive-item manual-responsive" src="${images[0]}" allowfullscreen></iframe>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${dataItem.title}</h5>
                        <div class="overflow-auto" style="height:150px;">
                            <p class="card-text">${dataItem.description}</p>
                        </div>
                    </div>
                </div>
            </div>
            `
        }
    }
    dataContainer.innerHTML = template
    spinner.style.display = 'none';

}