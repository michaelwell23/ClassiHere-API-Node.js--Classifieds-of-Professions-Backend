const { Model, DataTypes } = require('sequelize');

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },

        first_name: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },

        last_name: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },

        email: {
          type: DataTypes.STRING(254),
          allowNull: false,
        },

        password_hash: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },

        phone: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },

        avatar_path: {
          type: DataTypes.STRING(500),
          allowNull: true,
        },

        cpf: {
          type: DataTypes.STRING(11),
          allowNull: false,
          unique: true,

          validate: {
            is: /^\d{11}$/,
          },
        },

        is_email_verified: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },

        is_phone_verified: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },

        is_active: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },

        deactivated_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },

        deletion_requested_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },

        last_login_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },

        failed_login_attempts: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,

          validate: {
            min: 0,
          },
        },

        locked_until: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'users',
        underscored: true,
        paranoid: true,

        indexes: [
          {
            fields: ['cpf'],
            unique: true,
          },
          {
            fields: ['phone'],
          },
          {
            fields: ['deleted_at'],
          },
          {
            fields: ['is_active'],
          },
          {
            fields: ['locked_until'],
          },
        ],
      }
    );

    return this;
  }

  static associate(models) {
    this.hasMany(models.UserVerification, {
      foreignKey: 'user_id',
      as: 'verifications',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    this.hasMany(models.PasswordResetToken, {
      foreignKey: 'user_id',
      as: 'passwordResetTokens',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    this.hasMany(models.UserPhoneVerification, {
      foreignKey: 'user_id',
      as: 'phoneVerifications',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    this.hasMany(models.UserRefreshToken, {
      foreignKey: 'user_id',
      as: 'refreshTokens',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    this.hasMany(models.UserTermAcceptance, {
      foreignKey: 'user_id',
      as: 'termAcceptances',
    });
  }

  toJSON() {
    const values = {
      ...this.get(),
    };

    delete values.password;
    delete values.password_hash;

    return values;
  }
}

module.exports = User;
