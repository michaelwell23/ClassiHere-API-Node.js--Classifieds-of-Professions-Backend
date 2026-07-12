const { Model, DataTypes } = require('sequelize');

class UserTermAcceptance extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
        },
        user_id: DataTypes.UUID,
        term_id: DataTypes.UUID,
        accepted_at: DataTypes.DATE,
        ip_address: DataTypes.STRING,
        user_agent: DataTypes.TEXT,
      },
      {
        sequelize,
        tableName: 'user_term_acceptances',
        underscored: true,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });

    this.belongsTo(models.Term, {
      foreignKey: 'term_id',
      as: 'term',
    });
  }
}

module.exports = UserTermAcceptance;
