module.exports = {
  /**
   * Write json into ServerResponse
   *
   * @param {ServerResponse} res
   * @param {Object|Array} data
   * @return {ServerResponse}
   */
  write(res, data) {
    let json = {};
    try {
      json = JSON.stringify(data)
    } catch (e) {
      throw new Error(`"data" has to be an object or an Array.`)
    }

    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Content-Size', json.length)

    res.write(json)

    return res
  }
}
