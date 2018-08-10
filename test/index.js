/* eslint no-console: "off" */

'use strict'

const { should } = require('chai').use(require('chai-as-promised'))

const BaseJoi = require('joi')
const JoiIbanExtension = require('../src')
const Joi = BaseJoi.extend(JoiIbanExtension)

const testStrings = require('./_testStrings')

describe('Joi IBAN Extension: IBAN', () => {

  before(async () => {
    should()
  })

  it('should reject empty string', async () => {
    const schema = Joi.string().iban()
    const error = await schema.validate('').should.be.rejected
    error.message.should.equal('"value" is not allowed to be empty')
  })

  it('should reject invalid IBAN', async () => {
    const schema = Joi.string().iban()
    const error = await schema.validate('asd asdf asdf as').should.be.rejected
    error.message.should.equal('"value" needs to be a valid IBAN')
  })

  it('should accept valid IBAN with spaces', async () => {
    const schema = Joi.string().iban()
    const error = await schema.validate('DE89 3704 0044 0532 0130 00').should.be.fulfilled
  })

  it('should accept valid IBAN without spaces', async () => {
    const schema = Joi.string().iban()

    for (const iban of testStrings) {
      try {
        await schema.validate(iban).should.be.fulfilled
      } catch (e) {
        console.log(iban)
        throw e
      }
    }
  })

  it('should accept valid IBAN without spaces if strict mode is active', async () => {
    const schema = Joi.string().iban({ strict: true })
    const error = await schema.validate('DE89370400440532013000').should.be.fulfilled
  })

  it('should reject valid IBAN with spaces if strict mode is active', async () => {
    const schema = Joi.string().iban({ strict: true })
    const error = await schema.validate('DE89 3704 0044 0532 0130 00').should.be.rejected
    error.message.should.equal('"value" needs to be a valid IBAN')
  })

})

describe('Joi IBAN Extension: BIC', () => {

  before(async () => {
    should()
  })

  it('should reject invalid BIC', async () => {
    const schema = Joi.string().swiftbic()
    const error = await schema.validate('asda f1').should.be.rejected
    error.message.should.equal('"value" needs to be a valid BIC (SWIFT code)')
  })

  it('should accept valid BIC', async () => {
    const schema = Joi.string().swiftbic()
    const error = await schema.validate('DABAIE2D').should.be.fulfilled
  })

})
