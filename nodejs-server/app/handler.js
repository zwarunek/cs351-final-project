module.exports = (io, socket, clients,rooms) => {
    const joinRoom = function (payload) {

    };

    const getClientInfo = function (orderId, callback) {
    };

    const getUuid = function () {

        console.log(socket.handshake.session.uuid);
    };


    socket.on("get-uuid", getUuid);
}
