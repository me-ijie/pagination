var currPage = 1
var currSize = 20
var currPages = 1

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
  currPages = pages
  let mjPagination = document.getElementsByClassName('mj-pagination')[0]
  const layout = mjPagination.attributes['layout'].nodeValue.replace(/\s/g, "").split(",")

  // 是否显示总条数
  if (layout.indexOf('total') != -1) showTotal(total)
  // 是否可调整每页条数
  if (layout.indexOf('sizes') != -1) showSizeSelector()
  // pager
  // if(layout.indexOf('pager-count') != -1) {
  //   customerPager(pages, mjPagination)
  // } else {
  //   pager(pages, mjPagination)
  // }
  pager(pages)

  // 是否显示jumper
  if (layout.indexOf('jumper') != -1) showJumper()
}

function showTotal(total) {
  let mjPagination = document.getElementsByClassName('mj-pagination')[0]
  let node = document.createElement('p')
  node.setAttribute('id', 'totalCount')
  node.innerText = "共 " + total + " 条"
  mjPagination.appendChild(node)
}

function showSizeSelector() {
  let mjPagination = document.getElementsByClassName('mj-pagination')[0]
  const sizes = mjPagination.attributes['page-sizes'].nodeValue.replace(/\s/g, "").split(",")
  let selector = document.createElement('select')
  let i = 0
  while (i < sizes.length) {
    let option = document.createElement('option')
    option.setAttribute('value', sizes[i])
    option.innerText = sizes[i] + '条/页'
    selector.appendChild(option)
    i++
  }
  selector.onchange = function () {
    changeSize(selector)
  }

  const changeSize = function (selector) {
    let index = selector.selectedIndex
    let size = parseInt(selector.options[index].value)
    sendRequest(1, size, false)
    if (currPages > 5) {
      changeFoldPage(undefined, currPages, 1)
    } else {
      changeBasicPage(undefined, currPages, 1)
    }
  }

  mjPagination.appendChild(selector)
}

function customPager(pages) {
  let mjPagination = document.getElementsByClassName('mj-pagination')[0]
  let count = mjPagination.attributes['page-sizes'].nodeValue.replace(/\s/g, "")
  if (count <= 5) {
    pager(pages, mjPagination)
    return
  }

}

function pager(pages) {
  let mjPagination = document.getElementsByClassName('mj-pagination')[0]
  let pagination = document.createElement('div')
  pagination.setAttribute('class', 'pagination')

  if (pages <= 5) createBasicPager(pages, pagination)
  if (pages > 5) createFoldPager(pages, pagination)

  mjPagination.appendChild(pagination)
}

function createBasicPager(pages, pagination) {
  let i = 0

  while (i <= pages + 1) {
    let index = i
    let node = document.createElement('p')
    if (i === 0 || i == pages + 1) {
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
      changeBasicPage(index, pages)

      if (index === 0 || index == pages + 1) {
        page = index === 0 ? currPage - 1 : currPage + 1
      } else {
        page = index
      }

      sendRequest(page, currSize)
    })
    pagination.appendChild(node)
    i++
  }


}

function changeBasicPage(index, pages, page) {
  let topage = page
  let pagination = document.getElementsByClassName('pagination')[0]
  if (index == currPage) return
  if (index === 0 && currPage == 1) return
  if (index == pages + 1 && currPage == pages) return

  if (index === 0 || index == pages + 1) {
    topage = index === 0 ? currPage - 1 : currPage + 1
  } else if (index) {
    topage = index
  }

  let currNode = pagination.children[currPage]
  currNode.classList.remove("active");

  let pageNode = pagination.children[topage]
  pageNode.classList.add("active");

  if (topage == 1 || topage == pages) {
    pagination.children[topage == 1 ? pages + 1 : 0].classList.remove("disabled")
    pagination.children[topage == 1 ? 0 : pages + 1].classList.add("disabled")
  } else {
    pagination.children[0].classList.remove("disabled")
    pagination.children[pages].classList.remove("disabled")
  }
}

function createFoldPager(pages, pagination) {
  let i = 0

  while (i <= 8) {
    let node, index = i
    node = document.createElement('p')

    if (i === 0 || i == 8) {
      let className = i === 0 ? "icon-arrow-left" : "icon-arrow-right"
      node.classList.add("iconfont", className, "arrow")
    } else if (i == 2 || i == 6) {
      node.classList.add("iconfont", "icon-more")
      node.style.display = i == 2 ? 'none' : 'block'
    } else if (i == 1) {
      node.innerText = i
      node.classList.add("active")
      pagination.children[0].classList.add("disabled")
    } else {
      node.innerText = i == 7 ? pages : i - 1
    }

    if (i != 2 && i != 6) {
      node.addEventListener("click", function () {
        changeFoldPage(index, pages)
        if (index === 0 || index == 8) {
          console.log('jinlail')
          page = index === 0 ? currPage - 1 : currPage + 1
        } else {
          page = parseInt(node.innerText)
        }
        sendRequest(page, currSize)
      })
    }

    pagination.appendChild(node)
    i++
  }
}

/**
 * 
 * @param {string} index 按钮下标
 * @param {string} pages 总页数
 * @param {string} page 目标页码
 * @returns 
 */
function changeFoldPage(index, pages, page) {
  let topage = page
  let pagination = document.getElementsByClassName('pagination')[0]
  let node = pagination.children[index]
  let currNode, pageNode
  if (index === 0 && currPage == 1) return
  if (index == 8 && currPage == pages) return


    //获取目标页码
    if (node && node.innerText == "") { // 点击了prev/next按钮
      topage = index === 0 ? currPage - 1 : currPage + 1
    } else { // 点击了数字按钮
      topage = parseInt(node.innerText) // 目标页码
    }
    // // 去除当前页面的高亮显示
    // if (currPage == 1 || currPage == pages) { 
    //   currNode = pagination.children[currPage == 1 ? 1 : 7]
    // } else if (currPage == 2 || currPage == pages - 1) { 
    //   currNode = pagination.children[currPage == 2 ? 3 : 5]
    // } else {
    //   currNode = pagination.children[4]
    // }
    currNode = document.getElementsByClassName('active')[0]
    currNode.classList.remove("active");


  // 根据目标页面调整显示样式
  if (topage <= 3) {
    pagination.children[2].style.display = 'none' // 隐藏左边省略号
    pagination.children[3].innerText = 2
    pagination.children[4].innerText = 3
    pagination.children[5].innerText = 4
    pagination.children[6].style.display = 'block' // 显示右边省略号
    pagination.children[7].innerText = pages
    pageNode = pagination.children[topage == 1 ? 1 : topage + 1]
  } else if (topage >= pages - 2) {
    pagination.children[2].style.display = 'block' // 显示左边省略号
    pagination.children[3].innerText = pages - 3
    pagination.children[4].innerText = pages - 2
    pagination.children[5].innerText = pages - 1
    pagination.children[6].style.display = 'none' // 隐藏右边省略号
    pagination.children[7].innerText = pages
    pageNode = pagination.children[topage == pages ? 7 : 6 - pages + topage]
  } else {
    pagination.children[2].style.display = 'block' // 显示左边省略号
    pagination.children[3].innerText = topage - 1
    pagination.children[4].innerText = topage
    pagination.children[5].innerText = topage + 1
    pagination.children[6].style.display = 'block' // 显示右边省略号
    pagination.children[7].innerText = pages
    pageNode = pagination.children[4]
  }
  pageNode.classList.add("active");

  if (topage == 1 || topage == pages) {
    pagination.children[topage == 1 ? 8 : 0].classList.remove("disabled")
    pagination.children[topage == 1 ? 0 : 8].classList.add("disabled")
  } else {
    pagination.children[0].classList.remove("disabled")
    pagination.children[8].classList.remove("disabled")
  }
}

function showJumper() {
  let mjPagination = document.getElementsByClassName('mj-pagination')[0]
  let node = document.createElement('div')
  let txt1 = document.createTextNode('前往')
  let input = document.createElement('input')
  input.setAttribute('value', 4)
  input.setAttribute('type', 'number')
  input.onkeydown = function (e) {
    jumpToPage(input, e.key)
  }
  let txt2 = document.createTextNode('页')
  node.appendChild(txt1)
  node.appendChild(input)
  node.appendChild(txt2)
  mjPagination.appendChild(node)

  const jumpToPage = function (input, key) {
    let page = input.value
    if (page > currPages || page == currPage) return
    if (key == "Enter") {
      if (currPages > 5) {
        changeFoldPage(undefined, currPages, page)
      } else {
        changeBasicPage(undefined, currPages, page)
      }
      sendRequest(page, currSize)
    }
  }
}

function sendRequest(page, size, ifWait) {
  let request = new XMLHttpRequest()
  let param, paramPage, paramSize
  let wait = ifWait === false ? false : true
  paramPage = page != undefined ? page : currPage
  paramSize = size != undefined ? size : currSize
  param = "page=" + paramPage + "&limit=" + paramSize

  let url = "https://api.tanglifeng.cn/position/list?" + param
  request.onreadystatechange = function () {
    if (request.readyState == 4 && request.status == 200) {
      let res = request.responseText
      res = JSON.parse(res)
      currPages = Math.ceil(res.paging.total / res.paging.size)
      currPage = paramPage
      currSize = paramSize
    }
  }
  request.open("GET", url, wait)
  request.send()
}