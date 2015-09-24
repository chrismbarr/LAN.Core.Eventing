﻿class Str {
	public static endsWith(input: string, suffix: string): boolean {
		return input.indexOf(suffix, input.length - suffix.length) !== -1;
	}

	public static trim(str: string) {
		return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	}

	public static format(formatString: string) {
		var args = arguments;
		return formatString.replace(/{(\d+)}/g, (match: string, num: string) => {
			var replacementIndex: number = parseInt(num, 10) + 1;
			return typeof args[replacementIndex] !== 'undefined' ? args[replacementIndex] : match;
		});
	}
}

module DAL {
	'use strict';
	export class BaseExternalInvoker {
		public invoke = (event: string, data: Object) => {
			if (event === null) {
				throw 'event is null or undefined';
			}
			if (data === null) {
				throw 'data is null or undefined';
			}
			throw 'Invoker.invoke has not been implemented, or you are using the base invoker.';
		};
		public responder = (event: string, data: Object) => {
			if (event === null) {
				throw 'event is null or undefined';
			}
			if (data === null) {
				throw 'data is null or undefined';
			}
			throw 'Invoker.responder delegate was not provided.';
		};
	}

	export class SignalRExternalInvoker extends BaseExternalInvoker {
		public onStateChange(change: SignalRStateChange, connection: HubConnection) {
			//do nothing by default
		}

		constructor() {
			super();
			var intervalLoop: number;
			var connection = $.hubConnection();
			var queue: QueueItem[] = [];
			var hub = connection.createHubProxy('eventHub');

			/* tslint:disable: no-any */
			//We must use the `any` type here since we don't know what this might contain!
			//We need to disable the TSLint rule temporarily to allow this to work and to make TSLint not complain
			hub.on('eventReceived', (...msgs: any[]) => {
				/* tslint:enable: no-any */
				var event = msgs[0], data = msgs[1];
				writeTransportLog(' ↓ Reply ↓ ', 'Event: ' + event);
				this.responder(event, data);
			});

			var writeConnectionLog = (connectionState: string) => {
				var prefix = !logConfig.SupportCustomLogs ? '' : '%c';
				var suffix = !logConfig.SupportCustomLogs ? '' : 'background: #222; color: #bada55';
				logR.custom(prefix + ' © ' + connectionState + ' © ', suffix);
			};

			var writeTransportLog = (transportType: string, details: string) => {
				var prefix = !logConfig.SupportCustomLogs ? '' : '%c';
				var suffix = !logConfig.SupportCustomLogs ? '' : 'background: #222; color: #bada55';
				logR.custom(prefix + transportType, suffix, details);
			};

			connection.stateChanged((change: SignalRStateChange) => {
				//Call the optional function if it really is a function when the state is changed
				if ($.isFunction(this.onStateChange)) {
					//Send the change state and the SignalR connection object
					this.onStateChange.call(this, change, connection);
				}

				switch (change.newState) {
					case $.signalR.connectionState.reconnecting:
						writeConnectionLog('Re-connecting');
						stopQueue();
						break;
					case $.signalR.connectionState.connected:
						writeConnectionLog('Connected');
						startQueue();
						break;
					case $.signalR.connectionState.disconnected:
						writeConnectionLog('Disconnected');
						stopQueue();
						break;
					default:
				}
			});
			connection.start();

			var stopQueue = () => {
				writeTransportLog(' ! Queue Stopped ! ', DateTime.NowString());
				window.clearInterval(intervalLoop);
			};

			var startQueue = () => {
				var sendRequest = (qi: QueueItem) => {
					if ($.signalR.connectionState.connected) {
						writeTransportLog(' ↑ Request ↑ ', 'Event: ' + qi.Event);
						hub.invoke('raiseEvent', qi.Event, qi.Data);
					} else {
						stopQueue();
					}
				};

				var process = () => {
					for (var i = 0; i < queue.length; i++) {
						var qi = queue.splice(0, 1)[0];
						if (qi) {
							sendRequest(qi);
						} else {
							break;
						}
					}
				};

				intervalLoop = window.setInterval(process, 10);
			};


			/* tslint:disable: no-any */
			//We must use the `any` type here since we don't know what this might contain!
			//We need to disable the TSLint rule temporarily to allow this to work and to make TSLint not complain
			this.invoke = (event: string, data: any) => {
				/* tslint:enable: no-any */
				queue.push(<QueueItem>{
					Event: event,
					Data: data
				});
			};
		}
	}

	class QueueItem {
		/* tslint:disable: no-any */
		//We must use the `any` type here since we don't know what this might contain!
		//We need to disable the TSLint rule temporarily to allow this to work and to make TSLint not complain
		Event: string;
		Data: any;
		/* tslint:enable: no-any */
	}
}

class DateTime {
	public static NowString(): string {
		var now = new Date();
		var hoursTwentyForFormat = now.getHours();
		var hoursTwelveFormat: number;
		if (hoursTwentyForFormat === 0) {
			hoursTwelveFormat = 12;
		} else {
			hoursTwelveFormat = hoursTwentyForFormat > 12 ? hoursTwentyForFormat - 12 : hoursTwentyForFormat;
		}

		function addZero(num: number) {
			return (num >= 0 && num < 10) ? "0" + num : num + "";
		}
		var dateBits = addZero(now.getMonth() + 1) + '/' + addZero(now.getDate()) + '/' + now.getFullYear();
		var timeBits = addZero(hoursTwelveFormat) + ':' + addZero(now.getMinutes());
		var todBits = now.getHours() >= 12 ? "PM" : "AM";
		var strDateTime = dateBits + ' ' + timeBits + ' ' + todBits;

		return strDateTime;
	}
}