/**
 * Created by zj on 16/5/19.
 */

import socketio from 'socket.io'

let io = socketio()

export default (app,db) =>{

    db(()=>{
        let port = G.app.port || process.env.PORT || 8080
        let server = app.listen(port,  () =>{
            T.log(__filename,'启动服务端口:' + server.address().port);
        });
        server.on('error', onError);

        /**
         * Event listener for HTTP server "error" event.
         */

        function onError(error) {
            if (error.syscall !== 'listen') {
                throw error;
            }
            var bind = typeof port === 'string'
                ? 'Pipe ' + port
                : 'Port ' + port;

            // handle specific listen errors with friendly messages
            switch (error.code) {
                case 'EACCES':
                    console.error(bind + ' requires elevated privileges');
                    process.exit(1);
                    break;
                case 'EADDRINUSE':
                    console.error(bind + ' is already in use');
                    process.exit(1);
                    break;
                default:
                    throw error;
            }
        }

        if(G.socket){
            io.listen(server)
            io.on('connection', function (_socket) {
                T.log(__filename,_socket.id + ': connection');
                 _socket.emit('message', 'hello world');
                 _socket.on('message', function (msg) {
                     T.log(__filename,'Message Received: '+ msg);
                    _socket.broadcast.emit('message', msg);
                });
                socket = _socket

             })

        }
        return io
    })

}

