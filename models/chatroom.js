'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chatroom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //one user belongs to many chatrooms (M-1). To access the creator of chatroom :- chatroom.creator
      this.belongsTo(models.User,{foreignKey: "creator_id", as: "creator"})

      //A chatroom can have many members (M-M)
      this.belongsToMany(models.Chatroom, {
        through: models.Chatroom_member,
        foreignKey: 'member_id',
        otherKey: 'chatroom_id',
        as: 'chatrooms_joined'
      });

      // Many chatroom can have many messages from many users (M-M)
      this.belongsToMany(models.User, {
        through: models.Chatroom_member,
        foreignKey: 'chatroom_id',
        otherKey: 'sender_id',
        as: 'chatrooms_messages'
      });
    }
  }
  Chatroom.init({
    creator_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    chatroom_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Chatroom',
  });
  return Chatroom;
};