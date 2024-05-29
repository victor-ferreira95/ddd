import SendEmailWhenProductIsCreatedHandler from '../product/handler/send-email-when-product-is-created.handler'
import ProductCreatedEvent from '../product/product-created.event'
import EventDispatcher from './event-dispatcher'

describe('Domain events tests', () => {
  it('should register an event handle', () => {
    const eventDispatcher = new EventDispatcher()
    const eventHandler = new SendEmailWhenProductIsCreatedHandler()

    eventDispatcher.register('ProductCreatedEvent', eventHandler)

    expect(eventDispatcher.getEventHandlers.ProductCreatedEvent).toBeDefined()
    expect(eventDispatcher.getEventHandlers.ProductCreatedEvent.length).toBe(1)
    expect(
      eventDispatcher.getEventHandlers.ProductCreatedEvent[0],
    ).toMatchObject(eventHandler)
  })

  it('should unregister an event handler', () => {
    const eventDispatcher = new EventDispatcher()
    const eventHandler = new SendEmailWhenProductIsCreatedHandler()

    eventDispatcher.register('ProductCreatedEvent', eventHandler)

    expect(
      eventDispatcher.getEventHandlers.ProductCreatedEvent[0],
    ).toMatchObject(eventHandler)

    eventDispatcher.unregister('ProductCreatedEvent', eventHandler)

    expect(eventDispatcher.getEventHandlers.ProductCreatedEvent).toBeDefined()
    expect(eventDispatcher.getEventHandlers.ProductCreatedEvent.length).toBe(0)
  })
})

it('should be unregister all event handler', () => {
  const eventDispatcher = new EventDispatcher()
  const eventHandler = new SendEmailWhenProductIsCreatedHandler()

  eventDispatcher.register('ProductCreatedEvent', eventHandler)

  expect(eventDispatcher.getEventHandlers.ProductCreatedEvent[0]).toMatchObject(
    eventHandler,
  )

  eventDispatcher.unregisterAll()

  expect(eventDispatcher.getEventHandlers.ProductCreatedEvent).toBeUndefined()
})

it('should be notify all event handler', () => {
  const eventDispatcher = new EventDispatcher()
  const eventHandler = new SendEmailWhenProductIsCreatedHandler()

  const spyEventHandler = jest.spyOn(eventHandler, 'handle')

  eventDispatcher.register('ProductCreatedEvent', eventHandler)

  expect(eventDispatcher.getEventHandlers.ProductCreatedEvent[0]).toMatchObject(
    eventHandler,
  )
  const productCreatedEvent = new ProductCreatedEvent({
    name: 'Product 1',
    description: 'Product 1 description',
    price: 10,
  })

  // quando o notify for chamado, SendEmailWhenProductIsCreatedHandler.handle deve ser chamado
  eventDispatcher.notify(productCreatedEvent)

  expect(spyEventHandler).toHaveBeenCalled()
})
