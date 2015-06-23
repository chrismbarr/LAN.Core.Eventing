﻿using System;
using System.Security.Principal;
using System.Threading.Tasks;

namespace LAN.Core.Eventing
{
	public abstract class HandlerBase<TReq, TPrincipal> : IHandler
		where TReq : RequestBase
		where TPrincipal : IPrincipal
	{
		private static readonly Type ThisType = typeof(TReq);
		public Type GetRequestType()
		{
			return ThisType;
		}

		public Task Invoke(RequestBase req, IPrincipal principal)
		{
			return Task.Run(() => this.Invoke((TReq)req, (TPrincipal)principal));
		}

		public Task<bool> IsAuthorized(RequestBase req, IPrincipal principal)
		{
			return Task.Run(() => this.IsAuthorized((TReq) req, (TPrincipal) principal));
		}

		protected abstract bool IsAuthorized(TReq request, TPrincipal principal);
		protected abstract void Invoke(TReq request, TPrincipal principal);
	}
}