const { Model, DataTypes } = require('sequelize');

class UserTermAcceptance extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },

        user_id: {
          type: DataTypes.UUID,
          allowNull: false,
        },

        term_id: {
          type: DataTypes.UUID,
          allowNull: false,
        },

        accepted_at: {
          type: DataTypes.DATE,
          allowNull: false,
        },

        ip_address: {
          type: DataTypes.STRING,
          allowNull: true,
        },

        user_agent: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
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
