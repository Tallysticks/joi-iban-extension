'use strict'

const iban = require('ibantools')

module.exports = joi => {
  const ibanOpts = joi.object().keys({
    strict: joi.boolean(),
    format: joi.string().valid('electronic', 'friendly')
  }).default({
    strict: false,
    format: 'electronic'
  }).min(1);

  return {
    base: joi.string(),
    type: 'string',
    messages: {
      invalidIBAN: '"{{#label}}" needs to be a valid IBAN',
      invalidSWIFTBIC: '"{{#label}}" needs to be a valid BIC (SWIFT code)',
    },
    rules: {
      iban: {
        method(options) {
          return this.$_addRule({name: 'iban', args: {options}});
        },
        validate(value, {prefs, error}, args) {
          const options = joi.attempt(args.options, ibanOpts);

          // If strict mode is NOT on, we can convert the input into the machine format
          // If strict mode is on, do not convert, which will throw errors if it's not already in machine format
          if (!options.strict) {
            value = iban.electronicFormatIBAN(value)
          }

          if (iban.isValidIBAN(value)) {
            return options.format == 'friendly' ? iban.friendlyFormatIBAN(value) : value;
          }
          return error('invalidIBAN')
        },
      },
      swiftbic: {
        method(options) {
          return this.$_addRule({name: 'swiftbic', args: {options}});
        },
        validate(value, {prefs, error}, args) {
          if (iban.isValidBIC(value)) {
            return value
          }
          return error('invalidSWIFTBIC')
        },
      },
    },
  }
}
