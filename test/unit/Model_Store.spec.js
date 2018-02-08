import { createStore } from 'test/support/Helpers'
import Model from 'app/Model'

describe('Model – Store', () => {
  it('can access the store instance as static method', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('')
        }
      }

      static find () {
        return this.store().getters[this.namespace('find')](1)
      }
    }

    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: { id: 1, name: 'John Doe' }
    })

    const user = User.find()

    expect(user.id).toBe(1)
    expect(user.name).toBe('John Doe')
  })

  it('can access the store instance as instance method', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('')
        }
      }

      create () {
        return this.$store().dispatch(this.$namespace('create'), {
          data: { id: 1, name: 'John Doe' }
        })
      }
    }

    const store = createStore([{ model: User }])

    ;(new User()).create()

    const user = store.getters['entities/users/find'](1)

    expect(user.id).toBe(1)
    expect(user.name).toBe('John Doe')
  })
})
