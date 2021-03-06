﻿using LAN.Core.Eventing;
using RailsSharp.Example.Test;

namespace RailsSharp.Example
{
	public class HandlerConfig
	{
		public static void RegisterHandlers(IHandlerRepository repository)
		{
			repository.AddHandler<TestSingleHandler>(TestEvents.TestSingleRequest);
			repository.AddHandler<TestFailedHandler>(TestEvents.TestFailedRequest);
			repository.AddHandler<TestUnauthorizedHandler>(TestEvents.TestUnauthorizedRequest);
		}
	}
}