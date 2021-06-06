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

for(let item of attrList) {
  if(item.nodeName == "jumper") {
    let node = document.createElement('div')
    let txt1 = document.createTextNode('前往')
    let input = document.createElement('input')
    input.setAttribute('value', 4)
    input.setAttribute('type', 'number')
    let txt2 = document.createTextNode('页')
    node.appendChild(txt1)
    node.appendChild(input)
    node.appendChild(txt2)
    mjPagination.appendChild(node)
  }
}