const { Model, DataTypes } = require('sequelize');

class UserPhoneVerification extends Model {
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

        code: {
          type: DataTypes.STRING,
          allowNull: false,
        },

        expires_at: {
          type: DataTypes.DATE,
          allowNull: false,
        },

        verified_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'user_phone_verifications',
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
  }
}

module.exports = UserPhoneVerification;
