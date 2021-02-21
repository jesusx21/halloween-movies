const camelizeObject = require('camelcase-keys');
const snakeObject = require('snakecase-keys');
const omit = require('lodash.omit');
const isEmpty = require('lodash.isempty');
const snakeCase = require('lodash.snakecase');

const {
  DatabaseError,
  EntityNotFound,
  InputIsNotAnEntity,
  InvalidInputData,
  InvalidId
} = require('../errors');

class Store {
  constructor(connection) {
    this._connection = connection;
    this._tableName = null;
    this._storeName = null;
  }

  async create(entity) {
    if (!this._isEntity(entity)) throw new InputIsNotAnEntity(entity);

    const dataToSave = omit(
      this._formatInputData(entity.toJSON()), ['id', 'created_at', 'updated_at']
    );

    let data;

    try {
      const result = await this._connection(this._tableName)
        .insert(dataToSave)
        .returning('*');

      data = result[0];
    } catch (error) {
      if (error.code === '42703') throw new InvalidInputData(error, data);
      if (error.code === '22P02') {
        if (error.file === 'uuid.c') throw new InvalidId(data.id)

        throw new InvalidInputData(error, data);
      }

      throw new DatabaseError(error);
    }

    return this._buildEntity(data);
  }

//   async findById(id) {
//     return this._findOne({ filter: { id } });
//   }

//   async update(entity) {
//     if (!this._isEntity(entity)) return Promise.reject(new InputIsNotAnEntity(entity));

//     const dataToSave = this._formatInputData(omit(entity.toJSON(), ['id', 'createdAt']));

//     dataToSave.updated_at = new Date();

//     await this._connection(this._tableName)
//       .where('id', entity.getId())
//       .update(dataToSave)
//       .catch((error) => this._onUnexpectedError(error, dataToSave));

//     return this.findById(entity.getId());
//   }

//   async find(query) {
//     const filter = this._formatInputData(query.filter);
//     const orderBy = isEmpty(filter.sort) ? [{ field: 'created_at', order: 'desc'}] : filter.sort;
//     const sort = this._parseSortObject(orderBy);

//     const qb = this._connection(this._tableName)
//       .where(filter)
//       .orderBy(sort);

//     if (query.limit) qb.limit(query.limit);
//     if (query.skip) qb.offset(query.skip);

//     const records = await qb
//       .catch(this._onUnexpectedError)

//     return this._buildEntities(records);
//   }

//   async _findOne(query) {
//     const filter = this._formatInputData(query.filter);
//     const orderBy = isEmpty(query.sort) ? [{ field: 'created_at', order: 'desc'}] : query.sort;
//     const sort = this._parseSortObject(orderBy);

//     const record = await this._connection(this._tableName)
//       .where(filter)
//       .orderBy(sort)
//       .first()
//       .catch((error) => this._onUnexpectedError(error, filter));

//     if (!record) return this._onNotFoundError(filter);

//     return this._buildEntity(record)
//   }

  async _buildEntity(data) {
    const result = this._formatOutputData(data);

    return this._makeEntity(result);
  }

  _isEntity(entity) {
    return entity.isNew instanceof Function
  }

//   _buildEntities(data) {
//     const promises = data.map(this._buildEntity.bind(this));

//     return Promise.all(promises);
//   }

//   _parseSortObject(sort = []) {
//     return sort.map((item) => {
//       return {
//         column: snakeCase(item.field),
//         order: item.order.toUpperCase()
//       };
//     });
//   }

  _formatInputData(data) {
    return snakeObject(data, { deep: true });
  }

  _formatOutputData(data) {
    return camelizeObject(data, { deep: true });
  }

  // _onUnexpectedError(error, data = {}) {
  //   if (error.code === '42703') return Promise.reject(new InvalidInputData(error, data));
  //   if (error.code === '22P02') {
  //     if (error.file === 'uuid.c') return Promise.reject(new InvalidId(data.id))
  //     return Promise.reject(new InvalidInputData(error, data));
  //   }

  //   return Promise.reject(new DatabaseError(error));
  // }

//   _onNotFoundError(id) {
//     return Promise.reject(new EntityNotFound(id, this._storeName));
//   }
}

module.exports = Store;
