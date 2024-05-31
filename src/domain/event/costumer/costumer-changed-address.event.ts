import EventInterface from '../@shared/event.interface'

export default class CostumerChangedAddressEvent implements EventInterface {
  dataTimeOccurred: Date
  eventData: unknown

  constructor(eventData: unknown) {
    this.dataTimeOccurred = new Date()
    this.eventData = eventData
  }
}
