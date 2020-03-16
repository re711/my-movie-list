(function () {
    const BASE_URL = 'https://movie-list.alphacamp.io'
    const INDEX_URL = BASE_URL + '/api/v1/movies/'
    const POSTER_URL  = BASE_URL + '/posters/'
    const data = []
    const dataPanel = document.getElementById('data-panel')
    const searchForm = document.getElementById('search')
    const searchInput = document.getElementById('search-input')
    const pagination = document.getElementById('pagination')
    const ITEM_PER_PAGE = 12
    let paginationData = []
    //A30 新增變數
    const switchmode = document.getElementById('switch-Mode')
    let currentPage = 1
    let displayMode = 'cardmode'
   
    axios.get(INDEX_URL)
    .then((response) => {
        data.push(...response.data.results)
        getTotalPages(data)
        getPageData(1, data)
    })
    .catch((err) => console.log(err))

    dataPanel.addEventListener('click', (event) => {
        if(event.target.matches('.btn-show-movie')){
            showMovie(event.target.dataset.id) 
        } else if(event.target.matches('.btn-add-favorite')) {
            console.log(event.target.dataset.id)
            addFavoriteItem(event.target.dataset.id)    
        }       
    })  

    searchForm.addEventListener('submit', event => {
        event.preventDefault()
        let input = searchInput.value.toLowerCase()
        let results = data.filter(
            movie => movie.title.toLowerCase().includes(input)
        )
        console.log(results)
        getTotalPages(results)
        getPageData(1, results)
    })
     // 紀錄當前頁面
    pagination.addEventListener('click', event => {
        if (event.target.tagName === 'A') {
            currentPage = (event.target.dataset.page) //A30 修改
            getPageData(currentPage)  //A30 修改
      }  
    })
      
    //選擇 card 模式 或是 list 模式
    switchmode.addEventListener('click', event => {
        if (event.target.matches('#cord-icon')) {
            displayMode = 'cardmode'
            getPageData(currentPage)
        } else if (event.target.matches('#bars-icon')) {
            displayMode ='barsmode' 
            getPageData(currentPage)
        }
    })
  
    function displayDataList (data) {
        let htmlContent = ''
        data.forEach(function (item, index) {
            htmlContent += `
            <div class="col-sm-3">
                <div class="card mb-2">
                    <img  class="card-img-top" src="${POSTER_URL}${item.image}" alt="Card image cap">
                    <div class="card-body movie-item-body"> 
                        <h6 class="card-title">${item.title}</h6>
                    </div>

                    <!-- "More" button -->
                    <div class="card-footer">
                        <button class="btn btn-primary btn-show-movie" 
                        data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
                    <!-- favorite button --> 
                        <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
                    </div>    
                </div>
            </div>
            `
        })
        dataPanel.innerHTML = htmlContent
    }
    
  // 新增函數 list模式頁面
    function displayDataBarsList (data) {
        let htmlContent = ''
        data.forEach(function (item, index) {
            htmlContent += `
            <div class="col-6" id="barlist">${item.title}</div>
              <div class="col-6 text-right mb-2">
                <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
                <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
          </div>
      `
        })
        dataPanel.innerHTML = htmlContent
    }  
  
    function showMovie(id) {
        const modalTitle = document.getElementById('show-movie-title')
        const modalImage = document.getElementById('show-movie-image')
        const modalData = document.getElementById('show-movie-date')
        const modalDescription = document.getElementById('show-movie-description')
        const url = INDEX_URL + event.target.dataset.id
        console.log(url)

        axios.get(url).then((response) => {
            const data = response.data.results
            console.log(data)
            modalTitle.textContent = data.title
            modalImage.innerHTML = `
            <img src="${POSTER_URL}${data.image}" class="img-fluid"
            alt="Responsive image">
            `        
            modalData.textContent = `release at : ${data.response_data}`
            modalDescription.textContent = `${data.description}`
        }).catch((err) => console.log(err))
    }

    function addFavoriteItem(id) {
        const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
        const movie = data.find(item => item.id === Number(id))

        if (list.some(item => item.id === Number(id))) {
            alert(`${movie.title} is alerady in your favorite list.`)
        } else {
            list.push(movie)
            alert(`added ${movie.title} to your favorite list.`)
        }
        localStorage.setItem('favoriteMovies', JSON.stringify(list))
    }

    function getTotalPages (data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }
    
    // 增加維持頁面條件
    function getPageData (pageNum, data) {
        paginationData = data || paginationData
        currentPage = pageNum || currentPage
        let offset = (pageNum - 1) * ITEM_PER_PAGE
        let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
        if (displayMode === 'cardmode') {
          displayDataList(pageData)
        } else if (displayMode === 'barsmode') {
          displayDataBarsList(pageData)
        }
    }
 
})()