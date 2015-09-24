(function () {
    var app = angular.module("app", []);
    var logger = new LogR(logConfig);
    var externalInvoker = new DAL.SignalRExternalInvoker();
    var eventRegistry = new jMess.EventRegistry(logger, function (eventToRaise, data) {
        if (Str.endsWith(eventToRaise, 'Request')) {
            externalInvoker.invoke(eventToRaise, data);
        }
    });
    externalInvoker.responder = function (event, data) {
        eventRegistry.raise(event, data);
    };
    eventRegistry.register(ServerEvents);
    eventRegistry.register(TestEvents);
    var previouslyConnected = false;
    externalInvoker.onStateChange = function (change, connection) {
        var connectionEvent = {
            connection: connection
        };
        if (change.newState === $.signalR.connectionState.disconnected) {
            //Disconnected
            eventRegistry.raise(SignalRConnectionEvents.ConnectionLost, connectionEvent);
        }
        else if (change.newState === $.signalR.connectionState.reconnecting) {
            //Attempting to reconnect
            eventRegistry.raise(SignalRConnectionEvents.AttemptingReconnect, connectionEvent);
        }
        else if (previouslyConnected && change.newState === $.signalR.connectionState.connected) {
            //Connected when previously disconnected or reconnecting
            eventRegistry.raise(SignalRConnectionEvents.ConnectionReestablished, connectionEvent);
        }
        else if (!previouslyConnected && change.newState === $.signalR.connectionState.connected) {
            //First Connection
            previouslyConnected = true;
            eventRegistry.raise(SignalRConnectionEvents.InitialConnection, connectionEvent);
        }
    };
    app.factory('eventRegistry', function () { return eventRegistry; });
    app.controller('TestCtrl', TestCtrl);
})();
//# sourceMappingURL=CompositionRoot.js.map