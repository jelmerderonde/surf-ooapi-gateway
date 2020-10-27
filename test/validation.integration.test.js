/* eslint-env mocha */

const assert = require('assert').strict

const { httpGet, gwContainer, integrationContext } = require('./integration.environment.js')

integrationContext('validation policy', function () {
  it('should respond with 200 for a correct request', async () => {
    const port = gwContainer().getMappedPort(8080)

    const res = await httpGet(`http://localhost:${port}/courses`)
    assert.equal(res.statusCode, 200)
  })

  it('should respond with 200 for a correct request with parameter', async () => {
    const port = gwContainer().getMappedPort(8080)

    const res = await httpGet(`http://localhost:${port}/courses?pageNumber=1`)
    assert.equal(res.statusCode, 200)
  })

  it('should respond with 400 when specifying a parameter with the wrong format', async () => {
    const port = gwContainer().getMappedPort(8080)

    const res = await httpGet(`http://localhost:${port}/courses?pageNumber=bar`)
    assert.equal(res.statusCode, 400)
    assert.match(res.headers['content-type'], /^application\/json\b/)

    const data = JSON.parse(res.body).data
    assert.equal(data[0].keyword, 'type')
    assert.equal(data[0].dataPath, '.query.pageNumber')
    assert.equal(data[0].params.type, 'integer')
  })

  describe('with validation', () => {
    it('should respond with 200 for a correct response', async () => {
      const port = gwContainer().getMappedPort(8080)

      const res = await httpGet(`http://localhost:${port}/courses/900d900d-900d-900d-900d-900d900d900d`, {
        headers: { 'X-Validate-Response': 'true' },
        gzip: true
      })
      assert.equal(res.statusCode, 200)
      assert.match(res.headers['content-type'], /^application\/json\b/)

      const course = JSON.parse(res.body)
      assert.equal(course.courseId, '900d900d-900d-900d-900d-900d900d900d')
    })

    it('should respond with 502 for an incorrect response', async () => {
      const port = gwContainer().getMappedPort(8080)

      const res = await httpGet(`http://localhost:${port}/courses/badbadba-badb-badb-badb-badbadbadbad`, {
        headers: { 'X-Validate-Response': 'true' },
        gzip: true
      })
      assert.equal(res.statusCode, 502)
      assert.match(res.headers['content-type'], /^application\/json\b/)

      const data = JSON.parse(res.body).data
      assert.equal(data[0].keyword, 'required')
      assert.equal(data[0].params.missingProperty, 'name')
    })
  })

  describe('without validation', () => {
    it('should respond with 200 for a correct response', async () => {
      const port = gwContainer().getMappedPort(8080)

      const res = await httpGet(`http://localhost:${port}/courses/900d900d-900d-900d-900d-900d900d900d`)
      assert.equal(res.statusCode, 200)
      assert.match(res.headers['content-type'], /^application\/json\b/)

      const course = JSON.parse(res.body)
      assert.equal(course.courseId, '900d900d-900d-900d-900d-900d900d900d')
    })

    it('should respond with 200 for an incorrect response', async () => {
      const port = gwContainer().getMappedPort(8080)

      const res = await httpGet(`http://localhost:${port}/courses/badbadba-badb-badb-badb-badbadbadbad`)
      assert.equal(res.statusCode, 200)
      assert.equal(res.headers['content-type'], 'application/json')

      const course = JSON.parse(res.body)
      assert.equal(course.courseId, 'badbadba-badb-badb-badb-badbadbadbad')
    })
  })
})
