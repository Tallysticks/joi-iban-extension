'use strict'

const iban = require('ibantools')

module.exports = joi => {
  return {
    base: joi.string(),
    name: 'string',
    language: {
      invalidIBAN: 'needs to be a valid IBAN',
      invalidSWIFTBIC: 'needs to be a valid BIC (SWIFT code)',
    },
    pre(value, state, options) {
      return value
    },
    rules: [
      {
        name: 'iban',
        params: {
          options: joi.object().keys({
            strict: joi.boolean(),
          }).default({
            strict: false,
          }),
        },
        validate(params, value, state, options) {
          let newVal = value

          // If strict mode is NOT on, we can convert the input into the machine format
          // If strict mode is on, do not convert, which will throw errors if it's not already in machine format
          if (params.options.strict !== true) {
            newVal = iban.electronicFormatIBAN(value)
          }

          if (iban.isValidIBAN(newVal)) return newVal
          return this.createError('string.invalidIBAN', { value }, state, options)
        },
      },
      {
        name: 'swiftbic',
        validate(params, value, state, options) {
          if (iban.isValidBIC(value)) return value
          return this.createError('string.invalidSWIFTBIC', { value }, state, options)
        },
      },
    ],
  }
}
