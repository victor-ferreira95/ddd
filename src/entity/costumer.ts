// entidade anêmica -  não tem regra de negocio
// ORM

class Costumer {
  _id: string
  _name: string
  _address: string
  _active: boolean = true

  constructor(_id: string, _name: string, _address: string) {
    this._id = _id
    this._name = _name
    this._address = _address
  }

  // get id() {
  //   return this._id
  // }

  // get name() {
  //   return this._name
  // }

  // get address() {
  //   return this._address
  // }

  // set name(name: string) {
  //   this._name = name
  // }

  // set address(address: string) {
  //   this._address = address
  // }

  // modelagem do domínio rico
  changeName(name: string) {
    this._name = name
  }

  activate() {
    this._active = true
  }

  deactivate() {
    this._active = false
  }
}
