'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Follower extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Follower.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    follower_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_accepted:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
  }, {
    sequelize,
    modelName: 'Follower',
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'follower_id']
      }
    ]
  });
  return Follower;
};