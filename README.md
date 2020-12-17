# Grandpa Care

We want to increase people's safety by making it possible
for elderly people to be cared for even if nobody is
physically near them.

Therefore, the old person gets a Thingy they keep with
them, and some other person gets access to a web application
that is connected to the Thingy.

## Project Management
Scrum (Taiga)

### Milestones
Sprint 1
Sprint 2
Sprint 3

### Team
Jairo Erazo
Joël Zuber

## Models
Mongodb
User: {
  username: 'username-x',
  password: 'Encrypted_password',
  sensor: 'brown-3',
  chat_id: []
}

Influxdb
Bucket thingy
_measurement: temperature
_field: degree
_value: 

## Stories
https://tree.taiga.io/project/jairoerazobotero-ase2020-brown/timeline

## Technology
### Frontend
* Vue.js
* Vuetify
* Axios
* Vuex
### Backend
* Node.js
* Koa.js
* Influxdb
* Mongodb
* Redis
* Socket.io
* JWT
* MQTT
* Telegraf
* Nodemailer