import axios from 'axios';
import { LogCallback } from 'winston';
import Transport from 'winston-transport';

export class SlackTransport extends Transport {
  webhookUrl: any;
  name: any;
  formatter: any;
  emitAxiosErrors: any;
  axiosInstance: any;
  constructor(opts: any) {
    super(opts);

    opts = opts || {};

    this.name = opts.name || 'SlackTransport';
    this.level = opts.level || undefined;
    this.webhookUrl = opts.webhookUrl;
    this.formatter = opts.formatter || undefined;

    this.emitAxiosErrors = opts.emitAxiosErrors || false;

    this.axiosInstance = axios.create({
      proxy: opts.proxy || undefined
    });
  }

  async log(info: any, callback: LogCallback) {
    const payload = {
      text: info.text
    };

    payload.text = `${info.level}: ${info.message}`;

    try {
      await this.axiosInstance.post(this.webhookUrl, payload);
      this.emit('logged', info);
    } catch (err) {
      if (this.emitAxiosErrors) { this.emit('error', err); }
    } finally {
      callback();
    }
  }
}
