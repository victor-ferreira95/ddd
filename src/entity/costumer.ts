// entidade anêmica -  não tem regra de negocio
// ORM
// ter consistências dos dados, refletir ao valo atual do elemento
// sempre se autoavaliar
// Entidade focada em negocio
// NEGOCIO X PERSISTÊNCIA

import { Address } from './address'

export class Costumer {
  _id: string
  _name: string
  _address!: Address
  _active: boolean = false

  constructor(_id: string, _name: string) {
    this._id = _id
    this._name = _name
    this.validate()
  }

  validate() {
    if (this._name.length === 0) {
      throw new Error('Name is required')
    }
    if (this._id.length === 0) {
      throw new Error('Id is required')
    }
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
    this.validate()
  }

  activate() {
    if (this._address !== undefined) {
      throw new Error('Address is mandatory to activate a customer')
    }
    this._active = true
  }

  deactivate() {
    this._active = false
  }

  // eslint-disable-next-line accessor-pairs
  set address(address: Address) {
    this._address = address
  }
}
