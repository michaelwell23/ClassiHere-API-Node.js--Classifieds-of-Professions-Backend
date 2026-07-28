const { Model, DataTypes } = require('sequelize');

class UserVerification extends Model {
  static init(sequelize) {
    return super.init(
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

        token_hash: {
          type: DataTypes.STRING(64),
          allowNull: false,
          unique: true,
        },

        expires_at: {
          type: DataTypes.DATE,
          allowNull: false,
        },

        used_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'user_verifications',
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  }
}

module.exports = UserVerification;
