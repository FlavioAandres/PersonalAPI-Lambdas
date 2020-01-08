module.exports = (body) => {
    let params = body.split("&")
    let object = params.reduce((prev, current) => {
        let result = current.split("=")
        prev[result[0]] = decodeURIComponent(result[1] || '')
        return prev
    }, {})

    return object
}