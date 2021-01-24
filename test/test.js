const { expect } = require('chai')
const request = require('supertest')

const app = require('../app')


describe('Stateless Microservice', () => {
  const loginDetails = { username: 'someone', password: 'awesome' }
  let token
  const jsonObject = '{ "user": { "firstName": "Albert", "lastName": "Einstein" } }'
  const jsonPatchObject = '[{"op": "replace", "path": "/user/firstName", "value": "Leonado"}, {"op": "replace", "path": "/user/lastName", "value": "Da Vinci"}]'
  const imageUrl = 'https://s3.amazonaws.com/oxfamamericaunwrapped.com/wp-content/uploads/2013/07/OAU10-53_pair_of_goats_2014-updated-image-400x400.jpg'
  const invalidImageUrl = 'https://s3.amazonaws.com/oxfamamericaunwrapped.com/wp-content/uploads/2013/07/OAU10-53_pair_of_goats'

  describe('Testing Authentication(JWT)', () => {
    it('logging user if username and password are correct', (done) => {
      request.agent(app)
        .post('/api/users/login')
        .send({ username: 'someone', password: '' })
        .end((err, res) => {
          expect(res.statusCode).to.equal(400)
          done()
        })
    })

    it('generating JWT from username and password and returning it', (done) => {
      request.agent(app)
        .post('/api/users/login')
        .send(loginDetails)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200)
          expect(res.body.authorized).to.equal(true)
          token = res.body.token
          done()
        })
    })
  })
  describe('Patch object Testing', () => {
    it('it should patch object A with object B', (done) => {
      request.agent(app)
        .patch('/api/patch-object')
        .set('token', token)
        .send({ jsonObject, jsonPatchObject })
        .end((err, res) => {
          expect(res.statusCode).to.equal(200)
          done()
        })
    })

    it('it should not patch if token is invalid', (done) => {
      request.agent(app)
        .patch('/api/patch-object')
        .set('token', 'wrongtoken')
        .send({ jsonObject, jsonPatchObject })
        .end((err, res) => {
          expect(res.statusCode).to.equal(401)
          expect(res.body.authorized).to.equal(false)
        })
      done()
    })
  })

  describe('Thumbnail Testing', () => {
    it('it should accept a public image url and return a resized image', (done) => {
      request.agent(app)
        .post('/api/create-thumbnail')
        .set('token', token)
        .send({ imageUrl: imageUrl })
        .end((err, res) => {
          expect(res.statusCode).to.equal(200)
          expect(res.body.converted).to.equal(true)
        })
      done()
    })

    it('it should not process image if token is invalid', (done) => {
      request.agent(app)
        .post('/api/create-thumbnail')
        .set('token', 'randomewwrongtoken')
        .send({ imageUrl: imageUrl })
        .end((err, res) => {
          expect(res.statusCode).to.equal(401)
          expect(res.body.authorized).to.equal(false)
        })
      done()
    })

    it('it should not process image if url is invalid', (done) => {
      request.agent(app)
        .post('/api/create-thumbnail')
        .set('token', token)
        .send({ imageUrl: invalidImageUrl })
        .end((err, res) => {
          expect(res.statusCode).to.equal(400)
        })
      done()
    })
  })
})
