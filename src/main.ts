import Address from './entity/address'
import Costumer from './entity/costumer'
import Order from './entity/order'
import OrderItem from './entity/order_item'

const costumer = new Costumer('1', 'victor ferreira')
const address = new Address('rua minas gerais', 2003, '61944-460', 'Maranguape')
costumer.Address = address
costumer.activate()
// ID

const item1 = new OrderItem('1', 'item 1', 10, 'p1', 1)
const item2 = new OrderItem('2', 'item 2', 8, 'p2', 2)
const item3 = new OrderItem('3', 'item 3', 15, 'p3', 7)
const order = new Order('1', '1', [item1, item2, item3])
// Objeto - Entidade

console.log(costumer, order, order.total())
