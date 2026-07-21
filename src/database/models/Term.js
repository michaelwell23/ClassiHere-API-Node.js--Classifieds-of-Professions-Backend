const { Model, DataTypes } = require('sequelize');

class Term extends Model {
  static init(sequelize) {
    super.init(
      {
        ersion: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },

        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },

        document_path: {
          type: DataTypes.STRING,
          allowNull: false,
        },

        is_active: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
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
