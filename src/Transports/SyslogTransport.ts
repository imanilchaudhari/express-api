import { LogCallback } from 'winston';
import Transport from 'winston-transport';
import syslog, { ClientOptions } from 'syslog-client';

export class SyslogTransport extends Transport {
  name: any;
  host: any;
  port: any;

  constructor(opts: any) {
    super(opts);
    opts = opts || {};

    this.name = opts.name || 'SyslogTransport';
    this.level = opts.level || undefined;
    this.host = opts.host;
    this.port = opts.port;
  }

  log(info: any, callback: LogCallback) {
    const syslogOptions: ClientOptions = {
      appName: this.name,
      syslogHostname: this.name,
      transport: syslog.Transport.Udp,
      port: this.port
    };
    const syslogClient = syslog.createClient(this.host, syslogOptions);
    try {
      syslogClient.log(`${info.level}: ${info.message}`);
      this.emit('logged', info);
    } catch (err) {
      this.emit('error', err);
    } finally {
      callback();
    }
  }
}
