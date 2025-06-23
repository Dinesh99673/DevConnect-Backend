'use strict';
const { Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // 1:M - A user can create many chatrooms
      this.hasMany(models.Chatroom, { foreignKey: 'creator_id', as: 'chatrooms_created' });

      // M:M - A user can join many chatrooms
      this.belongsToMany(models.Chatroom, {
        through: models.Chatroom_member,
        foreignKey: 'member_id',
        otherKey: 'chatroom_id',
        as: 'chatrooms_joined'
      });

      // 1:M - A user can send many messages
      this.hasMany(models.Chatroom_message, {
        foreignKey: 'sender_id',
        as: 'messages_sent'
      });

      // M:M Self-association - Users I follow
      this.belongsToMany(models.User, {
        through: 'Follower',
        as: 'following',
        foreignKey: 'follower_id',
        otherKey: 'user_id'
      });

      // M:M Self-association - Users following me
      this.belongsToMany(models.User, {
        through: 'Follower',
        as: 'followers',
        foreignKey: 'user_id',
        otherKey: 'follower_id'
      });


      this.hasMany(models.Personal_message, { foreignKey: 'sender_id', as: 'sent_messages' });
      this.hasMany(models.Personal_message, { foreignKey: 'receiver_id', as: 'received_messages' });

    }
  }

  User.init({
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bio: DataTypes.STRING,
    description: DataTypes.STRING,
    profile_image_url: DataTypes.STRING,
    github_url: DataTypes.STRING,
    portfolio_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};
