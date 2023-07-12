const dotenv = require('dotenv');

const __db_connect = require('./database/config');
const { generateUniqueUsername, periodCrons } = require('./helper/library');

dotenv.config();

__db_connect().then(() => {
    require('./routes')
    require('./server_socket')
    periodCrons()
})




