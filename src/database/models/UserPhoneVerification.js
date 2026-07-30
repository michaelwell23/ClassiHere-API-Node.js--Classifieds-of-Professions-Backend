const { Model, DataTypes } = require('sequelize');

class UserPhoneVerification extends Model {
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

        code_hash: {
          type: DataTypes.STRING(64),
          allowNull: false,
        },

        expires_at: {
          type: DataTypes.DATE,
          allowNull: false,
        },

        attempts: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,

          validate: {
            min: 0,
          },
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

        indexes: [
          {
            fields: ['user_id', 'created_at'],
          },
          {
            fields: ['expires_at'],
          },
        ],
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  }

  toJSON() {
    const values = {
      ...this.get(),
    };

    delete values.code_hash;

    return values;
  }
}

module.exports = UserPhoneVerification;
