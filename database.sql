--Database tables and migration commands 

npx sequelize model:generate --name User --attributes username:string,email:string,password:string,bio:string,description:string,profile_image_url:string,github_url:string,portfolio_url:string;

npx sequelize model:generate --name Otp_verification --attributes otp_hash:integer,email:string;

npx sequelize model:generate --name Follower --attributes user_id:integer,follower_id:integer,is_accepted:boolean;

npx sequelize model:generate --name Personal_message --attributes sender_id:integer,receiver_id:integer,content_text:string;

npx sequelize model:generate --name Chatroom --attributes created_by:integer,chatroom_name:string;

npx sequelize model:generate --name Chatroom_member --attributes chatroom_id:integer,member_id:integer;

npx sequelize model:generate --name Chatroom_message --attributes chatroom_id:integer,sender_id:integer,content_text:string;

--because we changed the name from config.json to config.js so that we can include environment variables..
npx sequelize db:migrate --config config/config.js

In the `Followers` table, a check constraint is manually added:
  CHECK (user_id <> follower_id) (user_id != follower_id).
This prevents a user from following themselves.
Not handled by Sequelize migration; add manually after deployment.
