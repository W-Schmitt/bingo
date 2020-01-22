/* global XMLHttpRequest io */

/* ENUM-like class */
class Urls {
  static apiRoot () {
    return '/api/v0'
  }

  static bingo () {
    return `${this.apiRoot()}/bingo`
  }

  static bingoParams () {
    return `${this.bingo()}/params`
  }

  static bingoBoard () {
    return `${this.bingo()}/board`
  }
}

const getOrRetrieveParameters = () => {
  let parameters
  const paramsXhr = new XMLHttpRequest()
  paramsXhr.open('GET', Urls.bingoParams())
  paramsXhr.onreadystatechange = () => {
    if (this.readyState === 4 && this.status === 200) {
      parameters = JSON.parse(this.responseText)
    }
  }

  paramsXhr.send()

  return parameters
}

const getOrRetrieveBoard = () => {
  let board
  //TODO: check localStorage before requesting
  const boardXhr = new XMLHttpRequest()
  boardXhr.open('GET', Urls.bingoBoard())
  boardXhr.onreadystatechange = () => {
    if (this.readyState === 4 && this.status === 200) {
      board = JSON.parse(this.responseText)
    }
  }

  boardXhr.send()

  return board
}

const setChecked = (target) => {
  target.originalTarget.className = `card col s3${target.originalTarget.classList.contains('checked') ? '' : ' checked'}`
}

const createCardNode = (value) => {
  const node = document.createElement('div')
  node.id = `card-${value.id}`
  node.__id = value.id
  node.addEventListener('click', setChecked, false)
  node.className = 'card col s3'
  if (value.checked) node.className += ' blue-grey'
  const textElt = document.createTextNode(value.value)
  node.appendChild(textElt)
  return node
}

const buildVisualBoard = (board, params) => {
  const parentNode = document.querySelector('#board')

  const rows = []

  for (let i = 0; i < params.height; i++) {
    const row = document.createElement('div')
    row.className = 'row'
    rows.push(row)
  }

  for (let i = 0; i < params.height * params.width; i++) {
    const row = rows[Math.floor(i / params.width)]
    row.appendChild(createCardNode(board.board.values[i]))
  }

  for (let i = 0; i < rows.length; i++) {
    parentNode.appendChild(rows[i])
  }
}

const init = () => {
  let parameters
  const paramsXhr = new XMLHttpRequest()
  paramsXhr.open('GET', Urls.bingoParams())
  paramsXhr.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      parameters = JSON.parse(this.responseText)
      let board
      //TODO: check localStorage before requesting
      const boardXhr = new XMLHttpRequest()
      boardXhr.open('GET', Urls.bingoBoard())
      boardXhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          board = JSON.parse(this.responseText)

          buildVisualBoard(board, parameters)
        }
      }

      boardXhr.send()
    }
  }

  paramsXhr.send()
}

document.addEventListener('DOMContentLoaded', init, false)
