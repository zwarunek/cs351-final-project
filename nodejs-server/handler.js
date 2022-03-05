module.exports = (io, socket) => {
    const joinRoom = function (payload) {

    };

    const getClientInfo = function (orderId, callback) {
    };

    const getUuid = function () {
        console.log(socket.handshake.session.uuid);
    };


    socket.on("get-uuid", getUuid);
}
