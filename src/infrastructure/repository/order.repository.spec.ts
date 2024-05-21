import { Sequelize } from 'sequelize-typescript'
import CustomerModel from '../db/sequelize/model/customer.model'
import ProductModel from '../db/sequelize/model/product.model'
import CustomerRepository from './costumer.repository'
import Customer from '../../domain/entity/customer'
import Address from '../../domain/entity/address'
import ProductRepository from './product.repository'
import Product from '../../domain/entity/product'
import OrderModel from '../db/sequelize/model/order.model'
import OrderItemModel from '../db/sequelize/model/order-item.model'
import Order from '../../domain/entity/order'
import OrderItem from '../../domain/entity/order_item'
import OrderRepository from './order.repository'

describe('Order repository test', () => {
  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    })

    sequelize.addModels([
      CustomerModel,
      OrderItemModel,
      OrderModel,
      ProductModel,
    ])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it('should create a new order', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('123', 'Customer 1')
    const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1')
    customer.changeAddress(address)
    await customerRepository.create(customer)

    const productRepository = new ProductRepository()
    const product = new Product('123', 'Product 1', 10)
    await productRepository.create(product)

    const orderItem = new OrderItem(
      '1',
      product.name,
      product.price,
      product.id,
      2,
    )

    const order = new Order('123', '123', [orderItem])

    const orderRepository = new OrderRepository()
    await orderRepository.create(order)

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ['items'],
    })

    expect(orderModel!.toJSON()).toStrictEqual({
      id: '123',
      customer_id: '123',
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: '123',
          product_id: '123',
        },
      ],
    })
  })

  it('should update a order', async () => {
    // cria um costumer
    const customerRepository = new CustomerRepository()
    const customer = new Customer('123', 'Customer 1')
    const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1')
    customer.changeAddress(address)
    await customerRepository.create(customer)

    // cria um product e item 1
    const productRepository = new ProductRepository()
    const product1 = new Product('123', 'Product 1', 10)
    await productRepository.create(product1)

    const orderItem1 = new OrderItem(
      '1',
      product1.name,
      product1.price,
      product1.id,
      2,
    )

    // cria a order
    const order = new Order('123', '123', [orderItem1])

    const orderRepository = new OrderRepository()
    await orderRepository.create(order)

    // busca a order
    const orderModel1 = await OrderModel.findOne({
      where: { id: order.id },
      include: ['items'],
    })

    // testa
    expect(orderModel1!.toJSON()).toStrictEqual({
      id: '123',
      customer_id: '123',
      total: order.total(),
      items: [
        {
          id: orderItem1.id,
          name: orderItem1.name,
          price: orderItem1.price,
          quantity: orderItem1.quantity,
          order_id: '123',
          product_id: '123',
        },
      ],
    })

    // cria um product e item 2
    const product2 = new Product('1234', 'Product 2', 19)
    await productRepository.create(product2)

    const orderItem2 = new OrderItem(
      '2',
      product2.name,
      product2.price,
      product2.id,
      1,
    )

    order.changeItems([orderItem1, orderItem2])

    // atualiza a order
    await orderRepository.update(order)

    // busca a order
    const orderModel2 = await OrderModel.findOne({
      where: { id: order.id },
      include: ['items'],
    })

    // testa
    expect(orderModel2!.toJSON()).toStrictEqual({
      id: '123',
      customer_id: '123',
      total: order.total(),
      items: [
        {
          id: orderItem1.id,
          name: orderItem1.name,
          price: orderItem1.price,
          quantity: orderItem1.quantity,
          order_id: '123',
          product_id: '123',
        },
        {
          id: orderItem2.id,
          name: orderItem2.name,
          price: orderItem2.price,
          quantity: orderItem2.quantity,
          order_id: '123',
          product_id: '1234',
        },
      ],
    })
  })

  it('should find a order', async () => {
    // cria um costumer
    const customerRepository = new CustomerRepository()
    const customer = new Customer('123', 'Customer 1')
    const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1')
    customer.changeAddress(address)
    await customerRepository.create(customer)

    // cria um product e item 1
    const productRepository = new ProductRepository()
    const product1 = new Product('123', 'Product 1', 10)
    await productRepository.create(product1)

    const orderItem1 = new OrderItem(
      '1',
      product1.name,
      product1.price,
      product1.id,
      2,
    )

    // cria a order
    const order = new Order('123', '123', [orderItem1])

    const orderRepository = new OrderRepository()
    await orderRepository.create(order)

    const orderResult = await orderRepository.find(order.id)

    expect(order).toStrictEqual(orderResult)
  })

  it('should find all orders', async () => {
    // cria um costumer
    const customerRepository = new CustomerRepository()
    const customer = new Customer('123', 'Customer 1')
    const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1')
    customer.changeAddress(address)
    await customerRepository.create(customer)

    // cria um product e item 1
    const productRepository = new ProductRepository()
    const product1 = new Product('123', 'Product 1', 10)
    await productRepository.create(product1)

    const orderItem1 = new OrderItem(
      '1',
      product1.name,
      product1.price,
      product1.id,
      2,
    )

    // cria a order
    const order1 = new Order('123', customer.id, [orderItem1])

    const orderRepository = new OrderRepository()
    await orderRepository.create(order1)

    // cria um product e item 2
    const product2 = new Product('1234', 'Product 3', 70)
    await productRepository.create(product2)

    const orderItem2 = new OrderItem(
      '2',
      product2.name,
      product2.price,
      product2.id,
      5,
    )

    // cria a order
    const order2 = new Order('1234', customer.id, [orderItem2])
    await orderRepository.create(order2)

    const orders = await orderRepository.findAll()

    expect(orders).toHaveLength(2)
    expect(orders).toContainEqual(order1)
    expect(orders).toContainEqual(order2)
  })
})
