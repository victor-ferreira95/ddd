import Order from '../../domain/entity/order'
import OrderRepositoryInterface from '../../domain/repository/order.repository.interface'
import OrderModel from '../db/sequelize/model/order.model'
import OrderItemModel from '../db/sequelize/model/order-item.model'
import { Op } from 'sequelize'
import OrderItem from '../../domain/entity/order_item'

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      },
    )
  }

  async update(entity: Order): Promise<void> {
    // Atualiza a ordem
    await OrderModel.update(
      {
        customer_id: entity.customerId,
        total: entity.total(),
      },
      {
        where: { id: entity.id },
      },
    )

    // Atualiza os itens do pedido
    await Promise.all(
      entity.items.map(async (item) => {
        await OrderItemModel.upsert({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
          order_id: entity.id,
        })
      }),
    )

    // Remove os itens que não estão na lista atualizada
    const currentItemIds = entity.items.map((item) => item.id)
    await OrderItemModel.destroy({
      where: {
        order_id: entity.id,
        id: { [Op.notIn]: currentItemIds },
      },
    })
  }

  async find(id: string): Promise<Order> {
    let orderModel
    try {
      orderModel = await OrderModel.findByPk(id, {
        include: 'items',
        rejectOnEmpty: true,
      })
    } catch (error) {
      throw new Error('Customer not found')
    }

    const items = orderModel.items.map(
      (item) =>
        new OrderItem(
          item.id,
          item.name,
          item.price,
          item.product_id,
          item.quantity,
        ),
    )
    const order = new Order(orderModel.id, orderModel.customer_id, items)

    return order
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({
      include: 'items',
    })

    return orderModels.map((orderModel) => {
      const items = orderModel.items.map(
        (item) =>
          new OrderItem(
            item.id,
            item.name,
            item.price,
            item.product_id,
            item.quantity,
          ),
      )
      const order = new Order(orderModel.id, orderModel.customer_id, items)

      return order
    })
  }
}
