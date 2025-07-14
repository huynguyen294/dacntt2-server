TO RUN THIS PROJECT

Step 1: Open server folder in terminal
Step 2: Run 'yarn'
Step 3: Run 'yarn dev'
Step 4: Open client folder in terminal
Step 5: Run 'yarn'
Step 6: Run 'yarn dev'
Step 7: Access http://localhost:3000

Environment required:
node: https://nodejs.org/en/download (version >= 22.12.0)
yarn: https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable

Production link: https://dacntt2-center-managment-system.vercel.app

Accounts:
Admin: dacntt2.admin@gmail.com
Student: hocvien1@gmail.com
Teacher: giaovien1@gmail.com
Consultant: tuvanvien1@gmail.com
Finance-officer/Academic: taichinh1@gmail.com

Password: Abcd@1234

Notice:
Application is using online database to reduce initialization steps
In case of cannot access to online database. Please follow these steps:

Restore database
Step 1: Install PostgreSQL
Step 2: Open pgAdmin
Step 3: Create a database
Step 4: Restore database from database.backup file (notice: data options select do not save Owner, Privileges)
Step 4: Get database config including: username, password, host, database_name, Production
Step 5: Fill config into file .env in server folder
Step 6: Run server and client as above introduction
