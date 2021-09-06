const socket = io({ path: '/ws' })

const atag = document.getElementById('gay-link')
const image = document.getElementById('gay-image')
const upButton = document.getElementById('button-up')
const downButton = document.getElementById('button-down')

function log (type, ...data) {
  console.log(
    `%c[${type}]`, 'background: #222; color: #800080',
    ...data
  )
}

function setBerry (berry) {
  log('BERRY', 'Changed berry to', berry)
  image.src = `/api/cdn/${berry}`
  atag.href = `/${berry}`
}

upButton.onclick = () => {
  socket.emit('BERRY_UP')
}

downButton.onclick = () => {
  socket.emit('BERRY_DOWN')
}

socket.on('connect_error', console.error)

socket.on('connect', () => {
  socket.emit('IDENTIFY')

  log('BERRY', 'Connected')
})

socket.on('BERRY_CHANGE', setBerry)

window.socket = socket
