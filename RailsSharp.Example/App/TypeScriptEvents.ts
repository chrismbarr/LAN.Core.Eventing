

	declare class TestFailedRequest {
			}
	declare class TestSingleRequest {
			}
	declare class TestSingleResponse {
							}
	declare class TestUnauthorizedRequest {
			}

	class TestEvents {
					
		static TestSingleRequest : string = 'TestTestSingleRequest';
					
		static TestSingleResponse : string = 'TestTestSingleResponse';
					
		static TestFailedRequest : string = 'TestTestFailedRequest';
					
		static TestFailedResponse : string = 'TestTestFailedResponse';
					
		static TestUnauthorizedRequest : string = 'TestTestUnauthorizedRequest';
					
		static TestUnauthorizedResponse : string = 'TestTestUnauthorizedResponse';
					
		static TestSingleLegacyRequest : string = 'TestTestSingleLegacyRequest';
					
		static TestSingleLegacyResponse : string = 'TestTestSingleLegacyResponse';
					
		static TestDoubleARequest : string = 'TestTestDoubleARequest';
					
		static TestDoubleAResponse : string = 'TestTestDoubleAResponse';
					
		static TestDoubleBRequest : string = 'TestTestDoubleBRequest';
					
		static TestDoubleBResponse : string = 'TestTestDoubleBResponse';
			}

var ServerEvents = {
	OnError: "ServerOnError",
	OnWarn: "ServerOnWarn",
	OnNotification: "ServerOnNotification",
};

class SignalRConnectionEvents {
	static InitialConnection: string = "InitialConnection";
	static ConnectionLost: string = "ConnectionLost";
	static AttemptingReconnect: string = "AttemptingReconnect";
	static ConnectionReestablished: string = "ConnectionReestablished";
};

interface ISignalRConnectionResponse {
	connection: HubConnection
};

interface IServerErrorResponse {
	CorrelationId: string;
	Message: string;
}

