const { Sequelize } = require('sequelize');
const fs = require('fs');

if (fs.existsSync('config.env')) {
  require('dotenv').config({
      path: './config.env'
  });
};

const toBool = (x) => (x && (x.toLowerCase() === 'true' || x.toLowerCase() === 'on')) || false;
const DATABASE_URL = process.env.DATABASE_URL === undefined ? "./database.db" : process.env.DATABASE_URL

module.exports = {
  //__________________________________________________________________________________________________________________________________________
 // For Enabling Commands Like AUTO_STATUS_VIEW Type true For Disabling Type false  
//____________________________________________________________________________________________________________________________________________  
  SESSION_ID: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoidU05Q3JBdVRCd3JIWVYxbnJEbWF6YjQ4aFNjY2JZZDVneXovWFR3UGFHVT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiSG03eFZqZm5tbGszQ1RRUWJTV0V1bnBCWmRCWWdiS1JWMWkzWjRWR01rOD0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJJQlFHaEZYN2NuQWFSUWthUXlKYk1TOVRkeGFJRDdNcmU4eDdDWWZ6SG4wPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiI0dW5pMnJZU3VNd25qQXg4Y1ZwcEdaL013VlRmaTJFOXUzRzRrV2FQZlFNPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjBLNXVSam1hTk4zd3o0NGpjOUFyNlRKdm56RWpKVS8rUy9lTk1hMzZGVjA9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InR2WmZtWUFhdmJHQmhhSFM2T2N3VkNtRVVmZDFRMnBiZ1R6UEo2K1k5WFU9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiaUpPanNKRFNaM21XTlkvc0RZeVhmRU01ZGtEZUhGU1RCaHl3dUU1M1FYQT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoibkdNVC9xWXVKa3lFWW9CZTQxeEJLV05wVHZmMWVFRjhsOHcxQjhuVExSVT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImRvbWp0UHc2ZmFBN2laZ2FKZTUrcU9nQmcvRTB6d2ExT1kzZEJDdlhBY3hpUFBzYkRoTWhnck96bjAzOGl3TWV2RU0xZHZHRGhkNmRmc0hlUTNoWmlRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTYzLCJhZHZTZWNyZXRLZXkiOiIwdzNZQ3FyS0kyTEZpY2RtZzVCL1JZV3lRWGxnUEZGYkduZzQ3WlhYQ2tzPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwicmVnaXN0ZXJlZCI6ZmFsc2UsImFjY291bnQiOnsiZGV0YWlscyI6IkNKZkNpZXNDRUthZ21Mc0dHQ3NnQUNnQSIsImFjY291bnRTaWduYXR1cmVLZXkiOiJFRGtIMW9zSWl2YnM3WWNUa29UbjZGQjRYY0tGYWV2VnFUQnYzQkJ0alVJPSIsImFjY291bnRTaWduYXR1cmUiOiJQMGpkaW05R3p6UzhOWXdXQ3FwTnZ6YXRTYlNsTUdZRlU0MjdUeUU2MW9sbjZ5ZzZvMzQrVFpSUG1JYnZPV05Ja29yeXZqU2dDbkJoOE5RZkdadjJBUT09IiwiZGV2aWNlU2lnbmF0dXJlIjoiazRnbmxXZldzSTdYS0phcFZrK01iTGtpNkVjWDJQK1EyNHcrd1RWUFFvM0gvcmhQWjlCQnhOcWxkN0FlR2REbFJyb0hEZi80YmxtK0loZzVKTVRkZ0E9PSJ9LCJtZSI6eyJpZCI6IjIzNzY5NjkwMDYxMjo3NUBzLndoYXRzYXBwLm5ldCIsIm5hbWUiOiLwnZm38J2aivCdmpfwnZqcIPCdmoPwnZqO8J2ajPCdmpEg4oCgIiwibGlkIjoiMTIxNjU1Mzg0ODY2ODY4Ojc1QGxpZCJ9LCJzaWduYWxJZGVudGl0aWVzIjpbeyJpZGVudGlmaWVyIjp7Im5hbWUiOiIyMzc2OTY5MDA2MTI6NzVAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCUkE1QjlhTENJcjI3TzJIRTVLRTUraFFlRjNDaFducjFha3diOXdRYlkxQyJ9fV0sInBsYXRmb3JtIjoic21iYSIsInJvdXRpbmdJbmZvIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQ0FnSUFnPT0ifSwibGFzdEFjY291bnRTeW5jVGltZXN0YW1wIjoxNzM0NzQyMDY4LCJsYXN0UHJvcEhhc2giOiJJWG9EcCJ9',
  STICKER_DATA: process.env.STICKER_DATA || '🎯ᴘʜᴏᴇɴɪx-ᴍᴅ;ᴀʙʜɪꜱʜᴇᴋ ꜱᴜʀᴇꜱʜ🍀',
  ALIVE_DATA: process.env.ALIVE_DATA || '👋 ʜᴇʏ &sender, ɪ ᴍ *ᴘʜᴏᴇɴɪx-ᴍᴅ ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ* ᴀʟɪᴠᴇ ɴᴏᴡ!\n\n📌 ᴛʏᴘᴇ *menu* ᴛᴏ ɢᴇᴛ ᴍʏ ᴄᴏᴍᴍᴀɴᴅ ʟɪꜱᴛ.\n\n*ᴘʟᴀᴛꜰᴏʀᴍ:* &platform\n*ʀᴜɴᴛɪᴍᴇ:* &runtime;https://i.ibb.co/tHWJrz3/IMG-20231128-WA0005.jpg',
  AUDIO_DATA: process.env.AUDIO_DATA || 'Phoenix-MD;Abhishek Suresh;https://i.ibb.co/tHWJrz3/IMG-20231128-WA0005.jpg',
  BOT_INFO: process.env.BOT_INFO || 'ᴘʜᴏᴇɴɪx-ᴍᴅ;ᴀʙʜɪꜱʜᴇᴋ ꜱᴜʀᴇꜱʜ;919074692450;https://i.ibb.co/tHWJrz3/IMG-20231128-WA0005.jpg', 
  PREFIX: process.env.PREFIX || '.',
  MODE: process.env.MODE || 'public',
  SUDO: process.env.SUDO || '919074692450, 918157993101',
  START_MSG: toBool(process.env.START_MSG || 'true'),
  ERROR_MSG: toBool(process.env.ERROR_MSG || 'true'), 
  WELCOME_MSG: process.env.WELCOME_MSG || '👋 Hello *@user* Welcome To Our Group *@gname*\n*Total Members:* @count\n*Total Admins:* @admin\n*Group Description:*\n@gdesc @pp',
  GOODBYE_MSG: process.env.GOODBYE_MSG || '👋 GoodBye *@user* From *@gname*\n*Total Members:* @count @pp',
  HEROKU_APP_NAME: process.env.HEROKU_APP_NAME || '',
  HEROKU_API_KEY: process.env.HEROKU_API_KEY || '',
  RENDER_NAME: process.env.RENDER_NAME || '',
  RENDER_API: process.env.RENDER_API || '',
  KOYEB_APP_NAME: process.env.KOYEB_APP_NAME || 'abhiLoki',
  KOYEB_API_KEY: process.env.KOYEB_API_KEY || 'rdhmh9sja4bxep5wxf7e9y7q4my251ptcqmvrwc78698lbxp0uvm9gphsl0bpabn',
  ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY || '',
  TIMEZONE: process.env.TIMEZONE || "Asia/Kolkata",
  LANG: process.env.LANG || 'EN',
  AUTO_STATUS_VIEW: toBool(process.env.AUTO_STATUS_VIEW || 'false'),
  AUTO_STATUS_REPLY: toBool(process.env.AUTO_STATUS_REPLY || 'false'),
  AUTO_STATUS_REPLY_MSG: process.env.AUTO_STATUS_REPLY_MSG || '_*Nice Status Bro 🍀*_',
  AUTO_STATUS_REACT: toBool(process.env.AUTO_STATUS_REACT || 'true'),
  AUTO_STATUS_REACT_EMOJI: process.env.AUTO_STATUS_REACT_EMOJI || '🍀',
  AUTO_REACT: toBool(process.env.AUTO_REACT || 'false'),
  AUTO_READ_MSG: toBool(process.env.AUTO_READ_MSG || 'false'),
  ALWAYS_ONLINE: toBool(process.env.ALWAYS_ONLINE || 'false'),
  AUTO_CALL_REJECT: toBool(process.env.AUTO_CALL_REJECT || 'false'),
  AUTO_CALL_REJECT_MSG: process.env.AUTO_CALL_REJECT_MSG || '*ᴀᴜᴛᴏᴍᴀᴛᴇᴅ ᴄᴀʟʟ ʙʟᴏᴄᴋɪɴɢ*\n\nꜱᴏʀʀʏ ᴄᴀʟʟꜱ ᴀʀᴇ ɴᴏᴛ ᴀʟʟᴏᴡᴇᴅ\n\nᴘʟᴇᴀꜱᴇ ꜱᴇɴᴅ ᴀ ᴛᴇxᴛ ᴍᴇꜱꜱᴀɢᴇ/ᴠᴏɪᴄᴇ ᴍᴇꜱꜱᴀɢᴇ\n\n> ᴘʜᴏᴇɴɪx-ᴍᴅ ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ',
//_______________#OTHER(⚠️ Warning Dont Edit Anything Here)____________________________________________________________________________________
  BASE_URL: 'https://abhi-api-wphp.onrender.com/', // Don't Change This
  BRANCH: 'main',
  DATABASE: DATABASE_URL === "./database.db" ? new Sequelize({ dialect: "sqlite", storage: DATABASE_URL, logging: false }) : new Sequelize(DATABASE_URL, {dialect: "postgres", ssl: true, protocol: "postgres", dialectOptions: { native: true, ssl: { require: true, rejectUnauthorized: false },}, logging: false })
};
