var currPage = 1

function handleResult(res) {
  let container = document.getElementsByClassName('article-container')[0]
  if (container.children.length > 0) {
    let children = container.children
    for (let i = children.length - 1; i >= 0; i--) {
      container.removeChild(children[i]);
    }
  }
  let items = res
  for (let i of items) {
    let item = document.createElement('a')
    item.setAttribute("class", "item");
    item.setAttribute('target', '_blank')
    let href = 'articleContent.html'
    href += "?mediaId=" + i.mediaId + "&title=" + i.title
    item.setAttribute('href', href)
    // item.addEventListener("click", function () {
    //   toArticle(i.content)
    // });

    let image = document.createElement('div')
    image.setAttribute("class", "image");

    let img = document.createElement('img')
    img.setAttribute("src", i.thumbUrl);
    image.appendChild(img)

    let words = document.createElement('div')
    words.setAttribute("class", "words");

    let p1 = document.createElement('p')
    p1.setAttribute("class", "title");
    p1.innerText = i.title
    words.appendChild(p1)

    let p2 = document.createElement('p')
    p2.setAttribute("class", "digest");
    p2.innerText = i.digest
    words.appendChild(p2)

    let p3 = document.createElement('p')
    p3.setAttribute("class", "author");
    p3.innerText = "摘自：" + i.author
    words.appendChild(p3)

    let date = document.createElement('div')
    date.setAttribute("class", "date");

    let p4 = document.createElement('p')
    p4.setAttribute("class", "year");
    p4.innerText = i.createYear
    date.appendChild(p4)

    let p5 = document.createElement('p')
    p5.innerText = i.createDay
    date.appendChild(p5)

    item.appendChild(image)
    item.appendChild(words)
    item.appendChild(date)

    container.appendChild(item)
  }
}

function handleArticle(article) {
  let content = document.getElementsByClassName('content')[0]

  if (content.children.length > 0) {
    let children = content.children
    for (let i = children.length - 1; i >= 0; i--) {
      content.removeChild(children[i]);
    }
  }

  let node = document.createElement('div')
  node.innerHTML = article
  content.appendChild(node)
  node.style['padding-bottom'] = '100px'
  node.removeChild(node.children[node.children.length - 1]);
}

function toArticle(url) {
  let article = document.getElementsByClassName('article-content')[0]
  let content = document.getElementsByClassName('content')[0]

  if (content.children.length > 0) {
    let children = content.children
    for (let i = children.length - 1; i >= 0; i--) {
      content.removeChild(children[i]);
    }
  }

  if (article.style.display == "" || article.style.display == "none") {
    article.style.display = "block";
    document.documentElement.style.overflow = "hidden";
  } else if (article.style.display == "block") {
    article.style.display = "none";
    document.documentElement.style.overflow = "visible";
  }

  let node = document.createElement('div')
  node.innerHTML = url
  content.appendChild(node)
  node.style['padding-bottom'] = '100px'
  node.removeChild(node.children[node.children.length - 1]);
}

function pagination(size, total) {
  let pages = Math.ceil(total / size)
  let mjPagination = document.getElementsByClassName('mj-pagination')[0]
  let pagination = document.createElement('div')
  pagination.setAttribute('class', 'pagination')

  let attrList = mjPagination.attributes // 对象
  for(let item of attrList) {
    // 是否显示总条数
    if(item.nodeName == "total") {
      let node = document.createElement('p')
      node.setAttribute('id', 'totalCount')
      node.innerText = "共 " + total +" 条"
      mjPagination.appendChild(node)
      continue
    }
    // 是否可调整每页条数
    // if(item.nodeName == "page-sizes") {
    //   const sizes = item.nodeValue.split(",")
    //   let selector = createSizeSelector(sizes)
    //   mjPagination.appendChild(selector)
    // }
  }

  if(pages <= 5) createBasicPager(pages, pagination)
  if(pages > 5) createFoldPager(pages, pagination)
  mjPagination.appendChild(pagination)
}

function createBasicPager(pages, pagination) {
  let i = 0

  while (i <= pages+1) {
    let index = i
    let node = document.createElement('p')
    if(i === 0 || i == pages+1) {
      let className = i === 0 ? "icon-arrow-left" : "icon-arrow-right"
      node.classList.add("iconfont", className, "arrow")
    } else {
      node.innerText = i
    }
    if (i == 1) {
      node.classList.add("active")
      pagination.children[0].classList.add("disabled")
    }
    node.addEventListener("click", function () {
      changePage(index, pages, pagination)
    })
    pagination.appendChild(node)
    i++
  }

  const changePage = function(index, pages, pagination) {
    let page

    if(index == currPage) return
    if(index === 0 && currPage == 1) return 
    if(index == pages+1 && currPage == pages) return

    if(index === 0 || index == pages+1) {
      page = index === 0 ? currPage-1 : currPage+1
    } else {
      page = index
    }

    let currNode = pagination.children[currPage]
    currNode.classList.remove("active");
    let pageNode = pagination.children[page]
    pageNode.classList.add("active");

    if(page == 1 || page == pages) {
      pagination.children[page == 1 ? pages+1:0].classList.remove("disabled")
      pagination.children[page == 1 ? 0:pages+1].classList.add("disabled")
    } else {
      pagination.children[0].classList.remove("disabled")
      pagination.children[pages].classList.remove("disabled")
    }

    sendRequest(page)
  }
}

function createFoldPager(pages, pagination) {
  let i = 0

  while (i <= 8) {
    let node, index = i
    node = document.createElement('p')

    if(i === 0 || i == 8) {
      let className = i === 0 ? "icon-arrow-left" : "icon-arrow-right"
      node.classList.add("iconfont", className, "arrow")
    } else if(i == 2 || i == 6) {
      node.classList.add("iconfont", "icon-more")
      node.style.display = i == 2 ? 'none' : 'block'
    } else if(i == 1) {
      node.innerText = i
      node.classList.add("active")
      pagination.children[0].classList.add("disabled")
    }
     else {
      node.innerText = i == 7 ? pages : i-1
    }

    if( i != 2 && i != 6) {
      node.addEventListener("click", function () {
        changePage(index, pages, pagination)
      })
    }

    pagination.appendChild(node)
    i++
  }
  /**
   * 
   * @param {string} index 按钮下标
   * @param {string} pages 总页数
   * @param {string} page 目标页码
   * @returns 
   */
  const changePage = function(index, pages, pagination) {
    let page
    let node = pagination.children[index]
    let currNode, pageNode
    console.log(currPage, pages)
    if(currPage == parseInt(node.innerText)) return
    if(index === 0 && currPage == 1) return 
    if(index == 8 && currPage == pages) return

    //获取当前显示情况
    if(node.innerText == "") { // 点击了prev/next按钮
      page = index === 0 ? currPage-1 : currPage+1

    } else { // 点击了数字按钮
      page = parseInt(node.innerText) // 目标页码
    }
    console.log(currPage, page, pages)
    // 去除当前页面的高亮显示
    if(currPage == 1 ||  currPage == pages) {
      currNode = pagination.children[currPage == 1 ? 1:7]
    } else if(currPage == 2 || currPage == pages - 1){ // currPage == pages
      currNode = pagination.children[currPage == 2 ? 3:5]
    } else {
      currNode = pagination.children[4]
    }
    currNode.classList.remove("active");

    // 根据目标页面调整显示样式
    if(page <= 3) {
      pagination.children[2].style.display = 'none' // 隐藏左边省略号
      pagination.children[3].innerText = 2 // 隐藏左边省略号 
      pagination.children[4].innerText = 3 // 隐藏左边省略号
      pagination.children[5].innerText = 4 // 隐藏左边省略号
      pagination.children[6].style.display = 'block' // 显示右边省略号
      pageNode = pagination.children[page == 1 ? 1:page+1]
    } else if(page >= pages - 2) {
      pagination.children[2].style.display = 'block' // 显示左边省略号
      pagination.children[3].innerText = pages - 3 // 隐藏左边省略号 
      pagination.children[4].innerText = pages - 2 // 隐藏左边省略号
      pagination.children[5].innerText = pages - 1 // 隐藏左边省略号
      pagination.children[6].style.display = 'none' // 隐藏右边省略号
      pageNode = pagination.children[page == pages ? 7:6 - pages + page]
    } else {
      pagination.children[2].style.display = 'block' // 显示左边省略号
      pagination.children[3].innerText = page - 1 // 隐藏左边省略号 
      pagination.children[4].innerText = page // 隐藏左边省略号
      pagination.children[5].innerText = page + 1 // 隐藏左边省略号
      pagination.children[6].style.display = 'block' // 显示右边省略号
      pageNode = pagination.children[4]
    }
    pageNode.classList.add("active");

    if(page == 1 || page == pages) {
      pagination.children[page == 1 ? 8:0].classList.remove("disabled")
      pagination.children[page == 1 ? 0:8].classList.add("disabled")
    } else {
      pagination.children[0].classList.remove("disabled")
      pagination.children[8].classList.remove("disabled")
    }

    sendRequest(page)
  }
}

function createSizeSelector(sizes) {
  let selector = document.createElement('select')
  let i = 0
  while(i < sizes.length) {
    let option = document.createElement('option')
    option.setAttribute('value', sizes[i])
    option.innerText = sizes[i] + '条/页'
    selector.appendChild(option)
    i++
  }
  return selector
}
function sendRequest(page, size) {
  let request = new XMLHttpRequest()
  let param, paramPage, paramSize
  if(page) paramPage = "page=" + page
  if(size) paramSize = "limit" + size
  if(page && size) {
    param = paramPage + "&" + paramSize
  } else {
    param = size ? paramSize : paramPage
  }
  let url = "https://api.tanglifeng.cn/position/list?" + param
  request.onreadystatechange = function () {
    if (request.readyState == 4 && request.status == 200) {
      let res = request.responseText
      res = JSON.parse(res)
      // handleResult(res.data)
      currPage = page
    }
  }
  request.open("GET", url, true)
  request.send()
}