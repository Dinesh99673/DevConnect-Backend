'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chatroom_message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //Senders
      this.belongsTo(models.User, { foreignKey: 'sender_id' });
      //Chatrooms
      this.belongsTo(models.Chatroom, { foreignKey: 'chatroom_id' });
    }
  }
  Chatroom_message.init({
    chatroom_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content_text: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Chatroom_message',
  });
  return Chatroom_message;
};