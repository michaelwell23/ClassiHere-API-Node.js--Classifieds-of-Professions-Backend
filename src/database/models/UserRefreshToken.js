const { Model, DataTypes } = require('sequelize');

class UserRefreshToken extends Model {
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

        jti: {
          type: DataTypes.UUID,
          allowNull: false,
          unique: true,
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
      },
      {
        sequelize,
        tableName: 'user_refresh_tokens',
        underscored: true,

        indexes: [
          {
            fields: ['user_id'],
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

    delete values.token_hash;

    return values;
  }
}

module.exports = UserRefreshToken;
