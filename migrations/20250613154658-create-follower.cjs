'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Followers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',      
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'     
      },
      follower_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',    
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'     
      },
      is_accepted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
    },{
      uniqueKeys:{
        unique_follow:{
          fields:["user_id","follower_id"]
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Followers');
  }
};