import EventInterface from '../../@shared/event/event.interface'

export default class CostumerCreatedEvent implements EventInterface {
  dataTimeOccurred: Date
  eventData: unknown

  constructor(eventData: unknown) {
    this.dataTimeOccurred = new Date()
    this.eventData = eventData
  }
}
