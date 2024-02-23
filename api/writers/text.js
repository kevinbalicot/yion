module.exports = {
  write(res, data) {
    const text = String(data)
    res.setHeader('Content-Type', 'plain/text')
    res.setHeader('Content-Size', text.length)

    res.write(text)
  },
}
