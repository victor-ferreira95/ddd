import EventHandlerInterface from '../../@shared/event-handler.interface'
import CostumerChangedAddressEvent from '../costumer-changed-address.event'
import Costumer from '../../../entity/customer'

export class EnviaConsoleLogHandler
  implements EventHandlerInterface<CostumerChangedAddressEvent>
{
  handle(event: CostumerChangedAddressEvent): void {
    const customer = event.eventData as Costumer

    console.log(
      `Endereço do cliente: ${customer.id}, ${customer.name} alterado para: ${customer.Address.toString()}`,
    )
  }
}
