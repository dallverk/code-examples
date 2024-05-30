function contains(a, b) {
  return a.includes(b)
}

contains.transform = function (a, b) {
  let x = a
  let y = b

  if (typeof x?.includes !== 'function') {
    x = ''
  }

  return contains(x, y)
}

export default contains
