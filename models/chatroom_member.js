'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chatroom_member extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      //Members
      this.belongsTo(models.User, { foreignKey: 'member_id' });
      //Chatroom 
      this.belongsTo(models.Chatroom, { foreignKey: 'chatroom_id' });
    }
  }
  Chatroom_member.init({
    chatroom_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    member_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Chatroom_member',
    indexes: [
    {
      unique: true,
      fields: ['chatroom_id', 'member_id']
    }
  ]
  });
  return Chatroom_member;
};