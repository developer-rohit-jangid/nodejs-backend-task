const { expect } = require('chai')
const request = require('supertest')

const app = require('../app')


describe('Stateless Microservice', () => {
  const loginDetails = { username: 'someone', password: 'awesome' }
  let token

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

})
