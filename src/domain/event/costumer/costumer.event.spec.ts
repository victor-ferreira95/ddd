import Address from '../../entity/address'
import Customer from '../../entity/customer'
import EventDispatcher from '../@shared/event-dispatcher'
import CostumerChangedAddressEvent from './costumer-changed-address.event'
import CostumerCreatedEvent from './costumer-created.event'
import { EnviaConsoleLog1Handler } from './handler/EnviaConsoleLog1Handler'
import { EnviaConsoleLog2Handler } from './handler/EnviaConsoleLog2Handler'
import { EnviaConsoleLogHandler } from './handler/EnviaConsoleLogHandler'

describe('costumer events test', () => {
  it('should be notify all created event handler', () => {
    const eventDispatcher = new EventDispatcher()

    const eventHandler1 = new EnviaConsoleLog1Handler()
    const spyEventHandler1 = jest.spyOn(eventHandler1, 'handle')

    const eventHandler2 = new EnviaConsoleLog2Handler()
    const spyEventHandler2 = jest.spyOn(eventHandler2, 'handle')

    eventDispatcher.register('CostumerCreatedEvent', eventHandler1)
    expect(
      eventDispatcher.getEventHandlers.CostumerCreatedEvent[0],
    ).toMatchObject(eventHandler1)

    eventDispatcher.register('CostumerCreatedEvent', eventHandler2)
    expect(
      eventDispatcher.getEventHandlers.CostumerCreatedEvent[1],
    ).toMatchObject(eventHandler2)

    const customer = new Customer('1', 'Customer 1')

    const costumerCreatedEvent = new CostumerCreatedEvent(customer)

    eventDispatcher.notify(costumerCreatedEvent)

    expect(spyEventHandler1).toHaveBeenCalled()

    expect(spyEventHandler2).toHaveBeenCalled()
  })

  it('should be notify all changed address event handler', () => {
    const eventDispatcher = new EventDispatcher()

    const eventHandler = new EnviaConsoleLogHandler()
    const spyEventHandler = jest.spyOn(eventHandler, 'handle')

    eventDispatcher.register('CostumerChangedAddressEvent', eventHandler)
    expect(
      eventDispatcher.getEventHandlers.CostumerChangedAddressEvent[0],
    ).toMatchObject(eventHandler)

    const customer = new Customer('1', 'Customer 1')
    const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1')

    customer.changeAddress(address)

    const costumerChandeAddressEvent = new CostumerChangedAddressEvent(customer)

    eventDispatcher.notify(costumerChandeAddressEvent)

    expect(spyEventHandler).toHaveBeenCalled()
  })
})
