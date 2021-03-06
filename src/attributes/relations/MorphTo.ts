import { Record } from '../../data/Contract'
import Model from '../../model/Model'
import { Item } from '../../repo/Query'
import Repo, { Relation as Load } from '../../repo/Repo'
import Attr from '../types/Attr'
import { Fields } from '../contracts/Contract'
import Relation from './Relation'

export type Entity = typeof Model | string

export default class MorphTo extends Relation {
  /**
   * The field name that contains id of the parent model.
   */
  id: string

  /**
   * The field name fthat contains type of the parent model.
   */
  type: string

  /**
   * The related record.
   */
  record: Item = null

  /**
   * Create a new morph to instance.
   */
  constructor (id: string, type: string, connection?: string) {
    super(connection)

    this.id = id
    this.type = type
  }

  /**
   * Return null if the value is not present.
   */
  fill (value: any): any {
    return value || null
  }

  /**
   * Load the morph many relationship for the record.
   */
  load (repo: Repo, record: Record, relation: Load): Item {
    const related = this.model(record[this.type])
    const ownerKey = related.localKey()
    const query = new Repo(repo.state, related.entity, false)

    query.where(ownerKey, record[this.id])

    this.addConstraint(query, relation)

    return query.first()
  }

  /**
   * Make model instances of the relation.
   */
  make (parent: Fields): Model | null {
    const related: string = (parent[this.type] as Attr).value
    const model = this.model(related)

    return this.record ? new model(this.record) : null
  }
}
