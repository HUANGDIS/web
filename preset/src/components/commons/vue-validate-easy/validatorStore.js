
let validatorStore = {}

export default {
  addValidator(name, validator) {
    validatorStore[name] = validator
  }
}