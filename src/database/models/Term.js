const { Model, DataTypes } = require('sequelize');

class Term extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
        },
        version: DataTypes.STRING,
        title: DataTypes.STRING,
        document_path: DataTypes.STRING,
        is_active: DataTypes.BOOLEAN,
      },
      {
        sequelize,
        tableName: 'terms',
        underscored: true,
      }
    );

    return this;
  }

  static associate(models) {
    this.hasMany(models.UserTermAcceptance, {
      foreignKey: 'term_id',
      as: 'acceptances',
    });
  }
}

module.exports = Term;
